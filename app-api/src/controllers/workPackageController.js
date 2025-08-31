// src/controllers/workPackageController.js
const { pool } = require('../db');

// Listeleme
exports.list = async (req, res) => {
    const project_id = req.query.project_id || null;
    const sql = `
    SELECT wp_id, project_id, code, name, owner_id, status
    FROM core.work_package
    WHERE ($1::uuid IS NULL OR project_id = $1)
    ORDER BY code
  `;
    try {
        const { rows } = await pool.query(sql, [project_id]);
        res.json(rows);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Ekleme
exports.create = async (req, res) => {
    const { project_id, code, name, owner_id, status = 'planned' } = req.body;
    const sql = `
    INSERT INTO core.work_package (project_id, code, name, owner_id, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING wp_id, project_id, code, name, owner_id, status
  `;
    try {
        const { rows } = await pool.query(sql, [project_id, code, name, owner_id, status]);
        res.status(201).json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Detay
exports.detail = async (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT wp_id, project_id, code, name, owner_id, status
    FROM core.work_package
    WHERE wp_id = $1::uuid
  `;
    try {
        const { rows } = await pool.query(sql, [id]);
        if (!rows.length) return res.status(404).json({ error: 'not_found' });
        res.json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Güncelleme
exports.update = async (req, res) => {
    const { id } = req.params;
    const allowed = ['code', 'name', 'owner_id', 'status'];
    const entries = Object.entries(req.body).filter(([k]) => allowed.includes(k));
    if (!entries.length) return res.status(400).json({ error: 'no_fields_to_update' });

    const setSql = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const params = [id, ...entries.map(([, v]) => v)];
    const sql = `
    UPDATE core.work_package
       SET ${setSql}
     WHERE wp_id = $1::uuid
     RETURNING wp_id, project_id, code, name, owner_id, status
  `;
    try {
        const { rows } = await pool.query(sql, params);
        if (!rows.length) return res.status(404).json({ error: 'not_found' });
        res.json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Silme
exports.remove = async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM core.work_package WHERE wp_id = $1::uuid RETURNING wp_id`;
    try {
        const { rows } = await pool.query(sql, [id]);
        if (!rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, deleted_wp_id: rows[0].wp_id });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};
