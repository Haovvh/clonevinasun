import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import passengerService from "../services/passenger.service";
import driverService from "../services/driver.service";
import CheckButton from "react-validation/build/button";
import authService from "../services/auth.service";

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
  const user = AuthService.getCurrentUser();
  const [Fullname, setFullname] = useState("");
  const [Phone, setPhone] = useState("");
  const [Date_of_birth, setDate_of_birth] = useState("");
  const [statusCode, setStatusCode] = useState("noPassenger");  
  const [Car_type, setCar_type] = useState("");
  const [Car_owner, setCar_owner] = useState("");
  const [Car_code, setCar_code] = useState("");
  const [Car_seat, setCar_seat] = useState("");
  const [Car_color, setCar_color] = useState("");

  const [message, setMessage] = useState("");

  useEffect( () => {
    console.log(user)
    console.log("use Effect")
    passengerService.getPassenger().then(
      response => {
        if(response.data.resp  ) {
          console.log("Có Data")
          const passenger = response.data.data;
          console.log(passenger)
          if(response.data.data.Phone !== null) {
            setStatusCode("isPassenger") 
          }          
          setFullname(passenger.Fullname)
          setPhone(passenger.Phone)
          setDate_of_birth(passenger.Date_of_birth)                           
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

    const handleFullname = (event) => {        
      setFullname(event.target.value)
    }
    const handlePhone = (event) => {
      setPhone(event.target.value)
    }
    const handleDateofBirth = (event) => {
      setDate_of_birth(event.target.value)
    }
  // gọi API trở thành tài xế
  
  const handleOnClick = () => {
    if(statusCode === "isDriver") {
      console.log(Car_code !== "")
      if(Car_code !== null && Car_color !== null && Car_owner !== null && Car_seat !== null && Car_type !== null) {
        
        console.log("Khac null")
        driverService.postDriver(
          Car_code, Car_color, Car_owner, Car_seat, Car_type
        ).then(
          response => {
            if(response.data.resp) {
              console.log("Có Data")
              console.log(response.data) 
              setMessage(response.data.message)   
              alert("Cập nhật thành công");
              authService.logout();  
              window.location.reload();
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

      if(Fullname !== null && Phone !== null && Date_of_birth !== null) {
        console.log("Khong duoc rong")
        passengerService.putPassenger(Fullname, Phone, Date_of_birth).then(
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
    if (statusCode === "isPassenger"){
      setStatusCode("isDriver");
    }      
  }    

    if (!user) {
      return null;
    }
  return (
    <React.Fragment>
      <div className="col-md-12">

      {(statusCode === "isPassenger") && (
              <div className="form-group">
                <button className="btn btn-primary " onClick={() => {
                                handleIsDriver()}}>
                                Thành tài xế
                </button>
              </div>
            )}
        <div className="card card-container">
          <div className="form-group">        
            
            {statusCode !== "isDriver"  && 
            (<div>
              <div>
              <label htmlFor="username">FullName:</label>
                    <input
                            type="text"
                            className="form-control"
                            value={Fullname}
                            onChange={(event) => { handleFullname(event) }}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Phone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Phone}
                            onChange={(event) => { handlePhone(event) }}
                            validations={[required]}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Date of Birth:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={Date_of_birth}
                            onChange={(event) => { handleDateofBirth(event) }}
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
                        <input
                            type="text"
                            className="form-control"
                            value={Car_seat}
                            onChange={(event) => {        
                              setCar_seat(event.target.value)
                            }}
                            validations={[required]}
                        />
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
                                <button className="btn btn-primary " onClick={() => {
                                handleOnClick()}}>
                                {(statusCode === "isDriver") ? "Cập nhật tài xế" : "Cập nhật"}
                                </button>
                            </div>
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                window.location.reload();}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                         
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
        </div>
        </div>
      </div>
    </React.Fragment>
  );
}
