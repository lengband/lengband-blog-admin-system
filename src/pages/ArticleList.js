import React, { useState, useEffect } from 'react';
import '../static/css/ArticleList.css'

import {
  Button, Modal, message, Divider, Table,
} from 'antd';
import http from '../lib/http'
import { servicePath } from '../config/apiUrl'

const { confirm } = Modal;

function ArticleList(props) {
  const [list, setList] = useState([])

  // 得到文章列表
  const getList = () => {
    http({
      method: 'get',
      url: servicePath.getArticleList,
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
    });
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = [
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类别',
      dataIndex: 'type.cn_name',
      key: 'type.cn_name',
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      key: 'view_count',
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
export default ArticleList
