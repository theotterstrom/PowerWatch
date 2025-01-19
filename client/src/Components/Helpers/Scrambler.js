const axios = require('axios');
const apiUrl = require('./APIWrapper')
const CryptoJS = require('crypto-js');

const scramble = async (text, rawkey) => {
    const keyData = new TextEncoder().encode(rawkey);
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encodedText = enc.encode(text);
    const truncatedKeyData = keyData.slice(0, 16);
    const key = await crypto.subtle.importKey(
        "raw",
        truncatedKeyData,
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );
    const encryptedContent = await crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        key,
        encodedText
    );
    const combinedArray = new Uint8Array(iv.length + encryptedContent.byteLength);
    combinedArray.set(iv, 0);
    combinedArray.set(new Uint8Array(encryptedContent), iv.length);
    return btoa(String.fromCharCode(...combinedArray));
};

const encryptTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    const secret = "545267c8893806c0871f533fdfd4c06b";
    const hash = CryptoJS.HmacSHA256(now.toString(), secret).toString(CryptoJS.enc.Hex);
    return { hash, timestamp: now };
};

module.exports = async (string) => {
    const { hash, timestamp } = encryptTimestamp();
    const response = await axios.get(`${apiUrl}/fdsf8f9an3?session=n41e3HGsg2V3vg&timestamp=${timestamp}&hash=${hash}`);
    if (response.status !== 200) {
        return null
    }
    return `${await scramble(string, response.data.session)}fdsf8f9an3${response.data.session.slice(10, 20)}`
};
