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
const API = {getAllClients, getAllOrders,updateDelivered}
export default API;