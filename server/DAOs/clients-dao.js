'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

//get-> retrieve clients and their budget 
exports.getAllClients=()=>{
    return new Promise((resolve,reject)=>
    {const sql='SELECT * from clients';
   
    db.all(sql,[], (err,rows)=>{
        if (err){
            reject(err);
            return;
        }
        const o=rows.map((e)=>({client_id:e.client_id, budget :e.budget}));
        resolve(o);
    });

}   );
};
