import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";

export default function WorkPackages() {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("");
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [wpStatuses, setWpStatuses] = useState([]);

    const fetchData = async () => {
        const r = await api.get("/work-packages");
        setRows(Array.isArray(r.data) ? r.data : r.data?.items ?? []);
    };
    const fetchProjects = async () => {
        const r = await api.get("/projects");
        const list = Array.isArray(r.data) ? r.data : r.data?.items ?? [];
        setProjects(list);
    };

    useEffect(() => {
        fetchData();
        fetchProjects();
        // 🔹 Lookup: WP durumları
        api.get("/lookups/status?type=work_package").then(r => setWpStatuses(r.data || [])).catch(() => setWpStatuses([]));
    }, []);

    const filtered = rows.filter(r =>
        (!status || r.status === status) &&
        (!projectId || r.project_id === projectId)
    );

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">İş Paketleri</h1>
                <div className="flex gap-2">
                    <button onClick={fetchProjects} className="rounded-xl px-4 py-2 bg-slate-800">Projeleri Yenile</button>
                    <button onClick={fetchData} className="rounded-xl px-4 py-2 bg-slate-800">Yenile</button>
                </div>
            </header>

            <div className="flex flex-wrap gap-3">
                <select value={status} onChange={e => setStatus(e.target.value)}
                    className="rounded-lg bg-black/20 border border-white/20 px-3 py-2">
                    <option value="">Durum (tümü)</option>
                    {wpStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={projectId} onChange={e => setProjectId(e.target.value)}
                    className="rounded-lg bg-black/20 border border-white/20 px-3 py-2 min-w-[18rem]">
                    <option value="">Proje (tümü)</option>
                    {projects.map(p => (
                        <option key={p.project_id} value={p.project_id}>
                            {p.code} — {p.title}
                        </option>
                    ))}
                </select>
            </div>

            <DataTable
                rows={filtered}
                searchableKeys={["code", "name", "status"]}
                columns={[
                    { key: "code", label: "Kod" },
                    { key: "name", label: "Ad" },
                    { key: "status", label: "Durum" },
                ]}
            />
        </div>
    );
}
