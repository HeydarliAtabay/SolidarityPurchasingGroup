function client(client_id,budget){
    this.client_id=client_id; 
    this.budget=budget;
    
    }
function clientOrders(order_id,client_id,product_name,state){
    this.order_id=order_id; 
    this.client_id=client_id; 
    this.product_name=product_name;
    this.state=state;
    }
export  {client,clientOrders};