import * as React from 'react';
import {useState} from 'react';
import ReactMapGL, {GeolocateControl} from '@goongmaps/goong-map-react';
import GoongAPI from './GoongAPI';


const geolocateControlStyle= {
  right: 10,
  top: 10
};

function GoongMap() {
  const [viewport, setViewport] = useState({
    latitude: 10.739,
    longitude: 106.6657,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });
  console.log(GoongAPI.MAP_KEY);
  return (
    <React.Fragment>
      
    <ReactMapGL 
      {...viewport} 
      width="1000px" 
      height="1000px" 
      mapStyle='https://tiles.goong.io/assets/goong_map_web.json'
      goongApiAccessToken={GoongAPI.MAP_KEY()}
      onViewportChange={setViewport}      
      >
        

      <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{enableHighAccuracy: true}}
        trackUserLocation={true}
        auto
      />
    </ReactMapGL>
    </React.Fragment>
  );
}

export default GoongMap;


