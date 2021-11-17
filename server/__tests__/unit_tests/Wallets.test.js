'use strict';

const express = require('express');
const morgan = require('morgan'); //
const WalletService = require('../../DAOs/wallet-dao.js');
const httpMocks = require('node-mocks-http');


// init express
let app = express();
app.disable("x-powered-by");
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());


jest.mock('../../DAOs/wallet-dao.js');

const methods = [
  {method_id: '1', method_name: 'Credit card',approval_time:"1 days"},
  {method_id: '2', method_name: 'Satispay',approval_time:"0 days"},
  {method_id: '3', method_name: 'Bank Transfer',approval_time:"2 days"}
];

const transactions = [
  {
    transaction_id: 1,
    type: 'top-up',
    client_id: '1',
    method_id: '1',
    account_num: '4127856947845169',
    amount: 150,
    date: '20-11-2021 13:00',
    time: '13:00~14:30',
    status:'1'
    
  },
  {
    transaction_id: 2,
    type: 'top-up',
    client_id: '2',
    method_id: '2',
    account_num: '4127856947845169',
    amount: 100,
    date: '20-11-2021 13:00',
    time: '13:00~14:30',
    status:'1'
    
  },
];
/* ============================================================================
                        TEST GETlistallPaymentMethods
============================================================================*/

test('get all payment methods', () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});

  WalletService.listAllPaymentMethods.mockImplementation(() => {
    return Promise.resolve(methods);
  });

app.get('/api/methods', (req, res) => {
        WalletService
          .listAllPaymentMethods()
          .then((methods) => {
            res.json(methods);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
          expect(methods[0]).toEqual([
            {method_id: '1', method_name: 'Credit/debit card',approval_time:"In a minute"},
          ]);
      });
});

test('get all payment methods but an error occours in db', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
  
    WalletService.listAllPaymentMethods.mockImplementation(() => {
        return Promise.reject('some type of error');
      });
  
    app.get('/api/methods', (req, res) => {
        WalletService
          .listAllPaymentMethods()
          .then((methods) => {
            res.json(methods);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
          expect.assertions(1);
          expect(data).toEqual(
              {errors: [{'param': 'Server', 'msg': 'some type of error'}]},
          );
      });
  });

  test('get all payment methods but empty', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
  
    WalletService.listAllPaymentMethods.mockImplementation(() => {
      return Promise.resolve(methods);
    });
  
    app.get('/api/methods', (req, res) => {
        WalletService
          .listAllPaymentMethods()
          .then((methods) => {
            res.json(methods);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
          expect.assertions(1);
          expect(data).toEqual(
              {errors: [{'param': 'Server', 'msg': 'some type of error'}]},
          );
      });
  });

  /* ============================================================================
                        TEST apiTransactionPOST
============================================================================*/

test('add new transaction', () => {
    const req = httpMocks.createRequest({body:transactions[0]});
    const res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
  
    WalletService.createTransaction.mockImplementation(() => Promise.resolve());
  
        app.post('/api/transactions', (req, res) => {
            const transaction = req.body;
            if (!transaction) {
              res.status(400).end();
            } else {
              WalletService
                .createTransaction(transaction)
                .then((id) => res.status(201).json({ id: id }))
                .catch((err) => res.status(500).json(error));
            }
            expect.assertions(1);
            expect(res.status).toEqual(
                { id: id },
            );
          });
  });
  
  test('add a transaction but an error in db occours when finding it', () => {
    const req = httpMocks.createRequest({body:transactions[0]});
    const res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
  
    WalletService.createTransaction.mockImplementation((req) => Promise.resolve());
  
    app.post('/api/transactions', (req, res) => {
        const transaction = req.body;
        if (!transaction) {
          res.status(400).end();
        } else {
          WalletService
            .createTransaction(transaction)
            .then((id) => res.status(201).json({ id: id }))
            .catch((err) => res.status(500).json(error));
        }
        expect.assertions(1);
        expect(res.status).toEqual(
            {errors: [{'msg': 'some type of error'}]},
        );
      });
  });