import React from 'react';
import { render} from '@testing-library/react';
import Orders from "../Components/Orders";

const orders = [{ order_id: 1, client_id: 2, product_name: "fennels",state:"booked",OrderPrice: 20, id:1 }];
const userid=2;
test('Renders Orders page correctly', () => {
 const renderResult = render( <Orders
            orders={orders}
              clientid={userid}
            />);
    expect(renderResult.getByText("Make a new Order")).toBeInTheDocument();
    expect(renderResult.getByText("Back to my Area")).toBeInTheDocument();
   expect(renderResult.getByText("List of my booked orders")).toBeInTheDocument();
    expect(renderResult.getByText("ORDER_ID: 1")).toBeInTheDocument();
    expect(renderResult.getByText("show products")).toBeInTheDocument();
     expect(renderResult.getByText("TOTAL: 20 €")).toBeInTheDocument(); 
   
});