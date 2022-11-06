import React, {useEffect} from 'react';
import { useState } from 'react';
import ReactMapGL, { GeolocateControl, Source, Layer } from '@goongmaps/goong-map-react';
import { MAP_KEY } from './GoongKEY';


const geolocateControlStyle = {
  right: 10,
  top: 10
};
export default function GongMap(props) {
  
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
  return (
    <ReactMapGL className='container'
      {...viewport}
      width="56vw"
      height="55vh"
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
    </ReactMapGL>
    
  );
}


