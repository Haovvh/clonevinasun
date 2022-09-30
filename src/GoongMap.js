import * as React from 'react';
import {useState} from 'react';
import MapGL from '@goongmaps/goong-map-react';

const GOONG_MAPTILES_KEY = 'NQwv212RcJeMfcVxfWdgudp6k8UwXpatI2oSKExX'; // Set your goong maptiles key here

function GongMap() {
  const [viewport, setViewport] = useState({
    latitude: 10.739,
    longitude: 106.6657,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });

  return (
    <MapGL
      {...viewport}
      width="1000px"
      height="1000px"
      mapStyle='https://tiles.goong.io/assets/goong_map_web.json'
      onViewportChange={setViewport}
      goongApiAccessToken={GOONG_MAPTILES_KEY}
    />
  );
}

export default GongMap;


