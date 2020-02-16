export const ipUrl = 'http://127.0.0.1:7001/api/'

export const servicePath = {
  login: `${ipUrl}login`, // 检查用户名密码
  getTypeList: `${ipUrl}type`, // 获得文章类别列表
  addArticle: `${ipUrl}article/create`, // 添加文章
  updateArticle: `${ipUrl}article/`, // :id 修改文章第
  getArticleList: `${ipUrl}article`, // 文章列表
  delArticle: `${ipUrl}delArticle/`, // 删除文章
  getArticleById: `${ipUrl}article/`, // 根据ID获得文章详情
  getUserList: `${ipUrl}user`,
}
