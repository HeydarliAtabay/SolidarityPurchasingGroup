'use strict';

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

let db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

exports.setTestDB = (db_name) => {
    db = new sqlite.Database(db_name, (err) => { if (err) throw err; });
}

exports.getAllProviders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM providers';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const providers = rows.map((p) => ({
                id: p.provider_id,
                name: p.provider_name,
                description: p.provider_description,
                location: p.provider_location
            }));
            resolve(providers);
        });
    });
};

exports.getProviderById = (provider_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM providers WHERE provider_id=?';
        db.get(sql, [provider_id], (err, row) => {
            if (err) {
                reject(err);
            }
            const provider = {
                id: row.provider_id,
                name: row.provider_name,
                description: row.provider_description,
                location: row.provider_location
            }
            resolve(provider);
        });
    });
};

exports.getProviderExistingProducts = (provider_id) => {
    return new Promise((resolve, reject) => {
        const product_status = 'confirmed';
        const sql = 'SELECT * FROM products WHERE products.provider_id=? AND products.product_status=? GROUP BY product_name ORDER BY year, week_number DESC';
        db.all(sql, [provider_id, product_status], (err, rows) => {
            if (err) {
                reject(err);
            }
            const providerProducts = rows.map((p) => ({
                id: p.product_id,
                name: p.product_name,
                description: p.product_description,
                category: p.category_id,
                price: p.product_price,
                unit: p.product_unit,
                quantity: 0,
                expiryDate: '',
                providerId: provider_id,
                providerName: '',
                year: 0,
                week: 0,
                status: 'confirmed',
                active: 1
            }));
            resolve(providerProducts);
        });
    });
}

exports.checkProviderAvailabilityConfirmation = (provider_id, year, week_number) => {
    return new Promise((resolve, reject) => {
        const product_status = 'confirmed';
        const sql = 'SELECT COUNT(*) AS value FROM products WHERE products.provider_id=? AND products.year=? AND products.week_number=? AND products.product_status=?';
        db.get(sql, [provider_id, year, week_number, product_status], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row.value > 0) {
                resolve(true);
            }
            resolve(false);
        });
    });
}

exports.insertFarmerApplication = (farmer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO farmer_applications VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?,"pending")';
        db.run(sql, [farmer.name, farmer.surname, farmer.email, farmer.phone, farmer.password, farmer.description, farmer.country, farmer.region, farmer.city, farmer.address, farmer.zip, farmer.submit_date], (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

exports.getPendingApplications = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM farmer_applications WHERE application_approved="pending" ORDER BY application_id DESC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const pendingApplications = rows.map((p) => ({
                id: p.application_id,
                name: p.farmer_name,
                surname: p.farmer_surname,
                email: p.farmer_email,
                phone: p.farmer_phone,
                description: p.farmer_description,
                country: p.farmer_country,
                region: p.farmer_region,
                city: p.farmer_city,
                address: p.farmer_address,
                zip: p.farmer_zipcode,
                location: p.farmer_city + ', ' + p.farmer_region + ', ' + p.farmer_country,
                complete_address: p.farmer_address + ', ' + p.farmer_zipcode,
                date: p.application_date
            }));
            resolve(pendingApplications);
        });
    });
}

exports.getAcceptedApplications = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM farmer_applications WHERE application_approved NOT "pending" ORDER BY application_id DESC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const acceptedApplications = rows.map((p) => ({
                id: p.application_id,
                name: p.farmer_name,
                surname: p.farmer_surname,
                email: p.farmer_email,
                phone: p.farmer_phone,
                description: p.farmer_description,
                country: p.farmer_country,
                region: p.farmer_region,
                city: p.farmer_city,
                address: p.farmer_address,
                zip: p.farmer_zipcode,
                location: p.farmer_city + ', ' + p.farmer_region + ', ' + p.farmer_country,
                complete_address: p.farmer_address + ', ' + p.farmer_zipcode,
                date: p.application_date
            }));
            resolve(acceptedApplications);
        });
    });
}

exports.acceptApplication = (applicationID) => {
    return new Promise((resolve, reject) => {
        /*GET application details*/
        const sql = 'SELECT * FROM farmer_applications WHERE application_id=?';
        db.get(sql, [applicationID], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row) {
                const application = {
                    name: row.farmer_name + ' ' + row.farmer_surname,
                    email: row.farmer_email,
                    password: row.farmer_password,
                    phone: row.farmer_phone,
                    location: row.farmer_city + ', ' + row.farmer_region + ', ' + row.farmer_country,
                    complete_address: row.farmer_address + ', ' + row.farmer_zipcode,
                    date: row.application_date
                };

                return new Promise((resolve, reject) => {
                    /*SET farmer application status to "accepted*/
                    const sql = 'UPDATE farmer_applications SET application_approved="accepted" WHERE application_id=?';
                    db.run(sql, [applicationID], (err, row) => {
                        if (err) {
                            reject(err);
                        }

                        return new Promise((resolve, reject) => {
                            /*insert new farmer user*/
                            const dummy_user_id = null;
                            const sql = 'INSERT INTO users( id, name, email, hash, role ) VALUES ( ?, ?, ?, ?, "farmer" )';
                            db.run(sql, [dummy_user_id, application.name, application.email, application.password], (err, row) => {
                                if (err) {
                                    reject(err);
                                }
                                const user_id = this.lastID;

                                return new Promise((resolve, reject) => {
                                    /*insert new provider*/
                                    const sql = 'INSERT INTO providers( provider_id, user_id, provider_name, provider_description, provider_location, provider_address, provider_phone) VALUES ( NULL, ?, ?, ?, ?, ?, ? )';
                                    db.run(sql, [user_id, application.name, application.description, application.location, application.complete_address, application.phone], (err, row) => {
                                        if (err) {
                                            reject(err);
                                        }
                                        resolve(true);
                                    });
                                }).then((res) => (resolve(res)));
                            });
                        }).then((res) => (resolve(res)));
                    });
                }).then((res) => (resolve(res)));
            }
        });
    });
}

exports.rejectApplication = (applicationID) => {
    return new Promise((resolve, reject) => {
        /*SET farmer application status to "accepted*/
        const sql = 'UPDATE farmer_applications SET application_approved="rejected" WHERE application_id=?';
        db.run(sql, [applicationID], (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}
