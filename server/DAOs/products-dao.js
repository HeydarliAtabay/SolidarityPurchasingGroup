'use strict';

const sqlite = require('sqlite3');

let db = new sqlite.Database('spg.db', (err) => {
  if (err) {
    throw err;
  }
});

exports.setTestDB = (db_name) => {
  db = new sqlite.Database(db_name, (err) => {
    if (err) throw err;
  });
};

exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM products';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      console.log(rows)
;      const products = rows.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        description: p.product_description,
        category: p.category_name,
        price: p.product_price,
        unit: p.product_unit,
        quantity: p.product_quantity,
        expiryDate: p.product_expiry,
        providerId: p.provider_id,
        providerName: p.provider_name,
        year: p.year,
        week: p.week_number,
        status: p.product_status,
        active: p.notified,
      }));
      resolve(products);
    });
  });
};

exports.getAllConfirmedProducts = (year, week) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM products, providers, product_categories WHERE products.year=? AND products.week_number=?  AND products.category_id=product_categories.category_id AND products.provider_id=providers.provider_id';
    db.all(sql, [year, week], (err, rows) => {
      if (err) {
        reject(err);
      }
      const products = rows.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        description: p.product_description,
        category: p.category_name,
        categoryId: p.category_id,
        price: p.product_price,
        unit: p.product_unit,
        quantity: p.product_quantity,
        expiryDate: p.product_expiry,
        providerId: p.provider_id,
        providerName: p.provider_name,
        year: p.year,
        week: p.week_number,
        status: p.product_status,
        active: 1,
      }));
      resolve(products);
    });
  });
};

exports.getAllExpectedProducts = (year, week) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM products, providers, product_categories WHERE products.year=? AND products.week_number=? AND products.category_id=product_categories.category_id AND products.provider_id=providers.provider_id';
    db.all(sql, [year, week], (err, rows) => {
      if (err) {
        reject(err);
      }
      const products = rows.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        description: p.product_description,
        category: p.category_name,
        categoryId: p.category_id,
        price: p.product_price,
        unit: p.product_unit,
        quantity: p.product_quantity,
        expiryDate: p.product_expiry,
        providerId: p.provider_id,
        providerName: p.provider_name,
        year: p.year,
        week: p.week_number,
        status: p.product_status,
        active: 1,
      }));
      resolve(products);
    });
  });
};

exports.getProductById = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM products, providers, product_categories WHERE products.product_id=? AND products.category_id=product_categories.category_id AND products.provider_id=providers.provider_id';
    db.get(sql, [product_id], (err, row) => {
      if (err) {
        reject(err);
      }
      const product = {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        category: row.category_name,
        categoryId: p.category_id,
        price: row.product_price,
        unit: row.product_unit,
        quantity: row.product_quantity,
        expiryDate: row.product_expiry,
        providerId: row.provider_id,
        providerName: row.provider_name,
        active: 1,
      };
      resolve(product);
    });
  });
};

exports.getAllCategories = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT category_id, category_name FROM product_categories';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      const categories = rows.map((c) => ({
        id: c.category_id,
        name: c.category_name,
      }));
      resolve(categories);
    });
  });
};

exports.putProductQuantity = (product_id, quantity) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE products SET product_quantity=? Where product_id=?';
    db.run(sql, [quantity, product_id], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

exports.getProviderAvailableProducts = (provider_id, year, week_number) => {
  return new Promise((resolve, reject) => {
    console.log(provider_id, year, week_number);
    const sql =
      'SELECT * FROM products WHERE products.provider_id=? AND products.year=? AND products.week_number=? AND products.product_confirmed=0';
    db.all(sql, [provider_id, year, week_number], (err, rows) => {
      if (err) {
        reject(err);
      }
      let products = [];
      if (rows.length > 0) {
        products = rows.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          description: p.product_description,
          category: p.category_id,
          price: p.product_price,
          unit: p.product_unit,
          quantity: p.product_quantity,
          expiryDate: p.product_expiry,
          providerId: p.provider_id,
          year: p.year,
          week: p.week_number,
          status: p.product_status
        }));
      }
      resolve(products);
    });
  });
};

exports.deleteExpectedProducts = (provider_id, year, week_number) => {
  return new Promise((resolve, reject) => {
    const sql =
      'DELETE from products WHERE provider_id=? AND year=? AND week_number=?';
    db.run(sql, [provider_id, year, week_number], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

exports.insertNewExpectedProduct = (prod, provider_id) => {
  return new Promise((resolve, reject) => {
    const product_status = 'confirmed';
    const sql =
      'INSERT INTO products(product_name, product_description, category_id, product_price, product_unit, product_quantity, provider_id, year, week_number, product_status,notified) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    db.run(
      sql,
      [
        prod.name,
        prod.description,
        prod.category,
        prod.price,
        prod.unit,
        prod.quantity,
        provider_id,
        prod.year,
        prod.week_number,
        product_status,
        0,
      ],
      function (err) {
        if (err) {
          reject(err);
        }
        console.log(this);
        resolve(this.lastID);
      }
    );
  });
};

exports.confirmExpectedProduct = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE orders SET farmer_state="confirmed" WHERE product_id=?';
    db.run(sql, [product_id], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
    });
  });
};

exports.markProductAsConfirmed = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE products SET product_confirmed=1 WHERE product_id=?';
    db.run(sql, [product_id], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.unavailableProduct = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM orders WHERE product_id=?';
    db.run(sql, [product_id], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
    });
  });
};

exports.deleteProduct = (product_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM products WHERE product_id=?';
    db.run(sql, [product_id], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
    });
  });
};
