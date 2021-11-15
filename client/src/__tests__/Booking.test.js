import React from 'react';
import {
  fireEvent,
  render,
  findByText,
  getByText,
  waitFor,
  screen,
} from '@testing-library/react';
import Booking from '../Components/Booking';
import { Card } from 'react-bootstrap';

const isEmployeeF = false;
const isEmployeeT = true;
const product = {
  id: 1,
  name: 'Carrots',
  description: 'Some description 1',
  category: 'Vegetables',
  price: 1.23,
  unit: 'kg',
  quantity: 110,
  expiryDate: '2021-11-20',
  providerId: 1,
  providerName: 'Luca Bianchi',
  active: 1,
  qty: 1,
};
const clients = [
  {
    client_id: 1,
    name: 'NameTest',
    surname: 'SurnameTest',
    email: 'test@gmail.com',
  },
];

test('Render Booking Correctly', () => {
  const renderResult = render(
    <Booking isEmployee={isEmployeeF} products={product} />
  );
  expect(renderResult.getByText('Product Booking')).toBeInTheDocument();
  expect(
    renderResult.getByText(
      'Choose below the products you want to book for the client'
    )
  ).toBeInTheDocument();
  expect(renderResult.getByText('Basket:')).toBeInTheDocument();
  expect(renderResult.getByText('Cart is Empty')).toBeInTheDocument();
});
test('Render StaffBooking Correctly', () => {
  const renderResult = render(
    <Booking isEmployee={isEmployeeT} products={product} clients={clients} />
  );
  expect(renderResult.getByText('Product Booking')).toBeInTheDocument();
  expect(
    renderResult.getByText('Select the desired client')
  ).toBeInTheDocument();
  const renderDropdown = renderResult.getByText('Select the desired client');
});
