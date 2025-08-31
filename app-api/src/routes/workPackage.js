const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.work_package',
    idCol: 'wp_id',
    filterable: ['project_id', 'status', 'code'],
    returning: 'wp_id, project_id, code, name, status'
});
const router = express.Router();
router.get('/', ctrl.list);
router.get('/:wp_id', ctrl.detail);
module.exports = router;
