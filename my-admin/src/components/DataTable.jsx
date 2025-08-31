import { useMemo, useState } from "react";

export default function DataTable({ rows = [], columns = [], initialPageSize = 10, searchableKeys = [] }) {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [ps, setPs] = useState(initialPageSize);

    const filtered = useMemo(() => {
        if (!q) return rows;
        const qq = q.toLowerCase();
        return rows.filter((r) =>
            searchableKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(qq))
        );
    }, [rows, q, searchableKeys]);

    const total = filtered.length;
    const from = (page - 1) * ps;
    const to = from + ps;
    const pageRows = filtered.slice(from, to);
    const totalPages = Math.max(1, Math.ceil(total / ps));

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    placeholder="Ara…"
                    className="w-64 rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring"
                />
                <select className="rounded-lg bg-black/20 border border-white/20 px-2 py-1"
                    value={ps} onChange={(e) => { setPs(+e.target.value); setPage(1); }}>
                    {[10, 20, 50].map(n => <option key={n} value={n}>{n}/sayfa</option>)}
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            {columns.map(c => (
                                <th key={c.key} className="px-4 py-3 text-left text-sm font-medium">{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {pageRows.map((r, i) => (
                            <tr key={r.id ?? r.uuid ?? r.project_id ?? r.wp_id ?? i}>
                                {columns.map(c => (
                                    <td key={c.key} className="px-4 py-3 text-sm">
                                        {c.render ? c.render(r) : r[c.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {pageRows.length === 0 && (
                            <tr><td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-400">Kayıt yok</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-slate-400">Toplam: {total}</span>
                <button className="px-2 py-1 rounded bg-slate-800 disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Önceki</button>
                <span className="text-xs">{page}/{totalPages}</span>
                <button className="px-2 py-1 rounded bg-slate-800 disabled:opacity-50"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Sonraki</button>
            </div>
        </div>
    );
}
