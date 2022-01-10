import React from 'react';
import {  render } from '@testing-library/react';
import Fbookings from '../Components/FarmerPageOrders'
import dayjs from 'dayjs';
/*TEST DATA*/
const testOrders = [{ order_id: 1, client_id: 2, product_name: "carrots",product_id:1,order_quantity:1,state:"booked",farmer_state:null,OrderPrice: 1.23, id:1,address:"via Legnano",city:"torino",zipcode:10155, Nation:"Italy",date:"2021-12-21",time:"11:00" }];
const time=[{ date: "2021-12-01" , hour: "11:00" }];
const testClients = [{ client_id: 2, budget:0, name: "Alan", surname: "Green", gender: 1, birthday: "1995-01-15", country: "Italy",region: "Piemonte",address: "Via Gardena 19",city: "Torino"}];
const products =[ { id: 1, name: 'carrots', description: 'Some description 1',category: 'Vegetables',  price: 1.23, unit: 'kg',quantity: 110, expiryDate: '2021-11-20', providerId: 1, providerName: 'Luca Bianchi', active: 1, qty: 1,}];
 
test('Renders Correctly the bookings for a  farmer', () => { 
const renderResult = render(<Fbookings orders={testOrders} time={time}products={products} providerid={1}clients={testClients}/>);
    expect(renderResult.getByText("Bookings")).toBeInTheDocument();
    expect(renderResult.getByText("Choose a date clicking on the clock up above to see only the orders of that day containing the products i can provide as a farmer")).toBeInTheDocument();
    expect(renderResult.getByText("Order ID")).toBeInTheDocument();
    expect(renderResult.getByText("Client")).toBeInTheDocument();
    expect(renderResult.getByText("Total")).toBeInTheDocument();
    expect(renderResult.getByText("Purchase Type")).toBeInTheDocument();
    expect(renderResult.getByText("Date & Time")).toBeInTheDocument();
    expect(renderResult.getByText('Action')).toBeInTheDocument();
    expect(renderResult.getByText('You have not yet received any orders for this day.')).toBeInTheDocument();
    

});
