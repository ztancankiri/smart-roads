import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Progress, Row, Col, Collapse, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import moment from 'moment';
import {
    useParams
} from "react-router-dom";
import {
    CloudOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const { Panel } = Collapse;

const bar_data = {
    labels: Array.from(Array(7).keys()).map((i) => moment().subtract(i, 'days').format('DD-MM')),
    datasets: [
        {
            label: 'Cars',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};
const ContentWrapper = styled.div`
    padding: 24px;
`;

const DataCard = styled.div`
    width: ${props => props.width};
    height: ${props => props.height || '250px'};
    background: #FFFFFF;
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
    border-radius: 32px;
    padding: 16px 32px;
    text-align: ${props => props.center ? 'center' : 'start'};;
    margin: 16px 8px;
`;

const DataCardTitle = styled.h3`
    display: inline-block;
    font-weight: bold;
`;

const DataCardContent = styled.div`
    display: flex;
    justify-content: ${props => props.center ? 'center' : 'space-around'};
`;

const RoadTitle = styled.h1`
    font-weight: bold;
    text-align: start;
    font-size: 28px;
    margin-bottom: 0;
`;

export default function RoadStatus() {
    const { id } = useParams();
    const [roadData, setRoadData] = useState({});
    const [carData, setCarData] = useState(null);

    useEffect(() => {
        async function getRoadData() {
            const { data } = await axios.get(`http://23.251.142.247:8888/api/road/${id}`);
            const { data: weather } = await axios.get(`http://23.251.142.247:8888/api/weather/${id}/1/analytics`);
            const { data: warnings } = await axios.get(`http://23.251.142.247:8888/api/warning/${id}`);
            const { data: sensors } = await axios.get(`http://23.251.142.247:8888/api/sensor?road_id=${id}`);
            if (!data.success) {
                return;
            }
            setRoadData({
                ...data.data[0],
                ...weather.data[0],
                warnings: warnings.data,
                sensors: sensors.data
            });
        }
        async function getCardData() {
            const carPoints = [];
            let today = new Date()
            let yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            for (let i = 0; i < 6; i++) {
                const { data: cars } = await axios.get(`http://23.251.142.247:8888/api/vehiclecount/${id}/${today.toISOString()}/${yesterday.toISOString()}/densityDateSum`);
                carPoints.push(cars.data[0]);
                today = new Date(yesterday);
                yesterday = new Date(today);
                yesterday.setHours(yesterday.getHours() - 24);
            }
            const { data: cars } = await axios.get(`http://23.251.142.247:8888/api/vehiclecount/${id}/${today.toISOString()}/${yesterday.toISOString()}/densityDateSum`);
            carPoints.push(cars.data[0]);
            console.log(carPoints);
            setCarData(carPoints.map(x => x.max))
        }
        getRoadData();
        getCardData();
    }, [id])

    function WarningsCard() {
        return (
            <DataCard>
                {/* <WarningTwoTone style={{ display: 'block', fontSize: '32px' }} twoToneColor="#ffcc00" /> */}
                <DataCardTitle>Warnings</DataCardTitle>
                {roadData.warnings ? <Collapse expandIconPosition="right">
                    {roadData.warnings.map(({ warning_type }) => {
                        if (warning_type === 1) {
                            return (
                                <Panel header={
                                    <>
                                        <CloudOutlined style={{ marginRight: '5px', fontSize: '16px' }} /> Road Icing Expected
                                    </>
                                } key="1">
                                    <p>Latest temperature recordings shows temperatures below 2 degrees.</p>
                                </Panel>
                            );
                        }
                        if (warning_type === 2) {
                            return (
                                <Panel header={
                                    <>
                                        <CloudOutlined style={{ marginRight: '5px', fontSize: '16px' }} /> Asphalt Melting Expected
                                    </>
                                } key="1">
                                    <p>Latest temperature recordings shows temperatures above 35 degrees.</p>
                                </Panel>
                            );
                        }
                    })}
                </Collapse> : <h2>No Warnings</h2>},
            </DataCard>
        );
    }

    function CarsBarChart() {
        return (
            <DataCard>
                <Bar
                    data={{
                        labels: Array.from(Array(7).keys()).map((i) => moment().subtract(i, 'days').format('DD-MM')).reverse(),
                        datasets: [
                            {
                                label: 'Cars',
                                backgroundColor: 'rgba(255,99,132,0.2)',
                                borderColor: 'rgba(255,99,132,1)',
                                borderWidth: 1,
                                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                                hoverBorderColor: 'rgba(255,99,132,1)',
                                data: carData,
                            }
                        ]
                    }}
                    options={{
                        maintainAspectRatio: false,
                    }}
                />
            </DataCard>
        );
    }

    function RoadConditions() {
        return (
            <DataCard>
                <DataCardTitle>Road Conditions</DataCardTitle>
                <DataCardContent>
                    <div>
                        <p>Temperature</p>
                        <Progress type="dashboard" strokeColor="#E34F69" percent={roadData.avg_temp * 2} format={percent => `${parseInt(percent / 2)}°C`} />
                    </div>
                    <div>
                        <p>Humidity</p>
                        <Progress type="dashboard" strokeColor="#66BFFF" percent={parseInt(roadData.avg_humidity)} />
                    </div>
                    <div>
                        <p>Pressure(hPa)</p>
                        <Progress type="dashboard" strokeColor="#8885FC" percent={roadData.avg_pressure / 20} format={percent => `${parseInt(percent * 20)}`} />
                    </div>
                </DataCardContent>
            </DataCard>
        );
    }

    function HeaderMap({ lat, lng }) {
        return <div style={{ width: '100%', height: '250px' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
                defaultCenter={{ lat, lng }}
                defaultZoom={15}
                distanceToMouse={() => { }}
                draggable={false}
            />
        </div>
    }

    // function TrafficCard({ lat, lng }) {
    //     if (snappedPoints == null) {
    //         return null;
    //     }
    //     function renderPolylines(map, maps) {
    //         let geodesicPolyline = new maps.Polyline({
    //             path: snappedPoints,
    //         })
    //         geodesicPolyline.setMap(map)
    //     }
    //     return (
    //         <DataCard>
    //             <GoogleMapReact
    //                 yesIWantToUseGoogleMapApiInternals={true}
    //                 bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
    //                 defaultCenter={{ lat, lng }}
    //                 defaultZoom={14}
    //                 distanceToMouse={() => { }}
    //                 onGoogleApiLoaded={({ map, maps }) => renderPolylines(map, maps)}
    //                 draggable={false}
    //             />
    //         </DataCard>)
    // }

    return (
        <>
            <HeaderMap lat={roadData.road_lat} lng={roadData.road_lng} />
            <ContentWrapper>
                <RoadTitle>{roadData.road_name}</RoadTitle>
                <Row justify="center">
                    <Col span={12}>
                        <RoadConditions />
                    </Col>
                    <Col span={12}>
                        <CarsBarChart />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={12}>
                        <WarningsCard />
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'column', padding: '64px' }} span={12}>
                        {/* <TrafficCard lat={roadData.road_lat} lng={roadData.road_lng} /> */}
                        <Link to={`/sensor/${id}`}>
                            <Button type="primary">See all sensors</Button>
                        </Link>
                        <Link to={`/reports/${id}`}>
                            <Button type="primary">See all reports</Button>
                        </Link>
                    </Col>
                </Row>
            </ContentWrapper>
        </>
    )
}
