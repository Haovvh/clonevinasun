import React, { useState, useEffect } from "react";
import GoongMap from "../Goong/GoongMap";
import AuthService from "../services/auth.service";

import socketIOClient from "socket.io-client";
const host = "http://localhost:8080";

export default function Driver (){
  

  useEffect(() => {
    const param = { query: 'token=' }
        const socket = socketIOClient(host, param )
        socket.on('connect', function() {
            console.log("Successfully connected!");
            if(socket.connected){
                console.log("connected ở đây sẽ thành công " + socket.connected);
            }
        })
        .on('error', function(error) {
            console.log(error, "có lỗi ")
        })
  }, []);

  const [isMod, setIsMod] = useState(false)
  
  
  

  useEffect( () =>{
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsMod(user.roles.includes('ROLE_DRIVER')
      );
    }
  },[isMod] )

  
    if(!isMod) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="container">
          <header className="jumbotron">
            <h3>Driver</h3>
          </header>          
        </div>
        <div>
        <GoongMap />
        </div>
      </React.Fragment>
      
    );
  }

