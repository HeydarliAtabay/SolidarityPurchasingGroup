//GET ->retrieve clients and budget
async function getAllClients() {
  const response = await fetch('/api/clients');
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
//GET ->retrieve users
async function getAllUsers() {
  const response = await fetch('/api/users');
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

//GET ->retrieve client orders
async function getAllOrders() {
  const response = await fetch('/api/orders');
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

//GET ->retrieve client orders
async function getProviderDeliveredOrders(id) {
  const response = await fetch(`/api/provider-orders/${id}`);
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

//PUT to update a product as delivered
function updateDelivered(id, product_name) {
  return new Promise((resolve, reject) => {
    fetch(`/api/orders/${id}/${product_name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
                errors: [{ param: 'Application', msg: 'Cannot update ' }],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [{ param: 'Server', msg: 'Communicate with server failed' }],
        });
      });
  });
}

// PUT to update a product as prepared
function updateWHPrepared(id, product_name) {
  return new Promise((resolve, reject) => {
    fetch(`/api/orders/${id}/${product_name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
                errors: [{ param: 'Application', msg: 'Cannot update ' }],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [{ param: 'Server', msg: 'Communicate with server failed' }],
        });
      });
  });
} //

//update order state
function updateState(id, state) {
  return new Promise((resolve, reject) => {
    fetch(`/api/modifyState`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        state: state
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
                errors: [{ param: 'Application', msg: 'Cannot update ' }],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [{ param: 'Server', msg: 'Communicate with server failed' }],
        });
      });
  });
}

//update farmer state of a product of an order

function updateStateFarmer(id, product_name, state) {
  return new Promise((resolve, reject) => {
    fetch(`/api/modifyStateFarmer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        product_name: product_name,
        state: state,
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
                errors: [{ param: 'Application', msg: 'Cannot update ' }],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [{ param: 'Server', msg: 'Communicate with server failed' }],
        });
      });
  });
}


//GET all confirmed products + readme OK
async function getAllConfirmedProducts(year, week) {
  const response = await fetch('/api/products/confirmed/' + year + '/' + week);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all expected products + readme ok
async function getAllExpectedProducts(year, week) {
  const response = await fetch('/api/products/expected/' + year + '/' + week);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all products in the booked or pending state of a certain provider + readme ok
async function getOrderedProductsForProvider(year, week) {
  const response = await fetch('/api/products/ordered/' + year + '/' + week);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//Check if provider has already declared ordered items as shipped + readme ok
async function getProviderShipmentStatus(year, week) {
  const response = await fetch(
    '/api/provider/shipmentstatus/' + year + '/' + week
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//POST all products IDs that were shipped + readme ok
async function setProductsAsFarmerShipped(productIDS) {
  const response = await fetch('/api/orders/farmershipped', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productIDS), // Conversion in JSON format
  });
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET product by specific ID + readme ok
async function getProductById(product_id) {
  const response = await fetch('/api/product/' + product_id);
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all categories + readme ok
async function getAllCategories() {
  const response = await fetch('/api/products/categories');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all providers + readme ok
async function getAllProviders() {
  const response = await fetch('/api/providers/all');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
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
async function getProviderExpectedProducts(year, week_number) {
  const response = await fetch(
    '/api/products/provider/expected/' + year + '/' + week_number
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
function updateQuantity(product_id, quantity) {
  return new Promise((resolve, reject) => {
    fetch(`/api/modifyquantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: product_id, quantity: quantity }),
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
                errors: [{ param: 'Application', msg: 'Cannot update ' }],
              });
            });
        }
      })
      .catch((err) => {
        reject({
          errors: [{ param: 'Server', msg: 'Communicate with server failed' }],
        });
      });
  });
}

/* 
   Place a new order.
   orders = [(product_id, quantity), ...]
*/
//////////////////////////////////////////////////////////////////////
//'insertNewOrder' is defined but never used => comment to reduce TD//
//////////////////////////////////////////////////////////////////////
/*async function insertNewOrder(client_id, orders) {
  let product_order = { order_items: orders };

  const order_response = await fetch(
    '/api/insert-order?cid=' + client_id,
    {
      method: 'POST',
      body: JSON.stringify(product_order),
    }
  );

  if (order_response.ok) return await order_response.json(); // status: OK

  // something went wrong with the request.
  console.error(
    'Error fetching resource: insert-order, status: ' + order_response.status
  );

  let ex = { status: order_response.status, errObj: order_response };
  throw ex;
}*/

// Adding new client

function addClient(client) {
  return new Promise((resolve, reject) => {
    fetch('/api/clients', {
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
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: 'Cannot parse server response.' });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: 'Cannot communicate with the server.' });
      }); // connection errors
  });
}

//GET ->retrieve payment methods
async function getAllPaymentMethods() {
  const response = await fetch('/api/methods');
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

// Adding new transaction

function addTransaction(tr) {
  return new Promise((resolve, reject) => {
    fetch('/api/transactions', {
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
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: 'Cannot parse server response.' });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: 'Cannot communicate with the server.' });
      }); // connection errors
  });
}

// Increase balance of clients
function increaseBalance(amount, clientId) {
  return new Promise((resolve, reject) => {
    fetch('/api/clients/update/balance/' + clientId + '/' + amount, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: 'Cannot parse server response.' });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: 'Cannot communicate with the server.' });
      }); // connection errors
  });
}

// Confirm expexted product
function confirmExpectedProducts(product, year, week) {
  return new Promise((resolve, reject) => {
    fetch('/api/farmerConfirm/' + product + '/' + year + '/' + week, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: 'Cannot parse server response.' });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: 'Cannot communicate with the server.' });
      }); // connection errors
  });
}
//api login
async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', {
    method: 'DELETE',
  });
}

async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

//POST di un nuovo incontro
function addUser(S) {
  return new Promise((resolve, reject) => {
    fetch('/api/users', {
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
                errors: [{ param: 'Application', msg: 'Cannot insert a user' }],
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

//POST di un nuovo incontro
function addOrder(S) {
  return new Promise((resolve, reject) => {
    fetch('/api/orderinsert', {
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
                  { param: 'Application', msg: 'Cannot insert a order' },
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
  })
    .then((res) => res.json())
    .then(async (res) => {
      const resData = await res;
      console.log(resData);
      if (resData.status === 'success') {
        alert('Message Sent');
      } else if (resData.status === 'fail') {
        alert('Message failed to send');
      }
    });
};
function updateItem(order) {

  return new Promise((resolve, reject) => {
    fetch(`/api/orders/` + order.id, {
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
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: 'Cannot parse server response.' });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: 'Cannot communicate with the server.' });
      }); // connection errors
  });
}

//GET ->retrieve all deliverers
async function getAllDeliverers() {
  const response = await fetch('/api/deliverers');
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
//GET ->retrieve deliverable orders
async function getDeliverableOrders(city) {
  const response = await fetch(`/api/deliverableOrders/${city}`);
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
    try {
      const err = await response.json();
      throw err.message;
    } catch (err) {
      throw err;
    }
  }
}
const API = {
  getAllClients,
  getAllOrders,
  updateDelivered,
  updateWHPrepared,
  getAllConfirmedProducts,
  getAllExpectedProducts,
  getOrderedProductsForProvider,
  getProviderShipmentStatus,
  setProductsAsFarmerShipped,
  getProductById,
  getAllProviders,
  getProviderById,
  getProviderProducts,
  getProviderExpectedProducts,
  getProviderConfirmationStatus,
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
  updateItem,
  updateStateFarmer,
  getAllDeliverers,
  getDeliverableOrders,
  getDelivererByMail,
  getProviderProductsNotification,
  setNotificationasSent,
  getOrderAndClientData,
};

export default API;
