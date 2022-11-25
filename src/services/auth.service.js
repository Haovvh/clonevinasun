import axios from "axios";


class AuthService {
  login(email, password) {
    return axios
      .post(process.env.REACT_APP_API_URL + "/login/login", {
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

  register(username, phone, email, password, gender) {
    return axios.post(process.env.REACT_APP_API_URL + "/user/post-user", {
      username,
      phone,
      email,
      password,
      gender
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
