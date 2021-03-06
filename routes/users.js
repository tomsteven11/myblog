var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const { PWD_SALT, EXPIRATION, PRIVATE_KEY } = require('../utils/constant');
const jwt = require('jsonwebtoken');
const { md5, upload } = require('../utils/index');

/* 注册接口 */
router.post('/register', async (req, res, next) => {
  let { username, password, nickname } = req.body;
  try {
    let user = await querySql('select * from user where username = ?', [username]);
    if (!user || user.length === 0) {
      password = md5(`${password}${PWD_SALT}`);
      await querySql('insert into user(username,password,nickname) value(?,?,?)', [username, password, nickname])
      res.send({
        code: 0,
        msg: '注册成功',
      })
    } else {
      res.send({
        code: -1,
        msg: '该账户已经被注册',
      })
    }
  } catch (e) {
    console.log('eeee', e);
    next()
  }
});

// 登录接口
router.post('/login', async (req, res, next) => {
  let { username, password, nickname } = req.body;
  try {
    let user = await querySql('select * from user where username = ?', [username]);
    if (!user || user.length === 0) {
      res.send({
        code: -1,
        msg: '该账号不存在',
      })
    } else {
      password = md5(`${password}${PWD_SALT}`);
      let result = await querySql('select * from user where username = ? and password = ?', [username, password])
      if (!result || result.length === 0) {
        res.send({
          code: -1,
          msg: '该账户密码不正确',
        })
      } else {
        let token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRATION });
        res.send({
          code: 0,
          msg: '登录成功',
          token,
        })
      }
    }
  } catch (e) {
    console.log('eeee', e);
    next()
  }
});

router.get('/info', async (req, res, next) => {
  let { username } = req.user
  try {
    let userInfo = await querySql('select nickname,head_img from user where username = ?', [username])
    res.send({
      code: 0,
      msg: '成功',
      data: userInfo[0],
    })
  } catch (e) {
    next(e);
  }
});

// 头像上传接口
router.post('/upload', upload.single('head_img'), async (req, res, next) => {
  console.log('req2222', req);
  let imgPath = req.file.path.split('public')[1];
  let imgUrl = 'http://127.0.0.1:3000' + imgPath;
  res.send({
    code: 0,
    msg: '上传成功',
    data: imgUrl,
  })
})

router.post('/updateUser', async (req, res, next) => {
  let { nickname, head_img } = req.body;
  let { username } = req.user;
  try {
    await querySql('update user set nickname = ?,head_img = ? where username = ?', [nickname, head_img, username])
    res.send({
      code: 0,
      msg: '更新成功',
    })
  } catch (e) {
    next(e);
  }
});

module.exports = router;
