require('dotenv').config()
const { MongoClient } = require('mongodb');
const { mongouri, dbname } = process.env;
const axios = require('axios');
const https = require("https");


const run = async () => {
  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL verification
  });
  const fetchdata = await axios.get("https://powerwatch.se/api/database?secret=Ix1Cxml>VC4/MP8v/vb}O*Uw4),DilACqMVf", { httpsAgent: agent })
  const [readings, savings, prices, schedueles, tempreadings, powerhour, devices] = fetchdata.data.array;
  console.log(powerhour)
  const client = new MongoClient(mongouri);
  try{
    await client.connect();
    const db = client.db(dbname);

    const readingcollection = db.collection("power_readings");
    await readingcollection.deleteMany({})
    await readingcollection.insertMany(readings)
    const savingscollection = db.collection("savings");
    await savingscollection.deleteMany({})
    await savingscollection.insertMany(savings)
    
    const pricecollection = db.collection("prices");
    await pricecollection.deleteMany({})
    await pricecollection.insertMany(prices)
    
    const scheduelecollection = db.collection("schedueles");
    await scheduelecollection.deleteMany({})
    await scheduelecollection.insertMany(schedueles)
    
    const tempcollection = db.collection("temp_readings");
    await tempcollection.deleteMany({})
    await tempcollection.insertMany(tempreadings)

    const deviceCollection = db.collection("devices");
    await deviceCollection.deleteMany({});
    await deviceCollection.insertMany(devices)
    
/*     const powerhourcol = db.collection("powerhour")
    await powerhourcol.deleteMany({})
    await powerhourcol.insertOne(powerhour) */
    
    } catch(e){
    console.log(e)
    } finally{
      await client.close();
    }
};
run();