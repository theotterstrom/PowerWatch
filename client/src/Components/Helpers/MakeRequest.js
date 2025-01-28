const scrambler = require('./Scrambler');
const apiUrl = require('./APIWrapper');
const axios = require('axios');

module.exports = async (data, path, method, headers = {}) => {
    try {
        if (method === 'get') {
            const response = await axios[method](`${apiUrl}/${path}`, {
                headers: headers,
                withCredentials: true
            });
            return response;
        };
        const scrambledData = await scrambler(JSON.stringify(data));
        if (scrambledData) {
            const response = await axios[method](`${apiUrl}/${path}`, {
                data: { request: scrambledData },
                headers: headers
            }, {
                withCredentials: true
            });
            return response;
        } else {
            alert("Something went wrong")
        }
    } catch (error) {
        console.log(error)
        return error;
    };
};
