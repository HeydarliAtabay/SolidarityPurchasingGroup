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

//retrieve order given its id
exports.getO = (order_id, product_name) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM orders WHERE order_id =? AND product_name=? ';

    db.get(sql, [order_id, product_name], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

exports.getProviderShippedOrders = (provider_id) => {
  return new Promise((resolve, reject) => {
    const farmer_state = 'farmer-shipped';
    const sql = 'SELECT provider_id, order_id, clients.client_id, products.product_id, products.product_name, clients.name, clients.surname FROM products, orders, clients  WHERE  clients.client_id= orders.client_id AND products.product_id = orders.product_id  AND orders.farmer_state==? AND products.provider_id==?';

    db.all(sql, [farmer_state, provider_id,], (err, rows) => {
      if (err) {
        reject(err);
      }
      const providerOrders = rows.map((p) => ({
        prov_id: p.provider_id,
        ord_id: p.order_id,
        cli_id: p.client_id,
        prod_id: p.product_id,
        prod_name: p.product_name,
        client_name: p.name,
        client_surname: p.surname
      }));
      resolve(providerOrders);
    });
  });
}

exports.changeStateFarmer = async (id, product_name, state) => {
  const test = await this.getO(id, product_name);

  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE orders SET order_id=?, client_id=?, product_name=?, product_id=?, order_quantity=?, state=?, farmer_state=?, OrderPrice=? , id=?, address=?, city=?, zipcode=?, Nation=?, date=?, time=?, pickup=? WHERE order_id=? AND product_name=?';
    db.run(
      sql,
      [
        test.order_id,
        test.client_id,
        test.product_name,
        test.product_id,
        test.order_quantity,
        test.state,
        state,
        test.OrderPrice,
        test.id,
        test.address,
        test.city,
        test.zipcode,
        test.Nation,
        test.date,
        test.time,
        1,
        id,
        product_name,
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