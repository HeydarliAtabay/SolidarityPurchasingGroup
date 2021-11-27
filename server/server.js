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
const dbt = require("./DAOs/users-dao"); // module for accessing the DB

const fileUpload = require("express-fileupload"); //Middleware for storing files
const path = require("path"); //Module to create absolute paths

// init express
let app = express();
app.disable("x-powered-by");
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

/*** Set up Passport ***/
passport.use(
  new passportLocal(function (username, password, done) {
    dbt.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

// serialize and de-serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  dbt
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

// set up the session
app.use(
  session({
    secret:
      "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false,
  })
);

// then, init passport
app.use(passport.initialize());
/*** Users APIs ***/

// POST /sessions
// login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ code: 401, error: "Unauthenticated user!" });
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end("Logout completed!");
});
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
  '/api/orders/:order_id/:product_name',

  async (req, res) => {
    try {
      await ordersDao.delivered(req.params.order_id, req.params.product_name);
      res.status(200).end('Update Completed!');
    } catch (err) {
      res.status(503).json({
        code: 503,
        error: `Unavailable service during the update of order`,
      });
    }
  }
);

//GET all confirmed for sale products
app.get('/api/products/confirmed/:year/:week', async (req, res) => {
  try {
    const year = req.params.year;
    const week = req.params.week;
    const products = await productsDAO.getAllConfirmedProducts(year, week);
    console.log(products);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET all expected products
app.get('/api/products/expected/:year/:week', async (req, res) => {
  try {
    const year = req.params.year;
    const week = req.params.week;
    const products = await productsDAO.getAllExpectedProducts(year, week);
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
    res.json(provider);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Get provider products
app.get('/api/provider/:provider_id/products', async (req, res) => {
  try {
    const provider_id = req.params.provider_id;
    const providerProducts = await providersDAO.getProviderExistingProducts(provider_id);
    console.log(providerProducts);
    res.json(providerProducts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Insert provider's expected production
app.post('/api/products/expected', async (req, res) => {
  try {
    const products = req.body;
    const productIDs = [];
    for (let i = 0; i < products.length; i++) {
      const newID = await productsDAO.insertNewExpectedProduct(products[i], 1);
      productIDs.push({ old_id: products[i].id, new_id: newID });
    }
    console.log(productIDs);
    res.json(productIDs);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.post('/api/products/expected/upload/:img_id', async (req, res) => {

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const filename = req.params.img_id;

  let file = req.files.product_image;

  console.log(file);

  file.name = filename+".jpg";
  const path = __dirname + "/../client/public/products/" + file.name;

  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send({ status: "success", path: path });
  });
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
//POST ->add users
app.post('/api/users',

  async (req, res) => {

    var salt = bcrypt.genSaltSync(10);
    const oldPassword = req.body.hash;
    const hashedPassword = await bcrypt.hash(oldPassword, salt);
    const t = {

      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      hash: hashedPassword,
      role: req.body.role
    };
    try {
      const result = await dbt.addclient(t);

      res.status(201).end("Added client as a user!");
    } catch (err) {
      res.status(503).json({ code: 503, error: "Unavailable service." });
    }
  });
//POST ->orders
app.post('/api/orders',
  async (req, res) => {

    const t = {
      order_id: req.body.order_id,
      client_id: req.body.client_id,
      product_name: req.body.product_name,
      state: req.body.state,
      OrderPrice: req.body.OrderPrice,
      id: req.body.id
    };
    try {
      const result = await ordersDao.addOrder(t);

      res.status(201).end("Created order!");
    } catch (err) {
      res.status(503).json({ code: 503, error: "Unavailable service during the create of the order." });
    }
  });
//DELETE ->order item
app.delete('/api/orders/:id', async (req, res) => {

  try {
    await ordersDao.deleteItem(req.params.id);
    res.status(204).end("order item deleted!");
  } catch (err) {
    res.status(503).json({ code: 503, error: `Unavailable service error during the delete of the order item` });
  }
});
module.exports = app;

/* CONNECTION */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
