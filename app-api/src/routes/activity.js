const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.activity',
    idCol: 'activity_id',
    cols: ['wp_id', 'name', 'description', 'date_plan', 'date_act', 'progress_pct'],
    required: ['wp_id', 'name']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:activity_id', ctrl.detail);
router.patch('/:activity_id', ctrl.update);
router.delete('/:activity_id', ctrl.remove);
module.exports = router;
