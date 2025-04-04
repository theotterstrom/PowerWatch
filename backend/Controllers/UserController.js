const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const { generateRandomString } = require('./KeyController');

const hashPassword = (password, salt) => {
    return crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');
};


const login = async (data, db) => {
    const { login1, login2 } = data;
    const collection = db.collection("users");

    if(login1 === "demo" && login2 === "demo"){
        const user = await collection.findOne({ email: "demo@powerwatch.se" });
        const token = jwt.sign({ email: "demo" }, process.env.JWT_SECRET, { expiresIn: '14d' });
        console.log({ status: 200, message: 'Login successful', token, user })
        return { status: 200, message: 'Login successful', token, user };
    };

    
    const user = await collection.findOne({ email: login1 });
    if (!user) {
        return { status: 400, message: 'User not found', token: null };
    };

    const isMatch = hashPassword(login2, user.salt) == user.password;
    if (!isMatch) {
        return { status: 400, message: 'Invalid credentials', token: null };
    };
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '14d' });
    return { status: 200, message: 'Login successful', token, user };
};

const create = async (data, db, customer) => {
    try {
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email: data.create1 });
        if (existingUser) {
            return { status: 400, message: 'User already exists' }
        };
        const newSalt = generateRandomString();
        const newUser = await collection.insertOne({
            email: data.create1,
            password: hashPassword(data.create2, newSalt),
            salt: newSalt,
            customerId: customer.customerId,
        });
        return { status: 200, message: 'User created successfully!' }
    } catch (e) {
        console.error(e)
        return { status: 500, message: "An error occured" }
    }
};
module.exports = {
    login,
    create
}