const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.actual_cost',
    idCol: 'actual_cost_id',
    filterable: ['project_id', 'wp_id', 'currency'],
    returning: 'actual_cost_id, project_id, wp_id, tx_date, amount, currency, description'
});

const router = express.Router();
router.get('/', ctrl.list);
router.get('/:actual_cost_id', ctrl.detail);
module.exports = router;
