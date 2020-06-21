import React, { useEffect, useState } from 'react'
import { Layout, Button, InputNumber, message, Alert } from 'antd'
import ReactMapboxGl, { Feature, Layer } from 'react-mapbox-gl';
import styled from 'styled-components';
import useLocation from './useGeolocation';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1IjoieWVybGVya2F5bWl5b3IiLCJhIjoiY2s3dnQ3NW9sMGpzMzNsbzI1bWc5aWNrZSJ9.1Q1y9k4LETuJ514U1nim2g'
});

interface Address {
    long_name: string,
    short_name: string,
    types: Array<string>
}

const { Header, Content } = Layout;

const HeaderWrapper = styled(Header)`
    background-color: #0476D9;
    color: white;
    text-align: center;
`;

const ContentWrapper = styled(Content)`
    background-color: #FFFFFF;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 36px;
    align-items: center;
`;

const LoadingBar = styled.div`
    width: 300px;
    height: 32px;
    background-color: #F2F2F2;
    margin-bottom: 16px;
    margin-top: 16px;
`;

const LoadingMap = styled.div`
    width: 300px;
    height: 300px;
    border-radius: 8px;
    background-color: #F2F2F2;
`;

const SpeedInputWrapper = styled.div`
    margin-top: 32px;
    width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

interface RoadData {
    road_id: number,
    road_name: string,
    road_lat: number,
    road_lng: number,
    default_speed: number,
    warning_speed: number
}

export default function AddRoad() {
    const { error, position } = useLocation();
    const [name, setName] = useState<string>("");
    const [roadData, setRoadData] = useState<RoadData | null>(null);
    const [defaultSpeed, setDefaultSpeed] = useState<number>(0);
    const [warningSpeed, setWarningSpeed] = useState<number>(0);

    async function addSensor() {
        if (defaultSpeed < 0 || warningSpeed < 0) {
            message.error('Enter the required speed limits');
            return;
        }
        const { data } = await axios.post('http://23.251.142.247:8888/api/sensor', {
            road_name: name,
            sensor_lat: position.latitude,
            sensor_lng: position.longitude,
            default_speed: defaultSpeed,
            warning_speed: warningSpeed
        });

        if (data.success) {
            message.success('Sensor Added');
        }

    }

    useEffect(() => {
        async function reverseGeoCode() {
            const { latitude, longitude } = position;
            if (latitude === 0 || longitude === 0) {
                return;
            }
            const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw`);
            let addresses: Array<Address> = data.results[0].address_components;
            addresses = addresses.filter((address) => address.types.includes('route'));
            if (addresses.length <= 0) {
                return;
            }
            if (addresses[0].short_name == null) {
                return;
            }
            checkRoad(addresses[0].short_name);
            setName(addresses[0].short_name)
        }
        async function checkRoad(name: string) {
            const { data } = await axios.post(`http://23.251.142.247:8888/api/road/name`, {
                road_name: name
            });
            if (data.success) {
                setRoadData(data.data[0]);
                setDefaultSpeed(data.data[0].default_speed);
                setWarningSpeed(data.data[0].warning_speed);
            }
        }
        reverseGeoCode();
    }, [position, setName])

    return (
        <div>
            <Layout style={{ height: '100%', backgroundColor: '#564ab1' }}>
                <HeaderWrapper>
                    <h1 style={{ color: 'white' }}>Sensor Installation</h1>
                </HeaderWrapper>
                <ContentWrapper>
                    <h2>You are on</h2>
                    {name !== "" ?
                        <>
                            <h1 style={{ fontSize: '36px' }}>{name}</h1>
                            {roadData && <Alert style={{ marginBottom: '8px' }} message="Road Already Registered" type="success" showIcon />}
                            <Map
                                // eslint-disable-next-line react/style-prop-object
                                style="mapbox://styles/mapbox/streets-v9"
                                center={[position.longitude, position.latitude]}
                                zoom={[16]}
                                containerStyle={{
                                    height: '300px',
                                    width: '300px',
                                    borderRadius: '8px'
                                }}
                                movingMethod="jumpTo"
                            >
                                <Layer
                                    type="circle"
                                    paint={{
                                        'circle-radius': 5,
                                        'circle-color': '#E54E52',
                                        'circle-stroke-color': '#fff',
                                        'circle-stroke-width': 1,
                                    }}>
                                    <Feature coordinates={[position.longitude, position.latitude]} />
                                </Layer>
                            </Map>
                        </>
                        :
                        <>
                            <LoadingBar />
                            <LoadingMap />
                        </>
                    }
                    <SpeedInputWrapper>
                        <h2 style={{ display: 'inline-block', margin: '0' }}>Default Speed</h2>
                        <InputNumber value={defaultSpeed} defaultValue={roadData ? roadData.default_speed : 0} onChange={(value) => {
                            if (value) {
                                setDefaultSpeed(value);
                            }
                        }} />
                    </SpeedInputWrapper>
                    <SpeedInputWrapper>
                        <h2 style={{ display: 'inline-block', margin: '0' }}>Warning Speed</h2>
                        <InputNumber value={warningSpeed} defaultValue={roadData ? roadData.warning_speed : 0} onChange={(value) => {
                            if (value) {
                                setWarningSpeed(value);
                            }
                        }} />
                    </SpeedInputWrapper>
                    <Button onClick={addSensor} disabled={name === ""} size="large" shape="round" style={{ backgroundColor: '#F24F13', color: 'white', marginTop: '32px' }}>Add Sensor</Button>
                </ContentWrapper>
            </Layout>
        </div>
    )
}
