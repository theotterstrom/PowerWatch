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
            };
        };
        await sleep(2000);
        return fetchReading(url, retries - 1);
    };
};

const fetchPrices = async () => {
    try {
        const spotPris = await fetchReading('https://www.elmarknad.se/api/spotprice/current')
        const spotPrisObj = spotPris.data.map(obj => ({ hour: new Date(obj.CreatedDate).getHours(), price: obj.ForecastAreaThree }));
        console.log("Fetched prices")
        await client.connect();
        const db = client.db(process.env.dbname);
        const collection = db.collection("prices");

        const dateObject = new Date();
        dateObject.setDate(dateObject.getDate() + 1);
        const tomorrowsDate = dateObject.toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });

        const averagePrice = spotPris.data.reduce((sum, data) => sum + data.ForecastAreaThree, 0);
        const result = await collection.insertOne({ date: tomorrowsDate, values: spotPrisObj, average: averagePrice / 24 });
        console.log("Added prices to database")
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
};
fetchPrices()
//module.exports = fetchPrices;
