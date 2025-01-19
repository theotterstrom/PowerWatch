require('dotenv').config();
const express = require('express');
const deviceIds = require('./data/deviceIds.json');
const axios = require('axios');
const router = express.Router();
const app = express();
const fs = require('fs');
const { getKey, checkKeyRouteCredentials, requestDecrypter } = require('./server-scripts/KeyController');
const UserController = require('./server-scripts/UserController');
const jwt = require('jsonwebtoken');

let database;
const { shellytoken, shellyurl } = process.env;

const databaseFetch = async (collectionName, offset = 0, limit = 400) => {
    try {
        const collection = database.collection(collectionName);
        const results = await collection
            .find({})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray();
        return results;
    } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        throw err;
    }
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchReading = async (url, retries = 5) => {
    try {
        return await axios.get(url)
    } catch (e) {
        console.log("Failed to fetch, trying again", retries, e)
        await sleep(2000);
        if (retries <= 1) {
            return {
                data: {
                    data: {
                        device_status: {
                            meters: [{
                                total: 0
                            }]
                        }
                    }
                }
            };
        };
        return fetchReading(url, retries - 1);
    };
};

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;  // Retrieve the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token' });
    };
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    };
};

const verifyToken = (token) => {
    if (!token) {
        return { authenticated: false, status: 401, message: "No token provided" };
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { authenticated: true, decoded };
    } catch (error) {
        return { authenticated: false, status: 401, message: "Unauthorized" };
    }
};
module.exports = (db) => {

    database = db;

    router.get('/schedueles', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            res.json(await databaseFetch("schedueles"));
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch schedueles" });
        }
    });

    router.get('/prices', async (req, res) => {
        const authToken = req.cookies.authToken;
        const verificationResult = verifyToken(authToken);

        if (!verificationResult.authenticated) {
            return res.status(verificationResult.status).json({ message: verificationResult.message });
        };
        try {
            res.json(await databaseFetch("prices"));
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
            res.json(await databaseFetch("power_readings", offset || 0));
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
            res.json(await databaseFetch("savings", offset || 0));
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
            res.json(await databaseFetch("temp_readings", offset || 0));
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
            const urls = resultNames.map(name => `${shellyurl}/device/status?id=${deviceIds[name]}&auth_key=${shellytoken}`);
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
            const fileContents = JSON.parse(fs.readFileSync('./data/drivecontrol.json'))
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
                fs.writeFileSync('./data/drivecontrol.json', JSON.stringify(req.body));
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
                res.cookie('authToken', loginResponse.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 2419200000,
                    path: '/'
                });
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

    return router;
};