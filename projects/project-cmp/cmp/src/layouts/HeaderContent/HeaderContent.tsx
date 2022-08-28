import * as React from 'react'
import { HEADER_ID } from "../../configs/default";
import './HeaderContent.less'
import Logo from '../../../assets/taiden.jpeg';

const HeaderContent = () => {

  return (
    <div id={HEADER_ID} className="header-container">
      <img src={Logo} alt="taiden logo" height={50} />
      <span>会议管理平台</span>
      <span>v1.0.0</span>
    </div>
  )
}

export default HeaderContent;
