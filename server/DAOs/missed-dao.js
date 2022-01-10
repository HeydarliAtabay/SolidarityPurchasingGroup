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

//get-> retrieve all missed pickups
exports.getAllMissedPickups = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from missed_pickups';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const o = rows.map((e) => ({
        order_id: e.order_id,
        client_id: e.client_id
      }));
      resolve(o);
    });
  });
};
// Add a missed pickup
exports.addMissedPickup = (t) => {
  return new Promise((resolve, reject) => {
    
    const sql =
      'INSERT INTO missed_pickups ( order_id, client_id ) VALUES ( ? , ? )';
    db.run(
      sql,
      [
        t.order_id,
        t.client_id
      ],
      function (err) {
        if (err) {
          reject(err);

          return;
        }
        resolve(t.order_id);
      }
    );
  });
};