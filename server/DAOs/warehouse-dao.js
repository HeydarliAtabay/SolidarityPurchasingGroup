'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});


exports.getProviderShippedOrders = (provider_id) => {
    return new Promise((resolve, reject) => {
        const product_status = 'confirmed';
        const farmer_state = 'farmer-shipped';
        const sql = 'SELECT DISTINCT provider_id, order_id, client_id FROM products, orders  WHERE products.product_id = orders.product_id AND orders.farmer_state==? AND products.provider_id==?';
        
        db.all(sql, [farmer_state, provider_id, ], (err, rows) => {
            if (err) {
                reject(err);
            }
            const providerOrders = rows.map((p) => ({
                prov_id: p.product_id,
                ord_id: p.order_id,
                cli_id: p.client_id,
                
            }));
            resolve(providerOrders);
        });
    });
}