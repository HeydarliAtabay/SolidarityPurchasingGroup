
class Product{
    constructor(id, productName, productDescription, productCategory, productPrice, productUnit, productQuantity, productExpiryDate, productProviderId, productProviderName){
        this.id = id;
        this.name = productName;
        this.description = productDescription;
        this.category = productCategory;
        this.price = productPrice;
        this.unit = productUnit;
        this.quantity = productQuantity;
        this.expiryDate = productExpiryDate; 
        this.providerId = productProviderId;
        this.providerName = productProviderName;
    }

    static from(json){
        return new Product(json.id,json.productName,json.productDescription,json.productCategory,json.productPrice,json.productUnit,json.productQuantity,json.productExpiryDate,json.productProviderId,json.productProviderName);
    }
}

export default Product;