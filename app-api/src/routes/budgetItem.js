const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.budget_item',
    idCol: 'budget_item_id',
    filterable: ['project_id', 'wp_id', 'year', 'currency'],
    returning: 'budget_item_id, project_id, wp_id, code, name, category, planned_amount, currency, year'
});

const router = express.Router();
router.get('/', ctrl.list);
router.get('/:budget_item_id', ctrl.detail);
module.exports = router;
