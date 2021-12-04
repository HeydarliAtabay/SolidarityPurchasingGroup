'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('spg.db', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');

// Add a new client
exports.addclient = (t) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users( id, name, email, hash, role ) VALUES ( ?, ?, ?, ?, ? )';
        db.run(sql, [t.id, t.name, t.email, t.hash, t.role], function (err) {
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
                role: e.role
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
                const user = { id: row.id, username: row.email, name: row.name, role: row.role };
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
                const user = { id: row.id, username: row.email, name: row.name, role: row.role }
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
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * FROM farmer_applications WHERE farmer_email = ?';
                    db.get(sql, [email], (err, row) => {
                        if (err)
                            reject(err);
                        console.log(row);
                        if (row)
                            resolve(true);
                        else
                            resolve(false);
                    });
                }).then((status)=>(resolve(status))).catch((err)=>(reject(err)));
            }
        });
    });
}
