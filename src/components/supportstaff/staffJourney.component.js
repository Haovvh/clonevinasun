import React, { useState, useEffect } from "react";
import GoongAPI from "../../Goong/GoongAPI";
import io from "socket.io-client";
import DriverJourney from "../passengers/driverJourney.component";
import passengerService from "../../services/passenger.service";
import { MONEY_1KM_DISTANCE } from "../../public/const";
import authHeader from "../../services/auth-header";

const socket = io.connect(process.env.REACT_APP_WEBSOCKETHOST)

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };


export default function StaffJourney (props) {
    const room = `000${authHeader().id}`;
    
    const [Car_seat,setCar_seat] = useState('');
    const [Price, setPrice] = useState(0);
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
    const [Info, setInfo] = useState({
        SupportStaff_ID: "",
        Phone: "",
        Fullname: ""
    });

    const [status, setStatus] = useState("showtripinfo")
    const [distance_km, setDistance_km] = useState();
    const [distance, setDistance] = useState("")
    const [disabled, setDisabled] = useState(false);

    const [driverInfo, setDriverInfo] = useState({
        Fullname: "",
        Phone: "",
        Car_type: "",
        Car_code: "",
        Car_seat: "",
        Car_color: ""
    });

    
        // mở nhận socket tên broadcat     


    useEffect( ()=> {
        socket.emit("join_room", {
            room: room
        });
        passengerService.getPassenger().then(
            response => {
                if(response.data.resp) {
                    setInfo(prevState => ({
                        ...prevState,
                        SupportStaff_ID: response.data.data.Passenger_ID,
                        Fullname: response.data.data.Fullname,
                        Phone: response.data.data.Phone
                    }))
                }
                else {
                    setMessage(response.data.message)
                }
            }, error => {
                console.log(error)
            }
        )
        socket.on("nodriver", (...data) => {   
            if(room === data[0].data) {
                alert("No Driver")
                window.location.reload();
            }
        })
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
            window.location.reload();
            console.log("success passenger");
            setDistance_km()
            setDistance("")
            setPrice("");
            setDriverInfo({
                Fullname: "",
                Phone: "",
                Car_type: "",
                Car_code: "",
                Car_seat: "",
                Car_color: ""
            })
            setStatus("showtripinfo")
            setDisabled(false)
            setDistance("")
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
            setMessage("");
        
            setInfo({
                SupportStaff_ID: "",
                Phone: "",
                Fullname: ""
            });
            setDisabled(false);    
          })
        

    },[socket])

    
    
      

    const handleChange = (event) => {
        setCar_seat( event.target.value)
    }
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
                if (journey.origin_Fulladdress  && journey.destination_Fulladdress) {

                    const origins = await GoongAPI.getGeocode(journey.origin_Fulladdress);

                    const jsonorigins = await origins.data.results[0].geometry.location.lat + ',' + origins.data.results[0].geometry.location.lng
    
                    const destinations = await GoongAPI.getGeocode(journey.destination_Fulladdress);
                    
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
                        const distance = await GoongAPI.getDirection(jsonorigins,jsondestinations);                        
                        const json = await distance.data.routes[0]
                        
                        setJourney(prevState => ({
                            ...prevState,
                            pointCodes: json.overview_polyline.points
                        }))
                        
                        
                        setDistance("Distance: " + json.legs[0].distance.text)
                        
                        setPrice( Math.round((json.legs[0].distance.value)*MONEY_1KM_DISTANCE/1000))
                        setDistance_km(parseInt(json.legs[0].distance.value)/1000)
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
            socket.emit("calldriver", {
                room: room,
                SupportStaff_ID: Info.SupportStaff_ID,
                User_ID: props.Info.User_ID,
                //data gửi kèm đến server
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
                Price: Price,
                Fullname: props.Info.Fullname,
                Phone: props.Info.Phone,
                Car_seat: Car_seat

            });
            
            setStatus("completeTrip")           
        
        }
        else if (status === "completeTrip") {
            window.location.reload()
            
        }        
    }
    //
//
    return (
        <React.Fragment>
            { !props.show ? null : (
                <div>
                <div className="container">
                    <div className="card">
                        <div>
                            <h4>
                            {distance}
                            </h4>
                            {Price >0 && <h4>Price: {Price} VND</h4>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Origin</label>
                            <input
                                list="placeFrom" name="browser"
                                placeholder="Origin"
                                type="text"
                                className="form-control"
                                value={journey.origin_Fulladdress}
                                onChange={(event) => { handlePlaceFrom(event) }}
                                disabled={disabled}
                            />
                            <datalist id="placeFrom">
                                {props.place.map((item, key) => 
                                <option key = {key} value={item.origin_Fulladdress}/>)} 
                            </datalist>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Destination</label>
                            <input
                                list="placeTo"
                                placeholder="Destination"
                                type="text"
                                className="form-control"
                                value={journey.destination_Fulladdress}
                                onChange={(event) => { handlePlaceTo(event) }}
                                disabled={disabled}
                            />
                            <datalist id="placeTo">
                                {props.place.map((item, key) => 
                                <option key = {key} value={item.origin_Fulladdress}/>)} 
                            </datalist>
                        </div>
                        <div className="form-group">
                        <label htmlFor="username">Car Seat</label>
                        <select className="form-control" value={Car_seat} onChange = {(event) =>{handleChange(event)}}>
                            <option value="4">Car 4 Seat</option>
                            <option value="7">Car 7 Seat</option>
                            <option value="">Any</option>
                        </select> 
                        </div>
                        <div className="form-group ">
                            <div className="row">
                                <div className="col-5 container">
                                    <button className="btn btn-primary" 
                                    onClick={() => {
                                    handleOnClick()}}>
                                    {(status === "showtripinfo") ? "Show Trip" : 
                                    (status === "bookdriver") ? "Book Driver" : 
                                    (status === "completeTrip") ? "Complete Trip" : 
                                    "Show Trip Info"}
                                    </button>
                                </div>
                                <div className="col-5 container">
                                    <button  className="btn btn-primary" onClick={() => {
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
                </div>
            )}          
            
        </React.Fragment>
    );
}
