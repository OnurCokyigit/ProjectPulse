const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.asset',
    idCol: 'asset_id',
    cols: ['asset_tag', 'name', 'type', 'serial_no', 'purchase_date', 'initial_cost', 'status', 'owner_org_unit_id', 'location_id'],
    required: ['asset_tag', 'name', 'type', 'status', 'owner_org_unit_id']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:asset_id', ctrl.detail);
router.patch('/:asset_id', ctrl.update);
router.delete('/:asset_id', ctrl.remove);
module.exports = router;
