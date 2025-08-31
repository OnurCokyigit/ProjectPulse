const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.asset_movement',
    idCol: 'move_id',
    cols: ['asset_id', 'from_location_id', 'to_location_id', 'move_date', 'by_person_id', 'note'],
    required: ['asset_id', 'from_location_id', 'to_location_id', 'move_date']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:move_id', ctrl.detail);
router.patch('/:move_id', ctrl.update);
router.delete('/:move_id', ctrl.remove);
module.exports = router;
