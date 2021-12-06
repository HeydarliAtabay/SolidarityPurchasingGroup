const request = require("supertest");
const server = require("./../../../server");

server.setTestingMode('spg_test.db');

// describe("Test the products/all path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/products/all").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test the product/:product_id path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/product/1").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test the products/categories path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/products/categories").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test the providers/all path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/providers/all").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test the provider/:product_id path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/provider/1").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });
// describe("Test the clients path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/clients").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });
// describe("Test the orders path", () => {
//     test("It should response the GET method", () => {
//         request(server).get("/api/orders").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });
// describe("Test the update orders", () => {
//     test("It should response the PUT method", () => {
//         request(server).put("/api/orders/1/carrots").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test to get all payment methods", () => {
//     test("It should response the PUT method", () => {
//         request(server).get("/api/methods").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe("Test increasing the balance of client", () => {
//     test("It should response the PUT method", () => {
//         request(server).put("/api/clients/update/balance/1/15").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/modifyquantity', () => {
//     test('It should response the PUT method', () => {
//         request(server).put('/api/modifyquantity').then(response => {
//         expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/neworder path', () => {
//     test('It should response the POST method', () => {
//         request(server).post('/api/neworder').then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });


// describe('Test the provider /api/sendEmail', () => {
//     test('It should response the POST method', () => {
//         request(server).post('/api/sendEmail').then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// const productIDS = [1, 2, 3];

// describe('Test the provider /api/orders/farmershipped', () => {
//     test('It should response the POST method', () => {
//         request(server).post('/api/orders/farmershipped').set('Content-Type', 'application/json').send(JSON.stringify(productIDS)).end((error, response) => {
//                 expect(response.statusCode).toBe(200);
//             });
//     });
// });

// describe('Test the provider /api/products/confirmed/:year/:week', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/products/confirmed/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/products/expected/:year/:week', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/products/expected/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/products/ordered/:year/:week_number', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/products/ordered/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/provider/:provider_id/products', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/provider/:provider_id/products').then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/provider/confirmationStatus/:year/:week_number', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/provider/confirmationStatus/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/products/provider/expected/:year/:week_number', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/products/provider/expected/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/provider/shipmentstatus/:year/:week_number', () => {
//     test('It should response the GET method', () => {
//         request(server).get('/api/provider/shipmentstatus/' + 2021 + '/' + 20).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// const expectedProducts = [];

// describe('Test the provider /api/products/expected/:year/:week_number', () => {
//     test('It should response the POST method', () => {
//         request(server).post('/api/products/expected/' + 2021 + '/' + 20).send(JSON.stringify(expectedProducts)).then(response => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });
// describe("Test the delete path", () => {
//     test("It should response the delete method", () => {
//         request(server).delete("/api/orders/100000").then((response) => {
//             expect(response.statusCode).toBe(204);
//             done();
//         });
//     });
// });

// // describe("Test the add of order item", () => {
// //     test("It should response the post method", () => {
// //         request(server).post("/api/orders").then((response) => {
// //             expect(response.statusCode).toBe(200);
// //             done();
// //         });
// //     });
// // });

// describe("Test the login path", () => {
//     test("It should response the get method", () => {
//         request(server).get("/api/sessions/current").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });
// describe("Test the login path", () => {
//     test("It should response the delete method", () => {
//         request(server).delete("/api/sessions/current").then((response) => {
//             expect(response.statusCode).toBe(200);
//             done();
//         });
//     });
// });

// describe('Test the provider /api/orderinsert', () => {
//     test('It should response the POST method', () => {
//         request(server).post('/api/orderinsert').send(JSON.stringify({})).then(response => {
//             expect(response.statusCode).toBe(503);
//             done();
//         });
//     });
// });
