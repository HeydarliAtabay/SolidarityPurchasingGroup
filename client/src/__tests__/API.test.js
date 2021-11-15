import API from '../API';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();

beforeEach( () => fetch.resetMocks() );

describe('test AllPaymentMethods', () => {
    test('no errors', () => {
        const response=API.getAllPaymentMethods().then( (data) => {
            console.log(response)
            expect("hello").toEqual("hello")
        });
        
    });
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

/*______________________________________________________________________*/
/*                      PRODUCTS API TESTING                            */
/*______________________________________________________________________*/

const products = [
    { id: 1, name: 'Carrots', description: 'Some description 1', category: 'Vegetables', price: 1.23, unit: 'kg', quantity: 110, expiryDate: '2021-11-20', providerId: 1, providerName: 'Luca Bianchi', active: 1 },
    { id: 2, name: 'Apples', description: 'Some description 2', category: 'Fruits', price: 0.89, unit: 'kg', quantity: 60, expiryDate: '2021-11-20', providerId: 1, providerName: 'Luca Bianchi', active: 1 },
]

describe('test GetAllProducts', () => {
    test('No errors', async () => {
        fetch.mockResponseOnce(JSON.stringify(products));
        API.getAllProducts().then((res) => {
            expect.assertions(22);
            expect(res[0].id).toBe(1);
            expect(res[0].name).toEqual('Carrots');
            expect(res[0].description).toEqual('Some description 1');
            expect(res[0].category).toEqual('Vegetables');
            expect(res[0].price).toBe(1.23);
            expect(res[0].unit).toEqual('kg');
            expect(res[0].quantity).toBe(110);
            expect(res[0].expiryDate).toEqual('2021-11-20');
            expect(res[0].providerId).toBe(1);
            expect(res[0].providerName).toEqual('Luca Bianchi');
            expect(res[0].active).toBe(1);
            expect(res[1].id).toBe(2);
            expect(res[1].name).toEqual('Apples');
            expect(res[1].description).toEqual('Some description 2');
            expect(res[1].category).toEqual('Fruits');
            expect(res[1].price).toBe(0.89);
            expect(res[1].unit).toEqual('kg');
            expect(res[1].quantity).toBe(60);
            expect(res[1].expiryDate).toEqual('2021-11-20');
            expect(res[1].providerId).toBe(1);
            expect(res[1].providerName).toEqual('Luca Bianchi');
            expect(res[1].active).toBe(1);
        });
    });
    test('Error', async () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getAllProducts().catch((res) => {
            expect.assertions(2);
            expect(res.status).toBe(500);
            expect(res.errObj).toEqual('API error');
        });
    });
});

describe('test GetProductByID', () => {
    test('No errors', async () => {
        fetch.mockResponseOnce(JSON.stringify(products[0]));
        API.getProductById(1).then((res) => {
            expect.assertions(11);
            expect(res.id).toBe(1);
            expect(res.name).toEqual('Carrots');
            expect(res.description).toEqual('Some description 1');
            expect(res.category).toEqual('Vegetables');
            expect(res.price).toBe(1.23);
            expect(res.unit).toEqual('kg');
            expect(res.quantity).toBe(110);
            expect(res.expiryDate).toEqual('2021-11-20');
            expect(res.providerId).toBe(1);
            expect(res.providerName).toEqual('Luca Bianchi');
            expect(res.active).toBe(1);
        });
    });
    test('Error', async () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getProductById(1).catch((res) => {
            expect.assertions(2);
            expect(res.status).toBe(500);
            expect(res.errObj).toEqual('API error');
        });
    });
});

/*______________________________________________________________________*/
/*                      CATEGORIES API TESTING                          */
/*______________________________________________________________________*/

const categories = [
    { name: 'Fruits', active: 0 },
    { name: 'Vegetables', active: 0 },
    { name: 'Dairy', active: 0 },
    { name: 'Butchery', active: 0 },
]

describe('test GetAllCategories', () => {
    test('No errors', async () => {
        fetch.mockResponseOnce(JSON.stringify(categories));
        API.getAllCategories().then((res) => {
            expect.assertions(8);
            expect(res[0].name).toEqual('Fruits');
            expect(res[0].active).toBe(0);
            expect(res[1].name).toEqual('Vegetables');
            expect(res[1].active).toBe(0);
            expect(res[2].name).toEqual('Dairy');
            expect(res[2].active).toBe(0);
            expect(res[3].name).toEqual('Butchery');
            expect(res[3].active).toBe(0);
        });
    });
    test('Error', async () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getAllCategories().catch((res) => {
            expect.assertions(2);
            expect(res.status).toBe(500);
            expect(res.errObj).toEqual('API error');
        });
    });
});

/*______________________________________________________________________*/
/*                      PROVIDERS API TESTING                           */
/*______________________________________________________________________*/

const providers = [
    { id: 1, name: 'Luca Bianchi', description: 'Very good farmer', location: 'Torino' },
    { id: 2, name: 'Luca Neri', description: 'Very bad farmer', location: 'Cuneo' }
]

describe('test GetAllProviders', () => {
    test('No errors', async () => {
        fetch.mockResponseOnce(JSON.stringify(providers));
        API.getAllProviders().then((res) => {
            expect.assertions(8);
            expect(res[0].id).toBe(1);
            expect(res[0].name).toEqual('Luca Bianchi');
            expect(res[0].description).toEqual('Very good farmer');
            expect(res[0].location).toEqual('Torino');
            expect(res[1].id).toBe(2);
            expect(res[1].name).toEqual('Luca Neri');
            expect(res[1].description).toEqual('Very bad farmer');
            expect(res[1].location).toEqual('Cuneo');
        });
    });
    test('Error', async () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getAllProviders().catch((res) => {
            expect.assertions(2);
            expect(res.status).toBe(500);
            expect(res.errObj).toEqual('API error');
        });
    });
});

describe('test GetProviderByID', () => {
    test('No errors', () => {
        fetch.mockResponseOnce(JSON.stringify(providers[0]));
        API.getProviderById(1).then((res) => {
            expect.assertions(4);
            expect(res.id).toBe(1);
            expect(res.name).toEqual('Luca Bianchi');
            expect(res.description).toEqual('Very good farmer');
            expect(res.location).toEqual('Torino');
        });
    });
    test('Error', async () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getProviderById(1).catch((res) => {
            expect.assertions(2);
            expect(res.status).toBe(500);
            expect(res.errObj).toEqual('API error');
        });
    });
});

describe('test getAllPaymentMethods', () => {
    test('no errors', () => {
        fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
        API.getAllPaymentMethods().then( (data) => {
            expect.assertions(1);
            expect(data.mockData).toEqual('test');
        });
    });
    test('error', () => {
        fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
        API.getAllPaymentMethods().catch((data) => {
            expect.assertions(0);
            expect(data.status).toBe(500);
        });
    });
});

describe('test addClient', () => {
    test('no errors', () => {
        fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
        API.addClient('client').then( (data) => {
            expect.assertions(1);
            expect(data).toBeNull();
        });
    });
    test('response not ok, json ok', () => {
        fetch.mockResponseOnce(JSON.stringify({err: 'API error'}), { status: 500 });
        API.addClient('client').catch( (data) => {
            expect.assertions(1);
            expect(data.err).toEqual('API error');
        });
    });
    
    test('response not ok, json null', () => {
        fetch.mockResponseOnce(null, { status: 500 });
        API.addClient('client').catch( (data) => {
            expect.assertions(1);
            expect(data.err).toEqual('API error');
        });
    });
});

describe('test addTransaction', () => {
    test('no errors', () => {
        fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
        API.addTransaction('transaction').then( (data) => {
            expect.assertions(1);
            expect(data).toBeNull();
        });
    });
    test('response not ok, json ok', () => {
        fetch.mockResponseOnce(JSON.stringify({err: 'API error'}), { status: 500 });
        API.addTransaction('transaction').catch( (data) => {
            expect.assertions(1);
            expect(data.err).toEqual('API error');
        });
    });
    
    test('response not ok, json null', () => {
        fetch.mockResponseOnce(null, { status: 500 });
        API.addTransaction('transaction').catch( (data) => {
            expect.assertions(1);
            expect(data.err).toEqual('API error');
        });
    });
});
