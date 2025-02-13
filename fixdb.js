require('dotenv').config();
const { MongoClient } = require('mongodb');
const { mongouri } = process.env;
const run = async () => {
    const client = new MongoClient(mongouri);
    await client.connect();
    const db = client.db("styrning")
    const powercol = db.collection("savings");
    const allReadings = await powercol.find({}).toArray();
    const indexOfFuck = allReadings.findIndex(obj => obj.date === "2025-02-12 21-22");

    for(let i = indexOfFuck; i < allReadings.length; i++){
        console.log(allReadings[i])
        const newObject = {
            ...allReadings[i],
            values: {
                ...allReadings[i].value,
                ottebo: 0
            }
        };
        
/*         const replaceOne = await powercol.replaceOne(
            { _id: allReadings[i]["_id"] },
            newObject
        ); */
        
    }
    console.log("klart")
};
run()