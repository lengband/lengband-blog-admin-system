import React, { useState, useEffect } from 'react';
import '../static/css/ArticleList.css'

import {
  Table, Modal, message, Button, Divider,
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
        setList(res.data.data)
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
      title: '确定要删除这位用户吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
        http(servicePath.delArticle + id, { withCredentials: true }).then(
          () => {
            message.success('用户删除成功')
            getList()
          },
        )
      },
    });
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '简介',
      dataIndex: 'headline',
      key: 'headline',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          <Button type="link" onClick={() => { updateArticle(item._id) }}>修改</Button>
          <Divider type="vertical" />
          <Button type="link" onClick={() => { delArticle(item._id) }}>删除</Button>
        </span>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={list} />
  )
}
export default UserList
