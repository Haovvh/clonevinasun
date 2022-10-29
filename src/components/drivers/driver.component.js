import React, { useState, useEffect, useRef } from "react";
import GongMapDriver from "../../Goong/GoongMap.Driver";
import AuthService from "../../services/auth.service";
import authHeader from "../../services/auth-header";
import AcceptJourney from "./acceptJourney.component"
import socketIOClient from "socket.io-client";
import driverService from "../../services/driver.service";
import journeyService from "../../services/journey.service";

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

export default function Driver (){  
  const driver_ID = authHeader().id;
  const user = AuthService.getCurrentUser();
  const isDriver = user.role.includes('ROLE_DRIVER')
  
  const [isOnline, setIsOnline] = useState(true)
  const [status, setStatus] = useState("Online")
  const [customerInfo, setCustomerInfo] = useState({})
  const [socket_ID, setSocket_ID] = useState("");

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
    
        // mở nhận socket tên broadcat
         socket.on("broadcat",  (data) => {
          console.log("driver");
          console.log(data.drivers)
          console.log(data.socket_ID)
          let driver = data.drivers;

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
      setIsOnline(false)
      

    } else if (status === "Offline") {
      setStatus("Online");
      setIsOnline(true)

    } else if(status === "Cokhach") {
      //goi api tạo journey
      await journeyService.createjourney(customerInfo.Passenger_ID,customerInfo.User_ID, driver_ID, customerInfo.Price,
         customerInfo.origin_Id, customerInfo.origin_Fulladdress,
         customerInfo.destination_Id, customerInfo.destination_Fulladdress, 
         customerInfo.distance_km, customerInfo.pointCode).then(
          response => {
            if(response.data.resp) {
              socket.emit("driveracceptjourney", {
                socket_ID: socket_ID,
                driver_ID: driver_ID
              })
                   
              setStatus("trakhach")
            } else {
              setStatus("Online")
              setCustomerInfo({})
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
      

    } else if( status === "trakhach") {
      //gọi api update journey thành công
      await journeyService.updatejourney(customerInfo.Passenger_ID,driver_ID, 'Create').then(
        response => {
          if(response.data.resp) {
            setStatus("Online")
            setCustomerInfo({});
          }
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
      
    }
    
  }
  
    if(!isDriver) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="container">
          <header className="jumbotron">
            <h3>Driver</h3>
          </header> 
          <div>
          <div className="row container">
            <div className="col-6">
            <button className="btn btn-primary container" onClick={() => {
            handleOnline()
          }}>{(status === "Offline") ? 'Offline' : 
          ((status === "Online") ? 'Online' : ((status === "Cokhach") ? 'Nhận khách' : "Trả khách"))}</button>
            </div>
            <div className="col-6">
            {(status === "Cokhach") && (<button className="btn btn-primary container" onClick={() => window.location.reload()}>
            Cancel
          </button>)}
            </div>
          </div>
        </div>        
        <div>
          <AcceptJourney info={customerInfo} />
        </div >
        <div className="">
          <GongMapDriver Online={isOnline}/>  
        </div>
              
          
        </div>
      </React.Fragment>
      
    );
  }

