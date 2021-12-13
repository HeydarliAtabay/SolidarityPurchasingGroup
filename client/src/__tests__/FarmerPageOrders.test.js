import React from 'react';
import {  render } from '@testing-library/react';
import Fbookings from '../Components/FarmerPageOrders'
import dayjs from 'dayjs';
/*TEST DATA*/
const testOrders = [{ order_id: 1, client_id: 2, product_name: "fennels",product_id:2,order_quantity:1,state:"booked",farmer_state:null,OrderPrice: 20, id:1,address:"via Legnano",city:"torino",zipcode:10155, Nation:"Italy",date:"2021-12-21",time:"11:00" }];
const time=[{ date: dayjs("2021-12-21") , hour: dayjs("10:50") }];
/*
test('Renders Correctly the bookings for a  farmer', () => { 
const renderResult = render(<Fbookings orders={testOrders} time={time}/>);
    expect(renderResult.getByText("Back to Farmer Area")).toBeInTheDocument();
    expect(renderResult.getByText("Order id")).toBeInTheDocument();
    expect(renderResult.getByText("Products")).toBeInTheDocument();
    expect(renderResult.getByText("Total")).toBeInTheDocument();
    expect(renderResult.getByText("Purchase Type")).toBeInTheDocument();
    expect(renderResult.getByText("Date & Time")).toBeInTheDocument();
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText("show" )).toBeInTheDocument();
    expect(renderResult.getByText("10.00 €")).toBeInTheDocument();
    expect(renderResult.getByText("Pick up")).toBeInTheDocument();
    expect(renderResult.getByText("2021-12-10 10:50")).toBeInTheDocument();
    

});*/
