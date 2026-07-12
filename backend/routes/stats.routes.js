const router = require('express').Router();
const ctrl = require('../controllers/stats.controller');
router.get('/dashboard', ctrl.tableauBord);
router.get('/provinces', ctrl.parProvince);
module.exports = router;
