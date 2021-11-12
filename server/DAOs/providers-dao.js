'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

exports.getAllProviders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM providers';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const providers = rows.map((p) => ({
                id: p.provider_id,
                name: p.provider_name,
                description: p.provider_description,
                location: p.provider_location
            }));
            resolve(providers);
        });
    });
};

exports.getProviderById = (provider_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM providers WHERE provider_id=?';
        db.get(sql, [provider_id], (err, row) => {
            if (err) {
                reject(err);
            }
            const provider = {
                id: row.provider_id,
                name: row.provider_name,
                description: row.provider_description,
                location: row.provider_location
            }
            resolve(provider);
        });
    });
};
