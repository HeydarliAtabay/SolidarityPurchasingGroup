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

//get-> retrieve clients and their budget 
exports.getAllClients = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from clients';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const o = rows.map((e) => ({
        client_id: e.client_id, budget: e.budget, name: e.name, surname: e.surname, gender: e.gender, birthdate: e.birthdate,
        country: e.country, region: e.region, address: e.address, city: e.city, phone: e.phone, email: e.email
      }));
      resolve(o);
    });
  });
};

/// Adding new client to the db //////

exports.createClient = (client) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO clients(budget,name,surname, gender, birthdate, country, region, address, city, phone,email, hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
    db.run(sql, [client.budget, client.name, client.surname, client.gender, client.birthdate, client.country, client.region,
    client.address, client.city, client.phone, client.email, client.hash
    ], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log(this.lastID);
      resolve(this.lastID)
    });
  });
};

exports.putTelegramUserId = (telegramId,email) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE clients SET telegramId=? WHERE email=?';
    db.run(sql, [telegramId, email], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};