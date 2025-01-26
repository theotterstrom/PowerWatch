require('dotenv').config();
const express = require('express');
const deviceIds = require('../cron-scripts/data/deviceIds.json');
const driveControl = require('../cron-scripts/data/drivecontrol.json');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getKey, checkKeyRouteCredentials, requestDecrypter } = require('./Controllers/KeyController');
const UserController = require('./Controllers/UserController');
const {
    verifyToken,
    authMiddleware,
    fetchReading,
    databaseFetch
} = require('./helpers.js')
const { shellytoken, shellyurl } = process.env;

module.exports = (db) => {

    router.get('/schedueles', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            res.json(await databaseFetch("schedueles", db));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch schedueles" });
        }
    });

    router.get('/devices', async (req, res) => {
        const fsDeviceIds = fs.readFileSync('./cron-scripts/data/deviceIds.json');
        const parsedDeviceIds = JSON.parse(fsDeviceIds);
        res.json(parsedDeviceIds);
    });

    router.post('/addnewdevice', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };

        const fsDeviceIds = fs.readFileSync('./cron-scripts/data/deviceIds.json');
        const parsedDeviceIds = JSON.parse(fsDeviceIds);

        const data = await requestDecrypter(req.body.data, db);
        const parsedData = JSON.parse(data);
        if(Object.values(parsedDeviceIds).some(value => value.id === parsedData.id)){
            return res.status(409).json({ message: "Device id already exists"});
        };
        if(parsedDeviceIds[parsedData.deviceName]){
            return res.status(409).json({ message: "Device already exists"});
        };
        parsedDeviceIds[parsedData.deviceName] = {
            displayName: parsedData.displayName,
            id: parsedData.id,
            wattFormat: parsedData.wattFormat,
            deviceType: parsedData.deviceType
        };
        
        if(parsedData.deviceType === "Relay"){
            const fsDriveControl = fs.readFileSync('./cron-scripts/data/deviceIds.json');
            const parsedDriveControl = JSON.parse(fsDriveControl);
            parsedDriveControl[`device-${parsedData.deviceName}`] = "0";
            fs.writeFileSync('./cron-scripts/data/devicecontrol.json', JSON.stringify(parsedDriveControl));
        };
        fs.writeFileSync('./cron-scripts/data/deviceIds.json', JSON.stringify(parsedDeviceIds));
        return res.status(200).json({ message: "Device added"});
    });

    router.post('/removedevice', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        const data = await requestDecrypter(req.body.data, db);
        const parsedData = JSON.parse(data);
        if(!Object.entries(deviceIds).find(([key, value]) => value.id === parsedData.id)){
            return res.status(404).json({ message: "Device was not found"});
        };
        const fsDeviceIds = fs.readFileSync('./cron-scripts/data/deviceIds.json');
        const parsedDeviceIds = JSON.parse(fsDeviceIds);
        const deleteKey = Object.entries(parsedDeviceIds).find(([key, value]) => value.id === parsedData.id)[0];
        delete parsedDeviceIds[deleteKey];
        fs.writeFileSync('./cron-scripts/data/deviceIds.json', JSON.stringify(parsedDeviceIds));
        return res.status(200).json({ message: "Device was deleted"})
    });

    router.get('/prices', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            res.json(await databaseFetch("prices", db));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch prices" });
        }
    });

    router.get('/readings', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        const { offset } = req.query;
        try {
            res.json(await databaseFetch("power_readings", db, offset || 0));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch readings" });
        }
    });

    router.get('/savings', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        const { offset } = req.query;
        try {
            res.json(await databaseFetch("savings", db, offset || 0));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch savings" });
        }
    });

    router.get('/temperatures', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        const { offset } = req.query;
        try {
            res.json(await databaseFetch("temp_readings", db, offset || 0));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch temperatures" });
        }
    });

    router.get('/devicestatuses', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            const resultNames = [
                'nilleboat', 'loveboat', 'nillebovp', 'ottebo', 'nillebovv',
                'pool', 'lovetemp', 'nilletemp', 'ottetemp', 'uttemp'
            ];
            let results = [];
            const urls = resultNames.map(name => `${shellyurl}/device/status?id=${deviceIds[name]?.id}&auth_key=${shellytoken}`);
            for (const url of urls) {
                results.push(await fetchReading(url));
            };
            res.json(results.map(obj => obj.data.data))
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch device statuses" });
        }
    });

    router.get('/getcurrenthour', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            const filePath = path.join(__dirname, 'data', 'drivecontrol.json');
            const fileContents = JSON.parse(fs.readFileSync('./cron-scripts/data/drivecontrol.json', 'utf8'));
            res.json(fileContents)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Failed to fetch device hours" });
        }
    });

    router.post('/setpowerhour', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        if (req.body.data.secret === "28mortvik") {
            try {
                delete req.body.data.secret;
                fs.writeFileSync('./cron-scripts/data/drivecontrol.json', JSON.stringify(req.body));
                res.status(200).json({ message: "Updated hours" });
            } catch (e) {
                console.log(e)
                res.status(500).json({ error: "Failed to fetch device hours" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const data = await requestDecrypter(req.body.data, db);
            const loginResponse = await UserController.login(JSON.parse(data), db);
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
            }
            res.status(loginResponse.status).json({ message: loginResponse.message });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/createuser', async (req, res) => {
        const data = await requestDecrypter(req.body.data, db);
        const newUser = await UserController.create(JSON.parse(data), db);
        res.status(newUser.status).json({ message: newUser.message });
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

    router.get('/fdsf8f9an3', async (req, res) => {
        try {
            const { timestamp, hash: clientHash } = req.query;
            if (!timestamp || !clientHash) {
                return res.status(400).send({ message: 'Missing timestamp or hash.' });
            }
            const allowed = checkKeyRouteCredentials(timestamp, clientHash);
            if (allowed && req.query.session === "n41e3HGsg2V3vg") {
                const key = await getKey(db);
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