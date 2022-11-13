import React, {useEffect} from 'react';
import { useState } from 'react';
import ReactMapGL, { GeolocateControl} from '@goongmaps/goong-map-react';
import { MAP_KEY } from './GoongKEY';
import io from "socket.io-client"
import socketIOClient from "socket.io-client";
import authHeader from '../services/auth-header';
import onlinedriverService from '../services/onlinedriver.service';


const geolocateControlStyle = {
  right: 10,
  top: 10
};
//const socket = io.connect(process.env.REACT_APP_WEBSOCKETHOST)
export default function GongMapDriver(props) {

  
  
  const [viewport, setViewport] = useState({
    latitude: 10.739,
    longitude: 106.6657,
    zoom: 14
  });
  
    

  useEffect (()=>{
      var delay = 100000;
      if (props.Online === "Online") {
          delay = 5000
      } else {
        delay = 1000000
      }
      const intervalId = setInterval( () => {
        onlinedriverService.put5SecondOnlineDriver(viewport.longitude,viewport.latitude).then(
          response => {
            console.log(response)
          }, error => {
            console.log(error)
          }
        )
        
          
          // socket.emit("update_lat_lng", {
          //   id: authHeader().id,
          //   LAT: viewport.latitude,
          //   LNG: viewport.longitude
          // });
      }, delay) 
      return () => clearInterval(intervalId); //This is important   
    
    },[]
  )

  
  return (
    <React.Fragment>

    <ReactMapGL className='container'
      {...viewport}
      width="60vw"
      height="60vh"
      mapStyle='https://tiles.goong.io/assets/goong_map_web.json'
      goongApiAccessToken={MAP_KEY}
      onViewportChange={setViewport}
    >
      <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        auto
      />
      
    </ReactMapGL>
    </React.Fragment>
  );
}


