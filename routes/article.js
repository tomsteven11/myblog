var express = require('express');
var router = express.Router();
const querySql = require('../db/index');

/* 注册接口 */
router.post('/add', async (req, res, next) => {
    let { title, content } = req.body;
    let { username } = req.user;
    try {
        let result = await querySql('select id from user where username = ?', [username]);
        let user_id = result[0].id;
        await querySql('insert into article(title,content,create_time,user_id) value(?,?,NOW(),?)', [title, content, user_id])
        res.send({
            code: 0,
            msg: '新增成功',
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});

// 查询全部博客列表
router.get('/allList', async (req, res, next) => {
    try {
        let result = await querySql('select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article');
        res.send({
            code: 0,
            msg: '获取成功',
            data: result,
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});

// 查询个人博客列表
router.get('/myList', async (req, res, next) => {
    let { username } = req.user;
    try {
        let user = await querySql('select id from user where username = ?', [username]);
        let user_id = user[0].id;
        let result = await querySql('select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where user_id = ?', [user_id]);
        res.send({
            code: 0,
            msg: '获取成功',
            data: result,
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});


// 查询博客详情
router.get('/detail', async (req, res, next) => {
    let article_id = req.query.article_id;
    try {
        let result = await querySql('select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id = ?', [article_id]);
        res.send({
            code: 0,
            msg: '获取成功',
            data: result[0],
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});

// 博客更新详情
router.post('/update', async (req, res, next) => {
    let { article_id, title, content } = req.body;
    let { username } = req.user;
    try {
        let user = await querySql('select id from user where username = ?', [username]);
        let user_id = user[0].id;
        await querySql('update article set title = ?,content = ? where id = ? and user_id = ?', [title, content, article_id, user_id]);
        res.send({
            code: 0,
            msg: '更新成功',
            data: null,
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});

// 博客更新详情
router.post('/delete', async (req, res, next) => {
    let { article_id } = req.body;
    let { username } = req.user;
    try {
        let user = await querySql('select id from user where username = ?', [username]);
        let user_id = user[0].id;
        await querySql('delete from article  where id = ? and user_id = ?', [article_id, user_id]);
        res.send({
            code: 0,
            msg: '删除成功',
            data: null,
        })
    } catch (e) {
        console.log('eeee', e);
        next()
    }
});




module.exports = router;
