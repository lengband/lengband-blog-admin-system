import React, { useState, useEffect } from 'react';
import moment from 'moment'
import '../static/css/ArticleList.css'

import {
  List, Row, Col, Modal, message, Button,
} from 'antd';
import http from '../lib/http'
import { servicePath } from '../config/apiUrl'

const { confirm } = Modal;

function UserList(props) {
  const [list, setList] = useState([])

  // 得到文章列表
  const getList = () => {
    http({
      method: 'get',
      url: servicePath.getUserList,
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' },
    }).then(
      res => {
        setList(res.data.list)
      },
    )
  }

  // 修改文章
  const updateArticle = (id) => {
    props.history.push(`/index/add/${id}`)
  }

  // 删除文章的方法
  const delArticle = (id) => {
    confirm({
      title: '确定要删除这篇博客文章吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
        http(servicePath.delArticle + id, { withCredentials: true }).then(
          () => {
            message.success('文章删除成功')
            getList()
          },
        )
      },
      onCancel() {
        message.success('没有任何改变')
      },
    });
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div>
      <List
        header={(
          <Row className="list-div">
            <Col span={8}>
              <b>标题</b>
            </Col>
            <Col span={3}>
              <b>类别</b>
            </Col>
            <Col span={3}>
              <b>发布时间</b>
            </Col>
            <Col span={3}>
              <b>浏览量</b>
            </Col>
            <Col span={4}>
              <b>操作</b>
            </Col>
          </Row>
)}
        bordered
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Row className="list-div">
              <Col span={8}>
                {item.title}
              </Col>
              <Col span={3}>
                {item.typeName}
              </Col>
              <Col span={3}>
                {moment(item.create_time).format('YYYY-MM-DD')}
              </Col>
              <Col span={3}>
                {item.view_count}
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={() => { updateArticle(item.id) }}>修改</Button>
&nbsp;
                <Button onClick={() => { delArticle(item.id) }}>删除 </Button>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  )
}
export default UserList
