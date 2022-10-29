import axios from 'axios';
import authHeader from './auth-header';


class DriverService {
  
    getDriver() {

        return axios.get(process.env.REACT_APP_API_URL + "/driver/get-driver" ,
        { headers: authHeader() });
    }

    postDriver( Car_code, Car_color, Car_owner, Car_seat, Car_type) {
        
        return axios.post(process.env.REACT_APP_API_URL + "/driver/post-driver", {
            Car_code, Car_color, Car_owner, Car_seat, Car_type         
        },
        { headers: authHeader() });
    }

    putDriver(id, carOwner, carCode, carType, carSeat, carColor) {
        
        return axios.put(process.env.REACT_APP_API_URL + "/driver/put-driver", {
            id, carOwner, carCode, carType, carSeat, carColor         
        },
        { headers: authHeader() });
    }

}

export default new DriverService();
