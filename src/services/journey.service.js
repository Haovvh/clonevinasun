import axios from "axios";
import authHeader from './auth-header';

class Journey {  

  createjourney(origin, destionation,  Price, distance_km,  journey_pointCode) {
    return axios.post(process.env.REACT_APP_API_URL + "/user/create-journey", {
      origin, 
      destionation, 
      Price, 
      distance_km, 
      journey_pointCode
    },{ headers: authHeader() });
  }
  getAllJourneybyId() {
    return axios.get(process.env.REACT_APP_API_URL + "/user/get-all-journey-by-Id", { headers: authHeader() });
  }

}

export default new Journey();
