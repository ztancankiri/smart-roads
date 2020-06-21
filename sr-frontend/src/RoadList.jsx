import React, { useEffect, useState, useMemo } from 'react'
import { Card, Button } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import {
    Link
} from "react-router-dom";

export default function RoadList() {
    const [roads, setRoads] = useState([]);

    useEffect(() => {
        async function getAllRoads() {
            const { data: { data } } = await axios.get('http://23.251.142.247:8888/api/road');
            setRoads(data);
        }
        getAllRoads();
    }, []);

    const RoadButtons = useMemo(() => {
        return roads.map(({ road_id, road_lat, road_lng, road_name }) => {
            return (
                <div key={road_id}
                    lat={road_lat}
                    lng={road_lng}>
                    <Link to={`/road/${road_id}`}>
                        <Button shape="round" type={"primary"} >
                            {road_name}
                        </Button>
                    </Link>
                </div>
            );
        })
    }, [roads])


    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
                defaultCenter={{ lat: 38.458883, lng: 27.196989 }}
                defaultZoom={14}
                distanceToMouse={() => { }}
            >
                {RoadButtons}
            </GoogleMapReact>

        </div>
    )
}
