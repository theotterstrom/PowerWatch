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
    const user = await collection.findOne({ email: login1 });
    if (!user) {
        return { status: 400, message: 'User not found', token: null };
    };

    const isMatch = hashPassword(login2, user.salt) == user.password;
    if (!isMatch) {
        return { status: 400, message: 'Invalid credentials', token: null };
    };
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
    return { status: 200, message: 'Login successful', token };
};

const create = async (data, db) => {
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
            salt: newSalt
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