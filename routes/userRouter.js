const router = require("express").Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');

router.post('/register', userCtrl.register);

router.post('/login', userCtrl.login);

router.get('/logout', auth, userCtrl.logout);

router.get('/e229146b1984cd62e322005c53468c', userCtrl.refreshToken);

router.get('/info', auth, userCtrl.getInfo);

module.exports = router;