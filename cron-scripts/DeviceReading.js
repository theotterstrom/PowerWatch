require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchReading = async (url, retries = 5) => {
    try {
        return await axios.get(url)
    } catch (e) {
        console.log("Failed to fetch, trying again", retries, e)
        if (retries <= 1) {
            return {
                data: {
                    data: {
                        device_status: {
                            meters: [{
                                total: 0
                            }]
                        }
                    }
                }
            }
        }
        await sleep(2000);
        return fetchReading(url, retries - 1);
    };
};

const readDevices = async (customer) => {
    try {
        await client.connect();
        const db = client.db(customer.name);
        const powerCollection = db.collection("power_readings");
        const tempCollection = db.collection("temp_readings");
        const deviceCollection = db.collection("devices");
        const devices = await deviceCollection.find({}).toArray();
        
        const urls = devices.map(device => `${customer.shellyUrl}/device/status?id=${device.id}&auth_key=${customer.shellyToken}`);

        let results = [];
        for (const url of urls) {
            results.push(await fetchReading(url));
            await sleep(2000);
        };
        console.log("Fetched all device statuses")

        const resultObj = devices.reduce((acc, cur, index) => {
            acc[cur.deviceName] = results[index];
            return acc;
        }, {});

        let consumptionObj = {};
        let temperatureObj = {};

        for (const [name, result] of Object.entries(resultObj)) {
            const { emeters, meters, tmp } = result.data.data.device_status;
            let meterArr = emeters ?? meters;
            if (!meterArr && tmp) {
                temperatureObj[name] = tmp.value;
                continue;
            };
            const currentDevice = devices.find(device => device.deviceName === name);
            if (currentDevice.wattFormat === "Watthour") {
                consumptionObj[name] = (meterArr.reduce((sum, emeter) => sum + emeter.total, 0)) / 1000;
            } else if (currentDevice.wattFormat === "Milliwatt") {
                consumptionObj[name] = (meterArr.reduce((sum, emeter) => sum + emeter.total, 0)) / 60000;
            };
        };

        const currentDateTime = new Date().toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
        const hour = new Date().toLocaleTimeString("se-SV", { timeZone: "Europe/Stockholm" }).split(":")[0];
        const [powerResult, tempResult] = await Promise.all([
            powerCollection.insertOne({ date: `${currentDateTime} ${hour}`, values: consumptionObj }),
            tempCollection.insertOne({ date: `${currentDateTime} ${hour}`, value: temperatureObj })
        ]);
        console.log("Added device statuses to database")
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
};

module.exports = readDevices;
