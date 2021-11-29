import React from 'react';
import {  render, fireEvent,screen } from '@testing-library/react';
import  PickupList from '../Components/PickupList'
          
const testOrders = [{ order_id: 1, client_id: 1, product_name: "fennels", product_id:2, order_quantity:1, state:"booked", farmer_state:null, OrderPrice: 10, id:1, address:null, city:null, zipcode:null, nation:null, date:"2021-12-10", time:"10:50", pickup:1 }];
const clients = [{ client_id: 2, budget:0, name: "Atabay", surname: "Heydarli", gender: 1, birthday: "1999-01-15", country: "Italy",
region: "Piemonte", address: "Via Gambasca 19", city: "Torino"}];
test('Renders the list of products to be picked up correctly', () => {
    const renderResult = render(<PickupList orders = {testOrders} b = {"booked"} client = {1} clients = {clients} />);
    const A = document.querySelector("[data-testid=im]");
    expect(renderResult.getByText('Order ID')).toBeInTheDocument();
    expect(renderResult.getByText('Client ID')).toBeInTheDocument();
    expect(renderResult.getByText("Products")).toBeInTheDocument();
    expect(renderResult.getByText("TOTAL")).toBeInTheDocument();
    expect(renderResult.getByText('Confirm Preparation')).toBeInTheDocument();
    expect(renderResult.getByText('Close')).toBeInTheDocument();

   
});

const testOrders1 = [{ order_id: 1, client_id: 1, product_name: "fennels", product_id:2, order_quantity:1, state:"booked", farmer_state:null, OrderPrice: 10, id:1, address:null, city:null, zipcode:null, nation:null, date:"2021-12-10", time:"10:50", pickup:1 }];
const clients1 = [{ client_id: 2, budget:50, name: "Atabay", surname: "Heydarli", gender: 1, birthday: "1999-01-15", country: "Italy",
region: "Piemonte", address: "Via Gambasca 19", city: "Torino"}];
test('Renders the list of products to be picked up correctly with sufficient budget', () => {
    const renderResult1 = render(<PickupList orders = {testOrders1} b = {"booked"} client = {1} clients = {clients1} />);
    const A1 = document.querySelector("[data-testid=im]");
    expect(renderResult1.getByText('Order ID')).toBeInTheDocument();
    expect(renderResult1.getByText('Client ID')).toBeInTheDocument();
    expect(renderResult1.getByText("Products")).toBeInTheDocument();
    expect(renderResult1.getByText("TOTAL")).toBeInTheDocument();
    expect(renderResult1.getByText('Confirm Preparation')).toBeInTheDocument();
    expect(renderResult1.getByText('Close')).toBeInTheDocument();

   
});