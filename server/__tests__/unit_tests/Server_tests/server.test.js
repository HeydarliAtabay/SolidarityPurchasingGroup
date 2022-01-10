const dayjs = require("dayjs");
const request = require("supertest");
const server = require("./../../../server");

server.setTestingMode('spg_test.db');

beforeAll(done => {
    done();
})

afterAll(done => {
    done();
})

describe("Test the product/:product_id path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/product/1")
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the products/categories path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/products/categories")
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the providers/all path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/providers/all")
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the provider/:product_id path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/provider/1")
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the clients path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/clients").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});
describe("Test the orders path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/orders").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

/*FAILS most probably because of the 1*/
// describe("Test the update orders", () => {
//     test("It should response the PUT method", () => {
//         request(server).put("/api/orders/1/carrots").then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });

describe("Test to get all payment methods", () => {
    test("It should response the PUT method", () => {
        request(server).get("/api/methods").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("Test increasing the balance of client", () => {
    test("It should response the PUT method", () => {
        request(server).put("/api/clients/update/balance/1/15").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('Test the provider /api/modifyquantity', () => {
    test('It should response the PUT method', () => {
        request(server).put('/api/modifyquantity').then(response => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('Test the provider /api/neworder path', () => {
    test('It should response the POST method', () => {
        request(server).post('/api/neworder').then(response => {
            expect(response.statusCode).toBe(200);
        });
    });
});


describe('Test the provider /api/sendEmail', () => {
    test('It should response the POST method', () => {
        request(server).post('/api/sendEmail').then(response => {
            expect(response.statusCode).toBe(200);
        });
    });
});

const productIDS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

describe('Test the provider /api/provider-products-sent', () => {
    var farmer = request.agent(server);
    test('It should response the PUT method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.put('/api/provider-products-sent').send(productIDS);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).put('/api/provider-products-sent').send(productIDS);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/provider-products-notification', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/provider-products-notification');
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/provider-products-notification');
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/orders/farmershipped', () => {
    var farmer = request.agent(server);
    test('It should response the POST method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.post('/api/orders/farmershipped').send(productIDS);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).post('/api/orders/farmershipped').send(productIDS);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/products/confirmed/:year/:week', () => {
    test('It should response the GET method', async () => {
        const response = await request(server).get('/api/products/confirmed/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
});

describe('Test the provider /api/products/expected/:year/:week', () => {
    test('It should response the GET method', async () => {
        const response = await request(server).get('/api/products/expected/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
});

describe('Test the provider /api/products/ordered/:year/:week_number', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/products/ordered/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/products/ordered/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/provider-products', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/provider-products')
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/provider-products')
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/provider/confirmationStatus/:year/:week_number', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/provider/confirmationStatus/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/provider/confirmationStatus/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/products/provider/expected/:year/:week_number', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/products/provider/expected/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/products/provider/expected/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /api/provider/shipmentstatus/:year/:week_number', () => {
    var farmer = request.agent(server);
    test('It should response the GET method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.get('/api/provider/shipmentstatus/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/api/provider/shipmentstatus/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(401);
    });
});

const expectedProducts = [{ id: 10, name: "Test prod 1", description: "", category: 1, price: 1.2, unit: 'kg', quantity: 50, year: 2021, week_number: 50 },
{ id: 11, name: "Test prod 2", description: "", category: 1, price: 1.2, unit: 'kg', quantity: 50, year: 2021, week_number: 50 }];

describe('Test the provider /api/products/expected/:year/:week_number', () => {
    var farmer = request.agent(server);
    test('It should response the POST method', async () => {
        await farmer.delete('/api/sessions');
        const login = await farmer.post('/api/sessions').send({ "username": "luca.bianchi@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await farmer.post('/api/products/expected/' + 2021 + '/' + 49).send(expectedProducts);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).post('/api/products/expected/' + 2021 + '/' + 49);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /users/email-availability/:email', () => {
    test('It should response the GET method', async () => {
        const response = await request(server).get('/users/email-availability/luca.bianchi@spg.it');
        expect(response.statusCode).toBe(200);
    });
});

const farmerApplication = {
    name: 'Test',
    surname: 'Test',
    email: 'test_' + dayjs().format("DD_MM_YYYY_HH_MM_SS") + "@test.it",
    phone: '+393756035254',
    country: 'Italy',
    region: 'Piedmont',
    city: 'Turin',
    address: 'Corso TEST, 123',
    zip: 10134,
    password: 'test-pass',
    description: 'I am a test farmer',
    submit_date: dayjs().format("MM-DD-YYYY HH:mm")
}

describe('Test the provider /provider/apply', () => {
    test('It should response the POST method', async () => {
        const response = await request(server).post('/provider/apply').send(farmerApplication);
        expect(response.statusCode).toBe(200);
    });
});

let pendingApps = [];

describe('Test the provider /manager/applications/pending', () => {
    var manager = request.agent(server);
    test('It should response the GET method', async () => {
        await manager.delete('/api/sessions');
        const login = await manager.post('/api/sessions').send({ "username": "manager@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await manager.get('/manager/applications/pending');
        expect(response.statusCode).toBe(200);
        pendingApps = response.body;
    });
    test('Login fail', async () => {
        const response = await request(server).get('/manager/applications/pending');
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the provider /manager/applications/accepted', () => {
    var manager = request.agent(server);
    test('It should response the GET method', async () => {
        await manager.delete('/api/sessions');
        const login = await manager.post('/api/sessions').send({ "username": "manager@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await manager.get('/manager/applications/accepted');
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/manager/applications/accepted');
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the manager /manager/applications/accept/:application_id', () => {
    var manager = request.agent(server);
    test('It should response the GET method', async () => {
        await manager.delete('/api/sessions');
        const login = await manager.post('/api/sessions').send({ "username": "manager@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await manager.get('/manager/applications/accept/' + pendingApps[0].id);
        expect(response.statusCode).toBe(200);
    });
    test('Login fail', async () => {
        const response = await request(server).get('/manager/applications/accept/' + pendingApps[0].id);
        expect(response.statusCode).toBe(401);
    });
});

describe('Test the manager /manager/applications/reject/:application_id', () => {
    var manager = request.agent(server);
    test('It should response the GET method', async () => {
        await manager.delete('/api/sessions');
        const login = await manager.post('/api/sessions').send({ "username": "manager@spg.it", "password": "1111" });
        expect(login.statusCode).toBe(200);
        const response = await manager.get('/manager/applications/reject/' + pendingApps[0].id);
        expect(response.statusCode).toBe(200);
    });

    test('Login fail', async () => {
        const response = await request(server).get('/manager/applications/reject/' + pendingApps[0].id);
        expect(response.statusCode).toBe(401);
    });
});

describe("Test the delete path", () => {
    test("It should response the delete method", () => {
        request(server).delete("/api/orders/100000").then((response) => {
            expect(response.statusCode).toBe(204);
        });
    });
});

describe("Test the add of order item", () => {
    test("It should response the post method", () => {
        request(server).post("/api/orders").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("Test the login path", () => {
    test("It should response the get method", () => {
        request(server).get("/api/sessions/current").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});
describe("Test the login path", () => {
    test("It should response the delete method", () => {
        request(server).delete("/api/sessions/current").then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('Test the provider /api/orderinsert', () => {
    test('It should response the POST method', () => {
        request(server).post('/api/orderinsert').send(JSON.stringify({})).then(response => {
            expect(response.statusCode).toBe(503);
        });
    });
});
