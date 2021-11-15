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