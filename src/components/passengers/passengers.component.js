import React, { useState, useEffect } from "react";
import passengerService from "../../services/passenger.service";
import PassengerJourney from "./passengerJourney.component"
import { URL_RELOAD } from "../../public/const";

export default function Passenger () {

  
  const [InfoPassenger, setInfoPassenger] = useState({
    Date_of_birth: "",
    Fullname: "",
    Passenger_ID: "",
    Phone: "",
    role: ""
   
  })
  

  const [message, setMessage] = useState("");
  useEffect( () =>{       
    passengerService.getPassenger().then(
      response => {
        if(response.data.resp) {
          console.log(response.data);
          setInfoPassenger(response.data.data)
        } else {
          console.log(response.status);
          setMessage(response.data.message)
        }
      }, error => {
        console.log(error)

        const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        setMessage(resMessage)
        localStorage.removeItem("user");
        alert("Token is Exprise. Please Login");
        window.location.assign(URL_RELOAD)
      }
    )
  },[])
  
    if(!(InfoPassenger.role )) {      
      return null;
    } 
    
    return (
      <React.Fragment>
        <div className="container ">
        <div className="col">
          <header className="jumbotron">
            <h3>Passenger</h3>
            <PassengerJourney InfoPassenger = {InfoPassenger}/>                 
          </header>
          {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}    
        </div>    
        </div>
      </React.Fragment>
      
    );
}
