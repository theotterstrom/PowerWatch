require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);
const axios = require('axios');
const deviceIds = require('./data/deviceIds.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createPromise = ({url, turn, id}) => axios.post(url, 
    new URLSearchParams({
        channel: 0,
        turn,
        id,
        auth_key: process.env.shellytoken
    }),
    {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }    
});

const switchRelays = async ({url, turn, id}, retries = 5) => {
    try {
        return await createPromise({url, turn, id});
    } catch(e) {
        console.log("Failed to switch relay, trying again", retries, e)
        if (retries <= 1) {
            return null;
        }
        await sleep(2000);
        return switchRelays({url, turn, id}, retries -1); 
    };
};

const controlDevices = async () => {
    try{
        await client.connect()
        const db = client.db(process.env.dbname);
        const collection = db.collection("schedueles");
        const todaysDate = new Date().toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
        const { values: scheduele } = await collection.findOne({ date: todaysDate });
        console.log("Fetched scheduele");
        const todayTimeDate = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
        const currentHour = new Date(todayTimeDate).getHours()
        for(const device of Object.keys(scheduele)){
            await switchRelays({
                url: 'https://shelly-115-eu.shelly.cloud/device/relay/control', 
                turn: scheduele[device].includes(currentHour) ? 'on' : 'off', 
                id: deviceIds[device]?.id
            });
            await sleep(2000)
        };
        console.log("Switched relays");
    } catch(e){
        console.log(e);
        console.log(e?.response?.data)
    } finally {
        await client.close();
    }
};
module.exports = controlDevices;