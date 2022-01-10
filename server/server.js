'use strict';

const express = require('express');
const cron = require('node-cron'); // node-cron is for scheduling requests
const nodemailer = require('nodemailer'); // for sending an email
const bcrypt = require('bcryptjs');
const morgan = require('morgan'); // logging middleware
const clientsDao = require('./DAOs/clients-dao');
const ordersDao = require('./DAOs/client-orders-dao');
const usersDao = require('./DAOs/users-dao');
const productsDAO = require('./DAOs/products-dao');
const providersDAO = require('./DAOs/providers-dao');
const walletsDAO = require('./DAOs/wallet-dao');
const missedDao = require('./DAOs/missed-dao');
const axios = require('axios');
const warehouseDao = require('./DAOs/warehouse-dao');
const deliverersDao = require('./DAOs/deliverers-dao.js');
const passportLocal = require('passport-local').Strategy; //Authentication strategy
const session = require('express-session'); //Session middleware
const passport = require('passport'); //Authentication middleware
const dbt = require('./DAOs/users-dao'); // module for accessing the DB
const TelegramBot = require('node-telegram-bot-api'); //module for telegrom bot

const fileUpload = require('express-fileupload'); //Middleware for storing files
const path = require('path');

const fs = require('fs');
const { request } = require('http');
const { text } = require('body-parser');
const { parse } = require('dotenv');

// init express
let app = express();
require('dotenv').config();
app.disable('x-powered-by');
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

const telegram_token = process.env.TELEGRAM_TOKEN;
const telegram_group = process.env.TELEGRAM_GROUP_ID;
const bot = new TelegramBot(telegram_token, { polling: true });

app.setTestingMode = (test_db_name) => {
  clientsDao.setTestDB(test_db_name);
  ordersDao.setTestDB(test_db_name);
  productsDAO.setTestDB(test_db_name);
  providersDAO.setTestDB(test_db_name);
  walletsDAO.setTestDB(test_db_name);
  warehouseDao.setTestDB(test_db_name);
  dbt.setTestDB(test_db_name);
};

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

bot.onText(/\/message (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, `Your message was ${resp}`);
});

bot.on('/start', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(
    chatId,
    `Welcome to Solidarity Purchase Group BOT.
  
  Here you can use some functionalities of SPG. 
  In the Following lines, you can see all possible actions with this bot.
  /subscribe [email adress] - for making Subscription with bot to receive individual updates related to your account
  /schedule  - for Checking schedule when products will be available & when can you make an order
  /balance - to check your balance
  /orders - to check the list of your new and past orders
  `
  );
  // bot.sendVideo(chatId, necef, {caption: "Sent by: " + "Elnur" } )
});

// while writing /start
bot.onText(/\/start/, function onStart(msg) {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const photo = `../client/public/Frontpage/browse-farmers-image.png`;
  bot.sendPhoto(chatId, photo, {
    caption: `Welcome to Solidarity Purchase Group BOT dear ${username}.
  
Here you can use some functionalities of SPG. 
Please firstly subcribe to our system with the help of the following command
/subscribe [email adress] - for making Subscription with bot and receive individual updates related to your account,
also you will be able to use all the following commands:

/schedule  - for Checking schedule when products will be available & when can you make an order
/balance - to check your balance
/orders - to check the list of your new and past orders
    `,
  });
});
// example for sending photos

bot.onText(/\/photo/, function onPhotoText(msg) {
  // From file path
  const photo = `./GREETING.png`;
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "I'm a bot!",
  });
});

bot.onText(/\/subscribe (.+)/, async (msg, match) => {
  // From file path
  const userId = msg.chat.id;
  const userName = msg.chat.username;
  const emailUser = match[1];
  const clients = await clientsDao.getAllClients();
  let emailIsCorrect = 0;

  clients.forEach((client) => {
    if (client.email === emailUser) emailIsCorrect = 1;
  });

  if (emailIsCorrect === 1) {
    bot.sendMessage(
      userId,
      `Dear ${userName}, you've succesfully made a subscription to our service!
    Entered email was: ${emailUser}
      `
    );
    try {
      await clientsDao.putTelegramUserId(userId, emailUser);
    } catch (err) {
      console.log('error while updating the telegram id');
    }
  } else {
    bot.sendMessage(
      userId,
      `Dear ${userName}, we could not find email entered by you in our server, please try again.
    Entered email was: ${emailUser}
      `
    );
  }
});

// for /schedule
bot.onText(/\/schedule/, function onSchedule(msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Dear Client, Here is the schedule for the next week:
  `
  );
});

// for /balance
bot.onText(/\/balance/, function onSchedule(msg) {
  const chatId = msg.chat.id;

  const asyncExample = async () => {
    const result = await walletsDAO.retrieveBudgetByTelegramID(chatId);

    if (result.length > 0) {
      bot.sendMessage(
        chatId,
        `Dear Client, Here is your balance: ` + result[0].budget
      );
    } else {
      bot.sendMessage(
        chatId,
        `Dear Client, you haven't connected your  SPG account to Telegram
Please, use /subscribe [your email address] to connect your telegram to our system      
      `
      );
    }
    return result;
  };

  res = asyncExample();
});

// if the user has a telegram account sends him the update about the order status
app.post('/api/orderStateConfirmation', function (req, res) {
  const userId = req.body.clientId;
  const status = req.body.state;

  const asyncTelegramId = async (userId, status) => {
    const TID = await clientsDao.getClientsTelegramId(userId);
    // if the user has a telegram id I send the message
    if (TID.length > 0) {
      if (status == 'placed')
        bot.sendMessage(
          TID[0].telegramId,
          `Dear Client, your order status is: placed `
        );
      else
        bot.sendMessage(
          TID[0].telegramId,
          `Dear Client, your order status is: pending payment `
        );
    }
    return TID;
  };
  res = asyncTelegramId(userId, status);
});

app.get('/api/telegramId', async (req, res) => {
  try {
    const m = await walletsDAO.retrieveBudgetByTelegramID(246950204);
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: 'Database error during the retrieve of the list of users.',
    });
  }
});

// for /orders
bot.onText(/\/orders/, function onSchedule(msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Dear Client, Here is your order list: `);
});

app.post('/api/sendEmail', function (req, res) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${req.body.email}`,
    subject: `Status of your Order`,
    text: `${req.body.message}`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: 'fail',
      });
    } else {
      console.log('== Message Sent ==');
      res.json({
        status: 'success',
      });
    }
  });
});

app.post('/api/sendReminderForPickup', function (req, res) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${req.body.email}`,
    subject: `Status of your Order`,
    text: `${req.body.message}`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: 'fail',
      });
    } else {
      console.log('== Message Sent ==');
      res.json({
        status: 'success',
      });
    }
  });
});

app.post('/api/topUpNotificationTelegram', async (req, res) => {
  const client_id = req.body.clientid;
  const balance = req.body.balance;
  const telegramUserId = req.body.telegramId;
  const name = req.body.name;
  const surname = req.body.surname;
  const date = req.body.date;
  const time = req.body.time;
  const amount = req.body.amount;
  const newBalance = parseFloat(balance) + parseFloat(amount);

  console.log('tid');

  const telegram_user_id = await clientsDao.getClientsTelegramId(client_id);

  if (telegram_user_id[0].telegramId != null) {
    axios
      .post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
        chat_id: telegramUserId,
        parse_mode: 'HTML',
        text: `Dear ${name} ${surname}, your balance was ${balance}. Now your balance was topped up.

    Details about your last Top-up:
    added amount: ${amount} euros
    date: ${date}
    time: ${time}

    Your new balance is : ${newBalance}


    `,
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }
});

let sendUpdatedListNotificationTelegram = () => {
  let underlinedLink = '<u>http://localhost:3000/products-next-week</u>';
  axios
    .post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
      chat_id: telegram_group,
      parse_mode: 'HTML',
      text: `Dear Clients, we would like to inform you that the list of the available products for the next week is now online.
    
Please enter this link to open the page of available products.
    ${underlinedLink}`,
    })
    .then((res) => {
      console.log(`Message was sent to Telegram`);
    })
    .catch((error) => {
      console.error(error);
    });
};

let sendReminderAboutInsufficientBalanceOnTelegram = async () => {
  try {
    const clientsWithInsufficientBalance =
      await clientsDao.getClientsWithInsufficientBalanceAndTelegramId();
    clientsWithInsufficientBalance.forEach((clientInsufficient) => {
      axios
        .post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
          chat_id: clientInsufficient.telegramId,
          parse_mode: 'HTML',
          text: `Dear ${clientInsufficient.name} ${clientInsufficient.surname}, 
Your order which was implemented at ${clientInsufficient.orderDate} ${clientInsufficient.orderTime} still pending because of the insufficient balance,
Please top-up your balance, or contact us.      
        `,
        })
        .then((res) => {
          console.log(`Message was sent to Telegram`);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } catch (err) {
    console.log('error while getting clients');
  }
};
// post request for sending notification about insufficient balance
app.post(
  '/api/SendTelegramNotificationForInsufficientBalance',
  function (req, res) {
    sendReminderAboutInsufficientBalanceOnTelegram();
  }
);

// string for cron which will implement function each Saturday Morning at 09:00
let eachMorningAtTen = '0 0 10 * * *';
cron.schedule(eachMorningAtTen, () => {
  sendReminderAboutInsufficientBalanceOnTelegram(); // sending reminder each saturday at 09:00
});

// post request for sending notification about updates
app.post('/api/SendTelegramNotification', function (req, res) {
  sendUpdatedListNotificationTelegram();
});

// string for cron which will implement function each Saturday Morning at 09:00
let eachsaturday = '0 0 9 * * 6';
cron.schedule(eachsaturday, () => {
  sendUpdatedListNotificationTelegram(); // sending reminder each saturday at 09:00
});

let strA = '55 22 15 13 12 *';

cron.schedule(strA, () => {
  console.log('running a task every minute');
});

/*** Set up Passport ***/
passport.use(
  new passportLocal.Strategy((username, password, done) => {
    dbt
      .getUser(username, password)
      .then((user) => {
        if (user) {
          //Authentication successful, db returned user
          done(null, user);
        } else {
          //Authentication failed (wrong credentials)
          done(null, false, { message: 'Wrong username and/or password' });
        }
      })
      .catch((err) => {
        done(err); //DB error
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
      done(null, user); //make user available in req.user
    })
    .catch((err) => {
      done(err, null); //user authorization failed (user with that id not existing)
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: 'not authenticated' });
};

// set up the session
app.use(
  session({
    secret:
      'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false,
  })
);

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Users APIs ***/

// user login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (error) => {
      if (error) return next(error);
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET currently logged user information
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ code: 401, error: 'Unauthenticated user!' });
});

// user logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end('Logout completed!');
});
//GET all missed pickups
app.get('/api/missed-pickups', async (req, res) => {
  try {
    const m = await missedDao.getAllMissedPickups();
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error:
        'Database error during the retrieve of the list of missed pickups.',
    });
  }
});
//POST ->missed-pickups
app.post('/api/missed-pickup', async (req, res) => {
  try {
    const t = {
      order_id: req.body.order_id,
      client_id: req.body.client_id,
    };
    await missedDao.addMissedPickup(t);
    res.status(201).json('Created missed pickup!');
  } catch (err) {
    console.log(err);
    res.status(503).json({
      code: 503,
      error: 'Unavailable service during the create of the missed pickup.',
    });
  }
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

//GET clients and orders of the user who has TelegramId
app.get('/api/clientsOrdersWithTelegram', async (req, res) => {
  try {
    const o = await clientsDao.getClientsWithInsufficientBalanceAndTelegramId();
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

//GET all products
app.get('/api/products', async (req, res) => {
  try {
    const m = await productsDAO.getAllProducts();
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: 'Database error during the retrieve of the list of orders.',
    });
  }
});

// PUT update state
app.put('/api/modifyState', async (req, res) => {
  ordersDao
    .changeState(req.body.id, req.body.state)
    .then(() => {
      res.status(200).json('ok');
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// PUT update state
app.put('/api/modifyStateOnce', async (req, res) => {
  ordersDao
    .changeStateOnce(req.body.id, req.body.state)
    .then(() => {
      res.status(200).json('ok');
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// PUT update state
app.put('/api/modifyStateFarmer', async (req, res) => {
  warehouseDao
    .changeStateFarmer(req.body.id, req.body.product_id, req.body.state)
    .then(() => {
      res.status(200).json('ok');
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// PUT user
app.put('/api/users/:id', async (req, res) => {
  const u = req.body;

  try {
    await usersDao.change(u);
    res.status(200).json(u);
  } catch (err) {
    res
      .status(503)
      .json({ error: `Database error during the update of u .` });
  }
});

//POST ->add users
app.post(
  '/api/users',

  async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    const oldPassword = req.body.hash;
    const hashedPassword = await bcrypt.hash(oldPassword, salt);
    const t = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      hash: hashedPassword,
      role: req.body.role,
      suspended: req.body.suspended,
      date_suspension:req.body.date_suspension
    };
    try {
      await dbt.addclient(t);
      res.status(201).json('Added client as a user!');
    } catch (err) {
      console.log(err);
      res.status(503).json({ code: 503, error: 'Unavailable service.' });
    }
  }
);

//PUT to update a user as suspended
app.put(
  '/api/updateSuspension',

  async (req, res) => {
    try {
      await usersDao.suspension(req.params.id, req.params.suspension);
      res.status(200).json('Update Completed!');
    } catch (err) {
      res.status(503).json({
        code: 503,
        error: `Unavailable service during the update of user`,
      });
    }
  }
);

//PUT to update a product as delivered
app.put(
  '/api/orders/:order_id/:product_name',

  async (req, res) => {
    try {
      await ordersDao.delivered(req.params.order_id, req.params.product_name);
      res.status(200).json('Update Completed!');
    } catch (err) {
      res.status(503).json({
        code: 503,
        error: `Unavailable service during the update of order`,
      });
    }
  }
);

//PUT to update a product as prepared
app.put(
  '/api/orders/:order_id/:product_name',

  async (req, res) => {
    try {
      await ordersDao.prepared(req.params.order_id, req.params.product_name);
      res.status(200).json('Update Completed!');
    } catch (err) {
      res.status(503).json({
        code: 503,
        error: `Unavailable service during the update of order`,
      });
    }
  }
);

//POST the product IDs to be set with state 'farmer_shipped'
app.post('/api/orders/farmershipped', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    console.log(req.body);

    const productIDS = req.body;

    console.log(productIDS);

    for (const product of productIDS) {
      await ordersDao.setOrderAsFarmerShipped(product);
    }
    res.json(true);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET all confirmed for sale products
app.get('/api/products/confirmed/:year/:week', async (req, res) => {
  try {
    const year = req.params.year;
    const week = req.params.week;
    const products = await productsDAO.getAllConfirmedProducts(year, week);
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

//GET all booked orders for a certain provider
app.get('/api/products/ordered/:year/:week_number', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'farmer') {
      res.status(401).json({ error: 'Unauthorized user' });
      return;
    }

    const year = req.params.year;
    const week_number = req.params.week_number;
    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);

    const products = await ordersDao.getBookedOrders(
      provider_id,
      year,
      week_number
    );
    res.json(products);
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

//GET cleints and orders data for pickup
app.get('/api/orders/pickup/clientorder', async (req, res) => {
  try {
    const orders = await ordersDao.getOrderAndClientForPickup();
    res.json(orders);
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
app.get('/api/provider-products', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);
    const providerProducts = await providersDAO.getProviderExistingProducts(
      provider_id
    );
    res.json(providerProducts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Get provider bookings
app.get('/api/provider-bookings', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);
    const providerBookings = await providersDAO.getProviderBookings(
      provider_id
    );
    res.json(providerBookings);
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
//Post the notification as sent
app.put('/api/provider-products-sent/', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }
  try {
    const ids = req.body.map((p) => p.id);
    let result_change_notification = false;
    for (let pid of ids) {
      console.log(pid);
      result_change_notification = await providersDAO.postProviderNotification(
        pid
      );
    }
    if (!result_change_notification) {
      throw 'postProviderNotification failed';
    }
    res.json(result_change_notification);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
//Get provider products that are not available and not notificated to the farmer
app.get('/api/provider-products-notification', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }
  try {
    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);
    const providerProducts = await providersDAO.getProviderProductsNotification(
      provider_id
    );

    res.json(providerProducts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//CHECK provider's confirmation status
app.get(
  '/api/provider/confirmationStatus/:year/:week_number',
  async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'farmer') {
      res.status(401).json({ error: 'Unauthorized user' });
      return;
    }
    try {
      const year = req.params.year;
      const week_number = req.params.week_number;
      const provider_id = await dbt.getProviderIDfromUserID(req.user.id);

      const confirmationStatus =
        await providersDAO.checkProviderAvailabilityConfirmation(
          provider_id,
          year,
          week_number
        );
      res.json(confirmationStatus);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

//GET provider's expected production
app.get(
  '/api/products/provider/available/:year/:week_number',
  async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'farmer') {
      res.status(401).json({ error: 'Unauthorized user' });
      return;
    }

    try {
      const year = req.params.year;
      const week_number = req.params.week_number;
      const provider_id = await dbt.getProviderIDfromUserID(req.user.id);

      const expectedProducts = await productsDAO.getProviderAvailableProducts(
        provider_id,
        year,
        week_number
      );
      res.json(expectedProducts);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

//GET providers shipment status
app.get('/api/provider/shipmentstatus/:year/:week_number', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const year = req.params.year;
    const week_number = req.params.week_number;

    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);

    const shipmentStatus = await ordersDao.getProviderShipmentStatus(
      provider_id,
      year,
      week_number
    );
    res.json(shipmentStatus);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//GET provider shipped orders
app.get(`/api/provider-orders/:id`, async (req, res) => {
  try {
    const id = req.params.id;

    const farmerShippedOrders = await warehouseDao.getProviderShippedOrders(id);

    res.json(farmerShippedOrders);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Insert provider's expected production
app.post('/api/products/expected/:year/:week_number', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const products = req.body;
    const year = req.params.year;
    const week_number = req.params.week_number;

    const provider_id = await dbt.getProviderIDfromUserID(req.user.id);

    const oldProductIDs = (
      await productsDAO.getProviderAvailableProducts(
        provider_id,
        year,
        week_number
      )
    ).map((p) => p.id);
    const productIDs = [];

    await productsDAO.deleteExpectedProducts(provider_id, year, week_number);
    oldProductIDs.forEach((p) => {
      if (
        fs.existsSync(__dirname + '/../client/public/products/' + p + '.jpg')
      ) {
        fs.unlinkSync(__dirname + '/../client/public/products/' + p + '.jpg');
      }
    });
    for (const product of products) {
      const newID = await productsDAO.insertNewExpectedProduct(
        product,
        provider_id
      );
      productIDs.push({ old_id: product.id, new_id: newID });
    }
    console.log(productIDs);
    res.json(productIDs);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//UPLOAD image
app.post('/api/products/upload/expected/:img_id', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const filename = req.params.img_id;

  let file = req.files.product_image;

  file.name = filename + '.jpg';
  const imgpath = __dirname + '/../client/public/products/' + file.name;

  file.mv(imgpath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send({ status: 'success', path: imgpath });
  });
});

app.get('/users/email-availability/:email', async (req, res) => {
  try {
    const email = req.params.email;
    res.json(await dbt.checkIfEmailExists(email));
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.post('/provider/apply', async (req, res) => {
  try {
    let farmer = req.body;
    console.log(farmer);
    var salt = bcrypt.genSaltSync(10);
    farmer.password = await bcrypt.hash(farmer.password, salt);
    res.json(await providersDAO.insertFarmerApplication(farmer));
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get('/manager/applications/pending', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'shop-manager') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    res.json(await providersDAO.getPendingApplications());
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get('/manager/applications/accepted', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'shop-manager') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    res.json(await providersDAO.getAcceptedApplications());
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get('/manager/applications/accept/:application_id', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'shop-manager') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const application_id = req.params.application_id;
    res.json(await providersDAO.acceptApplication(application_id));
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get('/manager/applications/reject/:application_id', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'shop-manager') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    const application_id = req.params.application_id;
    res.json(await providersDAO.rejectApplication(application_id));
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
      res.status(200).json('ok');
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

//farmer mark product available
app.put('/api/farmerConfirm/:product_id', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    await productsDAO.confirmExpectedProduct(req.params.product_id);
    await productsDAO.markProductAsConfirmed(req.params.product_id);
    return res.status(200).json('ok');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//farmer mark product unavailable
app.put('/api/farmerUnavailable/:product_id', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'farmer') {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  try {
    await productsDAO.unavailableProduct(req.params.product_id);
    await productsDAO.deleteProduct(req.params.product_id);
    return res.status(200).json('ok');
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// adding a client

app.post('/api/clients', async (req, res) => {
  try {
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
        .then((id) => res.status(201).json('New Client was added !'))
        .catch((err) => res.status(500).json(error));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Unavailable service while adding new client!');
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
    await walletsDAO.increaseBalance(amount, clientId);
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
app.post(
  '/api/users',

  async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    const oldPassword = req.body.hash;
    const hashedPassword = await bcrypt.hash(oldPassword, salt);
    const t = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      hash: hashedPassword,
      role: req.body.role,
    };
    try {
      await dbt.addclient(t);
      res.status(201).json('Added client as a user!');
    } catch (err) {
      console.log(err);
      res.status(503).json({ code: 503, error: 'Unavailable service.' });
    }
  }
);

//POST ->orders
app.post('/api/orderinsert', async (req, res) => {
  try {
    const t = {
      order_id: req.body.order_id,
      client_id: req.body.client_id,
      product_name: req.body.product_name,
      product_id: req.body.product_id,
      order_quantity: req.body.order_quantity,
      state: req.body.state,
      OrderPrice: req.body.OrderPrice,
      id: req.body.id,
      city: req.body.city,
      Nation: req.body.Nation,
      zipcode: req.body.zipcode,
      address: req.body.address,
      date: req.body.date,
      time: req.body.time,
      pickup: req.body.pickup,
    };
    console.log(t);
    console.log(await ordersDao.addOrder(t));
    res.status(201).json('Created order!');
  } catch (err) {
    console.log(err);
    res.status(503).json({
      code: 503,
      error: 'Unavailable service during the create of the order.',
    });
  }
});

//DELETE ->order item
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await ordersDao.deleteItem(req.params.id);
    res.status(204).json('order item deleted!');
  } catch (err) {
    res.status(503).json({
      code: 503,
      error: `Unavailable service error during the delete of the order item`,
    });
  }
});
//GET all users
app.get('/api/users', async (req, res) => {
  try {
    const m = await dbt.getAllUsers();
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: 'Database error during the retrieve of the list of users.',
    });
  }
});
// PUT item order
app.put('/api/orders/:id', async (req, res) => {
  const order = req.body;

  try {
    await ordersDao.changeItem(order);
    res.status(200).json(order);
  } catch (err) {
    res
      .status(503)
      .json({ error: `Database error during the update of order .` });
  }
});

//GET all deliverers
app.get('/api/deliverers', async (req, res) => {
  try {
    const m = await deliverersDao.getAllDeliverers();
    return res.status(200).json(m);
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: 'Database error during the retrieve of the list of orders.',
    });
  }
});

//GET deliverable orders
app.get('/api/deliverableOrders/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const orders = await deliverersDao.getAllDeliverableOrders(city);
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// PUT update state
app.put('/api/modifyStato', async (req, res) => {
  deliverersDao
    .changeState(req.body.id, req.body.product, req.body.state)
    .then(() => {
      res.status(200).json('ok');
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

//GET deliverer by its mail
app.get('/api/deliverer/:deliverer_mail', async (req, res) => {
  try {
    const deliverer_mail = req.params.deliverer_mail;
    const deliverer = await deliverersDao.getDelivererByMail(deliverer_mail);
    res.json(deliverer);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = app;

/* CONNECTION */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
