// src/routes/metrics.js
const express = require('express');
const { pool } = require('../db');
const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const sql = `
      SELECT
        (SELECT COUNT(*) FROM core.project)        AS projects,
        (SELECT COUNT(*) FROM core.work_package)   AS work_packages,
        (SELECT COUNT(*) FROM core.activity)       AS activities,
        (SELECT COUNT(*) FROM core.asset)          AS assets,
        (SELECT COUNT(*) FROM core.budget_item)    AS budget_items
    `;
        const { rows } = await pool.query(sql);
        res.json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
