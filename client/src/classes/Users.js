class User{
    constructor(id, name, email, hash, role, suspended){
        this.id = id;
        this.name = name;
        this.email = email;
        this.hash = hash;
        this.role = role;
        this.suspended = suspended;
        this.date_suspension = date_suspension;
    }

    static from(json){
        return new User(json.id,json.name,json.email,json.hash,json.role, json.suspended, json.date_suspension);
    }
}

export default User;