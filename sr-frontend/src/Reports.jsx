import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import moment from 'moment';

const labels = Array.from(Array(7).keys()).map((i) => moment().subtract(i, 'days').format('DD-MM'));

const ContentWrapper = styled.div`
    padding: 24px;
`;

const LoadingBar = styled.div`
    width: 300px;
    height: 16px;
    background-color: #F2F2F2;
    margin-bottom: 16px;
    margin-top: 16px;
`;

const DataCard = styled.div`
    width: ${props => props.width || '500px'};
    height: ${props => props.height || '250px'};
    background: #FFFFFF;
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
    border-radius: 32px;
    padding: 24px 32px;
    text-align: ${props => props.center ? 'center' : 'start'};;
    margin: 16px 0;
`;

export default function Reports() {
    const [roadData, setRoadData] = useState(null);
    const [tempReport, setTempReport] = useState(null);
    const [humReport, setHumReport] = useState(null);
    const [pressReport, setPressReport] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function getRoadData() {
            const weatherPoints = [];
            let today = new Date()
            let yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            const { data: roadData } = await axios.get(`http://23.251.142.247:8888/api/road/${id}`);
            for (let i = 0; i < 6; i++) {
                const { data: weather } = await axios.get(`http://23.251.142.247:8888/api/weather/${id}/${today.toISOString()}/${yesterday.toISOString()}/analyticsDateSum`);
                weatherPoints.push(weather.data[0]);
                today = new Date(yesterday);
                yesterday = new Date(today);
                yesterday.setHours(yesterday.getHours() - 24);
            }
            const { data: weather } = await axios.get(`http://23.251.142.247:8888/api/weather/${id}/${today.toISOString()}/${yesterday.toISOString()}/analyticsDateSum`);
            weatherPoints.push(weather.data[0]);

            const avgTemps = []
            const avgHums = []
            const avgPresses = []

            weatherPoints.map(({ avg_temp, avg_humidity, avg_pressure }) => {
                avgTemps.push(avg_temp);
                avgHums.push(avg_humidity);
                avgPresses.push(avg_pressure);
            });
            console.log(weatherPoints);
            setTempReport({
                labels: labels.reverse(),
                datasets: [
                    {
                        label: 'Temperature(°C)',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: avgTemps.reverse()
                    }
                ]
            });
            setHumReport({
                labels: labels.reverse(),
                datasets: [
                    {
                        label: 'Humidity(%)',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: avgHums.reverse()
                    }
                ]
            });
            setPressReport({
                labels: labels.reverse(),
                datasets: [
                    {
                        label: 'Pressure(hPa)',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: avgPresses.reverse()
                    }
                ]
            });
            setRoadData(roadData.data[0]);
        }
        if (roadData == null) {
            getRoadData()
        }
    }, [roadData, id])

    function TemperatureCard() {
        return (
            <DataCard width="100%">
                <Line
                    data={tempReport}
                    options={{
                        maintainAspectRatio: false,
                    }}
                />
            </DataCard>
        );
    }

    function HumidityCard() {
        return (
            <DataCard width="100%">
                <Line
                    data={humReport}
                    options={{
                        maintainAspectRatio: false,
                    }}
                />
            </DataCard>
        );
    }

    function PressureCard() {
        return (
            <DataCard width="100%">
                <Line
                    data={pressReport}
                    options={{
                        maintainAspectRatio: false,
                    }}
                />
            </DataCard>
        );
    }


    return (
        <ContentWrapper>
            <h2>{roadData ? roadData.road_name : <LoadingBar />}</h2>
            <h3>Temperature</h3>
            <TemperatureCard />
            <h3>Humidity</h3>
            <HumidityCard />
            <h3>Pressure</h3>
            <PressureCard />
        </ContentWrapper>
    )
}
