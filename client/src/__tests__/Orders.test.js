/*import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import Orders from "../Components/Orders";
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,Link
} from 'react-router-dom';
const orders = [{ order_id: 1, client_id:2, product_name: "fennels", product_id:2, order_quantity:1, state:"booked", farmer_state:null, OrderPrice: 10, id:1, address:null, city:null, zipcode:null, nation:null, date:"2021-12-10", time:"10:50", pickup:1 }];
const products =[ { id: 2, name: 'fennels', description: 'Some description 1',category: 'Vegetables',  price: 1.23, unit: 'kg',quantity: 110, expiryDate: '2021-11-20', providerId: 1, providerName: 'Luca Bianchi', active: 1, qty: 1,}];
const userid=2;

test('Renders Orders Page correctly', () => {
    const renderResult = render(<Orders orders={orders} products={products} clientid={userid}/>);
    expect(renderResult.getByText("My Orders")).toBeInTheDocument();
    expect(renderResult.getByText("Below you can find all the orders you have placed. You can also modify an order if it has not yet been shipped by the farmer.")).toBeInTheDocument();
    expect(renderResult.getByText("Order id")).toBeInTheDocument();
    expect(renderResult.getByText('Products')).toBeInTheDocument();
    expect(renderResult.getByText('Total')).toBeInTheDocument();
    expect(renderResult.getByText('Payment status')).toBeInTheDocument();
    expect(renderResult.getByText('Purchase Type')).toBeInTheDocument();
    expect(renderResult.getByText('Date & Time')).toBeInTheDocument();
    expect(renderResult.getByText('Actions')).toBeInTheDocument();
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText('Show ordered products')).toBeInTheDocument();
    expect(renderResult.getByText("10.00€")).toBeInTheDocument();
    expect(renderResult.getByText("Payment successfull")).toBeInTheDocument();
    expect(renderResult.getByText("Pick up")).toBeInTheDocument();
    expect(renderResult.getByText("Fri, Dec 10, 2021 10:50")).toBeInTheDocument();
    expect(renderResult.getByText("Track order status")).toBeInTheDocument();
    expect(renderResult.getByText("Modify order")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Track order status'));
    fireEvent.click(screen.getByText('Modify order'));
   

   
});
*/
