import axios from "axios";

let API_KEY = 'Q8Ig6pAAaXN7omsq4aAGbjx9JS2FyOuCAylzUwcq'

class GoongAPI {
    
    getGeocode (address)  {
        return axios.get(`https://rsapi.goong.io/geocode?address=${address}&api_key=${API_KEY}`)        
    }        
    
    getDirection(origin, destination) {
        return axios.get(`https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=car&api_key=${API_KEY}`)
    }    

}
export default new GoongAPI();