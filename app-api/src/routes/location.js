const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.location',
    idCol: 'location_id',
    cols: ['name', 'type', 'parent_id'],
    required: ['name', 'type']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:location_id', ctrl.detail);
router.patch('/:location_id', ctrl.update);
router.delete('/:location_id', ctrl.remove);
module.exports = router;
