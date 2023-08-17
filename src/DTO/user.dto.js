class UserDTO {
  async user(user) {
    let userParams = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      password: user.password,
      cart: user.cart,
      role: user.role
    };
    return userParams;
  }
}

export default UserDTO