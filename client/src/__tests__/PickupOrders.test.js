import React from 'react';
import {  render, fireEvent, screen } from '@testing-library/react';
import PickupOrders from '../Components/PickupOrders'
import dayjs from 'dayjs'; 
/*TEST DATA*/
const testOrders = [{ order_id: 1, client_id: 2, product_name: "carrots",product_id:1,order_quantity:1,state:"booked",farmer_state:null,OrderPrice: 1.23, id:1,address:"via Legnano",city:"torino",zipcode:10155, Nation:"Italy",date:"2021-12-21",time:"11:00",pickup:1 }];

const testClients = [{ client_id: 2, budget:0, name: "Alan", surname: "Green", gender: 1, birthday: "1995-01-15", country: "Italy",region: "Piemonte",address: "Via Gardena 19",city: "Torino"}];
const missed =[ { order_id: 2, client_id: '2'}];
 
test('Renders Correctly the past pickups for a  manager', () => { 
const renderResult = render(<PickupOrders orders={testOrders} missed={missed} clients={testClients}/>);
    expect(renderResult.getByText("Pickups")).toBeInTheDocument();
    expect(renderResult.getByText("Below you can find all the past pickups. Please mark as missed the ones that were not picked up.")).toBeInTheDocument();
    expect(renderResult.getByText("Order ID")).toBeInTheDocument();
    expect(renderResult.getByText("Client")).toBeInTheDocument();
    expect(renderResult.getByText("Total")).toBeInTheDocument();
    expect(renderResult.getByText("Date & Time")).toBeInTheDocument();
    expect(renderResult.getByText('Action')).toBeInTheDocument();
    expect(renderResult.getByText('1')).toBeInTheDocument();
    expect(renderResult.getByText('Alan Green')).toBeInTheDocument();
    expect(renderResult.getByText("1.23€")).toBeInTheDocument();
    expect(renderResult.getByText("Tue, Dec 21, 2021 11:00")).toBeInTheDocument();
    expect(renderResult.getByText("Mark as missed")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Mark as missed'));
});
