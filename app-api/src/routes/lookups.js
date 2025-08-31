// src/routes/lookups.js
const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Yardımcı: CHECK constraint içindeki izinli değerleri ayrıştır
async function getAllowedFromCheck(constraintName) {
    const sql = `
    SELECT pg_get_expr(conbin, conrelid) AS expr
    FROM pg_constraint
    WHERE conname = $1
  `;
    const { rows } = await pool.query(sql, [constraintName]);
    const expr = rows[0]?.expr || '';
    // 'merkez'::text gibi değerleri yakalar
    const allowed = [...expr.matchAll(/'([^']+)'/g)].map(m => m[1]);
    return allowed;
}

/** 🔹 Status lookupları (project | work_package | activity) */
router.get('/status', async (req, res) => {
    const { type } = req.query; // örn: ?type=project
    try {
        if (!type) return res.status(400).json({ error: "Missing query param: type" });
        const { rows } = await pool.query(
            `SELECT status_code, description
         FROM core.lk_status
        WHERE status_type = $1
        ORDER BY status_code`, [type]
        );
        // Basit bir dizi dönelim: ["planned","active","completed"]
        return res.json(rows.map(r => r.status_code));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/** 🔹 Proje domain'leri (CHECK constraint veya fallback) */
router.get('/project-domains', async (_req, res) => {
    try {
        const allowed = await getAllowedFromCheck('project_domain_check');
        if (allowed.length) return res.json(allowed);
        const r2 = await pool.query(`SELECT DISTINCT domain FROM core.project WHERE domain IS NOT NULL ORDER BY 1`);
        return res.json(r2.rows.map(r => r.domain));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/** 🔹 Org unit type (CHECK constraint) */
router.get('/org-unit-types', async (_req, res) => {
    try {
        const allowed = await getAllowedFromCheck('org_unit_type_check');
        return res.json(allowed);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/** 🔹 Para birimleri (lookup tablosu) */
router.get('/currencies', async (_req, res) => {
    try {
        // Şeman farklıysa burayı uyarlayabilirsin (currency_code/description vs.)
        const { rows } = await pool.query(`SELECT code, name FROM core.lk_currency ORDER BY code`);
        return res.json(rows); // [{code:'TRY', name:'Turkish Lira'}, ...]
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
