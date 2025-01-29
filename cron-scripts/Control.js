require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);
const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createPromise = ({url, turn, id, token}) => axios.post(url, 
    new URLSearchParams({
        channel: 0,
        turn,
        id,
        auth_key: token
    }),
    {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }    
});

const switchRelays = async ({url, turn, id, token}, retries = 5) => {
    try {
        return await createPromise({url, turn, id, token});
    } catch(e) {
        console.log("Failed to switch relay, trying again", retries, e)
        if (retries <= 1) {
            return null;
        }
        await sleep(2000);
        return switchRelays({url, turn, id, token}, retries -1); 
    };
};

const controlDevices = async (customer, client) => {
    try{
        const db = client.db(customer.name);
        const collection = db.collection("schedueles");
        const deviceCollection = db.collection("devices");
        const devices = await deviceCollection.find({}).toArray();
        const todaysDate = new Date().toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
        const { values: scheduele } = await collection.findOne({ date: todaysDate });
        console.log("Fetched scheduele");
        const todayTimeDate = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
        const currentHour = new Date(todayTimeDate).getHours()
        for(const device of Object.keys(scheduele)){
            const deviceId = devices.find(obj => obj.deviceName === device)?.id;
            if(!deviceId){
                continue;
            };
            await switchRelays({
                url: `${customer.shellyUrl}/device/relay/control`, 
                turn: scheduele[device].includes(currentHour) ? 'on' : 'off', 
                id: deviceId,
                token: customer.shellyToken
            });
            await sleep(2000)
        };
        console.log("Switched relays");
    } catch(e){
        console.log(e);
        console.log(e?.response?.data)
    }
};
module.exports = controlDevices;