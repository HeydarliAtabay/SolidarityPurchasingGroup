

import React from 'react';
import {  render } from '@testing-library/react';
import ClientAlert from '../Components/ClientAlert'

/*TEST DATA*/
const testOrders = [{ order_id: 1, client_id: 2, product_name: "fennels",product_id:2,order_quantity:1,state:"booked",farmer_state:null,OrderPrice: 20, id:1,address:null,city:null,zipcode:0, Nation:null,date:null,time:null }];
const testClients = [{ client_id: 2, budget:0, name: "Alan", surname: "Green", gender: 1, birthday: "1995-01-15", country: "Italy",region: "Piemonte",address: "Via Gardena 19",city: "Torino"}];
const testUserid=2;

test('Renders Correctly the client Reminder', () => { 
const renderResult = render(<ClientAlert clients={testClients} orders={testOrders} clientid={testUserid}/>);
const AlertH = document.querySelector("[data-testid=alertH]");
const Alert = document.querySelector("[data-testid=alert]");
expect(AlertH.innerHTML).toBe("-ATTENTION-");
expect(Alert.innerHTML).toBe("Your wallet balance is insufficient. Please top it up!");

});
