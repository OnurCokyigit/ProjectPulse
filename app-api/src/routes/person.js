const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.person',
    idCol: 'person_id',
    filterable: ['org_unit_id'],          // <— filtre
    // Kendi kolon adlarına göre düzenle:
    returning: 'person_id, name, email, title, code, org_unit_id'
});

const router = express.Router();
router.get('/', ctrl.list);
router.get('/:person_id', ctrl.detail);
module.exports = router;
