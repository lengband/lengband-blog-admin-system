import React, { useState, useEffect } from 'react';
import marked from 'marked'
import axios from 'axios'
import moment from 'moment'
import {
  Row, Col, Input, Select, Button, DatePicker, message,
} from 'antd'
import servicePath from '../config/apiUrl'
import '../static/css/AddArticle.css'

const { Option } = Select
const { TextArea } = Input

function AddArticle(props) {
  const [articleId, setArticleId] = useState(0) // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('') // 文章标题
  const [articleContent, setArticleContent] = useState('') // markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') // html内容
  const [introducemd, setIntroducemd] = useState() // 简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') // 简介的html内容
  const [createTime, setCreateTime] = useState() // 发布日期
  // const [updateDate, setUpdateDate] = useState() // 修改日志的日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState('') // 选择的文章类别

  marked.setOptions({
    renderer: marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  });

  const changeContent = (e) => {
    setArticleContent(e.target.value)
    const html = marked(e.target.value)
    setMarkdownContent(html)
  }

  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value)
    const html = marked(e.target.value)
    setIntroducehtml(html)
  }

  const getArticleById = (id) => {
    axios(servicePath.getArticleById + id, {
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' },
    }).then(
      (res) => {
        // let articleInfo= res.data.data[0]
        setArticleTitle(res.data.data[0].title)
        setArticleContent(res.data.data[0].article_content)
        const html = marked(res.data.data[0].article_content)
        setMarkdownContent(html)
        setIntroducemd(res.data.data[0].introduce)
        const tmpInt = marked(res.data.data[0].introduce)
        setIntroducehtml(tmpInt)
        setCreateTime(res.data.data[0].create_time)
        setSelectType(res.data.data[0].typeId)
      },
    )
  }

  // 选择类别后的便哈
  const selectTypeHandler = (value) => {
    setSelectType(value)
  }

  // 保存文章的方法
  const saveArticle = () => {
    // markedContent()  //先进行转换
    if (!selectedType) {
      message.error('必须选择文章类别')
      return false
    }
    if (!articleTitle) {
      message.error('文章名称不能为空')
      return false
    }
    if (!articleContent) {
      message.error('文章内容不能为空')
      return false
    }
    if (!introducemd) {
      message.error('简介不能为空')
      return false
    }
    const dataProps = {}
    dataProps.type_id = selectedType
    dataProps.title = articleTitle
    dataProps.article_content = articleContent
    dataProps.introduce = introducemd
    dataProps.create_time = moment(createTime).format('YYYY-MM-DD HH:mm:ss')
    if (articleId === 0) { // 添加文章
      dataProps.view_count = 0
      axios({
        method: 'post',
        url: servicePath.addArticle,
        header: { 'Access-Control-Allow-Origin': '*' },
        data: dataProps,
        withCredentials: true,
      }).then(
        (res) => {
          setArticleId(res.data.insertId)
          if (res.data.isScuccess) {
            message.success('文章发布成功')
          } else {
            message.error('文章发布失败');
          }
        },
      )
    } else { // 修改文章
      dataProps.id = articleId
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        header: { 'Access-Control-Allow-Origin': '*' },
        data: dataProps,
        withCredentials: true,
      }).then(
        (res) => {
          if (res.data.isScuccess) {
            message.success('文章保存成功')
          } else {
            message.error('保存失败');
          }
        },
      )
    }
  }

  useEffect(() => {
    // 从中台得到文章类别信息
    const getTypeInfo = () => {
      axios({
        method: 'get',
        url: servicePath.getTypeInfo,
        header: { 'Access-Control-Allow-Origin': '*' },
        withCredentials: true,
      }).then(
        (res) => {
          if (res.data.data === '没有登录') {
            localStorage.removeItem('openId')
            console.log(props, 'props');
            props.history.push('/')
          } else {
            setTypeInfo(res.data.data)
            if (res.data.data && res.data.data.length) {
              setSelectType(res.data.data[0].id) // !!! 未生效
            }
          }
        },
      )
    }
    getTypeInfo()
    // 获得文章ID
    const tmpId = props.match.params.id
    if (tmpId) {
      setArticleId(tmpId)
      getArticleById(tmpId)
    }
  }, [props, props.match.params.id])

  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10}>
            <Col span={16}>
              <Input
                value={articleTitle}
                placeholder="博客标题"
                onChange={(e) => {
                  setArticleTitle(e.target.value)
                }}
                size="large"
              />
            </Col>
            <Col span={4}>
              <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler}>
                {
                  typeInfo.map(item => (<Option key={item.id} value={item.id}>{item.typeName}</Option>))
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10}>
            <Col span={12}>
              <TextArea
                value={articleContent}
                className="markdown-content"
                rows={35}
                onChange={changeContent}
                onPressEnter={changeContent}
                placeholder="文章内容"
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              />
            </Col>
          </Row>

        </Col>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large">暂存文章</Button>
&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
              <br />
            </Col>
            <Col span={24}>
              <br />
              <TextArea
                rows={4}
                value={introducemd}
                onChange={changeIntroduce}
                onPressEnter={changeIntroduce}
                placeholder="文章简介"
              />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: `文章简介：${introducehtml}` }}
              />
            </Col>
            <Col span={12}>
              <div className="date-select">
                <DatePicker
                  allowClear={false}
                  value={moment(createTime)}
                  onChange={(date, dateString) => setCreateTime(dateString)}
                  placeholder="发布日期"
                  size="large"
                />
              </div>
            </Col>
          </Row>
        </Col>

      </Row>
    </div>
  )
}
export default AddArticle
