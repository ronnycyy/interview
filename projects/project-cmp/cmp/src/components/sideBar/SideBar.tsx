import React from 'react';
import { List } from "antd";
import { shapes } from "../../configs/shapes";
import './SideBar.less';

const Sidebar = () => {
  const add = () => {
    console.log('add');
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={shapes}
      renderItem={shape =>
        <List.Item className="item" onClick={add}>{shape.title}</List.Item>
      }
    />
  )
}

export default Sidebar;
