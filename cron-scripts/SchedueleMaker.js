require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);

const makeScheduele = async () => {
    try{
        const fileContents = (JSON.parse(fs.readFileSync('./cron-scripts/data/drivecontrol.json'))).data;
        console.log("Read drivecontrol.json")
        await client.connect();
        const db = client.db(process.env.dbname);
        const collection = db.collection("prices");
        
        const dateObject = new Date();
        dateObject.setDate(dateObject.getDate() + 1);
        const tomorrowsDate = dateObject.toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
        const { values: tomorrowPrices } = await collection.findOne({ date: tomorrowsDate });
        console.log("Fetched prices of tomorrow");
        
        const sortedHours = tomorrowPrices.sort((a, b) => a.price - b.price);
        const deviceSettings = Object.fromEntries(Object.entries(fileContents).filter(([key, value]) => key.startsWith("device-")));
        let newScheduele = {};
        for(const device of Object.keys(deviceSettings)){
            const necessaryHours = fileContents[device];
            const xCheapestHours = sortedHours.filter((obj, index) => {
                if(obj.price > parseInt(fileContents.Maxpris * 100) || necessaryHours - 1 < index ){
                    return false;
                };
                return true;
            });
            newScheduele[device.replace("device-", "")] = xCheapestHours.map(obj => obj.hour);
        };
        const schedueleDb = client.db(process.env.dbname);
        const schedueleCol = schedueleDb.collection("schedueles");
        const response = await schedueleCol.insertOne({ date: tomorrowsDate, values: newScheduele });
        console.log("Added scheduele for tomorrow");
    } catch(e){
        console.log(e);
    } finally {
        await client.close();
    }
}; 
makeScheduele();
//module.exports = makeScheduele;