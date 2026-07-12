/**
 * Routes API des PV.
 * @module routes/pv.routes
 */
const router = require('express').Router();
const ctrl = require('../controllers/pv.controller');

router.post('/', ctrl.creer);
router.get('/', ctrl.lister);
router.get('/:id', ctrl.obtenir);
router.put('/:id', ctrl.mettreAJour);
router.delete('/:id', ctrl.supprimer);
router.get('/:id/versions', ctrl.versions);

module.exports = router;
