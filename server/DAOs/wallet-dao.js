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

// wallet top-up

exports.increaseBalance = (amount, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE clients SET budget=budget+? WHERE client_id = ? ';
    db.run(sql, [amount, id], function (err) {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
    });
  });
};


/// Adding new transaction

exports.createTransaction = (tr) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO transactions(type,client_id,method_id,account_num,amount,date,time,status) VALUES(?,?,?,?,?,?,?,?)'
    db.run(sql, [tr.type, tr.client_id, tr.method_id, tr.account_num, tr.amount, tr.date, tr.time, tr.status], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log(this.lastID);
      resolve(this.lastID)
    });
  });
};


// retrieve balance from telegram id

exports.retrieveBudgetByTelegramID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT budget FROM clients WHERE telegramId=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const methods = rows.map((res) => ({ budget: res.budget }));
      resolve(methods);
    });
  });
};