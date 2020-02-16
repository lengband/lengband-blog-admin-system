import React, { useState } from 'react';
import {
  Layout, Menu, Breadcrumb, Icon,
} from 'antd';
import { Route } from 'react-router-dom';
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'
import UserList from './UserList'
import '../static/css/AdminIndex.css'

const img = require('../static/images/logo.png')

const {
  Header, Content, Footer, Sider,
} = Layout;

function AdminIndex(props) {
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };


  const MenuClick = e => {
    props.history.push(e.key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo"><img style={{ width: '100%' }} alt="lengband" src={img} /></div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={MenuClick}>
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>工作台</span>
          </Menu.Item>
          <Menu.Item key="/index/add">
            <Icon type="addArticle" />
            <span>编写文章</span>
          </Menu.Item>
          <Menu.Item key="/index/list">
            <Icon type="file" />
            <span>文章列表</span>
          </Menu.Item>
          <Menu.Item key="/index/userlist">
            <Icon type="user" />
            <span>用户管理</span>
          </Menu.Item>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>留言管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <div>
              <Route path="/index/" exact component={AddArticle} />
              <Route path="/index/add/" exact component={AddArticle} />
              <Route path="/index/add/:id" exact component={AddArticle} />
              <Route path="/index/list/" component={ArticleList} />
              <Route path="/index/userlist/" component={UserList} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>lengband.github.io</Footer>
      </Layout>
    </Layout>
  )
}

export default AdminIndex
