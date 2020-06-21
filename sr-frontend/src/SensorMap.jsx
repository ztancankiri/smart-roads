import React, { useState, useEffect } from 'react';
import { Button, Popover, Layout } from 'antd';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;
const { Header } = Layout;

const BackButton = styled(Link)`
    display: inline-block;
    margin-right: 32px;
`;


export default function SensorMap() {
    const [roadCoord, setRoadCoord] = useState(null);
    const [sensors, setSensors] = useState(null);
    const [sensorData, setSensorData] = useState(null);
    const [days, setDays] = useState(null);
    const [time, setTime] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function getSensors() {
            const { data: sensorData } = await axios.get("http://23.251.142.247:8888/api/sensor?road_id=" + id);
            const { data: roadData } = await axios.get("http://23.251.142.247:8888/api/road/" + id);
            // const { data: roadData } = await axios.get("http://23.251.142.247:8888/api/sensor/" + id);
            console.log(roadData.data[0].road_lat, roadData.data[0].road_lng);
            setRoadCoord({ lat: roadData.data[0].road_lat, lng: roadData.data[0].road_lng });
            setSensors(sensorData.data);
            // sensorData.data.forEach(async (sensor_id) => {
            //     const { data: sensorIOTData } = await axios.get("http://23.251.142.247:8888/api/sensor/" + id);
            // });
        }
        getSensors()
    }, [id])

    useEffect(() => {
        if (days == null || time == null) {
            return;
        }

        async function filterSensorData(start, end) {
            const { data: weather } = await axios.get(`http://23.251.142.247:8888/api/weather/${id}/${start}/${end}/analyticsDate`);
            const { data: density } = await axios.get(`http://23.251.142.247:8888/api/vehiclecount/${id}/${start}/${end}/densityDate`);
            const allData = weather.data.map((weather_data, i) => {
                return { ...weather_data, ...density.data[i] }
            });
            setSensorData(allData);
            // setSensors(allData)
        }

        let start = new Date(days[0]);
        start.setHours(time[0]);
        start = start.toISOString()
        let end = new Date(days[1]);
        end.setHours(time[1]);
        end = end.toISOString()

        filterSensorData(start, end);

    }, [days, id, time])

    function renderSensors() {
        if (sensors == null) {
            return null;
        };
        let mergedSensors = [];
        if (sensorData == null) {
            mergedSensors = sensors;
        }
        else {
            mergedSensors = sensors.map((sensor, i) => {
                return { ...sensor, ...sensorData[i] }
            });
        }
        return mergedSensors.map(({ sensor_id, sensor_lat, sensor_lng, avg_temp, avg_humidity, avg_pressure, v_count }) => {
            return (
                <div key={sensor_id} lat={sensor_lat} lng={sensor_lng - 0.0001}>
                    <Popover title={`Sensor ${sensor_id}`} content={
                        <>
                            <p>Average Temp: {avg_temp || "No data"}</p>
                            <p>Average Humidity: {avg_humidity || "No data"}</p>
                            <p>Average Pressure: {avg_pressure || "No data"}</p>
                            <p>Vehicle Count: {v_count || "No data"}</p>
                        </>}>
                        <Button type="primary" shape="circle" >{sensor_id}</Button>
                    </Popover>
                </div>
            )
        });
    }

    return (
        <>
            <Header style={{ background: 'white', padding: '16px 32px', height: '150px', display: 'flex', alignItems: 'center' }}>
                <BackButton to={`/road/${id}`}>
                    <Button shape="circle" icon={<LeftOutlined />} />
                </BackButton>
                <div style={{
                    display: 'inline-block'
                }}>
                    <div>
                        <div style={{ display: 'inline-block', marginRight: '22px' }}>Day</div><DateRangePicker defaultValue={[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]} onChange={(time, time_string) => {
                            setDays(time_string)
                        }} />
                    </div>
                    <div>
                        <div style={{ display: 'inline-block', marginRight: '16px' }}>Time</div><TimeRangePicker defaultValue={[moment(new Date(), 'HH').subtract(2, 'hours'), moment(new Date(), 'HH')]} format="HH" onChange={(time, time_string) => {
                            setTime(time_string)
                        }} />
                    </div>
                </div>
            </Header>
            <div style={{ width: '100%', height: '100%' }}>
                {roadCoord && <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCUHyj6rjcJEeLTpFT7SyAckXLAmL2Qylw' }}
                    defaultCenter={roadCoord}
                    defaultZoom={15}
                    distanceToMouse={() => { }}
                >
                    {renderSensors()}
                </GoogleMapReact>
                }
            </div>
        </>
    )
}
