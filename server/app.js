const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// 数据库连接配置
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '你的密码',
  database: 'wx_mini_app'
});

app.use(cors());
app.use(express.json());

// 示例API路由
app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务器运行正常' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 