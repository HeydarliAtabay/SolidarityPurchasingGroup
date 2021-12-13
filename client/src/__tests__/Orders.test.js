import React from 'react';
import { render} from '@testing-library/react';
import Orders from "../Components/Orders";
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,Link
} from 'react-router-dom';
const orders = [{ order_id: 1, client_id:2, product_name: "fennels", product_id:2, order_quantity:1, state:"booked", farmer_state:null, OrderPrice: 10, id:1, address:null, city:null, zipcode:null, nation:null, date:"2021-12-10", time:"10:50", pickup:1 }];

const userid=2;

test('Renders Orders Page correctly', () => {
    const renderResult = render(<Orders  orders={orders} clientid={userid}/>);
    expect(renderResult.getByText("Order id")).toBeInTheDocument();
    expect(renderResult.getByText("Products")).toBeInTheDocument();
    expect(renderResult.getByText("Total")).toBeInTheDocument();
    expect(renderResult.getByText("Purchase Type")).toBeInTheDocument();
    expect(renderResult.getByText("Date & Time")).toBeInTheDocument();
    expect(renderResult.getByText("Status")).toBeInTheDocument();
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText("show / edit")).toBeInTheDocument();
    expect(renderResult.getByText("10.00 €")).toBeInTheDocument();
    expect(renderResult.getByText("Pick up")).toBeInTheDocument();
    expect(renderResult.getByText("2021-12-10 10:50")).toBeInTheDocument();
    expect(renderResult.getByText("booked")).toBeInTheDocument();
    
   
});
