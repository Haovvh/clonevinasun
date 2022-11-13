import axios from 'axios';
import authHeader from './auth-header';


class OnlineDriver {
  
  putOnlineDriver(Status) {
    return axios.put(process.env.REACT_APP_API_URL + "/onlineDriver/put-onlineDriver", 
    {Status},
    { headers: authHeader() });
  } 
  put5SecondOnlineDriver(LNG, LAT) {
    return axios.put(process.env.REACT_APP_API_URL + "/onlineDriver/put-5-second-onlineDriver", 
    {LNG, LAT},
    { headers: authHeader() });
  } 
}

export default new OnlineDriver();
