const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.supplier',
    idCol: 'supplier_id',
    cols: ['name', 'tax_no', 'country', 'iban', 'is_active'],
    required: ['name', 'tax_no']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:supplier_id', ctrl.detail);
router.patch('/:supplier_id', ctrl.update);
router.delete('/:supplier_id', ctrl.remove);
module.exports = router;
