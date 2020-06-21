import React from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
interface Props {

}

const BottomBar = (props: Props) => {
    return (
        <Row style={{ backgroundColor: 'white', height: '8vh' }} align='middle'>
            <Col span={8}></Col>
            <Col style={{ fontWeight: 'bold', fontSize: '24px' }} span={8}>D565</Col>
            <Col span={8}><RightOutlined /></Col>
        </Row>
    )
}

export default BottomBar;
