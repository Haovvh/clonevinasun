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

  const [message, setMessage] = useState("");
  const [driverInfo, setDriverInfo] = useState({
    Driver_ID: "",
    Fullname: "",
    Car_type: "",
    Car_code: "",
    Car_seat: "",
    Car_color: ""
  });
  const driver_ID = authHeader().id;
  const user = AuthService.getCurrentUser();
  const isDriver = user.role.includes('ROLE_DRIVER')
  const [status, setStatus] = useState("Online")
  const [customerInfo, setCustomerInfo] = useState({})
  const [socket_ID, setSocket_ID] = useState("");

  useEffect(  () => {  
    driverService.getDriver().then(
      response => {

        console.log( response.status === 200)
        if(response.data.resp) {
          console.log(response.data.data)
          setDriverInfo({
            Fullname: response.data.data.Fullname,
            Driver_ID: response.data.data.Driver_ID,
            Car_type: response.data.data.Car_type,
            Car_code: response.data.data.Car_code,
            Car_seat: response.data.data.Car_seat,
            Car_color: response.data.data.Car_color
          })
        } else {
          setMessage(response.data.message)
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
        //alert("Vui lòng đăng nhập lại")
        
        
      }
    )
    //check xem có journey nào chưa hoàn thành không? gọi API journey
    console.log("check api get Journey")
    journeyService.getJourneybyDriver().then(
      response => {
        if(response.data.resp) {
          console.log("Có Data")
          const user = response.data.data;          
          setCustomerInfo( prevState => ({
                ...prevState,
                Passenger_ID: user.Passenger_ID,
                Fullname: user.Fullname,
                Phone: user.Phone,
                origin_Fulladdress: user.origin_Fulladdress,
                destination_Fulladdress: user.destination_Fulladdress, 
                distance_km: user.distance_km,
                Price: user.Price,
                pointCode: user.pointCode 
          }))
          setStatus("trakhach")
        } else {

        }
               
      },
      error => {
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
    //socket
    
        // mở nhận socket tên broadcat
         socket.on("broadcat",  (data) => {
          console.log("driver");
          console.log(data.drivers)
          let driver = data.drivers;

          for(let i =0 ; i< driver.length; i++) {
            console.log("co khach")
            console.log(driverInfo.Driver_ID)
            if(driver_ID === driver[i].Driver_ID){
              setSocket_ID(data.socket_ID)
              setStatus("Cokhach");
              setCustomerInfo(prevState =>  ({
                ...prevState,
                Passenger_ID: data.user.Passenger_ID,
                User_ID: data.user.User_ID,
                SupportStaff_ID: data.user.SupportStaff_ID,
                Fullname: data.user.Fullname,
                Phone: data.user.Phone,
                origin_Id: data.user.origin.placeId,
                origin_Fulladdress: data.user.origin.fulladdress,
                destination_Id: data.user.destination.placeId,
                destination_Fulladdress: data.user.destination.fulladdress, 
                distance_km: data.user.distance_km,
                Price: data.user.Price,
                pointCode: data.user.pointCode
              }))
            }
          }
        })    
    
  }, []);

  
  const handleOnline = () => {
   
    
    if (status === "Online") {
      setStatus("Offline");
      

    } else if (status === "Offline") {
      setStatus("Online");

    } else if(status === "Cokhach") {
      //goi api tạo journey
      console.log(" vao status co khach")
      journeyService.createjourney(customerInfo.Passenger_ID,customerInfo.User_ID, 
        customerInfo.SupportStaff_ID, driver_ID, customerInfo.Price,
         customerInfo.origin_Id, customerInfo.origin_Fulladdress,
         customerInfo.destination_Id, customerInfo.destination_Fulladdress, 
         customerInfo.distance_km, customerInfo.pointCode).then(
          response => {
            if(response.data.resp) {
              setMessage(response.data.message)
              console.log(response.data)
              socket.emit("driveracceptjourney", {
                socket_ID: socket_ID,
                Driver_ID: driverInfo.Driver_ID,
                Fullname: driverInfo.Fullname,
                Car_type: driverInfo.Car_type,
                Car_code: driverInfo.Car_code,
                Car_seat: driverInfo.Car_seat,
                Car_color: driverInfo.Car_color

              })
                  
              setStatus("trakhach")
            } else {
              setMessage(response.data.message)
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
            setMessage(resMessage) 
            localStorage.removeItem("user")
            alert("Vui lòng đăng nhập lại")
            window.location.assign("http://localhost:8082/login")                    
            } 
         )
      

    } else {
      //gọi api update journey thành công
      journeyService.updatejourney(driver_ID, customerInfo.SupportStaff_ID).then(
        response => {
          if(response.data.resp) {
            setMessage(response.data.message)
            socket.emit("successjourney", {
              socket_ID: socket_ID,
              Status: "success"
            })
            setStatus("Online")
            setCustomerInfo({});
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
            error.toString();
          setMessage(resMessage)                   
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
          {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          <div>
          <div className="row container">
            <div className="col-6">
            <button className="btn btn-primary container" onClick={() => {
            handleOnline()
          }}>{(status === "Offline") ? 'Online' : 
          ((status === "Online") ? 'Offline' : ((status === "Cokhach") ? 'Nhận khách' : "Trả khách"))}</button>
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
          <GongMapDriver Online={status}/>  
        </div>
              
          
        </div>
      </React.Fragment>
      
    );
  }

