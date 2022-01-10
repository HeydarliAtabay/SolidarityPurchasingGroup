import API from '../API';
import fetchMock from 'jest-fetch-mock';
import dayjs from 'dayjs';

fetchMock.enableMocks();

beforeEach(() => fetch.resetMocks());

/*______________________________________________________________________*/
/*                      PRODUCTS API TESTING                            */
/*______________________________________________________________________*/

const products = [
  {
    id: 1,
    name: 'Carrots',
    description: 'Some description 1',
    category: 'Vegetables',
    price: 1.23,
    unit: 'kg',
    quantity: 110,
    expiryDate: '2021-11-20',
    providerId: 1,
    providerName: 'Luca Bianchi',
    active: 1,
  },
  {
    id: 2,
    name: 'Apples',
    description: 'Some description 2',
    category: 'Fruits',
    price: 0.89,
    unit: 'kg',
    quantity: 60,
    expiryDate: '2021-11-20',
    providerId: 1,
    providerName: 'Luca Bianchi',
    active: 1,
  },
];

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

const expectedProducts = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 'a',
    price: 1.23,
    unit: 'kg',
    quantity: 100,
    expiryDate: '',
    providerId: 1,
    providerName: 'a',
    year: 2021,
    week: 20,
    status: 'expected',
    active: 1,
  },
];

describe('test getAllExpectedProducts', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(expectedProducts));
    API.getAllExpectedProducts(2021, 20).then((res) => {
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual('a');
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(100);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021), expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('expected');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllExpectedProducts(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const confirmedProducts = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 'a',
    price: 1.23,
    unit: 'kg',
    quantity: 100,
    expiryDate: '',
    providerId: 1,
    providerName: 'a',
    year: 2021,
    week: 20,
    status: 'confirmed',
    active: 1,
  },
];

describe('test getAllConfirmedProducts', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(confirmedProducts));
    API.getAllConfirmedProducts(2021, 20).then((res) => {
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual('a');
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(100);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021);
      expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('confirmed');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllConfirmedProducts(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const orderedProducts = [
  { id: 1, name: 'a', tot_quantity: 100, unit: 'kg' },
  { id: 3, name: 'b', tot_quantity: 10, unit: 'kg' },
  { id: 5, name: 'c', tot_quantity: 1, unit: 'lt' },
];

describe('test getOrderedProductsForProvider', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(orderedProducts));
    API.getOrderedProductsForProvider(2021, 20).then((res) => {
      expect.assertions(12);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].tot_quantity).toEqual(100);
      expect(res[0].unit).toEqual('kg');
      expect(res[1].id).toBe(3);
      expect(res[1].name).toEqual('b');
      expect(res[1].tot_quantity).toEqual(10);
      expect(res[1].unit).toEqual('kg');
      expect(res[2].id).toBe(5);
      expect(res[2].name).toEqual('c');
      expect(res[2].tot_quantity).toEqual(1);
      expect(res[2].unit).toEqual('lt');
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getOrderedProductsForProvider(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test setProductsAsFarmerShipped', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(true));
    API.setProductsAsFarmerShipped([1, 2]).then((res) => {
      expect.assertions(1);
      expect(res).toBe(true);
    });
  });
  test('Error', async () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.setProductsAsFarmerShipped([1, 2]).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const availabilityIDS = [
  { old_id: 1, new_id: 50 },
  { old_id: 2, new_id: 51 },
  { old_id: 3, new_id: 52 },
];

describe('test declareAvailability', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(availabilityIDS));
    API.declareAvailability([], 2021, 20).then((res) => {
      expect.assertions(6);
      expect(res[0].old_id).toBe(1);
      expect(res[0].new_id).toBe(50);
      expect(res[1].old_id).toBe(2);
      expect(res[1].new_id).toBe(51);
      expect(res[2].old_id).toBe(3);
      expect(res[2].new_id).toBe(52);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.declareAvailability(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const formData = new FormData();

describe('test uploadProductImage', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(true));
    API.uploadProductImage(formData, 50).then((res) => {
      expect.assertions(1);
      expect(res).toBe(true);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.uploadProductImage(formData, 50).catch((res) => {
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
];

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
  {
    id: 1,
    name: 'Luca Bianchi',
    description: 'Very good farmer',
    location: 'Torino',
  },
  {
    id: 2,
    name: 'Luca Neri',
    description: 'Very bad farmer',
    location: 'Cuneo',
  },
];

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

describe('test getProviderShipmentStatus', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(true));
    API.getProviderShipmentStatus(2021, 20).then((res) => {
      expect.assertions(1);
      expect(res).toBe(true);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderShipmentStatus(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const providerExistingProducts = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 1,
    price: 1.23,
    unit: 'kg',
    quantity: 100,
    expiryDate: '',
    providerName: 'a',
    providerId: 1,
    year: 2021,
    week: 20,
    status: 'confirmed',
    active: 1,
  },
];

describe('test getProviderProducts', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(providerExistingProducts));
    API.getProviderProducts(1).then((res) => {
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual(1);
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(100);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021);
      expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('confirmed');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderProducts(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getProviderConfirmationStatus', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(true));
    API.getProviderConfirmationStatus(2021, 20).then((res) => {
      expect.assertions(1);
      expect(res).toBe(true);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderConfirmationStatus(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const providerExpectedProducts = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 1,
    price: 1.23,
    unit: 'kg',
    quantity: 100,
    expiryDate: '',
    providerName: 'a',
    providerId: 1,
    year: 2021,
    week: 20,
    status: 'expected',
    active: 1,
  },
];

describe('test getProviderExpectedProducts', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(providerExpectedProducts));
    API.getProviderExpectedProducts(2021, 20).then((res) => {
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual(1);
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(100);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021);
      expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('expected');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderExpectedProducts(2021, 20).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
const providerExpectedProducts1 = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 1,
    price: 1.23,
    unit: 'kg',
    quantity: 0,
    expiryDate: '',
    providerName: 'a',
    providerId: 1,
    year: 2021,
    week: 20,
    status: 'expected',
    active: 1,
  },
];

describe('test getProviderProductsNotification', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(providerExpectedProducts1));
    API.getProviderProductsNotification().then((res) => {
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual(1);
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(0);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021);
      expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('expected');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderProductsNotification().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
const providerExpectedProducts23 = [
  {
    id: 1,
    name: 'a',
    description: 'a',
    category: 1,
    price: 1.23,
    unit: 'kg',
    quantity: 0,
    expiryDate: '',
    providerName: 'a',
    providerId: 1,
    year: 2021,
    week: 20,
    status: 'expected',
    active: 1,
  },
];

describe('test setNotificationSent', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(providerExpectedProducts23));
    API.setNotificationasSent().then((res) => {
      console.log(res);
      expect.assertions(14);
      expect(res[0].id).toBe(1);
      expect(res[0].name).toEqual('a');
      expect(res[0].description).toEqual('a');
      expect(res[0].category).toEqual(1);
      expect(res[0].price).toBe(1.23);
      expect(res[0].unit).toEqual('kg');
      expect(res[0].quantity).toBe(0);
      expect(res[0].expiryDate).toEqual('');
      expect(res[0].providerId).toBe(1);
      expect(res[0].providerName).toEqual('a');
      expect(res[0].year).toBe(2021);
      expect(res[0].week).toBe(20);
      expect(res[0].status).toEqual('expected');
      expect(res[0].active).toBe(1);
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.setNotificationasSent(providerExpectedProducts23).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
const farmerApplication = {
  name: 'Test',
  surname: 'Test',
  email: 'test_' + '@test.it',
  phone: '+393756035254',
  country: 'Italy',
  region: 'Piedmont',
  city: 'Turin',
  address: 'Corso TEST, 123',
  zip: 10134,
  password: 'test-pass',
  description: 'I am a test farmer',
  submit_date: dayjs().format('MM-DD-YYYY HH:mm'),
};
describe('test farmerApplication', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(farmerApplication));
    API.sendFarmerApplication(farmerApplication).then((res) => {
      expect.assertions(12);
      expect(res.name).toBe('Test');
      expect(res.surname).toBe('Test');
      expect(res.email).toBe('test_@test.it');
      expect(res.phone).toBe('+393756035254');
      expect(res.country).toBe('Italy');
      expect(res.region).toBe('Piedmont');
      expect(res.city).toBe('Turin');
      expect(res.address).toBe('Corso TEST, 123');
      expect(res.zip).toBe(10134);
      expect(res.password).toBe('test-pass');
      expect(res.description).toBe('I am a test farmer');
      expect(res.submit_date).toBe(dayjs().format('MM-DD-YYYY HH:mm'));
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.sendFarmerApplication(farmerApplication).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const email = 'test_' + '@test.it';
describe('test checkEmailAvailability', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(email));
    API.checkEmailAvailability(email).then((res) => {
      expect.assertions(1);
      expect(res).toBe('test_@test.it');
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.checkEmailAvailability(email).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
const farmerPendingApplication1 = {
  name: 'Test',
  surname: 'Test',
  email: 'test_' + '@test.it',
  phone: '+393756035254',
  country: 'Italy',
  region: 'Piedmont',
  city: 'Turin',
  address: 'Corso TEST, 123',
  zip: 10134,
  password: 'test-pass',
  description: 'I am a test farmer',
  submit_date: dayjs().format('MM-DD-YYYY HH:mm'),
};
describe('test farmerPendingApplication', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(farmerPendingApplication1));
    API.getFarmerPendingApplications().then((res) => {
      expect.assertions(12);
      expect(res.name).toBe('Test');
      expect(res.surname).toBe('Test');
      expect(res.email).toBe('test_@test.it');
      expect(res.phone).toBe('+393756035254');
      expect(res.country).toBe('Italy');
      expect(res.region).toBe('Piedmont');
      expect(res.city).toBe('Turin');
      expect(res.address).toBe('Corso TEST, 123');
      expect(res.zip).toBe(10134);
      expect(res.password).toBe('test-pass');
      expect(res.description).toBe('I am a test farmer');
      expect(res.submit_date).toBe(dayjs().format('MM-DD-YYYY HH:mm'));
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getFarmerPendingApplications().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
describe('test getFarmerAcceptedApplications', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(farmerPendingApplication1));
    API.getFarmerAcceptedApplications().then((res) => {
      expect.assertions(12);
      expect(res.name).toBe('Test');
      expect(res.surname).toBe('Test');
      expect(res.email).toBe('test_@test.it');
      expect(res.phone).toBe('+393756035254');
      expect(res.country).toBe('Italy');
      expect(res.region).toBe('Piedmont');
      expect(res.city).toBe('Turin');
      expect(res.address).toBe('Corso TEST, 123');
      expect(res.zip).toBe(10134);
      expect(res.password).toBe('test-pass');
      expect(res.description).toBe('I am a test farmer');
      expect(res.submit_date).toBe(dayjs().format('MM-DD-YYYY HH:mm'));
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getFarmerAcceptedApplications().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
describe('test acceptFarmerApplication', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(farmerPendingApplication1));
    API.acceptFarmerApplication(1).then((res) => {
      expect.assertions(12);
      expect(res.name).toBe('Test');
      expect(res.surname).toBe('Test');
      expect(res.email).toBe('test_@test.it');
      expect(res.phone).toBe('+393756035254');
      expect(res.country).toBe('Italy');
      expect(res.region).toBe('Piedmont');
      expect(res.city).toBe('Turin');
      expect(res.address).toBe('Corso TEST, 123');
      expect(res.zip).toBe(10134);
      expect(res.password).toBe('test-pass');
      expect(res.description).toBe('I am a test farmer');
      expect(res.submit_date).toBe(dayjs().format('MM-DD-YYYY HH:mm'));
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.acceptFarmerApplication(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});
describe('test rejectFarmerApplication', () => {
  test('No errors', () => {
    fetch.mockResponseOnce(JSON.stringify(farmerPendingApplication1));
    API.rejectFarmerApplication(1).then((res) => {
      expect.assertions(12);
      expect(res.name).toBe('Test');
      expect(res.surname).toBe('Test');
      expect(res.email).toBe('test_@test.it');
      expect(res.phone).toBe('+393756035254');
      expect(res.country).toBe('Italy');
      expect(res.region).toBe('Piedmont');
      expect(res.city).toBe('Turin');
      expect(res.address).toBe('Corso TEST, 123');
      expect(res.zip).toBe(10134);
      expect(res.password).toBe('test-pass');
      expect(res.description).toBe('I am a test farmer');
      expect(res.submit_date).toBe(dayjs().format('MM-DD-YYYY HH:mm'));
    });
  });
  test('Error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.rejectFarmerApplication(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/*______________________________________________________________________*/
/*                      OTHER API TESTING                           */
/*______________________________________________________________________*/

const itemsOrder = {
  client_id: 1,
  order_items: {
    id: 1,
    name: 'Carrots',
    description: 'Some description 1',
    category: 'Vegetables',
    price: 1.23,
    unit: 'kg',
    quantity: 110,
    expiryDate: '2021-11-20',
    providerId: 1,
    providerName: 'Luca Bianchi',
    active: 1,
    qty: 1,
  },
  total: 1.23,
};

/* FAILS: missing mock? */
// describe('test AllPaymentMethods', () => {
//   test('no errors', () => {
//     const response = API.getAllPaymentMethods().then((data) => {
//       console.log(response);
//       expect('hello').toEqual('hello');
//     });
//   });
// });

/* FAILS: unhandled rejection*/
describe('test getAllClients', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllClients().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllClients().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test getAllOrders', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllOrders().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllOrders().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test updateDelivered(order_id)', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateDelivered(1).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateDelivered(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test getAllPaymentMethods', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllPaymentMethods().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllPaymentMethods().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test addClient', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.addClient('client').then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.addClient('client').catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test addTransaction', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.addTransaction('transaction').then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.addTransaction('transaction').catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});


const user = {
  userId: 7,
  name: 'Clare',
  email: 'clare.mint@yahoo.it',
  role: 'client',
};

/* FAILS: unhandled rejection*/
describe('test getUserInfo', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify(user));
    API.getUserInfo().then((data) => {
      console.log(data);
      expect.assertions(4);
      expect(data.userId).toEqual(7);
      expect(data.name).toEqual('Clare');
      expect(data.role).toEqual('client');
      expect(data.email).toEqual('clare.mint@yahoo.it');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getUserInfo().catch((res) => {
      console.log(res);
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test logIn', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify(user));
    API.logIn(7, 'test').then((data) => {
      expect.assertions(4);
      expect(data.userId).toEqual(7);
      expect(data.name).toEqual('Clare');
      expect(data.role).toEqual('client');
      expect(data.email).toEqual('clare.mint@yahoo.it');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.logIn(7, 'test').catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

/* FAILS: unhandled rejection*/
describe('test deleteOrderItem', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.deleteOrderItem(1).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.deleteOrderItem(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getAllUsers', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllUsers().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllUsers().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getAllProducts', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllProducts().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllProducts().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test updateWHPrepared', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateWHPrepared(1, "Tomatoes").then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateWHPrepared(1, "Tomatoes").catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test updateState', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateState(1, "delivered").then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateState(1, "delivered").catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test updateStateFarmer', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateStateFarmer(1, 1, "delivered").then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateStateFarmer(1, 1, "delivered").catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getProviderBookings', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getProviderBookings().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getProviderBookings().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test updateQuantity', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateQuantity(1, 100).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateQuantity(1, 100).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test increaseBalance', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.increaseBalance(1000, 1).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.increaseBalance(1000, 1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test confirmExpectedProducts', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.confirmExpectedProducts(1, 2021, 1).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.confirmExpectedProducts(1, 2021, 1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test logOut', () => {
  test('no errors', () => {
    API.logOut().then(() => {
      expect.assertions(0);
    });
  });
});

describe('test addUser', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.addUser(user).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.addUser(user).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const order = {
  order_id: 1,
  client_id: 1,
  product_name: "Apples",
  product_id: 1,
  order_quantity: 123,
  state: 'booked',
  OrderPrice: 1234,
  id: 1,
  address: 'address',
  city: 'city',
  zipcode: 12345,
  Nation: 'nation',
  date: 'date',
  time: 'time',
  pickup: 1,
}

describe('test addOrder', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.addOrder(order).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.addOrder(order).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const emailSubmit = {
  email: 'email',
  message: 'message',
}


describe('test submitEmail', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.submitEmail(emailSubmit).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.submitEmail(emailSubmit).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test sendTelegramNotificationOnSaturday', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.sendTelegramNotificationOnSaturday().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.sendTelegramNotificationOnSaturday().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

const telegramTopUpClient = {
  balance: 123,
  telegramId: 1,
  name: "Mario",
  surname: "Mario"
}

const telegramTopUpTransaction = {
  amount: 1432,
  date: 'date',
  time: 'time'
}

describe('test sendTelegramTopUpNotification', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.sendTelegramTopUpNotification(telegramTopUpClient, telegramTopUpTransaction).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.sendTelegramTopUpNotification(telegramTopUpClient, telegramTopUpTransaction).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test updateItem', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.updateItem(order).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.updateItem(order).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getAllDeliverers', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getAllDeliverers().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getAllDeliverers().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getDeliverableOrders', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getDeliverableOrders('Torino').then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getDeliverableOrders('Torino').catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getDelivererByMail', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getDelivererByMail(1).then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getDelivererByMail(1).catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});

describe('test getOrderAndClientData', () => {
  test('no errors', () => {
    fetch.mockResponseOnce(JSON.stringify({ mockData: 'test' }));
    API.getOrderAndClientData().then((data) => {
      expect.assertions(1);
      expect(data.mockData).toEqual('test');
    });
  });
  test('error', () => {
    fetch.mockResponseOnce(JSON.stringify('API error'), { status: 500 });
    API.getOrderAndClientData().catch((res) => {
      expect.assertions(2);
      expect(res.status).toBe(500);
      expect(res.errObj).toEqual('API error');
    });
  });
});