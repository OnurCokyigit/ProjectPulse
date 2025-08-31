const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.timesheet',
    idCol: 'ts_id',
    cols: ['person_id', 'project_id', 'wp_id', 'work_date', 'hours', 'activity_note'],
    required: ['person_id', 'project_id', 'wp_id', 'work_date', 'hours']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:ts_id', ctrl.detail);
router.patch('/:ts_id', ctrl.update);
router.delete('/:ts_id', ctrl.remove);
module.exports = router;
