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
  const [nreadings, nsavings, nprices, nschedueles, ntempreadings, npowerhour, ndevices] = [nreadings, nsavings, nprices, nschedueles, ntempreadings, npowerhour, ndevices].map(obj => []);
 
  for(const x of readings){
    nreadings.push({
        ...x,
        values: {
            device1: x.values["nilleboat"],
            device2: x.values["loveboat"],
            device3: x.values["nillebovp"],
        }
    });
  }
  for(const x of savings){
    nsavings.push({
        ...x,
        values: {
            device1: x.values["nilleboat"],
            device2: x.values["loveboat"],
            device3: x.values["nillebovp"],
        }
    });
  }
  for(const x of schedueles){
    nschedueles.push({
        ...x,
        values: {
            device1: x.values["nilleboat"],
            device2: x.values["loveboat"],
            device3: x.values["nillebovp"],
        }
    });
  }
  for(const x of tempreadings){
    ntempreadings.push({
        ...x,
        value: {
            temp1: x.values["lovetemp"],
            temp2: x.values["nilletemp"],
            temp3: x.values["ottetemp"],
        }
    });
  }


  const client = new MongoClient(mongouri);
  try{
    await client.connect();
    const db = client.db("demo");

    const readingcollection = db.collection("power_readings");
    await readingcollection.deleteMany({})
    await readingcollection.insertMany(nreadings)

    const savingscollection = db.collection("savings");
    await savingscollection.deleteMany({})
    await savingscollection.insertMany(nsavings)
    
    const pricecollection = db.collection("prices");
    await pricecollection.deleteMany({})
    await pricecollection.insertMany(prices)
    
    const scheduelecollection = db.collection("schedueles");
    await scheduelecollection.deleteMany({})
    await scheduelecollection.insertMany(nschedueles)
    
    const tempcollection = db.collection("temp_readings");
    await tempcollection.deleteMany({})
    await tempcollection.insertMany(ntempreadings)


    
    } catch(e){
    console.log(e)
    } finally{
      await client.close();
    }
};


run();