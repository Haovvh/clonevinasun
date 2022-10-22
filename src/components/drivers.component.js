import React, { useState, useEffect } from "react";
import GoongMap from "../Goong/GoongMap";
import AuthService from "../services/auth.service";
import AcceptJourney from "./acceptJourney.component";
import socketIOClient from "socket.io-client";


export default function Driver (){  

  useEffect(() => {   
    console.log("sucess")
    console.log(process.env.REACT_APP_WEBSOCKETHOST)
    const param = { query: 'token=' }
        const socket = socketIOClient(process.env.REACT_APP_WEBSOCKETHOST, param )
        socket.on('connect', function() {
            if(socket.connected){
                console.log("connected ở đây sẽ thành công " + socket.connected);
            }
        })
        .on('error', function(error) {
            console.log(error, "có lỗi ")
        })
        socket.emit("send_message", {
          abc: 1,
          def: 2
        });
        const user = AuthService.getCurrentUser();
    if (user) {
      setIsMod(user.roles.includes('ROLE_DRIVER')
      );
    }
    socket.on("broadcat", (data) => {
      console.log(data.some)
    })
    
  }, []);

  const [isMod, setIsMod] = useState(false)    
  const [isTrips, setIsTrips] = useState(true);
  const [isOnline, setIsOnline] = useState("Offline")
  const [customerInfo, setCustomerInfo] = useState({

    name: "Trần Văn A",
    sdt: "090123456789",
    placeFrom: "181 Cao thắng Q.10",
    placeTo: "285 Phạm văn chiêu gò vấp"
  })
  const handleOnline = () => {
    if (isOnline === "Online") {
      setIsOnline("Offline");
    } else {
      setIsOnline("Online");
    }
  }
  
    if(!isMod) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="container">
          <header className="jumbotron">
            <h3>Driver</h3>
          </header> 
          <div>
          <button className="btn btn-primary btn-block" onClick={() => {
            handleOnline()
          }}>{(isOnline === "Online") ? 'Offline' : 'Online'}</button>
          
        </div>
        
        <div>
          <AcceptJourney info={customerInfo} isTrips={isOnline} />
        </div >
        <GoongMap />        
          
        </div>
      </React.Fragment>
      
    );
  }

