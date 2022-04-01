/* eslint-disable */
const crypto = require('crypto');

// console.log(Math.floor(Date.now() / 1000));

const hash = crypto.randomBytes(32).toString('hex');
const hash2 = crypto.createHash('sha256').update(hash).digest('hex');

console.log(hash, '\n', hash2);
