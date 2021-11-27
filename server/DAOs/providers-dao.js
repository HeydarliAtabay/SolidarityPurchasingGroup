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

exports.getProviderExistingProducts = (provider_id) => {
    return new Promise((resolve, reject) => {
        const product_status = 'confirmed';
        const sql = 'SELECT * FROM products WHERE products.provider_id=? AND products.product_status=? GROUP BY product_name ORDER BY year, week_number DESC';
        db.all(sql, [provider_id, product_status], (err, rows) => {
            if (err) {
                reject(err);
            }
            const providerProducts = rows.map((p) => ({
                id: p.product_id,
                name: p.product_name,
                description: p.product_description,
                category: p.category_id,
                price: p.product_price,
                unit: p.product_unit,
                quantity: 0,
                expiryDate: '',
                providerId: provider_id,
                providerName: '',
                year: 0,
                week: 0,
                status: 'confirmed',
                active: 1
            }));
            resolve(providerProducts);
        });
    });
}

exports.checkProviderAvailabilityConfirmation = (provider_id, year, week_number) => {
    return new Promise((resolve, reject) => {
        const product_status = 'confirmed';
        const sql = 'SELECT COUNT(*) AS value FROM products WHERE products.provider_id=? AND products.year=? AND products.week_number=? AND products.product_status=?';
        db.get(sql, [provider_id, year, week_number, product_status], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row.value > 0) {
                resolve(true);
            }
            resolve(false);
        });
    });
}