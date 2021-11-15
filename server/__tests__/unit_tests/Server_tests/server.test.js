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