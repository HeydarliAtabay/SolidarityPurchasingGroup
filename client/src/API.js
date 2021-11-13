//GET ->retrieve clients and budget  
async function getAllClients(){

const response=await fetch("http://localhost:3000/api/clients");
if(response.ok){
  const responseBody=await response.json();
  return responseBody;
}
 else{
     try {
       const err=await response.json();
       throw err.message;}
        catch(err){throw err;}
     }
 }

//GET ->retrieve client orders  
async function getAllOrders(){

const response=await fetch("http://localhost:3000/api/orders");
if(response.ok){
  const responseBody=await response.json();
  return responseBody;
}
 else{
     try {
       const err=await response.json();
       throw err.message;}
        catch(err){throw err;}
     }
 }
 //PUT to update a product as delivered
function updateDelivered(order_id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/orders/${order_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // cause of error
          response.json()
            .then((obj) => { reject(obj); })
            .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot update " }] }) });
        }
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Communicate with server failed" }] }) });
  });
}

//GET all products
async function getAllProducts() {
    const response = await fetch('http://localhost:3000/api/products/all');
    if (response.ok) {
        return await response.json();
    } else {
        let err = { status: response.status, errObj: response };
        throw err;  // An object with the error coming from the server
    }
}

//GET product by specific ID
async function getProductById(product_id) {
    const response = await fetch('http://localhost:3000/api/product/'+product_id);
    if (response.ok) {
        return await response.json();
    } else {
        let err = { status: response.status, errObj: response };
        throw err;  // An object with the error coming from the server
    }
}

//GET all providers
async function getAllProviders() {
  const response = await fetch('http://localhost:3000/api/providers/all');
  if (response.ok) {
      return await response.json();
  } else {
      let err = { status: response.status, errObj: response };
      throw err;  // An object with the error coming from the server
  }
}

//GET provider by specific ID
async function getProviderById(provider_id) {
  const response = await fetch('http://localhost:3000/api/provider/'+provider_id);
  if (response.ok) {
      return await response.json();
  } else {
      let err = { status: response.status, errObj: response };
      throw err;  // An object with the error coming from the server
  }
}

async function insertNewOrder()
{
  
}

// Adding new client

function addClient(client) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({ budget:client.budget,name:client.name, surname:client.surname, gender:client.gender, 
        birthdate:client.birthdate, country:client.country, region:client.region,
        address:client.address, city:client.city, phone:client.phone, email:client.email, hash:client.hash
      })
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

const API = {getAllClients, getAllOrders,updateDelivered, getAllProducts, getProductById, getAllProviders, getProviderById,
              addClient
}

const API = {getAllClients, getAllOrders,updateDelivered, getAllProducts, getProductById, getAllProviders, getProviderById, addClient}
export default API;
