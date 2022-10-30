import axios from "axios";
import authHeader from './auth-header';

class Journey {  

  //customerInfo.Passenger_ID,customerInfo.User_ID, 
  //customerInfo.SupportStaff_ID, driver_ID, customerInfo.Price
  createjourney(Passenger_ID, User_ID, SupportStaff_ID, driver_ID, Price, origin_Id, 
    origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode) {
    return axios.post(process.env.REACT_APP_API_URL + "/journey/post-journey", {
      Passenger_ID, 
      User_ID, 
      SupportStaff_ID,
      driver_ID, 
      Price, 
      origin_Id, 
      origin_Fulladdress, 
      destination_Id, 
      destination_Fulladdress, 
      distance_km, 
      pointCode
    },
    { headers: authHeader() });
  }
  createjourneybyuser( User_ID, SupportStaff_ID, driver_ID, Price, origin_Id, 
    origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode) {
    return axios.post(process.env.REACT_APP_API_URL + "/journey/post-journey-by-user", {       
      User_ID,
      SupportStaff_ID,
      driver_ID, 
      Price, 
      origin_Id, 
      origin_Fulladdress, 
      destination_Id, 
      destination_Fulladdress, 
      distance_km, 
      pointCode
    },
    { headers: authHeader() });
  }
  
  updatejourney(driver_ID, SupportStaff_ID = null) {
    return axios.put(process.env.REACT_APP_API_URL + "/journey/put-journey", {
      driver_ID,
      SupportStaff_ID
    },
    { headers: authHeader() });
  }
  
  getJourneybyDriver() {
    return axios.get(process.env.REACT_APP_API_URL + "/journey/get-journey-by-driver", 
    { headers: authHeader() });
  }
  getJourneybyPassenger() {
    return axios.get(process.env.REACT_APP_API_URL + "/journey/get-journey-by-passenger", 
    { headers: authHeader() });
  }
  getAllJourneybyPassenger() {
    return axios.get(process.env.REACT_APP_API_URL + "/journey/get-all-journey-by-passenger", 
    { headers: authHeader() });
  }

}

export default new Journey();
