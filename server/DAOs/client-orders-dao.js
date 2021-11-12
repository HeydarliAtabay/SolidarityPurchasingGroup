'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('spg.db', (err) => {
    if (err) {
        throw err;
    }
});

//get-> retrieve all client orders 
exports.getAllOrders=()=>{
    return new Promise((resolve,reject)=>
    {const sql='SELECT * from orders';
   
    db.all(sql,[], (err,rows)=>{
        if (err){
            reject(err);
            return;
        }
        const o=rows.map((e)=>({order_id:e.order_id, client_id:e.client_id, product_name:e.product_name, state:e.state}));
        resolve(o);  });

    }   );
    };
//retrieve order given its id
exports.getO = (order_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orders WHERE order_id =? ';

        db.get(sql, [order_id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}
//update delivered order
exports.delivered = async (order_id) => {
    const test = await this.getO(order_id);
    
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE orders SET order_id=?, client_id=?, product_name=?, state=? WHERE order_id=?';
        db.run(sql, [test.order_id, test.client_id, test.product_name, "delivered" , order_id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });

}
