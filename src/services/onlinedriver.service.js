import axios from 'axios';
import authHeader from './auth-header';


class OnlineDriver {
  
  putOnlineDriver(Status) {
    return axios.put(process.env.REACT_APP_API_URL + "/onlineDriver/put-onlineDriver", 
    {Status},
    { headers: authHeader() });
  } 
  
}

export default new OnlineDriver();
