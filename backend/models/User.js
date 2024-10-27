// models/User.js (This is a mock for now)
let users = [];  // In-memory array to store users (replace with database later)

class User {
  constructor(name, email, password) {
    this.id = users.length + 1;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  save() {
    users.push(this);
    return this;
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }
}

module.exports = User;
