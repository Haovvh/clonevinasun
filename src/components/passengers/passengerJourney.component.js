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

    const [message, setMessage] = useState("");
    const [journey, setJourney] = useState({
        origin_Id: "",
        origin_Fulladdress: "",
        origin_LAT: "",
        origin_LNG: "",
        destination_Id: "",
        destination_Fulladdress: "",
        destination_LAT: "",
        destination_LNG: "",
        pointCodes: ""
    })

    const [status, setStatus] = useState("showtripinfo")
    const [places, setPlaces] = useState([])
    const [distance_km, setDistance_km] = useState();
    const [distance, setDistance] = useState("")
    const [duration, setDuration] = useState("")
    const [disabled, setDisabled] = useState(false);
    const [driverInfo, setDriverInfo] = useState({
        Fullname: "",
        Phone: "",
        Car_type: "",
        Car_code: "",
        Car_seat: "",
        Car_color: ""
    });

    socket.on("driverinfo", (data) => {
        console.log(data)
        setDriverInfo({
            Fullname: data.Fullname,
            Phone: data.Phone,
            Car_type: data.Car_type,
            Car_code: data.Car_code,
            Car_seat: data.Car_seat,
            Car_color: data.Car_color
        })
    })
    
    socket.on("successpassenger",  (data) => {
        console.log("success passenger");
        setStatus("showtripinfo")
        setJourney({
            origin_Id: "",
            origin_Fulladdress: "",
            origin_LAT: "",
            origin_LNG: "",
            destination_Id: "",
            destination_Fulladdress: "",
            destination_LAT: "",
            destination_LNG: "",
            pointCodes: ""
        })  
        
        setDistance_km();
        setDistance("")
        setDuration("")
        setDisabled(false);
        setDriverInfo({
            Fullname: "",
            Phone: "",
            Car_type: "",
            Car_code: "",
            Car_seat: "",
            Car_color: ""
        });
    
      })
    
        // mở nhận socket tên broadcat
        

    useEffect( () => {
        
        console.log("check api get all Journey")
        journeyService.getAllJourneybyPassenger().then(
            response => {
                if(response.data.resp) {
                    console.log(response.data.data)
                    setPlaces(response.data.data)
                    
                } else {

                }
            }, error => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();  
                  setMessage(resMessage)   
                  localStorage.removeItem("user")
                  alert("Vui lòng đăng nhập lại")
                  window.location.assign("http://localhost:8082/login")               
                }
        )
        
        console.log("check api get Journey")

        journeyService.getJourneybyPassenger().then(
          response => {
            if(response.data.resp) {
                setMessage(response.data.message)
              console.log("Có Data")
              const user = response.data.data;
              console.log(user)
              setDriverInfo({
                Fullname: user.FullName,
                    Phone: user.Phone,
                    Car_code: user.Car_code,
                    Car_seat: user.Car_seat,
                    Car_color: user.Car_color,
                    Car_type: user.Car_type
              })
              setJourney(prevState => ({
                ...prevState,
                origin_Fulladdress: user.origin_Fulladdress,
                destination_Fulladdress: user.destination_Fulladdress,
                pointCodes: user.pointCode
              }))
              
              setStatus("completeTrip")
              setDisabled(true)
            } else {
                setMessage(response.data.message)
            }
                   
          },
          error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(error.response.data.message);
            setMessage(resMessage) 
            localStorage.removeItem("user")
            alert("Vui lòng đăng nhập lại")
            window.location.assign("http://localhost:8082/login")                    
            }
        )
    },[])

    //lấy giá trị trong textbox 
    const handlePlaceFrom = (event) => {   
        setJourney(prevState => ({
            ...prevState,origin_Fulladdress: event.target.value
        }))
    }
    const handlePlaceTo = (event) => {

        setJourney(prevState => ({
            ...prevState,destination_Fulladdress: event.target.value
        }))
    }
    //event click
    const handleOnClick = async () => {
        if(status === "showtripinfo") {
            try {
                if (journey.origin_Fulladdress !== null && journey.destination_Fulladdress !== null) {
                    console.log(journey.origin_Fulladdress + " Test " + journey.destination_Fulladdress)
                    const origins = await GoongAPI.getGeocode(journey.origin_Fulladdress);

                    const jsonorigins = await origins.data.results[0].geometry.location.lat + ',' + origins.data.results[0].geometry.location.lng
    
                    const destinations = await GoongAPI.getGeocode(journey.destination_Fulladdress);
                    console.log(destinations.data.results[0].formatted_address)

                    const jsondestinations = await destinations.data.results[0].geometry.location.lat + ',' + destinations.data.results[0].geometry.location.lng
                    setJourney(prevState => ({
                        ...prevState,
                        origin_Id: origins.data.results[0].place_id,
                        origin_Fulladdress: origins.data.results[0].formatted_address,
                        origin_LAT: origins.data.results[0].geometry.location.lat,
                        origin_LNG: origins.data.results[0].geometry.location.lng,
                        destination_Id: destinations.data.results[0].place_id,
                        destination_Fulladdress: destinations.data.results[0].formatted_address,
                        destination_LAT: destinations.data.results[0].geometry.location.lat,
                        destination_LNG: destinations.data.results[0].geometry.location.lng
                    }))
                    if (jsonorigins && jsondestinations) {
                        console.log(" jsonorigins && jsondestinations ")
                        const distance = await GoongAPI.getDirection(jsonorigins,jsondestinations);                        
                        const json = await distance.data.routes[0]                        
                        console.log(json.legs[0].distance.text)
                        console.log(json.legs[0].duration.text)
                        console.log(json.overview_polyline.points);
                        
                        setJourney(prevState => ({
                            ...prevState,
                            pointCodes: json.overview_polyline.points
                        }))
                        
                        
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
                    placeId: journey.origin_Id,
                    fulladdress: journey.origin_Fulladdress,
                    origin_lat: journey.origin_LAT,
                    origin_lng: journey.origin_LNG
                },
                destination: {
                    placeId: journey.destination_Id,
                    fulladdress: journey.destination_Fulladdress,
                    destination_lat: journey.destination_LAT,
                    destination_lng: journey.destination_LNG
                },
                distance_km: distance_km,
                pointCode: journey.pointCodes,
                Price: distance_km * 10000,
                Fullname: "Tran van A",
                Phone: "0987654321"

            });
            
            setStatus("completeTrip")           
        
        }
        else if (status === "completeTrip") {
            console.log("completeTrip");
            setJourney({
                origin_Id: "",
                origin_Fulladdress: "",
                origin_LAT: "",
                origin_LNG: "",
                destination_Id: "",
                destination_Fulladdress: "",
                destination_LAT: "",
                destination_LNG: "",
                pointCodes: ""
            })
            setDistance_km();
            setDistance("");
            setDuration("")
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
                            value={journey.origin_Fulladdress}
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
                            value={journey.destination_Fulladdress}
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
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <div>
                <DriverJourney info ={driverInfo}/>
            </div>
            <GoongMap coordinates={journey.pointCodes} />
        </React.Fragment>
    );
}
