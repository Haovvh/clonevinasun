import axios from 'axios';
import authHeader from './auth-header';


class UserPhone {
  
  
  getUserbyPhone(Phone) {
    return axios.get(process.env.REACT_APP_API_URL + `/user-by-phone/get-user-by-phone/${Phone}`,     
    { headers: authHeader()
     });
  }
  postUser(Fullname, Phone, Date_of_birth, gender) {
    return axios.post(process.env.REACT_APP_API_URL + "/user-by-phone/post-user-by-phone", {
      Fullname, 
      Phone, 
      Date_of_birth, gender
    },
    { headers: authHeader() });
  }

  putPassenger(Fullname, Phone, Date_of_birth) {
    return axios.put(process.env.REACT_APP_API_URL + "/user-by-phone/put-user-by-phone", {
      Fullname, 
      Phone, 
      Date_of_birth
    },
    { headers: authHeader() });
  }
  
}

export default new UserPhone();
