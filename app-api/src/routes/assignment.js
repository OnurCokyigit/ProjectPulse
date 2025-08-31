const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.assignment',
    idCol: 'assign_id',
    cols: ['project_id', 'person_id', 'role_on_project', 'period'],
    required: ['project_id', 'person_id', 'role_on_project']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:assign_id', ctrl.detail);
router.patch('/:assign_id', ctrl.update);
router.delete('/:assign_id', ctrl.remove);
module.exports = router;
