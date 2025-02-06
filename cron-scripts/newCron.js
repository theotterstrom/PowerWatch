require("dotenv").config();
const cron = require('node-cron');
const fetchPrices = require('./FetchPrices');
const schedueleMaker = require('./SchedueleMaker');
const readDevices = require('./DeviceReading');
const calculateSavings = require('./CalculateSavingsHour');
const controlDevices = require('./Control');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.mongouri);

let customers = [];

const getCustomers = async () => {
    try {
        await client.connect();
        const db = client.db("customers");
        const collection = db.collection("customerDbs");
        const allCustomers = await collection.find({}).toArray();
        return { allCustomers, client };
    } catch (e) {
        console.log("ERROR", e)
    }
};

const runCronForCustomer = (customer, client) => {

    cron.schedule("50 23 * * *", async () => {
        try {
            await fetchPrices(customer, client);
        } catch (e) {
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("55 23 * * *", async () => {
        try {
            await schedueleMaker(customer, client);
        } catch (e) {
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("5 * * * *", async () => {
        try {
            await calculateSavings(customer, client);
        } catch (e) {
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("0 * * * *", async () => {
        try {
            await readDevices(customer, client);
        } catch (e) {
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("0 * * * *", async () => {
        try {
            await controlDevices(customer, client);
        } catch (e) {
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
};

const initializeCronJobs = async () => {
    const { allCustomers, client } = await getCustomers();
    allCustomers.forEach((customer) => {
        if (!customers.includes(customer.customerId)) {
            customers.push(customer.customerId);
            runCronForCustomer(customer, client);
        }
    });
};

setInterval(initializeCronJobs, 60000);
initializeCronJobs();
