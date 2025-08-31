// src/routes/project.js
const express = require('express');
const { makeController } = require('../controllers/genericControllerFactory');
const { pool } = require('../db');

const ctrl = makeController({
    table: 'core.project',
    idCol: 'project_id',
    filterable: ['project_id', 'code', 'domain', 'org_unit_id', 'status'],
    returning: 'project_id, code, title, domain, org_unit_id, status, start_date, end_date'
});

const router = express.Router();

// Liste
router.get('/', ctrl.list);

// Domain lookup (varsa)
router.get('/domains', async (req, res) => {
    try {
        const sql = `
      SELECT pg_get_expr(conbin, conrelid) AS expr
      FROM pg_constraint WHERE conname = 'project_domain_check'
    `;
        const { rows } = await pool.query(sql);
        const expr = rows[0]?.expr || '';
        const allowed = [...expr.matchAll(/'([^']+)'/g)].map(m => m[1]);
        if (allowed.length) return res.json(allowed);
        const r2 = await pool.query(`SELECT DISTINCT domain FROM core.project ORDER BY 1`);
        return res.json(r2.rows.map(r => r.domain).filter(Boolean));
    } catch (e) { res.status(400).json({ error: e.message }); }
});


router.get('/:project_id/finance', async (req, res) => {
    const { project_id } = req.params;
    try {
        const s1 = await pool.query(
            `SELECT planned_total, actual_total, variance
         FROM core.v_project_finance WHERE project_id = $1`,
            [project_id]
        );
        const s2 = await pool.query(
            `SELECT wp_id, code, planned, actual, variance
         FROM core.v_wp_finance WHERE project_id = $1
         ORDER BY code`,
            [project_id]
        );
        res.json({
            summary: s1.rows[0] || { planned_total: 0, actual_total: 0, variance: 0 },
            by_wp: s2.rows || []
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/** Projeye ait Budget Items (JOIN ile budget_version üzerinden) */
router.get('/:project_id/budget-items', async (req, res) => {
    const { project_id } = req.params;
    try {
        const { rows } = await pool.query(
            `
      SELECT
        b.budget_item_id,
        b.category,
        b.wp_id,
        b.amount_planned,
        b.currency,
        b.notes
      FROM core.budget_item b
      JOIN core.budget_version v ON v.budget_id = b.budget_id
      WHERE v.project_id = $1
      ORDER BY b.budget_item_id
      `,
            [project_id]
        );
        res.json(rows);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/** Projeye ait Actual Costs (doğrudan project_id ile) */
router.get('/:project_id/actual-costs', async (req, res) => {
    const { project_id } = req.params;
    try {
        const { rows } = await pool.query(
            `
      SELECT
        cost_id,
        wp_id,
        category,
        amount_actual,
        currency,
        posting_date,
        doc_ref,
        supplier_id
      FROM core.actual_cost
      WHERE project_id = $1
      ORDER BY posting_date
      `,
            [project_id]
        );
        res.json(rows);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// src/routes/project.js  (/:project_id satırından ÖNCE)
router.get('/:project_id/activities', async (req, res) => {
    const { project_id } = req.params;
    try {
        const { rows } = await pool.query(
            `
      SELECT
        a.activity_id,
        a.wp_id,
        a.name        AS code,         -- UI: "Kod" kolonu (ACT-01 gibi)
        a.description AS name,         -- UI: "Ad"  kolonu (açıklama)
        CASE
          WHEN a.progress_pct >= 100 THEN 'completed'
          WHEN a.progress_pct > 0     THEN 'in_progress'
          ELSE 'planned'
        END          AS status,        -- UI: "Durum"
        a.date_plan,
        a.date_act,
        a.progress_pct
      FROM core.activity a
      JOIN core.work_package w ON w.wp_id = a.wp_id
      WHERE w.project_id = $1
      ORDER BY a.date_plan NULLS LAST, a.name
      `,
            [project_id]
        );
        res.json(rows);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Detay
router.get('/:project_id', ctrl.detail);

module.exports = router;
