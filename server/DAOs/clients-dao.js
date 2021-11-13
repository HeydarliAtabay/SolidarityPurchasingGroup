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

/// Adding new client to the db //////

exports.createClient=(client)=>{
    return new Promise((resolve, reject)=>{
      const sql = 'INSERT INTO clients(budget,name,surname, gender, birthdate, country, region, address, city, phone,email, hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
      db.run(sql, [client.budget,client.name, client.surname, client.gender, client.birthdate, client.country, client.region,
                    client.address, client.city, client.phone, client.email, client.hash
    ], function(err){
        if(err){
          reject(err);
          return;
        }
        console.log(this.lastID);
        resolve(this.lastID)
      });
    });
  };
