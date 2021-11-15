import  DeliverList from '../Components/DeliverList'
import  EmployeePage from '../Components/EmployeePage'


const testOrders = [{ order_d: 1, client_id: 1, product_name: "fennels",state:"booked" }];
    test('Renders button to show products Correctly', () => {
    const renderResult=render(<EmployeePage orders={testOrders}  />);
    expect(renderResult.getByText("Show products to be delivered")).toBeInTheDocument();
   
});
test('Renders list of products to deliver Correctly', () => {
    const renderResult=render(<DeliverList orders={testOrders} b={"booked"} />);
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText(1)).toBeInTheDocument();
    expect(renderResult.getByText("fennels")).toBeInTheDocument();
    
});
