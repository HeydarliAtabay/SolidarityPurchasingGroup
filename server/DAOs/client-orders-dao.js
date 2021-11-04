'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('sgp.db', (err) => {
    if (err) {
        throw err;
    }
});