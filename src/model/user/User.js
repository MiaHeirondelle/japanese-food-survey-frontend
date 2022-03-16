class User {
  constructor(
    id,
    name,
    role) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  static fromJson(userJson) {
    return new User(userJson.id, userJson.name, userJson.role);
  }
}

export default User;
