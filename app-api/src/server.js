const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get('/health', (_, res) => res.json({ ok: true }));

// Routers
app.use('/projects', require('./routes/project'));
app.use('/work-packages', require('./routes/workPackage'));
app.use('/org-units', require('./routes/orgUnit'));
app.use('/persons', require('./routes/person'));
app.use('/budget-items', require('./routes/budgetItem'));
app.use('/actual-costs', require('./routes/actualCost'));
app.use('/metrics', require('./routes/metrics'));
app.use('/lookups', require('./routes/lookups'));

// Dashboard metrics (sayaclar)
app.get('/metrics', async (req, res) => {
    try {
        const q = (sql) => pool.query(sql).then(r => Number(r.rows[0].count || 0));
        const [projects, work_packages, activities, assets, budget_items] = await Promise.all([
            q('SELECT COUNT(*) FROM core.project'),
            q('SELECT COUNT(*) FROM core.work_package'),
            q('SELECT COUNT(*) FROM core.activity'),
            q('SELECT COUNT(*) FROM core.asset'),
            q('SELECT COUNT(*) FROM core.budget_item')
        ]);
        res.json({ projects, work_packages, activities, assets, budget_items });
    } catch (e) { res.status(400).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on :${PORT}`));
