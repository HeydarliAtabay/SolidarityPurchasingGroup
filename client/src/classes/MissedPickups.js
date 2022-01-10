class MPickups{
    constructor(order_id, client_id){
        this.order_id = order_id;
        
        this.client_id = client_id;
    }

    static from(json){
        return new MPickups(json.order_id,json.client_id);
    }
}

export default MPickups;