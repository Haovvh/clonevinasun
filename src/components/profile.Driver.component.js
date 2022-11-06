import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import passengerService from "../services/passenger.service";
import driverService from "../services/driver.service";
import { URL_PORT } from "../public/const";

const user = AuthService.getCurrentUser();
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
export default function ProfileDriver (props) { 

  const [Fullname, setFullname] = useState("");
  const [Phone, setPhone] = useState("");
  const [Date_of_birth, setDate_of_birth] = useState("");
  const [Car_type, setCar_type] = useState();
  const [Car_owner, setCar_owner] = useState();
  const [Car_code, setCar_code] = useState();
  const [Car_seat, setCar_seat] = useState();
  const [Car_color, setCar_color] = useState();
  const [statusCode, setStatusCode] = useState(false);  
  const [message, setMessage] = useState("");

  useEffect( () => {
    
    console.log("use Effect")
    driverService.getDriver().then(
      response => {
        if(response.data.resp  ) {
          console.log("Có Data")
          const user = response.data.data;                    
          setFullname(user.Fullname)
          setPhone(user.Phone)
          console.log(user.Date_of_birth)
          setDate_of_birth(user.Date_of_birth) 
          setCar_code(user.Car_code)    
          setCar_color(user.Car_color)
          setCar_owner(user.Car_owner)
          setCar_seat(user.Car_seat)
          setCar_type(user.Car_type)            
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
      console.log(event.target.value)
      setDate_of_birth(event.target.value)
    }
  // gọi API trở thành tài xế
  

  const handleOnClick = () => {
    console.log(Fullname + " " + Phone + " " + Date_of_birth)
    if(Fullname !== "" && Phone !== "" && Date_of_birth !== "") {
      console.log("Khong duoc rong")
      passengerService.putPassenger( Fullname, Phone, Date_of_birth).then(
        response => {
          if(response.data.resp) {
            console.log("Response True")
            
            setMessage(response.data.message)    
            setStatusCode(true);         
          }
          else {
            console.log("Response False")
            setMessage(response.data.message)    
            setStatusCode(false); 
          }
                   
        },
        error => {
          console.log("Error")
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();                    
          })
      }
    }    

    if (!user) {
      return null;
    }
  return (
    <React.Fragment>
      <div className="col-sm-12">
        
        <div className="card card-container">
          <h1>Driver Info</h1>
          <div className="form-group">
            <label htmlFor="username">FullName:</label>
                    <input
                            type="text"
                            className="form-control"
                            value={Fullname}
                            onChange={(event) => { handleFullname(event) }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Phone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Phone}
                            onChange={(event) => { handlePhone(event) }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Date of Birth:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={Date_of_birth}
                            onChange={(event) => { handleDateofBirth(event) }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Owner:</label>
                        <input
                            disabled ={true}
                            type="text"
                            className="form-control"
                            value={Car_owner}
                            onChange={(event) => {        
                              setCar_owner(event.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Type:</label>
                        <input
                            disabled
                            type="text"
                            className="form-control"
                            value={Car_type}
                            onChange={(event) => {        
                              setCar_type(event.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Code:</label>
                        <input
                        disabled
                            type="text"
                            className="form-control"
                            value={Car_code}
                            onChange={(event) => {        
                              setCar_code(event.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="username">Car Seat:</label>
                        <select className="form-control" disabled={true} value={Car_seat} onChange={(event) => { 
                          console.log(event.target.value)       
                              setCar_seat(event.target.value)
                            }}>
                            <option value="4">Car 4 chỗ</option>
                            <option value="7">Car 7 chỗ</option>
                        </select>                        
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Color:</label>
                        <input
                        disabled
                            type="text"
                            className="form-control"
                            value={Car_color}
                            onChange={(event) => {        
                              setCar_color(event.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group ">
                        <div className="row">
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                handleOnClick()}}>
                                Cập nhật
                                </button>
                            </div>
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                  
                                window.location.assign(`${URL_PORT}/profile`);}}>Cancel</button>
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
    </React.Fragment>
  );
}
