'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const morgan = require('morgan'); // logging middleware
const clientsDao = require('./DAOs/clients-dao');
const ordersDao = require('./DAOs/client-orders-dao');
const productsDAO = require('./DAOs/products-dao');
const providersDAO = require('./DAOs/providers-dao');
const walletsDAO = require('./DAOs/wallet-dao');
const passportLocal = require('passport-local').Strategy; //Authentication strategy
const session = require('express-session'); //Session middleware
const passport = require('passport'); //Authentication middleware

// init express
let app = express();
app.disable("x-powered-by");
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

//GET all clients and budget
app.get('/api/clients', async (req, res) => {
  try {
    const o = await clientsDao.getAllClients();
    return res.status(200).json(o);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: `Database error during the retrieve of the list of clients.`,
    });
  }
});

//GET all client orders
app.get('/api/orders', async (req, res) => {
  try {
    const m = await ordersDao.getAllOrders();
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: 'Database error during the retrieve of the list of orders.',
    });
  }
});

//PUT to update a product as delivered
app.put(
  '/api/orders/:order_id',

  async (req, res) => {
    try {
      await ordersDao.delivered(req.params.order_id);
      res.status(200).end('Update Completed!');
    } catch (err) {
      res.status(503).json({
        code: 503,
        error: `Unavailable service during the update of order`,
      });
    }
  }
);

//GET all products
app.get('/api/products/all', async (req, res) => {
  try {
    const products = await productsDAO.getAllProducts();
    console.log(products);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET product by its ID
app.get('/api/product/:product_id', async (req, res) => {
  try {
    const product_id = req.params.product_id;
    const product = await productsDAO.getProductById(product_id);
    console.log(product);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET all categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await productsDAO.getAllCategories();
    console.log(categories);
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Get all providers
app.get('/api/providers/all', async (req, res) => {
  try {
    const providers = await providersDAO.getAllProviders();
    console.log(providers);
    res.json(providers);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET provider by its ID
app.get('/api/provider/:provider_id', async (req, res) => {
  try {
    const provider_id = req.params.provider_id;
    const provider = await providersDAO.getProviderById(provider_id);
    console.log(provider);
    res.json(provider);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.post('/api/neworder', async (req, res) => {
  try {
    const client_id = req.body.client_id;
    const totalorderprice = req.body.total;
    const order_items = req.body.order_items;
    let response, response1;

    const order_id = await ordersDao.insert_order(client_id, totalorderprice);
    order_items.forEach(async (prod) => {
      if (prod.quantity >= prod.qty) {
        response = await ordersDao.insert_order_items(order_id, prod);
        if (response.status !== 'OK') throw 'something goes wrong';
      } else throw 'We do not have enough product ';
      const newQuantity = prod.quantity - prod.qty;
      response1 = await productsDAO.putProductQuantity(prod.id, newQuantity);
    });

    res.json(response);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
//update quantity
app.put('/api/modifyquantity', async (req, res) => {
  productsDAO
    .putProductQuantity(req.body.id, req.body.quantity)
    .then(() => {
      res.status(200).json();
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// adding a client

app.post('/api/clients', async (req, res) => {
  try {
    //const hashedPassword = await bcrypt.hash(req.body.hash,10)
    var salt = bcrypt.genSaltSync(10);
    const oldPassword = req.body.hash;
    const hashedPassword = await bcrypt.hash(oldPassword, salt);
    const client = {
      budget: req.body.budget,
      name: req.body.name,
      surname: req.body.surname,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      country: req.body.country,
      region: req.body.region,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone,
      email: req.body.email,
      hash: hashedPassword,
    };
    if (!client) {
      res.status(400).end();
    } else {
      await clientsDao
        .createClient(client)
        .then((id) => res.status(201).json({ id: id }))
        .catch((err) => res.status(500).json(error));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Something broke!');
  }
});

app.get('/api/methods', (req, res) => {
  walletsDAO
    .listAllPaymentMethods()
    .then((methods) => {
      res.json(methods);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.put('/api/clients/update/balance/:clientId/:amount', async (req, res) => {
  const clientId = req.params.clientId;
  const amount = req.params.amount;
  try {
    let task = await walletsDAO.increaseBalance(amount, clientId);
    res.json(`Balance of client : ${clientId} was increased`);
  } catch (error) {
    res
      .status(500)
      .json(
        `Error while updating the balance of user with id: ${clientId}   ` +
          error
      );
  }
});

app.post('/api/transactions', (req, res) => {
  const transaction = req.body;
  if (!transaction) {
    res.status(400).end();
  } else {
    walletsDAO
      .createTransaction(transaction)
      .then((id) => res.status(201).json({ id: id }))
      .catch((err) => res.status(500).json(error));
  }
});

module.exports = app;

/* CONNECTION */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
