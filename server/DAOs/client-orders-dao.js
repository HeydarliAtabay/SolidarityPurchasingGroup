'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
  if (err) {
    throw err;
  }
});

//get-> retrieve all client orders
exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from orders';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const o = rows.map((e) => ({
        order_id: e.order_id,
        client_id: e.client_id,
        product_name: e.product_name,
        state: e.state,
      }));
      resolve(o);
    });
  });
};
//retrieve order given its id
exports.getO = (order_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM orders WHERE order_id =? ';

    db.get(sql, [order_id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};
//update delivered order
exports.delivered = async (order_id) => {
  const test = await this.getO(order_id);

  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE orders SET order_id=?, client_id=?, product_name=?, state=? WHERE order_id=?';
    db.run(
      sql,
      [test.order_id, test.client_id, test.product_name, 'delivered', order_id],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(null);
      }
    );
  });
};

// insert a new order
exports.insert_order = async (client_id, totalorderprice) => {
  return new Promise((resolve, reject) => {
    const MAX_NUM = 10000000;
    const sql =
      'INSERT INTO orders (order_id, client_id,product_name,state,OrderPrice) VALUES (?,?,?,?,?)';
    const order_id = Math.floor(Math.random() * MAX_NUM);

    db.run(
      sql,
      [order_id, client_id, , 'booked', totalorderprice],
      function (err) {
        if (err) {
          reject(err);
          console.log(err.message);
          return;
        }
        resolve(order_id);
      }
    );
  });
};

exports.insert_order_items = async (order_id, order_items) => {
  return new Promise((resolve, reject) => {
    const MAX_ITEMS = 1000;
    const err_response = { status: 'FAIL' };
    const ok_response = { status: 'OK' };

    if (order_items.length > MAX_ITEMS) {
      reject(err_response);
      return;
    }

    const sql =
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?,?,?)';

    db.run(sql, [order_id, order_items.id, order_items.qty], (err) => {
      if (err) {
        console.log(err);
        reject(err_response);
        return;
      }
      resolve(ok_response);
    });
  });
};
