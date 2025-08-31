const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.budget_version',
    idCol: 'budget_id',
    cols: ['project_id', 'fiscal_year', 'version_no', 'is_final'],
    required: ['project_id', 'fiscal_year', 'version_no'],
    returning: 'budget_id, project_id, fiscal_year, version_no, is_final, created_at'
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:budget_id', ctrl.detail);
router.patch('/:budget_id', ctrl.update);
router.delete('/:budget_id', ctrl.remove);
module.exports = router;
