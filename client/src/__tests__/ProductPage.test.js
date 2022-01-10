import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductPage from '../Components/ProductPage'

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

function onAdd(a, b){
    return 0;
}

function setShowProductDetailsModal(){
    return 0;
}

test('Renders Frontpage correctly', () => {
    const renderResult = render(<ProductPage onAdd={onAdd} setShowProductDetailsModal={setShowProductDetailsModal} prod={product} operationType="booking"/>);
    expect(renderResult.getByText("Some description 1")).toBeInTheDocument();
    expect(renderResult.getByText("Vegetables")).toBeInTheDocument();
    expect(renderResult.getByText("Quantity")).toBeInTheDocument();
    expect(renderResult.getByText("+")).toBeInTheDocument();
    expect(renderResult.getByText("-")).toBeInTheDocument();
    expect(renderResult.getByText("1.23 €/kg")).toBeInTheDocument();
    expect(renderResult.getByText("110 kg available")).toBeInTheDocument();
    expect(renderResult.getByText("Add to basket")).toBeInTheDocument();

    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Add to basket'));

});
