'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM products, providers, product_categories WHERE products.category_id=product_categories.category_id AND products.provider_id=providers.provider_id';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const products = rows.map((p) => ({
                id: p.product_id,
                name: p.product_name,
                description: p.product_description,
                category: p.category_name,
                price: p.product_price,
                unit: p.product_unit,
                quantity: p.product_quantity,
                expiryDate: p.product_expiry,
                providerId: p.provider_id,
                providerName: p.provider_name
            }));
            resolve(products);
        });
    });
};

exports.getProductById = (product_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM products, providers, product_categories WHERE products.product_id=? AND products.category_id=product_categories.category_id AND products.provider_id=providers.provider_id';
        db.get(sql, [product_id], (err, row) => {
            if (err) {
                reject(err);
            }
            const product = {
                id: row.product_id,
                name: row.product_name,
                description: row.product_description,
                category: row.category_name,
                price: row.product_price,
                unit: row.product_unit,
                quantity: row.product_quantity,
                expiryDate: row.product_expiry,
                providerId: row.provider_id,
                providerName: row.provider_name
            }
            resolve(product);
        });
    });
};
