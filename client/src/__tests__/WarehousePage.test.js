import React from 'react';
import { render } from '@testing-library/react';
import WarehousePage from '../Components/WarehousePage'

test('Renders WarehousePage correctly', () => {
    const renderResult = render(<WarehousePage></WarehousePage>);
    expect(renderResult.getByText("Warehouse Personnel Area")).toBeInTheDocument();
    

});

test('Renders WarehousePage correctly', () => {
    const renderResult = render(<WarehouseManagerDashboard></WarehouseManagerDashboard>);
    expect(renderResult.getByText("MANAGER DASHBOARD")).toBeInTheDocument();
    expect(renderResult.getByText("providers avaiable on the platform")).toBeInTheDocument();
    
    

});

