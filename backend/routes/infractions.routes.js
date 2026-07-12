/**
 * Route lecture de la base juridique (65 infractions).
 * @module routes/infractions.routes
 */
const router = require('express').Router();
const INFRACTIONS = require('../data/infractions65.json');

router.get('/', (req, res) => res.json(INFRACTIONS));
router.get('/:id', (req, res) => {
  const inf = INFRACTIONS.find(i => i.id == req.params.id);
  inf ? res.json(inf) : res.status(404).json({ erreur: 'Infraction introuvable.' });
});

module.exports = router;
