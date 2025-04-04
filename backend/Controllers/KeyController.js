const crypto = require('crypto');

const generateRandomString = (length = 36) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~`-=';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    };
    return randomString;
};

const getKey = async db => {
    const collection = db.collection("keys");
    const allEntries = await collection.find({}).toArray();
    if (allEntries.length < 100) {
        const key = generateRandomString();
        const newSecret = await collection.insertOne({
            key
        });
        return key
    } else {
        await collection.deleteMany({})
        return await getKey(db);
    };
};

const unscramble = async (encryptedData, rawKey) => {
    const keyData = new TextEncoder().encode(rawKey).slice(0, 16);
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedContent = encryptedBuffer.slice(16);
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyData, iv);
    let decrypted = decipher.update(encryptedContent, null, 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

const hashTimestamp = timestamp => {
    const secret = "545267c8893806c0871f533fdfd4c06b";
    const hash = crypto
        .createHmac('sha256', secret)
        .update(timestamp.toString())
        .digest('hex');
    return hash;
};

const checkKeyRouteCredentials = (timestamp, clientHash ) => {
    const now = Math.floor(Date.now() / 1000);
    const oneMinute = 90;
    if (Math.abs(now - timestamp) > oneMinute) {
        return false
    };
    const serverHash = hashTimestamp(timestamp);
    if (clientHash === serverHash) {
        return true
    } else {
        return false
    };
};

const requestDecrypter = async (req, db) => {
    const [data, keyPart] = req.request.split("fdsf8f9an3");
    const collection = db.collection("keys");
    const allKeys = await collection.find({}).toArray();
    const correctKey = allKeys.find(obj => obj.key.slice(10, 20) === keyPart).key;
    const unscrambledData = await unscramble(data, correctKey)
    return await JSON.parse(unscrambledData);
};

module.exports = {
    getKey,
    unscramble,
    checkKeyRouteCredentials,
    requestDecrypter,
    generateRandomString
};