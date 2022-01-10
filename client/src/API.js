//GET ->retrieve clients and budget
async function getAllClients() {
  const response = await fetch('/api/clients');
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}
//GET ->retrieve missed
async function getAllMissedPickups() {
  const response = await fetch('/api/missed-pickups');
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    try {
      const err = await response.json();
      throw err.message;
    } catch (err) {
      throw err;
    }
  }
}
//Add missed
function addMissedPickup(S) {
  return new Promise((resolve, reject) => {
    fetch('/api/missed-pickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: S.order_id,
        client_id: S.client_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            })
            .catch((err) => {
              reject({
                errors: [
                  {
                    param: 'Application',
                    msg: 'Cannot insert a missed pickup',
                  },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [
            { param: 'Server', msg: 'Communication with server failed' },
          ],
        });
      });
  });
}

//GET ->retrieve users
async function getAllUsers() {
  const response = await fetch('/api/users');
  if (response.ok) {
    const responseUsersBody = await response.json();
    return await responseUsersBody;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET ->retrieve client orders
async function getAllOrders() {
  const response = await fetch('/api/orders');
  if (response.ok) {
    const responseAllOrders = await response.json();
    return responseAllOrders;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}
//GET ->retrieve products
async function getAllProducts() {
  const response = await fetch('/api/products');
  if (response.ok) {
    const responseAllProducts = await response.json();
    return responseAllProducts;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}
//GET ->retrieve client orders
async function getProviderDeliveredOrders(id) {
  const response = await fetch(`/api/provider-orders/${id}`);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//PUT to update a product as delivered
async function updateDelivered(id, product_name) {
  const response = await fetch(`/api/orders/${id}/${product_name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

// PUT to update a product as prepared
async function updateWHPrepared(id, product_name) {
  const response = await fetch(`/api/orders/${id}/${product_name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
} //

//update order state
async function updateState(id, state) {
  const response = await fetch(`/api/modifyState`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      state: state,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//update order state
async function updateStateOnce(id, state) {
  const response = await fetch(`/api/modifyStateOnce`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      state: state
    }),
  })
  if (response.ok) {
    return await response.json();
  }
  else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}


//update user suspension value
async function updateSuspension(id, suspension) {
  const response = await fetch(`/api/updateSuspension`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      suspension: suspension,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//update farmer state of a product of an order
async function updateStateFarmer(id, product_id, state) {
  const response = await fetch(`/api/modifyStateFarmer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      product_id: product_id,
      state: state,
    }),
  });
  console.log(response);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all confirmed products + readme OK
async function getAllConfirmedProducts(year, week) {
  const responseAllConfirmedProducts = await fetch(
    '/api/products/confirmed/' + year + '/' + week
  );
  if (responseAllConfirmedProducts.ok) {
    return await responseAllConfirmedProducts.json();
  } else {
    let errAllConfirmedProducts = {
      status: responseAllConfirmedProducts.status,
      errObj: await responseAllConfirmedProducts.json(),
    };
    throw errAllConfirmedProducts; // An object with the error coming from the server
  }
}

//GET all expected products + readme ok
async function getAllExpectedProducts(year, week) {
  const responseAllExpectedProducts = await fetch(
    '/api/products/expected/' + year + '/' + week
  );
  if (responseAllExpectedProducts.ok) {
    const responseAllExpectedProductsBody =
      await responseAllExpectedProducts.json();
    return responseAllExpectedProductsBody;
  } else {
    let errAllExpectedProducts = {
      status: responseAllExpectedProducts.status,
      errObj: await responseAllExpectedProducts.json(),
    };
    throw errAllExpectedProducts; // An object with the error coming from the server
  }
}

//GET all products in the booked or pending state of a certain provider + readme ok
async function getOrderedProductsForProvider(year, week) {
  const responseOrderedProductsForProvider = await fetch(
    '/api/products/ordered/' + year + '/' + week
  );
  if (responseOrderedProductsForProvider.ok) {
    return await responseOrderedProductsForProvider.json();
  } else {
    let errOrderedProductsForProvider = {
      status: responseOrderedProductsForProvider.status,
      errObj: await responseOrderedProductsForProvider.json(),
    };
    throw errOrderedProductsForProvider; // An object with the error coming from the server
  }
}

//Check if provider has already declared ordered items as shipped + readme ok
async function getProviderShipmentStatus(year, week) {
  const responseProviderShipmentStatus = await fetch(
    '/api/provider/shipmentstatus/' + year + '/' + week
  );
  if (responseProviderShipmentStatus.ok) {
    return await responseProviderShipmentStatus.json();
  } else {
    let errProviderShipmentStatus = {
      status: responseProviderShipmentStatus.status,
      errObj: await responseProviderShipmentStatus.json(),
    };
    throw errProviderShipmentStatus; // An object with the error coming from the server
  }
}

//POST all products IDs that were shipped + readme ok
async function setProductsAsFarmerShipped(productIDS) {
  const responseSetProductAsFarmerShipped = await fetch(
    '/api/orders/farmershipped',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productIDS), // Conversion in JSON format
    }
  );
  if (responseSetProductAsFarmerShipped.ok) {
    return await responseSetProductAsFarmerShipped.json();
  } else {
    let errSetProductAsFarmerShipped = {
      status: responseSetProductAsFarmerShipped.status,
      errObj: await responseSetProductAsFarmerShipped.json(),
    };
    throw errSetProductAsFarmerShipped; // An object with the error coming from the server
  }
}

//GET product by specific ID + readme ok
async function getProductById(product_id) {
  const responseProductById = await fetch('/api/product/' + product_id);
  if (responseProductById.ok) {
    return await responseProductById.json();
  } else {
    let errProductById = {
      status: responseProductById.status,
      errObj: await responseProductById.json(),
    };
    throw errProductById; // An object with the error coming from the server
  }
}

//GET all categories + readme ok
async function getAllCategories() {
  const responseAllCategories = await fetch('/api/products/categories');
  if (responseAllCategories.ok) {
    return await responseAllCategories.json();
  } else {
    let errAllCategories = {
      status: responseAllCategories.status,
      errObj: await responseAllCategories.json(),
    };
    throw errAllCategories; // An object with the error coming from the server
  }
}

//GET all providers + readme ok
async function getAllProviders() {
  const responseAllProviders = await fetch('/api/providers/all');
  if (responseAllProviders.ok) {
    return await responseAllProviders.json();
  } else {
    let errAllProviders = {
      status: responseAllProviders.status,
      errObj: await responseAllProviders.json(),
    };
    throw errAllProviders; // An object with the error coming from the server
  }
}

//GET provider by specific ID + readme ok
async function getProviderById(provider_id) {
  const response = await fetch('/api/provider/' + provider_id);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider products by providerID + readme ok
async function getProviderProducts() {
  const response = await fetch('/api/provider-products');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider products by providerID + readme ok
async function getProviderBookings() {
  const response = await fetch('/api/provider-bookings');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider products by providerID that are not available and notification filed is equal to zero.
async function getProviderProductsNotification() {
  const response = await fetch('/api/provider-products-notification');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}
//POST set the notification as Sent

async function setNotificationasSent(products) {
  const response = await fetch('/api/provider-products-sent/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//Check if provider has already confirmed product availability for given year and week of year + readme ok
async function getProviderConfirmationStatus(year, week_number) {
  const response = await fetch(
    '/api/provider/confirmationStatus/' + year + '/' + week_number
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider expected products + readme ok
async function getProviderAvailableProducts(year, week_number) {
  const response = await fetch(
    '/api/products/provider/available/' + year + '/' + week_number
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST array of expected products + readme ok
async function declareAvailability(products, year, week) {
  const response = await fetch('/api/products/expected/' + year + '/' + week, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products), // Conversion in JSON format
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST product image & product_id (used to rename img for correctly displaying in booking.js) + readme ok
async function uploadProductImage(formData, product_id) {
  const response = await fetch(
    '/api/products/upload/expected/' + product_id + '',
    {
      method: 'POST',
      body: formData,
    }
  );
  if (response.ok) {
    return true;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//Check if email already exists + readme ok
async function checkEmailAvailability(email) {
  const response = await fetch('/users/email-availability/' + email);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST a farmer application + readme ok
async function sendFarmerApplication(farmerApplication) {
  console.log(farmerApplication);
  const response = await fetch('/provider/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(farmerApplication),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all the pending farmer applications + readme ok
async function getFarmerPendingApplications() {
  const response = await fetch('/manager/applications/pending');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all the accepted/rejected farmer applications + readme ok
async function getFarmerAcceptedApplications() {
  const response = await fetch('/manager/applications/accepted');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//Accept a farmer application given the application id + readme ok
async function acceptFarmerApplication(application_id) {
  const response = await fetch(
    '/manager/applications/accept/' + application_id
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//Reject a farmer application given the application id + readme ok
async function rejectFarmerApplication(application_id) {
  const response = await fetch(
    '/manager/applications/reject/' + application_id
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//update quantity of products
async function updateQuantity(product_id, quantity) {
  const response = await fetch(`/api/modifyquantity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: product_id, quantity: quantity }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

// Adding new client
async function addClient(client) {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      budget: client.budget,
      name: client.name,
      surname: client.surname,
      gender: client.gender,
      birthdate: client.birthdate,
      country: client.country,
      region: client.region,
      address: client.address,
      city: client.city,
      phone: client.phone,
      email: client.email,
      hash: client.hash,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET ->retrieve payment methods
async function getAllPaymentMethods() {
  const response = await fetch('/api/methods');
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

// Adding new transaction
async function addTransaction(tr) {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: tr.type,
      client_id: tr.client_id,
      method_id: tr.method_id,
      account_num: tr.account_num,
      amount: tr.amount,
      date: tr.date,
      time: tr.time,
      status: 1,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

// Increase balance of clients
async function increaseBalance(amount, clientId) {
  const response = await fetch(
    '/api/clients/update/balance/' + clientId + '/' + amount,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

// Confirm expexted product
async function confirmExpectedProducts(product, year, week) {
  const response = await fetch('/api/farmerConfirm/' + product, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

async function setUnavailableProducts(product, year, week) {
  const response = await fetch('/api/farmerUnavailable/' + product, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//api login
async function logIn(credentials) {
  let responseLogIn = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (responseLogIn.ok) {
    const user = await responseLogIn.json();
    return user;
  } else {
    let err = {
      status: responseLogIn.status,
      errObj: await responseLogIn.json(),
    };
    throw err; // An object with the error coming from the server
  }
}

async function logOut() {
  await fetch('/api/sessions/current', {
    method: 'DELETE',
  });
}

async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST di un nuovo incontro
async function addUser(S) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: S.id,
      name: S.name,
      email: S.email,
      hash: S.hash,
      role: S.role,
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST di un nuovo incontro
async function addOrder(S) {
  const response = await fetch('/api/orderinsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: S.order_id,
      client_id: S.client_id,
      product_name: S.product_name,
      product_id: S.product_id,
      order_quantity: S.order_quantity,
      state: S.state,
      OrderPrice: S.OrderPrice,
      id: S.id,
      address: S.address,
      city: S.city,
      zipcode: S.zipcode,
      Nation: S.nation,
      date: S.date,
      time: S.time,
      pickup: S.pickup,
    }),
  });
  console.log(response);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//DELETE ->order item
function deleteOrderItem(id) {
  return new Promise((resolve, reject) => {
    fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            })
            .catch((err) => {
              reject({
                errors: [
                  { param: 'Application', msg: 'Cannot delete a rorder item' },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [
            { param: 'Server', msg: 'Communication with server failed' },
          ],
        });
      });
  });
}

const submitEmail = async (e) => {
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email: e.email,
      message: e.message,
    }),
  });
  if (response.ok) {
    const resData = await response.json();
    //console.log(resData);
    // if (resData.status === 'success') {
    //   alert('Message Sent');
    // }
    // else if (resData.status === 'fail') {
    //   alert('Message failed to send');
    // }
    return resData;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
  //   .then((res) => res.json())
  // .then(async (res) => {
  //   const resData = await res;

  // });
};

/// send telegram notification on Saturday at 09:00
const sendTelegramNotificationOnSaturday = async () => {
  const response = await fetch('/api/SendTelegramNotification', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
  // .then((res) => res.json())
  // .then(async (res) => {
  //   const resData = await res;
  //   console.log(resData);
  // });
};

/// send telegram notification on Saturday at 09:00
const sendTelegramTopUpNotification = async (client, transaction) => {
  const response = await fetch('/api/topUpNotificationTelegram', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      clientid: client.client_id,
      balance: client.budget,
      telegramId: client.telegramId,
      name: client.name,
      surname: client.surname,
      amount: transaction.amount,
      date: transaction.date,
      time: transaction.time,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
  // .then((res) => res.json())
  // .then(async (res) => {
  //   const resData = await res;
  //   console.log(resData);
  // });
};

/// send telegram notification on Saturday at 09:00
const sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10 =
  async () => {
    const response = await fetch(
      '/api/SendTelegramNotificationForInsufficientBalance',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      let err = { status: response.status, errObj: await response.json() };
      throw err; // An object with the error coming from the server
    }
    // .then((res) => res.json())
    // .then(async (res) => {
    //   const resData = await res;
    //   console.log(resData);
    // });
  };

const sendTelegramOrderStateNotification = async (clientId, state) => {
  const response = await fetch('/api/orderStateConfirmation', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId,
      state: state,
    }),
  })
    .then((res) => res.json())
    .then(async (res) => {
      const resData = await res;
      console.log(resData);
    });
};

async function updateItem(order) {
  const response = await fetch(`/api/orders/` + order.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: order.order_id,
      client_id: order.client_id,
      product_name: order.product_name,
      product_id: order.product_id,
      order_quantity: order.order_quantity,
      state: order.state,
      farmer_state: order.farmer_state,
      OrderPrice: order.OrderPrice,
      id: order.id,
      address: order.address,
      city: order.city,
      zipcode: order.zipcode,
      Nation: order.Nation,
      date: order.date,
      time: order.time,
      pickup: order.pickup,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET ->retrieve all deliverers
async function getAllDeliverers() {
  const responseGetAllDeliverers = await fetch('/api/deliverers');
  if (responseGetAllDeliverers.ok) {
    return await responseGetAllDeliverers.json();
  } else {
    let err = {
      status: responseGetAllDeliverers.status,
      errObj: await responseGetAllDeliverers.json(),
    };
    throw err; // An object with the error coming from the server
  }
}

//GET ->retrieve deliverable orders
async function getDeliverableOrders(city) {
  const response = await fetch(`/api/deliverableOrders/${city}`);
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider by specific mail
async function getDelivererByMail(id) {
  const response = await fetch('/api/deliverer/' + id);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET ->retrieve all deliverers
async function getOrderAndClientData() {
  const response = await fetch('/api/orders/pickup/clientorder');
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

const API = {
  getAllClients,
  getAllProducts,
  getAllOrders,
  updateDelivered,
  updateWHPrepared,
  getAllConfirmedProducts,
  getAllExpectedProducts,
  getOrderedProductsForProvider,
  getProviderShipmentStatus,
  setProductsAsFarmerShipped,
  updateStateOnce,
  getProductById,
  getAllProviders,
  getProviderById,
  getProviderProducts,
  getProviderAvailableProducts,
  getProviderBookings,
  getProviderConfirmationStatus,
  setUnavailableProducts,
  declareAvailability,
  uploadProductImage,
  checkEmailAvailability,
  sendFarmerApplication,
  getFarmerPendingApplications,
  getFarmerAcceptedApplications,
  acceptFarmerApplication,
  rejectFarmerApplication,
  addClient,
  getAllPaymentMethods,
  addTransaction,
  increaseBalance,
  deleteOrderItem,
  updateQuantity,
  getAllCategories,
  logOut,
  logIn,
  getUserInfo,
  addUser,
  addOrder,
  submitEmail,
  confirmExpectedProducts,
  getProviderDeliveredOrders,
  getAllUsers,
  updateState,
  updateSuspension,
  updateItem,
  updateStateFarmer,
  getAllDeliverers,
  getDeliverableOrders,
  getDelivererByMail,
  getProviderProductsNotification,
  setNotificationasSent,
  getOrderAndClientData,
  sendTelegramNotificationOnSaturday,
  sendTelegramTopUpNotification,
  sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10,
  getAllMissedPickups,
  addMissedPickup,
  sendTelegramOrderStateNotification,
};

export default API;
