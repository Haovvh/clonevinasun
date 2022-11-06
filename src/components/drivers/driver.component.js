import React, { useState, useEffect} from "react";
import GongMapDriver from "../../Goong/GoongMap.Driver";
import authHeader from "../../services/auth-header";
import AcceptJourney from "./acceptJourney.component"
import socketIOClient from "socket.io-client";
import driverService from "../../services/driver.service";
import journeyService from "../../services/journey.service";

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
  const [Online, setOnline] = useState(false);
  const [status, setStatus] = useState("Offline")
  const [customerInfo, setCustomerInfo] = useState({})
  const [socket_ID, setSocket_ID] = useState("");

  useEffect(  () => {  
    
    driverService.getDriver().then(
      response => {
        if(response.data.resp) {
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
        alert("Mã đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại");
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
          setOnline(true);
          setStatus("Donetrip")
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

  
  const handleOnline = () => {   
    
    if (status === "Online") {
      //gọi API đến server
      setOnline(false)
      setStatus("Offline");
      

    } else if (status === "Offline") {
      setOnline(true)
      setStatus("Online");

    } else if(status === "isPassenger") {
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
              console.log(driverInfo)
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
            } 
         )      

    } else if(status === "Donetrip") {
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
            <button  onClick={() => {
            handleOnline()
          }}>{(status === "Offline") ? 'Online' : 
          ((status === "Online") ? 'Offline' : ((status === "isPassenger") ? 'Accept' : "Done Trip"))}</button>
            </div>
            <div className="col-6">
            {(status === "isPassenger") && (<button  onClick={() => window.location.reload()}>
            Cancel
          </button>)}
            </div>
          </div>
        </div>        
        <div>
          <AcceptJourney info={customerInfo} />
        </div >
        <div className="">
          <GongMapDriver Online={Online}/>  
        </div>              
          
        </div>
      </React.Fragment>
      
    );
  }

