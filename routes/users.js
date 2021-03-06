var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', user_controller.index);

router.get('/create', user_controller.user_create_get);
router.post('/create', user_controller.user_create_post);

router.post('/:id/delete', user_controller.user_delete_post);

router.post('/:id/eatnow', user_controller.user_eatNow_post);

router.post('/:id/puke/:pukeId', user_controller.user_puke_post);

router.get('/:id', user_controller.user_detail_get);

module.exports = router;
