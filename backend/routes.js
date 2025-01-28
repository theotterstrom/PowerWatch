require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getKey, checkKeyRouteCredentials, requestDecrypter } = require('./Controllers/KeyController');
const UserController = require('./Controllers/UserController');
const {
    authMiddleware,
    fetchReading,
    databaseFetch,
    databaseReplace,
    databaseInsert,
    databaseRemove
} = require('./helpers.js')
const { ObjectId } = require("mongodb")

module.exports = ({ client, masterDb }) => {

    router.get('/schedueles', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try {
            res.json(await databaseFetch("schedueles", masterDb, customer, client));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch schedueles" });
        }
    });

    router.get('/devices', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            res.json(await databaseFetch("devices", masterDb, customer, client))
        } catch(e){
            res.status(500).json({ error: "Failed to fetch devices" });
        }

    });

    router.get('/prices', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try {
            res.json(await databaseFetch("prices", masterDb, customer, client));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch prices" });
        }
    });

    router.get('/readings', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;

        const { offset } = req.query;
        try {
            res.json(await databaseFetch("power_readings", masterDb, customer, client, offset || 0));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch readings" });
        }
    });

    router.get('/savings', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;

        const { offset } = req.query;
        try {
            res.json(await databaseFetch("savings", masterDb, customer, client, offset || 0));
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch savings" });
        }
    });

    router.get('/temperatures', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        const { offset } = req.query;
        try {
            res.json(await databaseFetch("temp_readings", masterDb, customer, client, offset || 0));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch temperatures" });
        }
    });

    router.post('/addnewdevice', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const existingDevices = await databaseFetch("devices", masterDb, customer, client)

            const data = await requestDecrypter(req.body.data, masterDb);
    
            if(existingDevices.some(device => device.id === data.id)){
                return res.status(409).json({ message: "Device id already exists"});
            };
            if(existingDevices.some(device => device.deviceName === data.deviceName)){
                return res.status(409).json({ message: "Device already exists"});
            };
            
            const newDevice = {
                deviceName: data.deviceName,
                displayName: data.displayName,
                id: data.id,
                wattFormat: data.wattFormat,
                deviceType: data.deviceType
            };
            
            if(data.deviceType === "Relay"){
                const fsDriveControl = await databaseFetch("powerhours", masterDb, customer, client);
                fsDriveControl[`device-${data.deviceName}`] = "0";
                await databaseReplace("powerhour", masterDb, customer, client, fsDriveControl);
            };
            await databaseInsert("devices", masterDb, customer, client, newDevice);
            return res.status(200).json({ message: "Device added"});
        } catch(e){
            console.log(e);
            res.status(500).json({ error: "Failed to add device" });
        }
    });

    router.post('/removedevice', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const deviceIds = await databaseFetch("devices", masterDb, customer, client)
    
            const deviceToBeDeleted = deviceIds.find(device => device.id === data.id);
            if(!deviceToBeDeleted){
                return res.status(404).json({ message: "Device was not found"});
            };
            const idToBeRemoved = deviceToBeDeleted["_id"];
            
            await databaseRemove("devices", masterDb, customer, client, idToBeRemoved);
            return res.status(200).json({ message: "Device was deleted" })
        } catch(e){
            console.log(e)
            res.status(500).json({ error: "Failed to delete device" });
        }
    });

    router.post('/updatedevice', authMiddleware, async (req, res) => {
        try{
            const { customer } = req.cookies;
            const data = await requestDecrypter(req.body.data, masterDb);
            data._id = new ObjectId(data.mongoid);
            await databaseReplace("devices", masterDb, customer, client, data)
            return res.status(200).json({ message: "Device was updated" });
        } catch(e){
            console.log(e);
            res.status(500).json({ error: "Failed to update device" });
        }
    });

    router.post('/groupchange', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const deviceIds = await databaseFetch("devices", masterDb, customer, client);
           
            for(const device of deviceIds){
                if(data.members.includes(device.displayName)){
                    device.group = Array.from(new Set([...device.group || [], data.groupName]));
                    await databaseReplace("devices", masterDb, customer, client, device);
                } else if(device.group && device.group.includes(data.groupName)) {
                    device.group = device.group.filter(obj => obj !== data.groupName);
                    await databaseReplace("devices", masterDb, customer, client, device);
                };
            };
            res.status(200).json({ message: "Group was changed", newDeviceList: deviceIds });
        } catch(e){
            console.log(e)
            res.status(500).json({ error: "Failed to change group" });
        }
    });

    router.post('/groupadd', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const deviceIds = await databaseFetch("devices", masterDb, customer, client);
            for(const device of deviceIds){
                if(data.members.includes(device.displayName)){
                    device.group = Array.from(new Set([...device.group || [], data.groupName]));
                    await databaseReplace("devices", masterDb, customer, client, device);
                }
            };
            res.status(200).json({ message: "Group was added", newDeviceList: deviceIds});
        } catch(e){
            console.log(e)
            res.status(500).json({ error: "Failed to add group" });
        }
    });

    router.post('/groupremove', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const deviceIds = await databaseFetch("devices", masterDb, customer, client);
            for(const device of deviceIds){
                if(device.group && device.group.includes(data.groupName)){
                    device.group = device.group.filter(obj => obj !== data.groupName)
                    await databaseReplace("devices", masterDb, customer, client, device);
                }
            };
            res.status(200).json({ message: "Group was removed", newDeviceList: deviceIds });
        } catch(e){
            console.log(e)
            res.status(500).json({ error: "Failed to remove group" });
        }
    });

    router.get('/devicestatuses', authMiddleware, async (req, res) => {
        try {
            const { customer } = req.cookies;
            const devices = await databaseFetch("devices", masterDb, customer, client);
            const collection = masterDb.collection("customerDbs");
            const customerRes = await collection.findOne({
                customerCookie: customer
            });

            const urls = devices.map(device => `${customerRes.shellyUrl}/device/status?id=${device.id}&auth_key=${customerRes.shellyToken}`);
            let results = [];
            for (const url of urls) {
                results.push(await fetchReading(url));
            };
            res.json(results.map(obj => obj.data.data))
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch device statuses" });
        }
    });

    router.get('/getcurrenthour', authMiddleware, async (req, res) => {
        try {
            const { customer } = req.cookies;
           const fsDriveControl = await databaseFetch("powerhours", masterDb, customer, client);
            res.json(fsDriveControl)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch device hours" });
        }
    });

    router.post('/setpowerhour', authMiddleware, async (req, res) => {
        try {
            const { customer } = req.cookies;
            delete req.body.data.secret;
            await databaseReplace("devices", masterDb, customer, client, req.body.data);
            res.status(200).json({ message: "Updated hours" });
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch device hours" });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const data = await requestDecrypter(req.body.data, masterDb);
            const loginResponse = await UserController.login(data, masterDb);
            if (loginResponse.status === 200) {
                const cookie = process.env.NODE_ENV === "production" ? {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 604800000,
                    path: '/'
                } : {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 2419200000,
                    path: '/'
                };
                res.cookie('authToken', loginResponse.token, cookie);
                const customerCollection = masterDb.collection("customerDbs");
                const customer = await customerCollection.findOne({ customerId: loginResponse.user.customerId });
                res.cookie('customer', customer.customerCookie, cookie)
            };
            res.status(loginResponse.status).json({ message: loginResponse.message });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        };
    });

    router.post('/createuser', async (req, res) => {
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const customerCollection = masterDb.collection("customerDbs");
            const customer = await customerCollection.findOne({ customerCookie: data.create3 });
            if(customer){
                const newUser = await UserController.create(data, masterDb, customer);
                res.status(newUser.status).json({ message: newUser.message });
            } else {
                res.status(401).json({ message: "Customer was not found "});
            };
        } catch(e){
            console.error('Create user error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/logout', async (req, res) => {
        res.cookie('authToken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            expires: new Date(0),
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    });

    router.get('/shellycredentials', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const collection = masterDb.collection("customerDbs");
            const customerInfo = await collection.findOne({
                customerCookie: customer
            });
            if(customerInfo){
                return res.status(200).json({ shellyUrl: customerInfo.shellyUrl, shellyToken: customerInfo.shellyToken, powerArea: customerInfo.powerArea });
            };
            return res.status(500).json({ message: "Something went wrong" });
        } catch(e){
            return res.status(500).json({ message: "Something went wrong" });
        }
    });

    router.post('/setshellycredentials', authMiddleware, async (req, res) => {
        const { customer } = req.cookies;
        try{
            const data = await requestDecrypter(req.body.data, masterDb);
            const collection = masterDb.collection("customerDbs");
            const customerInfo = await collection.findOne({
                customerCookie: customer
            });
            if(customerInfo){
                customerInfo.shellyUrl = data.shellyUrl;
                customerInfo.shellyToken = data.shellyToken;
                customerInfo.powerArea = data.powerArea;
                await collection.replaceOne({
                    _id: customerInfo["_id"]
                }, customerInfo);
                return res.status(200).json({ message: "Credentials succesfully set" });
            };
            return res.status(500).json({ message: "Something went wrong" });
        } catch(e){
            return res.status(500).json({ message: "Something went wrong" });
        }
    });

    router.get('/fdsf8f9an3', async (req, res) => {
        try {
            const { timestamp, hash: clientHash } = req.query;
            if (!timestamp || !clientHash) {
                return res.status(400).send({ message: 'Missing timestamp or hash.' });
            }
            const allowed = checkKeyRouteCredentials(timestamp, clientHash);
            if (allowed && req.query.session === "n41e3HGsg2V3vg") {
                const key = await getKey(masterDb);
                return res.status(200).json({ session: key });
            };
            return res.status(401).json({ message: "Unauthorized" });
        } catch (e) {
            console.error(e)
            return res.status(500).json({ e })
        };
    });

    router.get('/check-auth', authMiddleware, (req, res) => {
        res.status(200).json({ message: 'Authenticated' });
    });

    router.get('/api', (req, res) => {
        res.status(200).json({ message: "Hellooouuu "});
    });

    return router;
};