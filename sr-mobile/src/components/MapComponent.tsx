import React, { useEffect, useState } from 'react'
import { Button } from 'antd';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { Link } from "react-router-dom";
import axios from 'axios';

const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1IjoieWVybGVya2F5bWl5b3IiLCJhIjoiY2s3dnQ3NW9sMGpzMzNsbzI1bWc5aWNrZSJ9.1Q1y9k4LETuJ514U1nim2g'
});

interface RoadData {
    road_id: number,
    road_name: string,
    road_lat: number,
    road_lng: number,
    default_speed: number,
    warning_speed: number
}

export default function MapComponent(): React.ReactElement {

    const [roads, setRoads] = useState<RoadData[] | null>(null);

    useEffect(() => {
        async function getRoads() {
            const { data } = await axios.get(`http://23.251.142.247:8888/api/nearby/38/27`);
            setRoads(data.data)
        }
        if (roads == null) {
            getRoads();
        }
    }, [roads])

    function renderRoads() {
        if (roads == null) {
            return;
        }
        return roads.map((road) => {
            return <Marker
                key={road.road_id}
                coordinates={[road.road_lng, road.road_lat]}
                anchor="bottom">
                <Link to={`/details/${road.road_id}`}><Button type="primary" shape="round">{road.road_name}</Button></Link>
            </Marker>
        });
    }

    return (
        <Map
            // eslint-disable-next-line react/style-prop-object
            style="mapbox://styles/mapbox/streets-v9"
            center={[27.190013, 38.454839]}
            zoom={[13]}
            containerStyle={{
                height: '100vh',
                width: '100vw',
            }}
            movingMethod="jumpTo"
        >
            {renderRoads()}
        </Map>
    );


}

