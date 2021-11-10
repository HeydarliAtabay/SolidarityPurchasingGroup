
class Product{
    constructor(id, productName, productPrice, productWeight, productProvider){
        this.id = id;
        this.name = productName;
        this.price = productPrice;
        this.weight = productWeight;
        this.provider = productProvider;

    }

    static from(json){
        return new Product(json.id,json.productName,json.productPrice,json.productWeight,json.productProvider);
    }
}

export default Product;