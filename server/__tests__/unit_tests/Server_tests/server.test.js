const request = require("supertest");
const server = require("./../../../server");

describe("Test the products/all path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/products/all").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test the product/:product_id path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/product/1").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test the products/categories path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/products/categories").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test the providers/all path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/providers/all").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test the provider/:product_id path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/provider/1").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
describe("Test the clients path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/clients").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
describe("Test the orders path", () => {
    test("It should response the GET method", () => {
        request(server).get("/api/orders").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
describe("Test the update orders", () => {
    test("It should response the PUT method", () => {
        request(server).put("/api/orders/1").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test to get all payment methods", () => {
    test("It should response the PUT method", () => {
        request(server).get("/api/methods").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test increasing the balance of client", () => {
    test("It should response the PUT method", () => {
        request(server).put("/api/clients/update/balance/1/15").then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test the provider /api/modifyquantity', () => {
    test('It should response the PUT method', () => {
        request(server).put('/api/modifyquantity');
        expect(response.statusCode).toBe(200);
        done();
    });
});

describe('Test the provider /api/neworder path', () => {
    test('It should response the POST method', () => {
        request(server).post('/api/neworder');
        expect(response.statusCode).toBe(200);
        done();
    });
});


describe('Test the provider /api/sendEmail', () => {
    test('It should response the POST method', () => {
        request(server).post('/api/sendEmail');
        expect(response.statusCode).toBe(200);
        done();
    });
});
