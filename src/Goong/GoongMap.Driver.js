import React, {useEffect} from 'react';
import { useState } from 'react';
import ReactMapGL, { GeolocateControl} from '@goongmaps/goong-map-react';
import { MAP_KEY } from './GoongKEY';
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
    zoom: 11
  });
      

  useEffect (()=>{
    
      var delay = 100000;
      if (props.Online === "Online") {
          delay = 5000
      } else {
        delay = 1000000
      }
      const intervalId = setInterval( () => {
        console.log(viewport.latitude)
        onlinedriverService.put5SecondOnlineDriver(viewport.longitude,viewport.latitude).then(
          response => {
            console.log(response.status)
          }, error => {
            console.log(error)
          }
        )
        
      }, delay) 
      return () => clearInterval(intervalId); //This is important   
    
    },[viewport.latitude, viewport.longitude]
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
        positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
        trackUserLocation={false}
        
        auto
      />
      
    </ReactMapGL>
    </React.Fragment>
  );
}


