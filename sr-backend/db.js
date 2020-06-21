const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports.query = (text, params) => {
    return new Promise((resolve, reject) => {
        pool.query(text, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    });
};