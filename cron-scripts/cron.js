require("dotenv").config();
const cron = require('node-cron');
const fetchPrices = require('./FetchPrices');
const schedueleMaker = require('./SchedueleMaker');
const readDevices = require('./DeviceReading');
const calculateSavings = require('./CalculateSavingsHour');
const controlDevices = require('./Control');

const run = async () => {
    cron.schedule("50 23 * * *", async () => {
        try{
            await fetchPrices();
        } catch(e){
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("55 23 * * *", async () => {
        try{
            await schedueleMaker();
        } catch(e){
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("10 * * * *", async () => {
        try{
            await calculateSavings();
        } catch(e){
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("0 * * * *", async () => {
        try{
            await readDevices();
        } catch(e){
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
    cron.schedule("0 * * * *", async () => {
        try{
            await controlDevices();
        } catch(e){
            console.log("ERROR")
            console.log(e.response?.data?.errors ?? e);
        }
    }, {
        timezone: "Europe/Stockholm"
    });
};
run();