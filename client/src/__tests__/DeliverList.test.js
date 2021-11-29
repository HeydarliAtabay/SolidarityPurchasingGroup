import React from 'react';
import {  render, fireEvent,screen } from '@testing-library/react';
import  DeliverList from '../Components/DeliverList'
          
const testOrders = [{ order_id: 1, client_id: 1, product_name: "fennels",product_id:2,order_quantity:1,state:"booked",farmer_state:null,OrderPrice: 20, id:1,address:null,city:null,zipcode:0, Nation:null,date:null,time:null }];
const clients = [{ client_id: 2, budget:0, name: "Atabay", surname: "Heydarli", gender: 1, birthday: "1999-01-15", country: "Italy",
region: "Piemonte",address: "Via Gambasca 19",city: "Torino"}];
test('Renders list of products to deliver Correctly', () => {
    const renderResult=render(<DeliverList orders={testOrders} b={"booked"} client={1} clients={clients} />);
    const A = document.querySelector("[data-testid=im]");
    expect(renderResult.getByText('ORDER_ID')).toBeInTheDocument();
    expect(renderResult.getByText('CLIENT_ID')).toBeInTheDocument();
    expect(renderResult.getByText("PRODUCTS")).toBeInTheDocument();
    expect(renderResult.getByText("TOTAL")).toBeInTheDocument();
    expect(renderResult.getByText('DELIVER')).toBeInTheDocument();
    expect(renderResult.getByText('Close')).toBeInTheDocument();
    expect(renderResult.getByText('show')).toBeInTheDocument();
    expect(renderResult.getByText('20 €')).toBeInTheDocument();

   
    
});
