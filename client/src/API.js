//GET ->retrieve clients and budget
async function getAllClients() {
  const response = await fetch('http://localhost:3000/api/clients');
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
  const response = await fetch('http://localhost:3000/api/orders');
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
function updateDelivered(order_id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/orders/${order_id}`, {
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

//GET all products
async function getAllProducts() {
  const response = await fetch('http://localhost:3000/api/products/all');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET product by specific ID
async function getProductById(product_id) {
  const response = await fetch(
    'http://localhost:3000/api/product/' + product_id
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET all categories
async function getAllCategories() {
  const response = await fetch('http://localhost:3000/api/products/categories');
  if (response.ok) {
      return await response.json();
  } else {
      let err = { status: response.status, errObj: await response.json() };
      throw err;  // An object with the error coming from the server
  }
}

//GET all providers
async function getAllProviders() {
  const response = await fetch('http://localhost:3000/api/providers/all');
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}

//GET provider by specific ID
async function getProviderById(provider_id) {
  const response = await fetch(
    'http://localhost:3000/api/provider/' + provider_id
  );
  if (response.ok) {
    return await response.json();
  } else {
    let err = { status: response.status, errObj: await response.json() };
    throw err; // An object with the error coming from the server
  }
}
//Insert a new order
function insertNewBookOrder(itemsOrdered) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/neworder/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemsOrdered),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response);
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
//update quantity of products
function updateQuantity(product_id, quantity) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/modifyquantity`, {
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
async function insertNewOrder(client_id, orders) {
  let product_order = { order_items: orders };

  const order_response = await fetch(
    'http://localhost:3000/api/insert-order?cid=' + client_id,
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
}

// Adding new client

function addClient(client) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/clients', {
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
  const response = await fetch('http://localhost:3000/api/methods');
  if (response.ok) {
    const responseBody = await response.json();
    return responseBody;
  } else {
    try {
      let err = { status: response.status, errObj: responseBody };
      throw err.message;
    } catch (err) {
      throw err;
    }
  }
}


// Adding new transaction

function addTransaction(tr) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/transactions', {
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
    fetch(
      'http://localhost:3000/api/clients/update/balance/' +
        clientId +
        '/' +
        amount,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )
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

const API = {
  getAllClients,
  getAllOrders,
  updateDelivered,
  getAllProducts,
  getProductById,
  getAllProviders,
  getProviderById,
  addClient,
  getAllPaymentMethods,
  addTransaction,
  increaseBalance,
  insertNewOrder,
  updateQuantity,
  insertNewBookOrder,
  getAllCategories
};
export default API;
