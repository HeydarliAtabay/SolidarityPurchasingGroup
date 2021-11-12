"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const clientsDao = require('./DAOs/clients-dao');
const ordersDao = require('./DAOs/client-orders-dao');
const productsDAO = require('./DAOs/products-dao');
const passportLocal = require("passport-local").Strategy; //Authentication strategy
const session = require("express-session"); //Session middleware
const passport = require("passport"); //Authentication middleware

// init express
const app = express();
const PORT = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());



//GET all clients and budget
app.get('/api/clients', async (req, res) => {
    try {
        const o = await clientsDao.getAllClients();
        return res.status(200).json(o);
    } catch (err) {
        res.status(500).json({ code: 500, error: `Database error during the retrieve of the list of clients.` });
    }
});

//GET all client orders
app.get('/api/orders', async (req, res) => {
    try {
        const m = await ordersDao.getAllOrders();
        return res.status(200).json(m);
    } catch (err) {
        res.status(500).json({ code: 500, error: "Database error during the retrieve of the list of orders." });
    }
});

//PUT to update a product as delivered
    app.put('/api/orders/:order_id',
    
        async (req, res) => {
           
            try {
                await ordersDao.delivered(req.params.order_id);
                res.status(200).end("Update Completed!");
            } catch (err) {
                res.status(503).json({ code: 503, error: `Unavailable service during the update of order` });
            }
    
        });

//GET all products
app.get("/api/products/all", async(req,res)=>{

    try{
        res.json(await productsDAO.getAllProducts());
    }
    catch(err){
        console.log(err);
        res.json(err);
    }
});

//GET product by its ID
app.get("/api/product/:product_id", async(req,res)=>{
    try{
        const product_id = req.params.product_id;
        console.log(await productsDAO.getProductById(product_id));
        res.json(await productsDAO.getProductById(product_id));
    }
    catch(err){
        console.log(err);
        res.json(err);
    }
});

/* CONNECTION */
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
