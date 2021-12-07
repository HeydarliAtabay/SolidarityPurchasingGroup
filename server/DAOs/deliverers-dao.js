'use strict';

const sqlite = require('sqlite3');

let db = new sqlite.Database('spg.db', (err) => {
  if (err) {
    throw err;
  }
});

exports.setTestDB = (db_name) => {
  db = new sqlite.Database(db_name, (err) => { if (err) throw err; });
}


//get-> retrieve all client orders
exports.getAllDeliverers = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * from deliverers';
  
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const o = rows.map((e) => ({
          id: e.id,
          username: e.username,
          city: e.city
        }));
        resolve(o);
      });
    });
  };