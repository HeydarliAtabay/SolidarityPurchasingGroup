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
      resolve(o);
    });
  });
};

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
//update delivered order
exports.delivered = async (order_id, product_name) => {
  const test = await this.getO(order_id, product_name);

  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE orders SET order_id=?, client_id=?, product_name=?, state=?, OrderPrice=? , id=? WHERE order_id=? AND product_name=?';
    db.run(
      sql,
      [
        test.order_id,
        test.client_id,
        test.product_name,
        'delivered',
        test.OrderPrice,
        test.id,
        order_id,
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
// insert a new order
exports.insert_order = async (client_id, totalorderprice) => {
  return new Promise((resolve, reject) => {
    const MAX_NUM = 10000000;
    const sql =
      'INSERT INTO orders (order_id, client_id,product_name,state,OrderPrice) VALUES (?,?,?,?,?)';
    const order_id = Math.floor(Math.random() * MAX_NUM);

    db.run(
      sql,
      [order_id, client_id, '', 'booked', totalorderprice],
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

// Add a new order
exports.addOrder = (t) => {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO orders( order_id, client_id, product_name, product_id, order_quantity, state, OrderPrice, id,address,city,zipcode,Nation,date,time, pickup ) VALUES ( ?,?, ?,?, ?, ?, ?, ?, ?,?,?,?,?,?,? )';
    db.run(
      sql,
      [
        t.order_id,
        t.client_id,
        t.product_name,
        t.product_id,
        t.order_quantity,
        t.state,
        t.OrderPrice,
        t.id,
        t.address,
        t.city,
        t.zipcode,
        t.Nation,
        t.date,
        t.time,
        t.pickup
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

//delete an order item
exports.deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM orders WHERE id = ? ';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

exports.setOrderAsWarehousePrepared = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE orders SET state="prepared" WHERE product_id=?';
    db.run(sql, [product_id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

exports.getBookedOrders = (provider_id, year, week_number) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT products.product_id AS productID, products.product_name, SUM(order_quantity) AS TotQty, products.product_unit ' +
      'FROM products, orders ' +
      'WHERE products.provider_id=? AND products.year=? AND products.week_number=? AND products.product_id=orders.product_id AND (orders.state="booked" OR orders.state="pending") AND orders.farmer_state IS NULL ' +
      'GROUP BY products.product_id, products.product_name, products.product_unit';
    db.all(sql, [provider_id, year, week_number], (err, rows) => {
      if (err) {
        reject(err);
      }
      const products = rows.map((p) => ({
        id: p.productID,
        name: p.product_name,
        tot_quantity: p.TotQty,
        unit: p.product_unit,
      }));
      resolve(products);
    });
  });
}

exports.setOrderAsFarmerShipped = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE orders SET farmer_state="farmer-shipped" WHERE product_id=?';
    db.run(sql, [product_id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

exports.getProviderShipmentStatus = (provider_id, year, week_number) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT COUNT(*) AS NumShipped ' +
      'FROM products, orders ' +
      'WHERE products.provider_id=? AND products.year=? AND products.week_number=? AND products.product_id=orders.product_id AND orders.farmer_state="farmer-shipped"';
    db.get(sql, [provider_id, year, week_number], (err, row) => {
      if (err) {
        reject(err);
      }
      console.log(row);
      if (row.NumShipped > 0) {
        resolve(true);
      }
      resolve(false);
    });
  });
}
