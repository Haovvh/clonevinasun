import React, { useState, useEffect, useRef } from "react";
import GongMapDriver from "../Goong/GoongMap.Driver";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import AcceptJourney from "./acceptJourney.component";
import socketIOClient from "socket.io-client";
import driverService from "../services/driver.service";
import journeyService from "../services/journey.service";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function IsDriver (){  
  const driver_ID = authHeader().id;
  const user = AuthService.getCurrentUser();
  const isDriver = user.role.includes('ROLE_DRIVER')
  
  const [isOnline, setIsOnline] = useState("Online")
  const [status, setStatus] = useState("Offline")
  const [customerInfo, setCustomerInfo] = useState({})

  useEffect(  () => {  
    //check xem có journey nào chưa hoàn thành không? gọi API journey
    console.log("check api get Journey")
    journeyService.getJourneybyDriver().then(
      response => {
        if(response.data.resp) {
          console.log("Có Data")
          const user = response.data.data;
          setCustomerInfo({
                Passenger_ID: user.Passenger_ID,
                Fullname: user.FullName,
                Phone: user.Phone,
                origin_Fulladdress: user.origin_Fulladdress,
                destination_Fulladdress: user.destination_Fulladdress, 
                distance_km: user.distance_km,
                Price: user.Price,
                pointCode: user.pointCode 
          })
          setStatus("trakhach")
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
    //socket
    const param = { query: 'token=' }
        const socket = socketIOClient(process.env.REACT_APP_WEBSOCKETHOST, param )
        // mở nhận socket tên broadcat
         socket.on("broadcat",  (data) => {
          console.log(data.user)
          console.log("driver");
          console.log(data.drivers)
          let driver = data.drivers;

          for(let i =0 ; i< driver.length; i++) {
            console.log("co khach")
            if(driver_ID === driver[i].Driver_ID){
              setStatus("Cokhach");
              setCustomerInfo({
                Passenger_ID: data.user.Passenger_ID,
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
        })    
    
  }, []);

  
  const handleOnline = async () => {
    await driverService.getDriver().then(
      response => {
          console.log(response.data)          
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
    
    if (status === "Online") {
      setStatus("Offline");

    } else if (status === "Offline") {
      setStatus("Online");

    } else if(status === "Cokhach") {
      //goi api tạo journey
      await journeyService.createjourney(customerInfo.Passenger_ID, driver_ID, customerInfo.Price,
         customerInfo.origin_Id, customerInfo.origin_Fulladdress,
         customerInfo.destination_Id, customerInfo.destination_Fulladdress, 
         customerInfo.distance_km, customerInfo.pointCode)
      setStatus("trakhach")

    } else if( status === "trakhach") {
      //gọi api update journey thành công
      await journeyService.updatejourney(customerInfo.Passenger_ID,driver_ID, 'Create').then(
        response => {
          console.log(response.data)          
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
      setStatus("Online")
      setCustomerInfo({});
    }
    
  }
  
    if(!isDriver) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="col-md-12">
        <div className="card card-container">
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
            {driver && (<div className="form-group ">
                        <div className="row">
                            <div className="col-5 container">
                                <button className="btn btn-primary " onClick={() => {
                                handleOnClickDriver()}}>
                                Bạn muốn làm tài xế
                                </button>
                            </div>
                            
                        </div>
                    </div>)}  
                    
        </div>

      </div>
      </React.Fragment>
      
    );
  }

