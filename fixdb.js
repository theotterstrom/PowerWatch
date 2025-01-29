require('dotenv').config()
const { MongoClient } = require('mongodb');
const { mongouri, dbname } = process.env;
const axios = require('axios');

const fixSchedueleNames = async () => {
    const nameMap = {
        NilleATtim: 'nilleboat',
        NilleVPtim: 'nillebovp',
        NilleVVtim: 'nillebovv',
        LoveATtim: 'loveboat',
        LoveVVtim: 'lovebovv',
        Ottebo: 'ottebo',
        Garage: 'garage',
        PoolTid: "pool"
    };
    const scheduelecollection = db.collection("schedueles");
    const schdulearray = await scheduelecollection.find({}).toArray();

    for (const schedule of schdulearray) {
        const updatedValues = {};
        for (const [key, value] of Object.entries(schedule.values)) {
            const newKey = nameMap[key] || key;
            updatedValues[newKey] = value;
        }

        await scheduelecollection.updateOne(
            { _id: schedule._id },
            { $set: { values: updatedValues } }
        );
    }

    console.log("Keys have been updated in all schedules.");
};
