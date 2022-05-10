class User {
  constructor(
    id,
    name,
    role,
    userDataSubmitted) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.userDataSubmitted = userDataSubmitted;
  }

  static fromJson(userJson) {
    return new User(userJson.id, userJson.name, userJson.role, userJson.user_data_submitted);
  }
}

export default User;
