import React from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import RoadStatus from './RoadStatus';
import RoadList from './RoadList';
import DensityMap from './DensityMap';
import SensorMap from './SensorMap';
import Reports from './Reports';
import TrafficMap from './TrafficMap';

import styled from 'styled-components';

import { Layout, Menu } from 'antd';
import {
  CarOutlined,
  AlertOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FormOutlined,
} from '@ant-design/icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Logo = styled.div`
    font-size: 32px;
    font-weight: 200;
    height: 32px;
    line-height: 32px;
    margin: 16px 16px 12px 16px;
    color: black;
`;

const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

function App() {
  function ContentRouter() {
    return (
      <Switch>
        <Route path="/density">
          <DensityMap />
        </Route>
        <Route path="/sensor/:id">
          <SensorMap />
        </Route>
        <Route path="/reports/:id">
          <Reports />
        </Route>
        <Route path="/traffic">
          <TrafficMap />
        </Route>
        <Route path="/road/:id">
          <RoadStatus />
        </Route>
        <Route path="/">
          <RoadList />
        </Route>
      </Switch>
    );
  }
  return (
    <div className="App">
      <Router>
        <Layout style={{ height: '100vh' }}>
          <Sider style={{ background: 'white' }} trigger={null} collapsible collapsed={false}>
            <Logo>autoroad</Logo>
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                <StyledLink to="/roads">
                  Road List
                </StyledLink>
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                <StyledLink to="/density">
                  Density Map
                </StyledLink>
              </Menu.Item>
              {/* <Menu.Item key="3" icon={<CarOutlined />}>
                <StyledLink to="/traffic">
                  Traffic Map
                </StyledLink>
              </Menu.Item> */}
              {/* <Menu.Item key="4" icon={<FormOutlined />}>
                <StyledLink to="/reports">
                  Reports
                </StyledLink>
              </Menu.Item> */}
            </Menu>
          </Sider>
          <Layout>
            <Content
              style={{
                minHeight: 280,
              }}
            >
              <ContentRouter />
            </Content>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
