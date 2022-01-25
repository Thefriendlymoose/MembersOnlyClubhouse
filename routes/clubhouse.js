var express = require('express');
var router = express.Router();
var clubhouseController = require('../controllers/clubhouseController');

router.get('/', clubhouseController.index_get);


router.get('/sign-up', clubhouseController.sign_up_get);
router.post('/sign-up', clubhouseController.sign_up_post);

router.get('/log-in', clubhouseController.log_in_get);
router.post('/log-in', clubhouseController.log_in_post);
router.get('/log-out', clubhouseController.log_out_get);

router.get('/create-message', clubhouseController.create_message_get);
router.post('/create-message', clubhouseController.create_message_post);
router.post('/delete-message', clubhouseController.delete_message_post);

router.get('/join-club', clubhouseController.join_club_get);
router.post('/join-club', clubhouseController.join_club_post);
router.get('/leave-club', clubhouseController.leave_club_get);

router.get('/become-admin', clubhouseController.become_admin_get);
router.post('/become-admin', clubhouseController.become_admin_post);
router.get('/remove-admin', clubhouseController.remove_admin_get);





module.exports = router;