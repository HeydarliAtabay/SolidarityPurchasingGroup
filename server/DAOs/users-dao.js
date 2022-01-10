'use strict';

const sqlite = require('sqlite3');
let db = new sqlite.Database('spg.db', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');

exports.setTestDB = (db_name) => {
    db = new sqlite.Database(db_name, (err) => { if (err) throw err; });
}

// Add a new client
exports.addclient = (t) => {
    return new Promise((resolve, reject) => {
       
        const sql = 'INSERT INTO users( id, name, email, hash, role, suspended,date_suspension ) VALUES ( NULL, ?, ?, ?, ?, ? ,?)';
        db.run(sql, [t.name, t.email, t.hash, t.role, t.suspended,t.date_suspension], function (err) {
            if (err) {
                reject(err);

                return;
            }
            resolve(t.id);
        });
    });
};
//get-> retrieve all users
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from users';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const o = rows.map((e) => ({
                id: e.id,
                name: e.name,
                email: e.email,
                hash: e.hash,
                role: e.role, 
                suspended: e.suspended,
                date_suspension:e.date_suspension
            }));
            resolve(o);
        });
    });
};

//LOGIN

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id, username: row.email, name: row.name, role: row.role, suspended: row.suspended, date_suspension:row.date_suspension };
                bcrypt.compare(password, row.hash).then(result => {
                    if (result)
                        resolve(user); 
                    else
                        resolve(false);
                }).catch();
            }
        });
    });
};


exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.id, username: row.email, name: row.name, role: row.role, suspended: row.suspended,date_suspension: row.date_suspension }
                resolve(user);
            }
        });
    });
};

exports.checkIfEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            console.log(row);
            if (row) {
                resolve(true);
            }
            else {
                return new Promise((resolve1, reject1) => {
                    const sql1 = 'SELECT * FROM farmer_applications WHERE farmer_email = ?';
                    db.get(sql1, [email], (err1, row1) => {
                        if (err1)
                            reject1(err1);
                        console.log(row1);
                        if (row1)
                            resolve1(true);
                        else
                            resolve1(false);
                    });
                }).then((status) => (resolve(status))).catch((err) => (reject(err)));
            }
        });
    });
}

//update user suspension 
exports.suspension = async (id) => {
    const test = await this.getUserById(id);
  
    return new Promise((resolve, reject) => {
      const sql =
        'UPDATE users SET id=?, name=?, email=?, hash=?, role=?, suspended=?,date_suspension=? WHERE id=?';
      db.run(
        sql,
        [
          test.id,
          test.name,
          test.email,
          test.hash,
          test.role,
          1,
          test.date_suspension,
          id
          
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

exports.getProviderIDfromUserID = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT provider_id FROM providers WHERE user_id=?';
        db.get(sql, [user_id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                reject({ error: 'Provider not found.' });
            else {
                console.log("Provider_id "+row.provider_id)
                resolve(row.provider_id);
            }
        });
    });
}
//update a booked item
exports.change = async (item) => {


    return new Promise((resolve, reject) => {
      const sql =
        'UPDATE users SET id=?, name=?, email=?, hash=?, role=?, suspended=?, date_suspension=? WHERE id=? ';
      db.run(
        sql,
        [
          item.id,
          item.name,
          item.email,
          item.hash,
          item.role,
          item.suspended,
          item.date_suspension,
          item.id
        ],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(item);
        }
      );
    });
  };