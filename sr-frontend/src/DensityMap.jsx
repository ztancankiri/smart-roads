import React, { useState, useEffect, useMemo } from 'react'
import { Button, Popover, Layout } from 'antd';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import moment from 'moment';

import {
    CarFilled
} from '@ant-design/icons';

const { Header } = Layout;

export default function DensityMap() {
    const [roads, setRoads] = useState([]);

    useEffect(() => {
        async function getRoads() {
            const { data } = await axios.get('http://23.251.142.247:8888/api/nearby/38/27');
            if (!data.success) {
                return;
            }
            const roads = data.data;
            let new_roads = []
            let today = moment()
            let lastWeek = moment();
            lastWeek.subtract(7, "days")

            for (let i = 0; i < roads.length; i++) {
                const { data } = await axios.get(`http://23.251.142.247:8888/api/vehiclecount/${roads[i].road_id}/${today.toISOString()}/${lastWeek.toISOString()}/densityDateSum`);
                const count = data.data[0].max;
                new_roads.push({ ...roads[i], vehicleCount: count })
            }
            setRoads(new_roads);
        }
        if (roads.length <= 0) {
            getRoads();
        }
    }, [])


    function PopoverContent({ carCount }) {
        return (
            <div>
                {carCount != null ? <><CarFilled style={{ marginRight: '6px' }} />{carCount} Cars/Week</> : "No data"}
            </div>
        )
    }

    const RenderRoadsMemo = useMemo(() => {
        if (roads == null) {
            return null;
        }
        const arr = roads.map(({ road_id, road_name, road_lat, road_lng, vehicleCount }) => {
            let color = null;
            let dollars = "$";
            console.log(vehicleCount);

            if (vehicleCount != null) {
                if (vehicleCount < 500) {
                    color = "#FB5348"
                }
                else if (vehicleCount < 1000) {
                    color = "#FFD600"
                    dollars = "$$";
                }
                else if (vehicleCount >= 1000) {
                    color = "#63D884"
                    dollars = "$$$";
                }
            }
            return <div
                key={road_id}
                lat={road_lat}
                lng={road_lng}>
                <Popover title={road_name} content={<PopoverContent carCount={vehicleCount} />}>
                    <Button size="large" style={{ backgroundColor: color, color: 'white' }} shape='circle'>{dollars}</Button>
                </Popover>
            </div >
        });
        return arr;
    }, [roads]);


    return (
        <>
            <Header style={{ background: 'white', padding: '16px 32px', height: '90px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ marginRight: '16px' }}>
                        <Button style={{ marginRight: '8px', backgroundColor: '#FB5348', color: 'white' }} size="large" shape='circle'>$</Button>
                        Low Profit Potential
                    </div>
                    <div style={{ marginRight: '16px' }}>
                        <Button style={{ marginRight: '8px', backgroundColor: '#FFD600', color: 'white' }} size="large" shape='circle'>$$</Button>
                        Medium Profit Potential
                    </div>
                    <div style={{ marginRight: '16px' }}>
                        <Button style={{ marginRight: '8px', backgroundColor: '#63D884', color: 'white' }} size="large" shape='circle'>$$$</Button>
                        High Profit Potential
                    </div>
                </div>
            </Header>
            <div style={{ width: '100%', height: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
                    defaultCenter={{ lat: 38.424373, lng: 27.151677 }}
                    defaultZoom={15}
                    distanceToMouse={() => { }}
                >
                    {RenderRoadsMemo}
                </GoogleMapReact>
            </div>
        </>
    )
}
