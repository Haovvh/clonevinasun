import React, { useState, useEffect} from "react";
import GongMapDriver from "../../Goong/GoongMap.Driver";
import authHeader from "../../services/auth-header";
import AcceptJourney from "./acceptJourney.component"
import socketIOClient from "socket.io-client";
import driverService from "../../services/driver.service";
import journeyService from "../../services/journey.service";
import onlinedriverService from "../../services/onlinedriver.service";

const param = { query: 'token=' }
const socket = socketIOClient(process.env.REACT_APP_WEBSOCKETHOST, param )


export default function Driver (){  

  const [message, setMessage] = useState("");
  const [driverInfo, setDriverInfo] = useState({
    Driver_ID: "",
    Fullname: "",
    Phone: "",
    Car_type: "",
    Car_code: "",
    Car_seat: "",
    Car_color: ""
  });
  const driver_ID = authHeader().id;
  const [IsDriver, setIsDriver] = useState(false);
  const [Online, setOnline] = useState("");
  const [status, setStatus] = useState("Offline")
  const [PassengerInfo, setPassengerInfo] = useState({})
  const [socket_ID, setSocket_ID] = useState("");

  useEffect(  () => {  
    
    driverService.getDriver().then(
      response => {
        if(response.data.resp) {
          console.log(response.data.data)
          setIsDriver(true);
          setDriverInfo(prevState => ({ ...prevState,
            Fullname: response.data.data.Fullname,
            Phone: response.data.data.Phone,
            Driver_ID: response.data.data.Driver_ID,
            Car_type: response.data.data.Car_type,
            Car_code: response.data.data.Car_code,
            Car_seat: response.data.data.Car_seat,
            Car_color: response.data.data.Car_color
          }))
          setOnline(response.data.data.Status)
          setStatus(response.data.data.Status)
        } else {
          console.log(response.status);
          console.log(response.data)
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
    socket.id = driverInfo.Driver_ID;
    //check xem có journey nào chưa hoàn thành không? gọi API journey
    console.log("check api get Journey")
    journeyService.getJourneybyDriver().then(
      response => {
        if(response.data.resp) {
          console.log("Có Data")
          const user = response.data.data;          
          setPassengerInfo( prevState => ({
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
          setStatus("Donetrip")
          //setOnline("Online");
          
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
        }
    )
  }, [driverInfo.Driver_ID]);

  //Socket
  socket.on("broadcat",  (data) => {
    console.log("driver");
    console.log(data.drivers)
    let driver = data.drivers;

    for(let i =0 ; i< driver.length; i++) {
      console.log(driverInfo.Driver_ID)
      console.log(driver_ID)
      if(driver_ID === driver[i].Driver_ID){
        setSocket_ID(data.socket_ID)
        setStatus("isPassenger");
        setPassengerInfo(prevState =>  ({
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

  
  const handleOnline = () => {   
    
    if (status === "Online") {
      //gọi API đến server
      setOnline("Offline")
      setStatus("Offline");
      onlinedriverService.putOnlineDriver("Offline").then(
        response => {
          if (response.data.resp) {
            console.log("Success")
          }
        }, error => {
          console.log(error)
        }
      )
      

    } else if (status === "Offline") {
      onlinedriverService.putOnlineDriver("Online").then(
        response => {
          if (response.data.resp) {
            console.log("Success")
          }
        }, error => {
          console.log(error)
        }
      )
      setOnline("Online")
      setStatus("Online");

    } else if(status === "isPassenger") {
      //goi api tạo journey
      console.log(" vao status co khach")
      journeyService.createjourney(PassengerInfo.Passenger_ID,PassengerInfo.User_ID, 
        PassengerInfo.SupportStaff_ID, driver_ID, PassengerInfo.Price,
        PassengerInfo.origin_Id, PassengerInfo.origin_Fulladdress,
        PassengerInfo.destination_Id, PassengerInfo.destination_Fulladdress, 
        PassengerInfo.distance_km, PassengerInfo.pointCode).then(
          response => {
            if(response.data.resp) {
              setMessage(response.data.message)
              console.log(response.data)
              onlinedriverService.putOnlineDriver("isTrip").then(
                response => {
                  console.log(response.data);
                }, error => {
                  console.log(error)
                }
              )
              socket.emit("driveracceptjourney", {
                socket_ID: socket_ID,
                Driver_ID: driverInfo.Driver_ID,
                Phone: driverInfo.Phone,
                Fullname: driverInfo.Fullname,
                Car_type: driverInfo.Car_type,
                Car_code: driverInfo.Car_code,
                Car_seat: driverInfo.Car_seat,
                Car_color: driverInfo.Car_color
              })                  
              setStatus("Donetrip")
            } else {
              setMessage(response.data.message)
              setStatus("Online")
              setPassengerInfo({})
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

    } else if(status === "Donetrip") {
      //gọi api update journey thành công
      journeyService.updatejourney(driver_ID, PassengerInfo.SupportStaff_ID).then(
        response => {
          if(response.data.resp) {
            setMessage(response.data.message)
            socket.emit("successjourney", {
              socket_ID: socket_ID,
              Status: "success"
            })
            onlinedriverService.putOnlineDriver("Online").then(
              response => {
                console.log(response.data);
              }, error => {
                console.log(error)
              }
            )
            setStatus("Online")
            setPassengerInfo({});
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
  
    if(!IsDriver) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="card container">
          <header className="jumbotron">
            {driverInfo.Driver_ID && (
              <div>
                
            <h3>Driver: {driverInfo.Fullname}</h3>
            <h4>Phone: {driverInfo.Phone}</h4>
            <h4>Car Info: {driverInfo.Car_type} {driverInfo.Car_code}</h4>
              </div>
            )}
          </header> 
          {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          <div className="form-group ">
          <div className="row">
            <div className="col-5 container">
            <button  className="btn btn-primary" onClick={() => {
            handleOnline()
          }}>
            {(status === "Offline") ? 'Online' : 
          ((status === "Online") ? 'Offline' : ((status === "isPassenger") ? 'Accept' : "Done Trip"))}</button>
            </div>
            <div className="col-6">
            {(status === "isPassenger") && (
            <button   className="btn btn-primary"
            onClick={() => window.location.reload()}>
            Cancel
          </button>)}
            </div>
          </div>
        </div>        
        <div>
          <AcceptJourney info={PassengerInfo} />
        </div >
        <div className="">
          {(Online === "Offline") ? <h1>Offline</h1> : 
          <GongMapDriver Online={Online}/>  
            }
        </div>              
          
        </div>
      </React.Fragment>
      
    );
  }

