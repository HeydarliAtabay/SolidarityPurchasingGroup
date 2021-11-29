class User{
    constructor(id, name, email, hash, role){
        this.id = id;
        this.name = name;
        this.email = email;
        this.hash= hash;
        this.role= role;
    }

    static from(json){
        return new User(json.id,json.name,json.email,json.hash,json.role);
    }
}

export default User;