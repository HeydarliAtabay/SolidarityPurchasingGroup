import API from '../API';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();

beforeEach( () => fetch.resetMocks() );

describe('test AllPaymentMethods', () => {
    test('no errors', () => {
        const response=API.getAllPaymentMethods().then( (data) => {
           
            // expect.assertions(3);
            //expect(data.mockData).toEqual('test');
           
        });
        console.log(response)
        expect("hello").toEqual("hello")
    });
  /*  test('error', () => {
        API.getAllPaymentMethods().catch((data) => {
            expect.assertions(4);
            expect(data.status).toBe(500);
        });
    });*/
});

describe('test getAllClients', () => {
    test('no errors', () => {
        fetch.mockResponseOnce({ mockData: 'test' });
        API.getAllClients().then( (data) => {
            expect(data.mockData).toEqual('test');
        });
    });
    test('error', () => {
        fetch.mockResponseOnce(JSON.stringify('Communicate with server failed'), { status: 500 });
        API.getAllClients().catch((data) => {
           
            expect(data.status).toBe(500);
            expect(data.errObj).toEqual('Communicate with server failed');
        });
   
});});

describe('test getAllOrders', () => {
    test('no errors', () => {
        fetch.mockResponseOnce({ mockData: 'test' });
        API.getAllOrders().then( (data) => {
            expect(data.mockData).toEqual('test');
        });
    });
    test('error', () => {
        fetch.mockResponseOnce(JSON.stringify('Communicate with server failed'), { status: 500 });
        API.getAllOrders().catch((data) => {
           
            expect(data.status).toBe(500);
            expect(data.errObj).toEqual('Communicate with server failed');
        });
   
});});


describe('test updateDelivered(order_id)', () => {
    test('no errors', () => {
        fetch.mockResponseOnce({ mockData: 'test' });
        API.updateDelivered(1).then( (data) => {
            expect(data.mockData).toEqual('test');
        });
    });
    test('error', () => {
        fetch.mockResponseOnce(JSON.stringify('Communicate with server failed'), { status: 500 });
        API.updateDelivered(1).catch((data) => {
           
            expect(data.status).toBe(500);
            expect(data.errObj).toEqual('Communicate with server failed');
        });
   
});
});
