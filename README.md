# SE2-SPG

The webapplication runs on node.js and npm, so you need to install it. Get the lastest version from [here](https://nodejs.org/) and [here](https://npmjs.org/)

## How to run it:

Use these npm scripts to install and run the project: 

1. clone the repository
2. `cd namedirectory`
3. `cd client →npm install`
4. `cd .. → cd server → npm install`
5. `cd client → npm start`
6. (open another termianal window) `cd server npm start`

The application should now run at [http://localhost:3000](http://localhost:3000/) of the browser

## How to test it: 

`npm run test` 

in the server and client directory

<h2>Running Docker for Demo2</h2>

Dockerhub: https://hub.docker.com/r/fridanco/spg-r2-se2:

<h3>Pull the image</h3>

      (sudo) docker pull fridanco/spg-r2-se2:demo2

if on linux, use "sudo" otherwise commands will fail

<h3>Run the image</h3>

     (sudo) docker run -p xxxx:3000 fridanco/spg-r2-se2:demo2

if on linux, use "sudo" otherwise commands will fail
xxxx can be any free port on your PC: e.g 5000, 10000, 50000 etc
open your favourite browser and access the project at the url: http://localhost:xxxx

## Users Credentials

### Clients

| Email address    | Password  |
| :--------------- | :-------: |
| antonio@spg.it | ant111 |
| elnurs.shabanov@gmail.com  | elnur111  |
| sara.bekkari@yahoo.it | sara |
| clare.mint@yahoo.it | sara |


### Shop employee

| Email address    | Password  |
| :--------------- | :-------: |
| employee1@shop.it | shop |
| employee2@shop.it  | shop  |
| employee3@shop.it  | shop  |

### Warehouse manager

| Email address    | Password  |
| :--------------- | :-------: |
| whmanager@shop.it | whmanager |


### Warehouse employee

| Email address    | Password  |
| :--------------- | :-------: |
| warehouse1@shop.it | warehouse1 |
### Farmer 

| Email address    | Password  |
| :--------------- | :-------: |
| luca.bianchi@spg.it | 1111 |

## API Server
----------------------------------------------------------------------------------------------------------------------------------------------------------------------
* login api:
* POST `/api/sessions `
    * Request parameter:
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
          
          `{
              "id": e.id, 
              "name": e.name, 
               "email": e.email,
              "hash": e.hash, 
              "role": e.role
      
         }
         `     
    * Response: `201 OK (success) or 401` 
    * Response body: 

        `{
              "id": e.id, 
              "name": e.name, 
               "email": e.email,
              "hash": e.hash, 
              "role": e.role
      
         }`  or
              
          `{ 'User not found.' } `

* GET `/api/sessions/current `
    * Request parameter: 
    * Request body:  
    * Body of the content: 
     
     `{
              
               "email": e.email,
               "password": e.password
      
         }` 
    * Response: `200 OK (success) or 401`
    * Response body:
     
     `{
               "id": e.id, 
              "name": e.name, 
               "email": e.email,
               "hash": e.hash, 
               "role": e.role
      
         }`       or
         
    
    `{
           "code": 401,
           "error": 'Unauthenticated user!',
         } `

* DELETE `/api/sessions/current `
    * Request parameter:
    * Request body: 
    * Body of the content:
    * Response: 
    * Response body:
    `Logout completed!`
    
-------------------------------------------------------------------------------------------------------------------------------------------------------------   
* POST `/api/orderinsert `
    * Request parameter:
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
         
   
         `{
             "order_id":xxxx,
             "client_id": yyyy,
             "product_name": S.product_name,
             "product_id": S.product_id,
             "order_quantity": S.order_quantity,
             "state": S.state,
             "OrderPrice": S.OrderPrice,
             "id": S.id,
             "address": S.address,
             "city": S.city,
             "zipcode": S.zipcode,
             "Nation": S.nation,
            "date": S.date,
            "time": S.time,
            "pickup": S.pickup
         }
         `
    * Response: `201 OK (success) or 503`
    * Response body:

        `{
             "code":503
             "error": "Unavailable service during the create of the order."
         }`
* POST `/api/users `
    * Request parameter:
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
         
         `{
              "id": e.id, 
              "name": e.name, 
               "email": e.email,
              "hash": e.hash, 
              "role": e.role
      
         }
         `     
    * Response: `201 OK (success) or 503 
    * Response body:
     
     `Added client as a user!` or

        `{
             "code":503
             "error": "Unavailable service during the create of the order."
         }`


* GET `/api/orders `
    * Request parameter: 
    * Request body:  
    * Body of the content: 
    * Response: `200 OK (success) or 500
    * Response body:
     
     `{
             "order_id":S.order_id,
             "client_id":S.client_id,
             "product_name": S.product_name,
             "product_id": S.product_id,
             "order_quantity": S.order_quantity,
             "state": S.state,
             "OrderPrice": S.OrderPrice,
             "id": S.id,
             "address": S.address,
             "city": S.city,
             "zipcode": S.zipcode,
             "Nation": S.nation,
            "date": S.date,
            "time": S.time,
            "pickup": S.pickup
         }`   or
         
      `{  
            code: 500,
             error: 'Database error during the retrieve of the list of orders.'
         } `
* GET `/api/clients `
    * Request parameter: 
    * Request body:  
    * Body of the content: 
    * Response: `200 OK (success) or 500
    * Response body:
    
       `{
              "client_id": e.client_id, 
              "budget": e.budget, 
              "name": e.name, 
              "surname": e.surname, 
              "gender": e.gender, 
              "birthdate": e.birthdate,
              "country": e.country,
               "region": e.region,
               "address": e.address,
               "city": e.city, 
               "phone": e.phone,
               "email": e.email
      
         }` or 
         
      `{
           code: 500,
           error: `Database error during the retrieve of the list of clients.`
         } `
        
 * GET `/api/users `
    * Request parameter: 
    * Request body:  
    * Body of the content: 
    * Response: `200 OK (success) or 500
    * Response body:
      
      `{
              "id": e.id, 
              "name": e.name, 
               "email": e.email,
              "hash": e.hash, 
              "role": e.role
      
         } `      or
         
      `{
           code: 500,
           error: 'Database error during the retrieve of the list of users.'
         } `

* PUT `/api/orders/:id `
    * Request parameter: id 
    * Request body:  An object representing (Content-Type: `application/json`).
    * Body of the content:
       
       `{
              "client_id": e.client_id, 
              "budget": e.budget, 
              "name": e.name, 
              "surname": e.surname, 
              "gender": e.gender, 
              "birthdate": e.birthdate,
              "country": e.country,
               "region": e.region,
               "address": e.address,
               "city": e.city, 
               "phone": e.phone,
               "email": e.email
      
         } `
    * Response: `200 OK (success) or 503 
    * Response body:  
      
      `{
              "client_id": e.client_id, 
              "budget": e.budget, 
              "name": e.name, 
              "surname": e.surname, 
              "gender": e.gender, 
              "birthdate": e.birthdate,
              "country": e.country,
               "region": e.region,
               "address": e.address,
               "city": e.city, 
               "phone": e.phone,
               "email": e.email
      
         } ` or
        `{
            "error": "Database error during the update of order. " 
         } `
* PUT `/api/orders/:order_id/:product_name `
    * Request parameter: order_id , product_name
    * Request body: 
    * Body of the content:
    * Response: `200 OK (success) or 503` 
    * Response body:
     
     `Update Completed!` or

        `{
             "code":503
             "error": "Unavailable service during the update of the order."
         } `
  

* DELETE`/api/orders/:id `
    * Request parameter:id
    * Request body: 
    * Body of the content:
          
    * Response: `204 OK (success) or 503 
    * Response body: `order item deleted!` or

        `{
                "code": 503,
                "error": "Unavailable service error during the delete of the order item"
         } `

-------------------------------------------------------------------------------------------------------------------------------------------------------------   
## API for adding a new client

POST `/api/clients `
    * Request parameter:
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
         
         `{
      "budget": c.budget,
      "name": c.name,
      "surname": c.surname,
      "gender": c.gender,
      "birthdate": c.birthdate,
      "country": c.country,
      "region": c.region,
      "address": c.address,
      "city": c.city,
      "phone": c.phone,
      "email": c.email,
      "hash": hashedPassword,
      
         }
         `     
    * Response: `201 OK (success) or 500 
    * Response body:
     
     `'New Client was added!` or

        `{
             "code":500
             "error": "Unavailable service while adding new client!"
         }`
## API for getting all payment methods

 * GET `/api/methods `
    * Request parameter: 
    * Request body:  
    * Body of the content: 
    * Response: `200 OK (success) or 500
    * Response body:
      
      `{
               "method_id": m.method_id,
               "method_name": m.method_name,
               "approval_time": m.approval_time
      
         } `      or
         
      `{
           code: 500,
           error: 'Database error during the retrieve of the list of payment methods.'
         } `
## API for increasing balane of the client

* PUT `/api/clients/update/balance/:clientId/:amount `
    * Request parameter: clientId , amount
    * Request body: 
    * Body of the content:
    * Response: `200 OK (success) or 500` 
    * Response body:
     
     `Balance of client : ${clientId} was increased` or

        `{
             "code":500
             "error": ` Error while updating the balance of user with id: ${clientId} `
         } `

 
## API for adding a new transaction

POST `/api/transactions `
    * Request parameter:
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
         
         `{
     "type": tr.type, 
     "client_id": tr.client_id, 
     "method_id": tr.method_id, 
     "account_num": tr.account_num, 
     "amount": tr.amount, 
     "date": tr.date, 
     "time": tr.time, 
     "status": tr.status
      
         }
         `     
    * Response: `201 OK (success) or 500 
    * Response body:
     
     `'Id of the new transaction` or

        `{
             "code":500
             "error": "Unavailable service while adding new transaction!"
         }`






        


   
