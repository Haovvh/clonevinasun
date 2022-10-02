import axios from "axios";

let API_KEY = 'Q8Ig6pAAaXN7omsq4aAGbjx9JS2FyOuCAylzUwcq'
let MAP_KEY = 'NQwv212RcJeMfcVxfWdgudp6k8UwXpatI2oSKExX'

class GoongAPI { 
    API_KEY() {
        return API_KEY;
    }   
    MAP_KEY() {
        return MAP_KEY;
    }
    DISTANCEMATRIS_API(origins, destinations) {
        return axios.get(`https://rsapi.goong.io/DistanceMatrix?origins=${origins}&destinations=${destinations}&vehicle=car&api_key=${API_KEY}`)
    }
    ReverseGeocoding(latitude, longitude) {
        return axios.get(`https://rsapi.goong.io/Geocode?latlng=${latitude},%20${longitude}&api_key=${API_KEY}`)
    }
    

}
export default new GoongAPI();