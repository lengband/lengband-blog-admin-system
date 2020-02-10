import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import '../static/css/Login.css';
import {
  Card, Input, Icon, Button, Spin, message,
} from 'antd';
import http from '../lib/http'
import { setToken } from '../lib/auth'
import { servicePath } from '../config/apiUrl'

function Login(props) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
  }, [])

  const login = () => {
    if (!userName) {
      message.error('用户名不能为空')
      return false
    } if (!password) {
      message.error('密码不能为空')
      return false
    }
    setIsLoading(true)
    const dataProps = {
      name: userName,
      password,
    }
    http({
      method: 'post',
      url: servicePath.login,
      data: dataProps,
      header: { 'Access-Control-Allow-Origin': '*' },
      withCredentials: true, // 携带cookie，共享 session
    }).then(res => {
      setIsLoading(false)
      props.history.push('/index')
      setToken(res.data.token)
    })
      .catch(error => {
        message.error('用户名密码错误')
        setIsLoading(false)
        throw error
      })
  }

  return (
    <div className="login-div">
      <Spin tip="Loading..." spinning={isLoading}>
        <Card title="lengband Blog admin System" bordered style={{ width: 400 }}>
          <Input
            id="userName"
            size="large"
            placeholder="Enter your userName"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e) => { setUserName(e.target.value) }}
          />
          <br />
          <br />
          <Input.Password
            id="password"
            size="large"
            placeholder="Enter your password"
            prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <br />
          <br />
          <Button type="primary" size="large" block onClick={login}> Login in </Button>
        </Card>
      </Spin>
    </div>
  )
}

export default Login
