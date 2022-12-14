import * as React from 'react';
import { Layout } from 'antd';
import './App.less';
import Editor from '../layouts/Editor/Editor';
import HeaderContent from '../layouts/HeaderContent/HeaderContent';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout className="App">
      <Header style={{ padding: '0px 18px' }}>
        <HeaderContent />
      </Header>
      <Content>
        <Editor />
      </Content>
    </Layout>
  )
}

export default App;
