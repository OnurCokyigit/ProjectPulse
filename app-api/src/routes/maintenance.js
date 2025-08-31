const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.maintenance',
    idCol: 'mnt_id',
    cols: ['asset_id', 'request_date', 'start_date', 'end_date', 'type', 'cost', 'currency', 'notes'],
    required: ['asset_id', 'request_date', 'type']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:mnt_id', ctrl.detail);
router.patch('/:mnt_id', ctrl.update);
router.delete('/:mnt_id', ctrl.remove);
module.exports = router;
