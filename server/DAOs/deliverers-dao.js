'use strict';

const sqlite = require('sqlite3');
const ordersDao = require('./client-orders-dao');

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

  exports.getAllDeliverableOrders = (city) => {
    return new Promise((resolve, reject) => {
      const product_status1 = 'booked';
      const product_status2 = 'shipped';
      const sql =
        'SELECT  DISTINCT order_id, client_id, state, address, city, zipcode   FROM orders WHERE (city =? AND pickup=? AND state=?) OR (city =? AND pickup=? AND state=?) ';
      db.all(sql, [city,0,product_status1, city,0, product_status2], (err, rows) => {
        if (err) {
          reject(err);
        }
        const orders = rows.map((e) => ({
        order_id: e.order_id,
        client_id: e.client_id,
        product_name: e.product_name,
        product_id: e.product_id,
        order_quantity: e.order_quantity,
        state: e.state,
        farmer_state: e.farmer_state,
        OrderPrice: e.OrderPrice,
        id: e.id,
        address: e.address,
        city: e.city,
        zipcode: e.zipcode,
        Nation: e.Nation,
        date: e.date,
        time: e.time,
        pickup: e.pickup
        }));
        resolve(orders);
      });
    });
  };

  //update state order
exports.changeState = async (id, product_name, state) => {
  const test = await ordersDao.getO(id, product_name);

  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE or REPLACE orders SET order_id=?, client_id=?, product_name=?, product_id=?, order_quantity=?, state=?, OrderPrice=? , id=?, address=?, city=?, zipcode=?, Nation=?, date=?, time=?, pickup=? WHERE order_id=?';
    db.run(
      sql,
      [
        test.order_id,
        test.client_id,
        test.product_name,
        test.product_id,
        test.order_quantity,
        state,
        test.OrderPrice,
        test.id,
        test.address,
        test.city,
        test.zipcode,
        test.Nation,
        test.date,
        test.time,
        test.pickup,
        id,
        product_name
      ],
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
// get deliverer by id
exports.getDelivererByMail = (deliverer_mail) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM deliverers WHERE username=?';
      db.get(sql, [deliverer_mail], (err, row) => {
          if (err) {
              reject(err);
          }
          const deliverer = {
              id: row.id,
              username: row.username,
              name: row.name,
              city: row.city
              
          }
          resolve(deliverer);
      });
  });
};