require('dotenv').config();
const { dbname } = process.env;
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);

const newCalculateSavings = async () => {
    try {
        await client.connect();
        const db = client.db(dbname);
        const powerCollection = db.collection("power_readings");
        const priceCollection = db.collection("prices");
        const schedueleCollection = db.collection("schedueles");
        const savingsCollection = db.collection("savings");

        const todaysDate = new Date().toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
        const todaysConsumption = await powerCollection.find({
            date: { $regex: `^${todaysDate}` }
        }).toArray();

        let hour1, hour2, dayPrices, schedueles, databaseDate;
        const currentHour = new Date().toLocaleTimeString("se-SV", { timeZone: "Europe/Stockholm" }).split(":")[0].padStart(2, '0');
        if(currentHour === '00'){
            const dateObject = new Date();
            dateObject.setDate(dateObject.getDate() - 1);
            const yesterDaysDate = dateObject.toLocaleDateString("se-SV", { timeZone: "Europe/Stockholm" });
            const yesterdaysConsumption = await powerCollection.find({
                date: { $regex: `^${yesterDaysDate}`}
            }).toArray();
            [{ values: hour1 }, { values: hour2 }] = [todaysConsumption.find(obj => obj.date.endsWith('00')), yesterdaysConsumption.find(obj => obj.date.endsWith('23'))];
            dayPrices = await priceCollection.findOne({ date: yesterDaysDate });
            schedueles = await schedueleCollection.findOne({ date: yesterDaysDate });
            databaseDate = yesterDaysDate;
        } else {
            [{ values: hour1 }, { values: hour2 }] = [todaysConsumption.find(obj => obj.date.endsWith(currentHour.toString())), todaysConsumption.find(obj => obj.date.endsWith((currentHour - 1).toString()))];
            dayPrices = await priceCollection.findOne({ date: todaysDate });
            schedueles = await schedueleCollection.findOne({ date: todaysDate });
            databaseDate = todaysDate;
        };

        const nameMap = {
            NilleATtim: 'nilleboat',
            NilleVPtim: 'nillebovp',
            NilleVVtim: 'nillebovv',
            LoveATtim: 'loveboat',
            LoveVVtim: 'lovebovv',
            Ottebo: 'ottebo',
            Garage: 'garage',
            PoolStart: 'pool'
        };
        
        let priceHour = currentHour === '00' ? 23 : parseInt(currentHour) - 1;
        const currentPrice = dayPrices.values.find(obj => obj.hour === priceHour).price;

        let savingsObject = {}
        for(const [name, scheduele] of Object.entries(schedueles.values)){
            const deviceName = Object.entries(nameMap).find(obj => obj[0] === name)?.[1];
            if(!deviceName){
                continue;
            };
            const realCost = (hour1[deviceName] - hour2[deviceName]) * currentPrice;
            const averageCost = (hour1[deviceName] - hour2[deviceName]) * dayPrices.average;
            savingsObject[deviceName] = {
                realCost:  isNaN(realCost) || !scheduele.includes(priceHour) ? 0 : realCost,
                averageCost:  isNaN(averageCost) || !scheduele.includes(priceHour) ? 0 : averageCost
            };
        };

        if(Object.keys(savingsObject).length === 0){
            return;
        };
        
        const insertSavings = await savingsCollection.insertOne({ values: savingsObject, date: `${databaseDate} ${currentHour === '00' ? '23-00' : currentHour-1 + "-" + currentHour }` });
        console.log("Inserted savings into database");
    } catch(e){
        console.log(e);
    } finally {
        await client.close();
    }
};

//newCalculateSavings()
module.exports = newCalculateSavings;