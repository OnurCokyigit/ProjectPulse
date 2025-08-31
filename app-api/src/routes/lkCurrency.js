const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');

const ctrl = makeController({
    table: 'core.lk_currency',
    idCol: 'code',
    idType: 'text',
    cols: ['code', 'name'],
    required: ['code', 'name']
});

const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:code', ctrl.detail);
router.patch('/:code', ctrl.update);
router.delete('/:code', ctrl.remove);
module.exports = router;
