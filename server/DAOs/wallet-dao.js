'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

//get-> retrieve all payment methods
exports.listAllPaymentMethods = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM payment_methods ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const methods = rows.map((method) => ({ method_id: method.method_id, method_name: method.method_name, approval_time: method.approval_time }));
        resolve(methods);
      });
    });
  };
