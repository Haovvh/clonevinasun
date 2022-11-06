import React, {useEffect} from 'react';
import { useState } from 'react';
import ReactMapGL, { GeolocateControl, Source, Layer } from '@goongmaps/goong-map-react';
import { MAP_KEY } from './GoongKEY';
import socketIOClient from "socket.io-client";
import authHeader from '../services/auth-header';


const geolocateControlStyle = {
  right: 10,
  top: 10
};
export default function GongMapDriver(props) {
  
  const [viewport, setViewport] = useState({
    latitude: 10.739,
    longitude: 106.6657,
    zoom: 14
  });
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature', geometry: {type: props.type, coordinates: props.coordinates}}
    ]
  };
  const layerStyle = {
    id: 'route',
    type: 'line',
    Source:'route',
    paint: {
      'line-color': '#1e88e5',
      'line-width': 8
    }
  };  
  

  useEffect (()=>{
      var delay = 10000;
      if (!props.Online) {
        //Xóa dữ liệu driver trong DB ra
          delay = 600000000
      } else {
        delay = 10000
      }
      const intervalId = setInterval( () => {
        const param = { query: 'token=' }
          const socket = socketIOClient(process.env.REACT_APP_WEBSOCKETHOST, param )
          
          socket.emit("update_lat_lng", {
            id: authHeader().id,
            LAT: viewport.latitude,
            LNG: viewport.longitude
          });
      }, delay) 
      return () => clearInterval(intervalId); //This is important   
    
    },[viewport.latitude, viewport.longitude]
  ) 
  

  
  return (
    <React.Fragment>

    {!props.Online ? (<h1>Bạn đang Offline</h1>) :
    (<ReactMapGL className='container'
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
      <Source 
        id="route" 
        type="geojson" 
        data= {geojson}>
        <Layer {...layerStyle} />
      </Source>
    </ReactMapGL>)}
    </React.Fragment>
  );
}


