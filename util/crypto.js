const crypto = require('crypto');

const SECURIT_KEY = 'json';
const securit = (content) => {
    const md5 = crypto.createHash('md5');

    return md5.update(content).digest('hex');
}

const addSecurit = (username) => {
    const string = `username=${username}&securite=${SECURIT_KEY}`;

    return securit(string);
}


module.exports = addSecurit;