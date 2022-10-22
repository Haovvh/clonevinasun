import axios from "axios";


class AuthService {
  login(email, password) {
    return axios
      .post(process.env.REACT_APP_API_URL + "/auth/login", {
        email,
        password
      })
      .then(response => {
        console.log(response.data)
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(process.env.REACT_APP_API_URL + "/user/add-new-user", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
