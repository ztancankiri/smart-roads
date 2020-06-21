import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSnowflake, faCarCrash, faTrafficLight, faSun, faCar } from '@fortawesome/free-solid-svg-icons'
import { LeftOutlined } from '@ant-design/icons';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const { Header, Content } = Layout;

const RoadName = styled.h1`
    display: inline-block;
    color: white;
    margin: 0;
    flex: 1;
    text-align: center;
    padding-right: 32px;
`;

const HeaderWrapper = styled(Header)`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 40%;
    padding: 0;
    background-color: #564ab1;
    color: white;
    min-height: 300px;
    padding: 16px;
    margin-bottom: 60px;
`;

const ContentWrapper = styled(Content)`
    background-color: white;
    border-radius: 40px 40px 0 0;
    padding: 32px;
    height: 100%;
`;

const SpeedIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 100%;
    height: 125px;
    width: 125px;
    background-color: #5045A2;
    margin-bottom: 1rem;
    padding-top: 32px;
    padding-bottom: 32px;
`;

const SuggestedSpeed = styled.p`
    font-size: 48px;
    font-weight: 500;
    line-height: 48px;
    height: 100%;
    margin-bottom: 10px;
    height: 125px;
`;

const SpeedUnit = styled.p`
    font-size: 16px;
    line-height: 1rem;
    margin: 0;
`;

const SpeedLimit = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    height: 50px;
    width: 50px;
    border-radius: 100%;
    border: 5px solid #F22727;
    background-color: white;
    color: black;
`;

const IncidentCard = styled.div`
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #F5F5F5;
    border-radius: 6px;
    margin-bottom: 8px;
    height: 65px;
    font-size: 16px;
    color: #000;
`;

const IconCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    width: 36px;
    border-radius: 100%;
    font-size: 16px;
    background-color: ${props => props.color || "white"};
    color: white;
    margin: 0 10px 0 6px;
`;

const SuggestedSpeedText = styled.h2`
    color: white;
    margin: 0px;
    font-size: 32px;
`;


interface RoadData {
    road_name: string,
    road_lat: number,
    road_lng: number,
    default_speed: number,
    warning_speed: number
}

interface Warning {
    warning_type: number;
}

const DetailsPage = () => {
    const [roadData, setRoadData] = useState<RoadData | null>(null);
    const [warnings, setWarnings] = useState<number[] | null>(null);
    const [densityData, setDensityData] = useState<number | null>(null);

    const { id } = useParams();


    useEffect(() => {
        console.log(id);
        async function getRoadDetails() {
            const { data } = await axios.get(`http://23.251.142.247:8888/api/road/${id}`);
            setRoadData(data.data[0])
        }
        async function getWarnings() {
            const { data } = await axios.get(`http://23.251.142.247:8888/api/warning/${id}`);
            if (data.data == null) {
                return;
            }
            setWarnings(data.data.map(({ warning_type }: Warning) => warning_type));
        }
        async function getRoadDensity() {
            const { data } = await axios.get(`http://23.251.142.247:8888/api/vehiclecount/${id}/1/density`);
            if (data.data == null) {
                return;
            }
            setDensityData(data.data[0].max);
        }
        if (roadData == null) {
            getRoadDetails();
        }
        if (warnings == null) {
            getWarnings();
        }
        if (densityData == null) {
            getRoadDensity();
        }
    }, [densityData, id, roadData, warnings])

    function RenderWarnings() {
        console.log('warnings', warnings);
        if (warnings == null) {
            return <IncidentCard>
                <div style={{ marginLeft: '16px' }}>No Warnings</div>
            </IncidentCard>
        }
        return warnings?.map((warning_type) => {
            if (warning_type === 1) {
                return <IncidentCard>
                    <IconCircle color="#04B2D9">
                        <FontAwesomeIcon icon={faSnowflake} />
                    </IconCircle>
                        Road icing expected
                    </IncidentCard>
            }
            if (warning_type === 2) {
                return <IncidentCard>
                    <IconCircle color="red">
                        <FontAwesomeIcon icon={faSun} />
                    </IconCircle>
                        Asphalt melting expected
                    </IncidentCard>
            }
        });
    }

    return (
        <div style={{ height: '100vh' }}>
            <Layout style={{ height: '100%', backgroundColor: '#564ab1' }}>
                <HeaderWrapper>
                    <div style={{ width: '100%', display: 'flex', alignItems: "center" }}>
                        <Link to="/">
                            <Button shape="circle" icon={<LeftOutlined />} ghost />
                        </Link>
                        <RoadName>{roadData ? roadData.road_name : 'Loading...'}</RoadName>
                    </div>
                    <SuggestedSpeedText>Suggested Speed</SuggestedSpeedText>
                    <SpeedIndicator>
                        <SuggestedSpeed>{roadData?.warning_speed || " "}</SuggestedSpeed>
                        <SpeedUnit>km/h</SpeedUnit>
                    </SpeedIndicator>
                    <SpeedLimit>{roadData?.default_speed || " "}</SpeedLimit>
                </HeaderWrapper>
                <ContentWrapper>
                    <h2>Warnings</h2>
                    {RenderWarnings()}
                    {densityData &&
                        <IncidentCard>
                            <IconCircle color="orange">
                                <FontAwesomeIcon icon={faCar} />
                            </IconCircle>
                            {densityData} cars passed in last 1 hour
                        </IncidentCard>}
                </ContentWrapper>
            </Layout>
        </div>
    )
}

export default DetailsPage
