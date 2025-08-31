const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.org_unit',
    idCol: 'org_unit_id',
    filterable: ['org_unit_id', 'code', 'type'],
    returning: 'org_unit_id, code, name, type'
});
const router = express.Router();
router.get('/', ctrl.list);
router.get('/:org_unit_id', ctrl.detail);
module.exports = router;
