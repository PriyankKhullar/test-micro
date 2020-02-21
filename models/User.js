class User {

   constructor(data) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
   }

   addUser() {
      return `INSERT INTO users(name, email, password) \
                   VALUES('${this.name}','${this.email}', '${this.password}')`;
   }

   updateUser(id) {
      return `UPDATE users SET name = '${this.name}', email = '${this.email}', password = '${this.password}' WHERE id = ${id}`;
   }

   static getUserById(id) {
      return `SELECT * FROM users WHERE id = ${id}`;
   }

   static getUserByEmail(emailId) {
      return `SELECT * FROM users WHERE email = '${emailId}'`;
   }

   static deleteUserById(id) {
      return `DELETE FROM users WHERE id = ${id}`;
   }

   static getAllUsers() {
      return `SELECT * FROM users`;
   }
}

module.exports = User;