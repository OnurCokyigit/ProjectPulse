import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DataTable from "../components/DataTable";

export default function Projects() {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("");
    const [domain, setDomain] = useState("");
    const [domains, setDomains] = useState([]);
    const [projStatuses, setProjStatuses] = useState([]);

    const fetchData = async () => {
        const r = await api.get("/projects");
        setRows(Array.isArray(r.data) ? r.data : r.data?.items ?? []);
    };

    useEffect(() => {
        fetchData();
        // 🔹 Lookup'lar:
        api.get("/lookups/project-domains").then(r => setDomains(r.data || [])).catch(() => setDomains([]));
        api.get("/lookups/status?type=project").then(r => setProjStatuses(r.data || [])).catch(() => setProjStatuses([]));
    }, []);

    const filtered = rows.filter(r =>
        (!status || r.status === status) && (!domain || r.domain === domain)
    );

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Projeler</h1>
                    <p className="text-sm text-slate-400">Listele / Filtrele / Detay</p>
                </div>
                <button onClick={fetchData} className="rounded-xl px-4 py-2 bg-slate-800">Yenile</button>
            </header>

            <div className="flex gap-3">
                <select value={status} onChange={e => setStatus(e.target.value)}
                    className="rounded-lg bg-black/20 border border-white/20 px-3 py-2">
                    <option value="">Durum (tümü)</option>
                    {projStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={domain} onChange={e => setDomain(e.target.value)}
                    className="rounded-lg bg-black/20 border border-white/20 px-3 py-2">
                    <option value="">Alan (tümü)</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <DataTable
                rows={filtered}
                searchableKeys={["code", "title", "domain", "status"]}
                columns={[
                    { key: "code", label: "Kod", render: (r) => <Link className="text-indigo-300 hover:underline" to={`/projects/${r.project_id}`}>{r.code}</Link> },
                    { key: "title", label: "Başlık" },
                    { key: "domain", label: "Alan" },
                    { key: "status", label: "Durum" },
                ]}
            />
        </div>
    );
}
