import React from 'react';
import {  render, fireEvent, screen } from '@testing-library/react';
import  DeliverList from '../Components/DeliverList'
          
const orders = [{ order_id: 1, client_id:2, product_name: "fennels", product_id:2, order_quantity:1, state:"booked", farmer_state:null, OrderPrice: 10, id:1, address:null, city:null, zipcode:null, nation:null, date:"2021-12-10", time:"10:50", pickup:1 }];
const clients = [{ client_id: 2, budget:0, name: "Alan", surname: "Green", gender: 1, birthday: "1995-01-15", country: "Italy",region: "Piemonte",address: "Via Gardena 19",city: "Torino",phone:"+3900000",email:"alan.green@yahoo.it",}];
const time=[{ date: "2021-12-21" , hour: "11:00" }];
const products =[ { id: 2, name: 'fennels', description: 'Some description 1',category: 'Vegetables',  price: 1.23, unit: 'kg',quantity: 110, expiryDate: '2021-11-20', providerId: 1, providerName: 'Luca Bianchi', active: 1, qty: 1,}];
const methods=[];
test('Renders list of products to deliver Correctly', () => {
    const renderResult=render(<DeliverList orders={orders} mail={"alan.green@yahoo.it"} methods={methods} time={time} products={products} client={1} clients={clients} />);
    
    expect(renderResult.getByText('Order id')).toBeInTheDocument();
    expect(renderResult.getByText('Client')).toBeInTheDocument();
    expect(renderResult.getByText("Products")).toBeInTheDocument();
    expect(renderResult.getByText('Total')).toBeInTheDocument();
    expect(renderResult.getByText('Order status')).toBeInTheDocument();
    expect(renderResult.getByText('Delivery Type')).toBeInTheDocument();
    expect(renderResult.getByText('Date & Time')).toBeInTheDocument();
    expect(renderResult.getByText('Action')).toBeInTheDocument();
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText("Alan Green")).toBeInTheDocument();
    expect(renderResult.getByText('Show ordered products')).toBeInTheDocument();
    expect(renderResult.getByText("10.00€")).toBeInTheDocument();
    expect(renderResult.getByText("Payment completed")).toBeInTheDocument();
    expect(renderResult.getByText("Pick up")).toBeInTheDocument();
    expect(renderResult.getByText("Fri, Dec 10, 2021 10:50")).toBeInTheDocument();
  
  

   
    
});

