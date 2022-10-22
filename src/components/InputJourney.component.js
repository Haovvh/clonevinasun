import React, { useState } from "react";
import GoongAPI from "../Goong/GoongAPI";
import GoongMap from "../Goong/GoongMap";
import journey from "../services/journey.service";

const decode = require('geojson-polyline').decode


function Place(props) {
    return <option value={props.place}/>
}

export default function InputJourney (props) {
    const [status, setStatus] = useState("showtripinfo")
    const [places, setPlaces] = useState([
        { place: "122 Trường chinh thân phú", count: 7 },
        { place: "123 Trường chinh thân phú", count: 6 },
        { place: "124 Trường chinh thân phú", count: 5 },
        { place: "125 Trường chinh thân phú", count: 4 },
        { place: "126 Trường chinh thân phú", count: 3 }
    ])
    const [distance_km, setDistance_km] = useState();
    const [distance, setDistance] = useState("")
    const [duration, setDuration] = useState("")
    const [placeFrom, setPlaceFrom] = useState("");
    const [placeTo, setPlaceTo] = useState("");
    const [points, setPoints] = useState("")
    const [coordinates, setCoordinates]= useState([])
    const [disabled, setDisabled] = useState(false);

    const handlePlaceFrom = (event) => {        
        setPlaceFrom(event.target.value)
    }
    const handlePlaceTo = (event) => {
        setPlaceTo(event.target.value)
    }
    const handleOnClick = async () => {
        if(status === "showtripinfo") {
            try {
                if (placeFrom.trim() !== "" && placeTo.trim() !== "") {
                    
                    const origins = await GoongAPI.getGeocode(placeFrom);
                    setPlaceFrom(origins.data.results[0].formatted_address)                   
                    
                    const jsonorigins = await origins.data.results[0].geometry.location.lat + ',' + origins.data.results[0].geometry.location.lng
    
                    const destinations = await GoongAPI.getGeocode(placeTo);
                    setPlaceTo(destinations.data.results[0].formatted_address)
                    
                    const jsondestinations = await destinations.data.results[0].geometry.location.lat + ',' + destinations.data.results[0].geometry.location.lng
    
                    if (jsonorigins && jsondestinations) {
                        const distance = await GoongAPI.getDirection(jsonorigins,jsondestinations);
                        
                        const json = await distance.data.routes[0]
                        
                        console.log(json.legs[0].distance.text)
                        console.log(json.legs[0].duration.text)
                        
                        const LineString = {
                            type: 'LineString',
                            coordinates: json.overview_polyline.points
                        };
                        const geoJSON = decode(LineString)
                        setCoordinates(geoJSON.coordinates)
                        setPoints(json.overview_polyline.points)
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
            console.log("success")
            journey.createjourney(placeFrom , placeTo, 100, distance_km , points).then(
                response => {
                    console.log(response.data.message)
                    setStatus("completeTrip")
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
        }
        else if (status === "completeTrip") {
            console.log("completeTrip");
            setDistance_km();
            setDistance("");
            setDuration("")
            setPlaceFrom("");
            setPlaceTo("");
            setPoints("");
            setCoordinates([]);
            setStatus("showtripinfo");
            setDisabled(false)
        }        
    }
        
    if (!props.warn) {
        return null;
    }

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
                            {places.map((val) => <Place place={val.place}/>)} 
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
                            {places.map((val) => <Place place={val.place}/>)}
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
            <GoongMap coordinates={coordinates} />
        </React.Fragment>
    );
}
