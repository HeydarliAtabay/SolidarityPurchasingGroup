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

| Email address             | Password |
| :------------------------ | :------: |
| antonio@spg.it            |  ant111  |
| elnurs.shabanov@gmail.com | elnur111 |
| sara.bekkari@yahoo.it     |   sara   |
| clare.mint@yahoo.it       |   sara   |


### Shop employee

| Email address     | Password |
| :---------------- | :------: |
| employee1@shop.it |   shop   |
| employee2@shop.it |   shop   |
| employee3@shop.it |   shop   |

### Shop manager

| Email address     | Password |
| :---------------- | :------: |
| manager@spg.it    |   1111   |

### Warehouse manager

| Email address     | Password  |
| :---------------- | :-------: |
| whmanager@shop.it | whmanager |

### Warehouse employee

| Email address      |  Password  |
| :----------------- | :--------: |
| warehouse1@shop.it | warehouse1 |
### Farmer 

| Email address       | Password |
| :------------------ | :------: |
| luca.bianchi@spg.it |   1111   |
| farmer@spg.it       |   1234   |
| farmer2@spg.it      |   1234   |
| matteo.rossi@spg.it |   1111   |
| mattia.verdi@spg.it |   1111   |
| newfarmer@spg.it    |   1234   |
| farmer3@spg.it      |   1234   |

### Delivery person

| Email address      |  Password  |
| :----------------- | :--------: |
| deliverer1@shop.it | deliverer1 |
| deliverer2@shop.it | deliverer2 |

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






* GET `/api/products/confirmed/:year/:week_number`
    * Get all farmer-confirmed products for the given year and week of the year
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.product_id,
            name: p.product_name,
            description: p.product_description,
            category: p.category_name,
            price: p.product_price,
            unit: p.product_unit,
            quantity: p.product_quantity,
            expiryDate: p.product_expiry,
            providerId: p.provider_id,
            providerName: p.provider_name,
            year: p.year,
            week: p.week_number,
            status: p.product_status,
            active: 1
         }`   

* GET `/api/products/expected/:year/:week_number`
    * Get all expected products for the given year and week of the year
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.product_id,
            name: p.product_name,
            description: p.product_description,
            category: p.category_name,
            price: p.product_price,
            unit: p.product_unit,
            quantity: p.product_quantity,
            expiryDate: p.product_expiry,
            providerId: p.provider_id,
            providerName: p.provider_name,
            year: p.year,
            week: p.week_number,
            status: p.product_status,
            active: 1
         }`   

* GET `/api/products/ordered/:year/:week_number`
    * GET all products in the booked or pending state of a certain provider
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.productID,
            name: p.product_name,
            tot_quantity: p.TotQty,
            unit: p.product_unit
         }`  


* GET `/api/provider/shipmentstatus/:year/:week_number`
    * Check if provider has already declared ordered items as shipped
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `true if provider has shipped at least 1 product, false otherwise`


POST `/api/orders/farmershipped`
    * Set all the sent product IDs as farmer-shipped
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
         `[product_ID1, product_ID2, ..., productIDn]`     
    * Response: `201 OK (success) or 500 
    * Response body:
        `true if all the products status was set to "farmer-shipped", false otherwise`


* GET `/api/product/:product_id`
    * Get a product given its product ID
    * Request parameter: product_id
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `{
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            category: row.category_name,
            price: row.product_price,
            unit: row.product_unit,
            quantity: row.product_quantity,
            expiryDate: row.product_expiry,
            providerId: row.provider_id,
            providerName: row.provider_name,
            active: 1,
         }`   


* GET `/api/products/categories`
    * Get all the product categories
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `{
            id: c.category_id,
            name: c.category_name,
            active: 0,
         }`   

* GET `/api/providers/all`
    * Get all the providers/farmers
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.provider_id,
            name: p.provider_name,
            description: p.provider_description,
            location: p.provider_location,
         }`   


* GET `/api/provider/:provider_id`
    * Get a provider/farmer given his/her provider ID
    * Request parameter: provider_id
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `{
             id: row.provider_id,
            name: row.provider_name,
            description: row.provider_description,
            location: row.provider_location,
         }`  


* GET `/api/provider-products`
    * Get ALL the products of the currently logged in provider/farmer
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.product_id,
            name: p.product_name,
            description: p.product_description,
            category: p.category_id,
            price: p.product_price,
            unit: p.product_unit,
            quantity: 0,
            expiryDate: '',
            providerId: provider_id,
            providerName: '',
            year: 0,
            week: 0,
            status: 'confirmed',
            active: 1,
         }`  


* GET `/api/provider/confirmationStatus/:year/:week_number`
    * Check if provider has already confirmed product availability for given year and week of year
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `true if provider has confirmed at least 1 product, false otherwise`


* GET `/api/products/provider/expected/:year/:week_number`
    * Get ALL the expected products of the currently logged in provider/farmer for the given year and week of year
    * Request parameter: year, week_number
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.product_id,
            name: p.product_name,
            description: p.product_description,
            category: p.category_id,
            price: p.product_price,
            unit: p.product_unit,
            quantity: p.product_quantity,
            expiryDate: p.product_expiry,
            providerId: p.provider_id,
            year: p.year,
            week: p.week_number,
            status: p.product_status,
         }` 


* POST `/api/products/provider/expected/:year/:week_number`
    * Declare expected products of the currently logged in provider/farmer for the given year and week of year
    * Request parameter: year, week_number
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
        `array of {
            id: prod.id,
            name: prod.name,
            description: prod.description,
            category: prod.category,
            price: prod.price,
            unit: prod.unit,
            quantity: prod.quantity,
            year: year of next week (obtained with dayjs),
            week_number: number of next week (obtained with dayjs),
         }` 
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body: ALL the new IDs of the inserted products (used to upload product images)
        `[product_ID1, product_ID2, ..., productIDn]`


* POST `/api/products/upload/expected/:product_id`
    * Upload product image with image name = product ID
    * Request parameter: product_id
    * Request body: An object representing (Content-Type: `application/x-www-form-urlencoded`).
    * Body of the content:
        `FormData with product image appended` 
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body: 
        `'success' if image uploaded, 'No files were uploaded.' otherwise`


* GET `/users/email-availability/:email`
    * Check if email is available or not
    * Request parameter: email
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `true if email already EXISTS, false otherwise`


* POST `/provider/apply`
    * POST a farmer application
    * Request body: An object representing (Content-Type: `application/json`).
    * Body of the content:
        `{
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            country: country,
            region: region,
            city: city,
            address: address,
            zip: zip_code,
            password: password,
            description: description,
            submit_date: date and time of submission (obtained with dayjs)
        }` 
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body: ALL the new IDs of the inserted products (used to upload product images)
        `true if application successfully submitted, false otherwise`
        

* GET `/manager/applications/pending`
    * GET all the pending farmer applications
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.application_id,
            name: p.farmer_name,
            surname: p.farmer_surname,
            email: p.farmer_email,
            phone: p.farmer_phone,
            description: p.farmer_description,
            country: p.farmer_country,
            region: p.farmer_region,
            city: p.farmer_city,
            address: p.farmer_address,
            zip: p.farmer_zipcode,
            location: p.farmer_city + ', ' + p.farmer_region + ', ' + p.farmer_country,
            complete_address: p.farmer_address + ', ' + p.farmer_zipcode,
            date: p.application_date,
            status: pending  
        }`


* GET `/manager/applications/accepted`
    * GET all the accepted/rejected farmer applications
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `array of {
            id: p.application_id,
            name: p.farmer_name,
            surname: p.farmer_surname,
            email: p.farmer_email,
            phone: p.farmer_phone,
            description: p.farmer_description,
            country: p.farmer_country,
            region: p.farmer_region,
            city: p.farmer_city,
            address: p.farmer_address,
            zip: p.farmer_zipcode,
            location: p.farmer_city + ', ' + p.farmer_region + ', ' + p.farmer_country,
            complete_address: p.farmer_address + ', ' + p.farmer_zipcode,
            date: p.application_date,
            status: accepted or rejected  
        }`


* GET `/manager/applications/accept/:application_id`
    * Accept a farmer application given the application id
    * Request parameter: application_id
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `true if application was successfully accepted, the farmer was inserted in the users table and farmer details were registered in the providers table, false otherwise`

   
* GET `/manager/applications/reject/:application_id`
    * Reject a farmer application given the application id
    * Request parameter: application_id
    * Response: `201 OK (success) or 503 (request failed)`
    * Response body:
        `true if application was successfully rejected, false otherwise`
        
 
## API for deliverer page

* GET `/api/deliverers `
    * get all the data of all deliverers
    * Request parameter:
         `     
    * Response: `201 OK (success) or 500 
    * Response body:
     array of {
     `'id: e.id,
       username: e.username,
       city: e.city`} or

        `{
             "code":500
             "error": "Unavailable service"
         }`

* GET `/api/deliverers/{$id}`
    * get deliverer by his mail
    * Request parameter:
         `     
    * Response: `201 OK (success) or 500 
    * Response body:
      '{
     id: row.id,
              username: row.username,
              name: row.name,
              city: row.city}'

        `{
             "code":500
             "error": "Unavailable service"
         }`


* GET `/api/deliverableOrders/${city}`
    * get all the deliverable orders
    * Request parameter:
              
    * Response: `201 OK (success) or 500 
    * Response body:
    array of:
      '{
            order_id: e.order_id,
            client_id: e.client_id,
            product_name: e.product_name,
            product_id: e.product_id,
            order_quantity: e.order_quantity,
            state: e.state,
            farmer_state: e.farmer_state,
            OrderPrice: e.OrderPrice,
            id: e.id,
            address: e.address,
            city: e.city,
            zipcode: e.zipcode,
            Nation: e.Nation,
            date: e.date,
            time: e.time,
            pickup: e.pickup}'

        `{
             "code":500
             "error": "Unavailable service"
         }`


