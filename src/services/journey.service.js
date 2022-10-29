import axios from "axios";
import authHeader from './auth-header';

class Journey {  

 // `customerInfo.Passenger_ID,customerInfo.User_ID, driver_ID, customerInfo.Price,
  //customerInfo.origin_Id, customerInfo.origin_Fulladdress,
  //customerInfo.destination_Id, customerInfo.destination_Fulladdress, 
  //customerInfo.distance_km, customerInfo.pointCode`
  createjourney(Passenger_ID, User_ID, driver_ID, Price, origin_Id, 
    origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode) {
    return axios.post(process.env.REACT_APP_API_URL + "/journey/post-journey", {
      Passenger_ID, 
      User_ID,
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
  
  updatejourney(Passenger_ID, driver_ID, Status) {
    return axios.put(process.env.REACT_APP_API_URL + "/journey/put-journey", {
      Passenger_ID, 
      driver_ID, 
      Status
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
