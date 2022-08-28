import * as React from 'react';
import './Editor.less';
import { Row, Col } from 'antd';
import { SIDEBAR_ID } from "../../configs/default";
import Sidebar from "../../components/sideBar/SideBar";
import Body from '../../components/Body/Body';

const Editor = () => {
  return (
    <div className="editor-container">
      <Row style={{ height: '100%' }}>
        <Col span={4} id={SIDEBAR_ID}>
          <Sidebar />
        </Col>
        <Col span={20}>
          <Body />
        </Col>
      </Row>
    </div>
  )
}

export default Editor
