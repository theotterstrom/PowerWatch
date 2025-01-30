require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const databaseFetch = async (collectionName, masterDb, customerCookie, client, offset = 0, limit = 400) => {
    try {
        const customerCollection = masterDb.collection("customerDbs");
        const databaseObject = await customerCollection.findOne({ customerCookie: customerCookie });
        const customerDb = client.db(databaseObject.name);
        const collection = customerDb.collection(collectionName);
        const results = await collection
            .find({})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray();
        return results;
    } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        throw err;
    }
};

const databaseReplace = async (collectionName, masterDb, customerCookie, client, object) => {
    try {
        const customerCollection = masterDb.collection("customerDbs");
        const databaseObject = await customerCollection.findOne({ customerCookie: customerCookie });
        const customerDb = client.db(databaseObject.name);
        const collection = customerDb.collection(collectionName);
        const replaceOne = await collection.replaceOne(   
            { _id: object["_id"] },
            object
        );
        
        return 'ok';
    } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        throw err;
    }
};

const databaseInsert = async (collectionName, masterDb, customerCookie, client, object) => {
    try {
        const customerCollection = masterDb.collection("customerDbs");
        const databaseObject = await customerCollection.findOne({ customerCookie: customerCookie });
        const customerDb = client.db(databaseObject.name);
        const collection = customerDb.collection(collectionName);
        const insertOne = await collection.insertOne(object);
        return 'ok';
    } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        throw err;
    }
};

const databaseRemove = async (collectionName, masterDb, customerCookie, client, id) => {
    try {
        const customerCollection = masterDb.collection("customerDbs");
        const databaseObject = await customerCollection.findOne({ customerCookie: customerCookie });
        const customerDb = client.db(databaseObject.name);
        const collection = customerDb.collection(collectionName);
        const deleteOne = await collection.deleteOne({
            _id: id
        });
        return 'ok';
    } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        throw err;
    }
};

const fetchReading = async (url, retries = 5) => {
    try {
        return await axios.get(url)
    } catch (e) {
        console.log("Failed to fetch, trying again", retries, e)
        await sleep(2000);
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
        return fetchReading(url, retries - 1);
    };
};

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;  // Retrieve the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token' });
    };
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    };
};

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

const createNewScheduele = async (customerDb, powerhours, scheduleCollection, client, customerDbName) => {
    const priceCollection = customerDb.collection("prices");
    const today = new Date().toISOString().split("T")[0];
    const todaysPrices = await priceCollection.findOne({ date: today });
    const sortedHours = todaysPrices.values.sort((a, b) => a.price - b.price);
    let newScheduele = {};
    for(const device of Object.keys(powerhours)){
        const necessaryHours = powerhours[device];
        const xCheapestHours = sortedHours.filter((obj, index) => {
            if(necessaryHours - 1 < index ){
                return false;
            };
            return true;
        });
        newScheduele[device.replace("device-", "")] = xCheapestHours.map(obj => obj.hour);
    };
    await scheduleCollection.insertOne({ date: today, values: newScheduele });
    const deviceCollection = customerDb.collection("devices");
    const devices = await deviceCollection.find({}).toArray();
    const todayTimeDate = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
    const currentHour = new Date(todayTimeDate).getHours()
    for(const device of Object.keys(newScheduele)){
        const deviceId = devices.find(obj => obj.deviceName === device)?.id;
        if(!deviceId){
            continue;
        };
        try{
            await switchRelays({
                url: `${customerDbName.shellyUrl}/device/relay/control`, 
                turn: newScheduele[device].includes(currentHour) ? 'on' : 'off', 
                id: deviceId,
                token: customerDbName.shellyToken
            });
        } catch(e){
            console.log("Failed to switch relay")
        }
        await sleep(2000)
    };
};

module.exports = {
    authMiddleware,
    fetchReading,
    databaseFetch,
    databaseReplace,
    databaseInsert,
    databaseRemove,
    createNewScheduele
};