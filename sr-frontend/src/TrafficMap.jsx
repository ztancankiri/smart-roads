import React from 'react'
import GoogleMapReact from 'google-map-react';

export default function TrafficMap() {
    return (

        <div style={{ width: '100%', height: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
                defaultCenter={{ lat: 38.424373, lng: 27.151677 }}
                defaultZoom={15}
                distanceToMouse={() => { }}
            >
            </GoogleMapReact>
        </div>

    )
}
