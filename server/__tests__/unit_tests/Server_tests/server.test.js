const request = require("supertest");
const server = require("./../../../server");

describe("Test the products/all path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/products/all");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the product/:product_id path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/product/1");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the products/categories path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/products/categories");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the providers/all path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/providers/all");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the provider/:product_id path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/provider/1");
        expect(response.statusCode).toBe(200);
    });
});
describe("Test the clients path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/clients");
        expect(response.statusCode).toBe(200);
    });
});
describe("Test the orders path", () => {
    test("It should response the GET method", async () => {
        const response = await request(server).get("/api/orders");
        expect(response.statusCode).toBe(200);
    });
});
describe("Test the update orders", () => {
    test("It should response the PUT method", async () => {
        const response = await request(server).put("/api/orders/1");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test to get all payment methods", () => {
    test("It should response the PUT method", async () => {
        const response = await request(server).get("/api/methods");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test increasing the balance of client", () => {
    test("It should response the PUT method", async () => {
        const response = await request(server).put("/api/clients/update/balance/1/15");
        expect(response.statusCode).toBe(200);
    });
});