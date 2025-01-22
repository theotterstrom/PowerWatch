require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const databaseFetch = async (collectionName, database, offset = 0, limit = 400) => {
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

module.exports = {
    verifyToken,
    authMiddleware,
    fetchReading,
    databaseFetch
};