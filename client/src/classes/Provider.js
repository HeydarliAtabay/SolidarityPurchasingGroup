
class Provider{
    constructor(id, providerName, providerDescription, providerLocation){
        this.id = id;
        this.name = providerName;
        this.description = providerDescription;
        this.location = providerLocation;
    }

    static from(json){
        return new Provider(json.id,json.providerName,json.providerDescription,json.providerLocation);
    }
}

export default Provider;