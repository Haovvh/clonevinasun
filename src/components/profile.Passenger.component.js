import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import passengerService from "../services/passenger.service";
import driverService from "../services/driver.service";
import { URL_RELOAD } from "../public/const";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};


export default function ProfilePassenger (props) {  

  const [InfoPassenger, setInfoPassenger] = useState({
    Date_of_birth: "",
    Fullname: "",
    Passenger_ID: "",
    Phone: "",
    role: ""
   
  })
  const user = AuthService.getCurrentUser();
  const [statusCode, setStatusCode] = useState("noPassenger");  
  const [Car_type, setCar_type] = useState("");
  const [Car_owner, setCar_owner] = useState("");
  const [Car_code, setCar_code] = useState("");
  const [Car_seat, setCar_seat] = useState(4);
  const [Car_color, setCar_color] = useState("");
  const [SupportStaffCode, setSupportStaffCode] = useState("");
  const [message, setMessage] = useState("");


  useEffect( () => {

    passengerService.getPassenger().then(
      response => {
        if(response.data.resp) {
          console.log(response.data.data);
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
        alert("Please Login");
        window.location.assign(URL_RELOAD)
      }
    )
    
  },[])    

  // gọi API trở thành tài xế
  
  const handleOnClick = () => {
    if(statusCode === "isDriver") {
      console.log(Car_code !== "")
      if(Car_code  && Car_color  && Car_owner  && Car_seat  && Car_type ) {
        
        console.log("Khac null")
        driverService.postDriver(
          Car_code, Car_color, Car_owner, Car_seat, Car_type
        ).then(
          response => {
            if(response.data.resp) {
              console.log("Có Data")
              console.log(response.data) 
              setMessage(response.data.message)   
              localStorage.removeItem("user")
              alert(`Update Success.
              Please Login`)
              window.location.assign(URL_RELOAD)
            }
            else {
              setMessage(response.data.message)    
              //setStatusCode(false); 
            }                 
          },
          error => {
            console.log(error)
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
                console.log(error)                    
            })
      }
      
    }
    else {

      if(InfoPassenger) {
        console.log("Khong duoc rong")
        passengerService.putPassenger(InfoPassenger).then(
          response => {
            if(response.data.resp) {
              console.log("Response True")
              console.log(response.data) 
              setMessage(response.data.message)    
              setStatusCode("isPassenger"); 
              //setDriver(true)             
            }
            else {
              console.log("Response False")
              setMessage(response.data.message)    
              //setStatusCode(false); 
            }                   
          },
          error => {
            console.log("Error")
            console.log(error)
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
                console.log(error)                    
            })
          }
    }
  }
  
  const  handleIsDriver = () => {
    setStatusCode("isDriver");
    // if (statusCode === "isPassenger"){
    //   setStatusCode("isDriver");
    // }      
  }    

    if (!user) {
      return null;
    }
  return (
    <React.Fragment>
      <div className="col-md-12">
        <div className="form-group ">
        {message && (
              <div className="form-group">
                <div
                  className={
                    statusCode
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                {message}
                </div>
              </div>
            )}

            <div className="form-group ">
            {InfoPassenger.Phone && (
                            <div className="col-5 container">
                            <button className="btn btn-primary " onClick={() => {
                            handleIsDriver()}}>Is Driver</button>
                            </div>
                            )}              
            
        <div className="card">
          <div className="form-group">        
            
            {statusCode !== "isDriver"  && 
            (<div>
              <div>
              <label htmlFor="username">FullName:</label>
                    <input
                            type="text"
                            className="form-control"
                            value={InfoPassenger.Fullname}
                            onChange={(event) => setInfoPassenger(prevState => ({...prevState, Fullname: event.target.value}))}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Phone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={InfoPassenger.Phone}
                            onChange={(event) => setInfoPassenger(prevState => ({...prevState, Phone: event.target.value}))}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Date of Birth:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={InfoPassenger.Date_of_birth}
                            onChange={(event) => setInfoPassenger(prevState => ({...prevState, Date_of_birth: event.target.value}))}
                            validations={[required]}
                        />
                        </div>            
            
                    </div>)}
                    {statusCode === "isDriver" && 
                    ( <div>
                    <div className="form-group">
                        <label htmlFor="username">Car Owner:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Car_owner}
                            onChange={(event) => {        
                              setCar_owner(event.target.value)
                            }}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Type:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Car_type}
                            onChange={(event) => {        
                              setCar_type(event.target.value)
                            }}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Code:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Car_code}
                            onChange={(event) => {        
                              setCar_code(event.target.value)
                            }}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                      
                        <label htmlFor="username">Car Seat:</label>
                        <select className="form-control" value={Car_seat} onChange={(event) => { 
                                 
                              setCar_seat(event.target.value)
                            }}>
                            <option value="4">Car 4 seat</option>
                            <option value="7">Car 7 seat</option>
                        </select>
                        
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Color:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Car_color}
                            onChange={(event) => {        
                              setCar_color(event.target.value)
                            }}
                            validations={[required]}
                        />
                        </div>
                    </div>)}
                    
                    <div className="form-group ">
                        <div className="row">
                            <div className="col-5 container">
                                <button className="btn btn-primary" onClick={() => {
                                handleOnClick()}}>
                                {(statusCode === "isDriver") ? "Update" : "OK"}
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
            </div>
          </div>
        </div>
    </React.Fragment>
  );
}
