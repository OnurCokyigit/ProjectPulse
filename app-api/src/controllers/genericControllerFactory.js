const { pool } = require('../db');

function makeController(cfg) {
    const table = cfg.table;
    const idCol = cfg.idCol;

    const list = async (req, res) => {
        try {
            // basit filter: ?field=value
            const keys = Object.keys(req.query || {}).filter(k => (cfg.filterable || []).includes(k));
            const where = keys.map((k, i) => `${k} = $${i + 1}`).join(' AND ');
            const params = keys.map(k => req.query[k]);
            const sql = `SELECT ${cfg.returning || '*'} FROM ${table}` + (where ? ` WHERE ${where}` : '') + ` ORDER BY 1`;
            const { rows } = await pool.query(sql, params);
            res.json(rows);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    };

    const detail = async (req, res) => {
        try {
            const { rows } = await pool.query(
                `SELECT ${cfg.returning || '*'} FROM ${table} WHERE ${idCol}=$1`,
                [req.params[idCol] || req.params[Object.keys(req.params)[0]]]
            );
            if (!rows.length) return res.status(404).json({ error: 'Not found' });
            res.json(rows[0]);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    };

    return { list, detail };
}

module.exports = { makeController };
