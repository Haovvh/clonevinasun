import React, { useState, useEffect } from "react";
import passengerService from "../../services/passenger.service";
import PassengerJourney from "./passengerJourney.component"


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
          console.log(InfoPassenger)
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
        window.location.assign("http://localhost:8082/login")
      }
    )
  },[])
  
    if(!(InfoPassenger.role )) {      
      return null;
    } 
    if (!InfoPassenger.Phone) {
      return (
        <h3>Please update info. You book Driver</h3>
      )
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
