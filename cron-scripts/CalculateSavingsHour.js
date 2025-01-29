require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);

const newCalculateSavings = async (customer, client) => {
    try {
        const db = client.db(customer.name);
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
            hour1 = todaysConsumption.find(obj => obj.date.endsWith(currentHour.toString()))?.values;
            hour2 = todaysConsumption.find(obj => obj.date.endsWith((currentHour - 1).toString()))?.values;
            dayPrices = await priceCollection.findOne({ date: todaysDate });
            schedueles = await schedueleCollection.findOne({ date: todaysDate });
            databaseDate = todaysDate;
        };
        
        let priceHour = currentHour === '00' ? 23 : parseInt(currentHour) - 1;
        const currentPrice = dayPrices.values.find(obj => obj.hour === priceHour).price;

        let savingsObject = {}
        for(const [name, scheduele] of Object.entries(schedueles.values)){
            const realCost = (hour1[name] - hour2[name]) * currentPrice;
            const averageCost = (hour1[name] - hour2[name]) * dayPrices.average;
            savingsObject[name] = {
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
    }
};

module.exports = newCalculateSavings;
