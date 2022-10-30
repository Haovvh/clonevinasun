import axios from 'axios';
import authHeader from './auth-header';


class Passenger {
  
  getPassenger() {
    return axios.get(process.env.REACT_APP_API_URL + "/user/get-user", 
    { headers: authHeader() });
  }
  getUserbyPhone() {
    return axios.get(process.env.REACT_APP_API_URL + "/user/get-user", 
    { headers: authHeader() });
  }
  putUserToSupportStaff(SupportStaffCode) {
    return axios.put(process.env.REACT_APP_API_URL + "/user/put-user-supportstaff", {
      SupportStaffCode
    },
    { headers: authHeader() });
  }

  putPassenger(Fullname, Phone, Date_of_birth) {
    return axios.put(process.env.REACT_APP_API_URL + "/user/put-user", {
      Fullname, 
      Phone, 
      Date_of_birth
    },
    { headers: authHeader() });
  }
  
}

export default new Passenger();
