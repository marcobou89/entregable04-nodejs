const express = require('express');
const routerUser = require('./user.route');
const routerPost = require('./post.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users',routerUser)
router.use('/posts',routerPost)




module.exports = router;