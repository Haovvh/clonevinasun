import React, { useState, useEffect } from "react";
import GoongAPI from "../../Goong/GoongAPI";
import GoongMap from "../../Goong/GoongMap";
import socketIOClient from "socket.io-client";
import authHeader from "../../services/auth-header";
import journeyService from "../../services/journey.service";
import DriverJourney from "./driverJourney.component"

const param = { query: 'token=' }
const socket = socketIOClient(process.env.REACT_APP_WEBSOCKETHOST, param )

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };




export default function PassengerJourney (props) {

    const [status, setStatus] = useState("showtripinfo")
    const [places, setPlaces] = useState([])
    const [distance_km, setDistance_km] = useState();
    const [distance, setDistance] = useState("")
    const [duration, setDuration] = useState("")
    const [placeFrom, setPlaceFrom] = useState("");
    const [origin_Id, setOrigin_Id] = useState("");
    const [placeFrom_lat, setPlaceFrom_lat] = useState(0);
    const [placeFrom_lng, setPlaceFrom_lng] = useState(0);
    const [placeTo, setPlaceTo] = useState("");
    const [destination_Id, setDestination_Id] = useState("");
    const [placeTo_lat, setPlaceTo_lat] = useState(0);
    const [placeTo_lng, setPlaceTo_lng] = useState(0);
    const [pointCodes, setPointCodes] = useState("")
    const [coordinates, setCoordinates]= useState([])
    const [disabled, setDisabled] = useState(false);
    const [driverJouney, setDriverJourney] = useState();
    
        // mở nhận socket tên broadcat
         socket.on("driveracceptjourney",  (data) => {
          console.log("driveracceptjourney");
          console.log(data)
          console.log(data.socket_ID)
            /*
          for(let i =0 ; i< driver.length; i++) {
            console.log("co khach")
            if(driver_ID === driver[i].Driver_ID){
              setSocket_ID(data.socket_ID)
              setStatus("Cokhach");
              setCustomerInfo({
                Passenger_ID: data.user.Passenger_ID,
                User_ID: data.user.User_ID,
                Fullname: data.user.Fullname,
                Phone: data.user.Phone,
                origin_Id: data.user.origin.placeId,
                origin_Fulladdress: data.user.origin.fulladdress,
                destination_Id: data.user.destination.placeId,
                destination_Fulladdress: data.user.destination.fulladdress, 
                distance_km: data.user.distance_km,
                Price: data.user.Price,
                pointCode: data.user.pointCode
              })
            }
          }
          */
        })

    useEffect( () => {
        socket.on("passenger", (data) => {
            console.log(data)
        })
        console.log("check api get all Journey")
        journeyService.getAllJourneybyPassenger().then(
            response => {
                if(response.data.resp) {
                    console.log(response.data.data)
                    setPlaces(response.data.data)
                    
                }
            }, error => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                    console.log(error)                    
                }
        )
        
        console.log("check api get Journey")

        journeyService.getJourneybyPassenger().then(
          response => {
            if(response.data.resp) {
              console.log("Có Data")
              const user = response.data.data;
              console.log(user)
              setDriverJourney({
                    Fullname: user.FullName,
                    Phone: user.Phone,
                    Car_code: user.Car_code,
                    Car_color: user.Car_color,
                    Car_type: user.Car_type
              })
              setPlaceFrom(user.origin_Fulladdress)
              setPlaceTo(user.destination_Fulladdress)
              setPointCodes(user.pointCode)
              setStatus("completeTrip")
              setDisabled(true)
            }
                   
          },
          error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
                console.log(error)                    
            }
        )
    },[])

    //lấy giá trị trong textbox 
    const handlePlaceFrom = (event) => {        
        setPlaceFrom(event.target.value)
    }
    const handlePlaceTo = (event) => {
        setPlaceTo(event.target.value)
    }
    //event click
    const handleOnClick = async () => {
        if(status === "showtripinfo") {
            try {
                if (placeFrom !== null && placeTo !== null) {
                    console.log("Khong duoc null")
                    const origins = await GoongAPI.getGeocode(placeFrom);
                    setOrigin_Id(origins.data.results[0].place_id)
                    

                    setPlaceFrom(origins.data.results[0].formatted_address)                   
                    setPlaceFrom_lat(await origins.data.results[0].geometry.location.lat)
                    setPlaceFrom_lng(await origins.data.results[0].geometry.location.lng)
                    const jsonorigins = await origins.data.results[0].geometry.location.lat + ',' + origins.data.results[0].geometry.location.lng
    
                    const destinations = await GoongAPI.getGeocode(placeTo);
                    setDestination_Id(destinations.data.results[0].place_id)
                    setPlaceTo(destinations.data.results[0].formatted_address)
                    setPlaceTo_lat(await destinations.data.results[0].geometry.location.lat)
                    setPlaceTo_lng(await destinations.data.results[0].geometry.location.lng)
                    const jsondestinations = await destinations.data.results[0].geometry.location.lat + ',' + destinations.data.results[0].geometry.location.lng
    
                    if (jsonorigins && jsondestinations) {

                        const distance = await GoongAPI.getDirection(jsonorigins,jsondestinations);                        
                        const json = await distance.data.routes[0]                        
                        console.log(json.legs[0].distance.text)
                        console.log(json.legs[0].duration.text)
                        console.log(json.overview_polyline.points);
                        setPointCodes(json.overview_polyline.points)
                        
                        setDistance("Quảng đường: " + json.legs[0].distance.text)
                        setDistance_km(parseInt(json.legs[0].distance.value)/1000)
                        setDuration("Thời gian: " + json.legs[0].duration.text)
                        setStatus("bookdriver")
                        setDisabled(true)
                    }
                    else {
                        return;
                    }
                }
    
            } catch (error) {
                console.log(error)
            }
            
        } else if (status === "bookdriver") {
            console.log("Book driver")
            //check connect xem được không? 

            //socket gọi đến server tìm tài xế
            socket.emit("calldriver", {
                socket_ID: socket.id,
                //data gửi kèm đến server
                Passenger_ID: authHeader().id,
                origin: {
                    placeId: origin_Id,
                    fulladdress: placeFrom,
                    origin_lat: placeFrom_lat,
                    origin_lng: placeFrom_lng
                },
                destination: {
                    placeId: destination_Id,
                    fulladdress: placeTo,
                    destination_lat: placeTo_lat,
                    destination_lng: placeTo_lng
                },
                distance_km: distance_km,
                pointCode: pointCodes,
                Price: distance_km * 10000,
                Fullname: "Tran van A",
                Phone: "0987654321"

            });
            
            setStatus("completeTrip")           
        
        }
        else if (status === "completeTrip") {
            console.log("completeTrip");
            setDistance_km();
            setDistance("");
            setDuration("")
            setPlaceFrom("");
            setPlaceTo("");
            setPointCodes("");
            setCoordinates([]);
            setStatus("showtripinfo");
            setDisabled(false)
        }        
    }
    //
//
    return (
        <React.Fragment>
            <div className="container">
                <div className="card">
                    <div>
                        <h1>
                            {distance}
                        </h1>
                        <h1>
                            {duration}
                        </h1>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Điểm đón:</label>
                        <input
                            list="placeFrom" name="browser"
                            placeholder="Điểm đón"
                            type="text"
                            className="form-control"
                            value={placeFrom}
                            onChange={(event) => { handlePlaceFrom(event) }}
                            disabled={disabled}
                        />
                        <datalist id="placeFrom">
                            {places.map((item, key) => 
                            <option key = {key} value={item.origin_Fulladdress}/>)} 
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Điểm đến:</label>
                        <input
                            list="placeTo"
                            placeholder="Điểm đến"
                            type="text"
                            className="form-control"
                            value={placeTo}
                            onChange={(event) => { handlePlaceTo(event) }}
                            disabled={disabled}
                        />
                        <datalist id="placeTo">
                            {places.map((item, key) => 
                            <option key = {key} value={item.origin_Fulladdress}/>)} 
                        </datalist>
                    </div>
                    <div className="form-group">
                        <select id="cars" name="cars">
                            <option value="car4">Car 4 Chỗ</option>
                            <option value="car7">Car 7 Chỗ</option>
                            <option value="car7">Bất kỳ</option>
                        </select>
                    </div>
                    <div className="form-group ">
                        <div className="row">
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                handleOnClick()}}>
                                {(status === "showtripinfo") ? "Show Trip Info" : 
                                (status === "bookdriver") ? "Book Driver" : 
                                (status === "completeTrip") ? "Complete Trip" : 
                                "Show Trip Info"}
                                </button>
                            </div>
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                window.location.reload();}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <DriverJourney info ={driverJouney}/>
            </div>
            <GoongMap coordinates={coordinates} />
        </React.Fragment>
    );
}
