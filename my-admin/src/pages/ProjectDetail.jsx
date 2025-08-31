import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import DataTable from "../components/DataTable";

export default function ProjectDetail() {
    const { project_id } = useParams();
    const [p, setP] = useState(null);
    const [wps, setWps] = useState([]);
    const [acts, setActs] = useState([]);
    const [budgetItems, setBudgetItems] = useState([]);
    const [actualCosts, setActualCosts] = useState([]);
    const [fin, setFin] = useState({
        summary: { planned_total: 0, actual_total: 0, variance: 0 },
        by_wp: [],
    });

    // 🔹 Para birimi lookup + seçili filtreler
    const [currencies, setCurrencies] = useState([]);
    const [curBI, setCurBI] = useState(""); // Budget Items filtresi
    const [curAC, setCurAC] = useState(""); // Actual Costs filtresi

    useEffect(() => {
        api.get(`/projects/${project_id}`).then((r) => setP(r.data));
        api
            .get(`/work-packages?project_id=${project_id}`)
            .then((r) => setWps(Array.isArray(r.data) ? r.data : r.data?.items ?? []));
        api
            .get(`/projects/${project_id}/activities`)
            .then((r) => setActs(Array.isArray(r.data) ? r.data : r.data?.items ?? []));
        api
            .get(`/projects/${project_id}/budget-items`)
            .then((r) =>
                setBudgetItems(Array.isArray(r.data) ? r.data : r.data?.items ?? [])
            )
            .catch(() => setBudgetItems([]));
        api
            .get(`/projects/${project_id}/actual-costs`)
            .then((r) =>
                setActualCosts(Array.isArray(r.data) ? r.data : r.data?.items ?? [])
            )
            .catch(() => setActualCosts([]));
        // Finans özeti (plan vs actual)
        api
            .get(`/projects/${project_id}/finance`)
            .then((r) => setFin(r.data))
            .catch(() => { });

        // 🔹 Para birimleri (lookup)
        api
            .get(`/lookups/currencies`)
            .then((r) => {
                const arr = Array.isArray(r.data) ? r.data : [];
                // /lookups/currencies -> [{code:'TRY', name:'Turkish Lira'}, ...] bekliyoruz
                setCurrencies(arr.map((x) => x.code ?? x));
            })
            .catch(() => setCurrencies([]));
    }, [project_id]);

    if (!p) return <div>Yükleniyor...</div>;

    const SummaryCard = ({ title, value }) => (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm text-slate-400">{title}</div>
            <div className="text-2xl font-semibold mt-1">
                {Number(value || 0).toLocaleString()}
            </div>
        </div>
    );

    // 🔹 Seçime göre filtrelenmiş listeler
    const budgetItemsFiltered = budgetItems.filter(
        (x) => !curBI || x.currency === curBI
    );
    const actualCostsFiltered = actualCosts.filter(
        (x) => !curAC || x.currency === curAC
    );

    return (
        <div className="space-y-6">
            <div>
                <Link to="/projects" className="text-indigo-300 hover:underline text-sm">
                    ← Geri
                </Link>
                <h1 className="text-2xl font-semibold mt-1">
                    {p.code} — {p.title}
                </h1>
                <div className="text-sm text-slate-400">
                    Alan: {p.domain} · Durum: {p.status}
                </div>
            </div>

            {/* Finans özet kartları */}
            <div className="grid sm:grid-cols-3 gap-3">
                <SummaryCard title="Planned" value={fin.summary.planned_total} />
                <SummaryCard title="Actual" value={fin.summary.actual_total} />
                <SummaryCard title="Variance" value={fin.summary.variance} />
            </div>

            <section>
                <h2 className="text-lg font-medium mb-2">İş Paketleri</h2>
                <DataTable
                    rows={wps}
                    searchableKeys={["code", "name", "status"]}
                    columns={[
                        { key: "code", label: "Kod" },
                        { key: "name", label: "Ad" },
                        { key: "status", label: "Durum" },
                    ]}
                />
            </section>

            <section>
                <h2 className="text-lg font-medium mb-2">Aktiviteler</h2>
                <DataTable
                    rows={acts}
                    searchableKeys={["code", "name", "status"]}
                    columns={[
                        { key: "code", label: "Kod" },
                        { key: "name", label: "Ad" },
                        { key: "status", label: "Durum" },
                        {
                            key: "date_plan",
                            label: "Plan Tarihi",
                            render: (r) =>
                                r.date_plan ? new Date(r.date_plan).toLocaleDateString() : "-",
                        },
                        {
                            key: "date_act",
                            label: "Gerçekleşen Tarih",
                            render: (r) =>
                                r.date_act ? new Date(r.date_act).toLocaleDateString() : "-",
                        },
                        {
                            key: "progress_pct",
                            label: "% İlerleme",
                            render: (r) => {
                                const v = Number(r.progress_pct ?? 0);
                                return (
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                        <div className="h-2 w-24 rounded bg-white/10 overflow-hidden">
                                            <div
                                                className="h-2 bg-white/70"
                                                style={{
                                                    width: `${Math.max(0, Math.min(100, v))}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm">{isNaN(v) ? 0 : v}%</span>
                                    </div>
                                );
                            },
                        },
                    ]}
                />
            </section>

            <section>
                <h2 className="text-lg font-medium mb-2">Bütçe Kalemleri (Plan)</h2>

                {/* 🔹 Para birimi filtresi */}
                <div className="mb-2">
                    <select
                        value={curBI}
                        onChange={(e) => setCurBI(e.target.value)}
                        className="rounded-lg bg-black/20 border border-white/20 px-3 py-2"
                    >
                        <option value="">Para Birimi (tümü)</option>
                        {currencies.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <DataTable
                    rows={budgetItemsFiltered}
                    searchableKeys={["category", "currency", "notes"]}
                    columns={[
                        { key: "category", label: "Kategori" },
                        {
                            key: "amount_planned",
                            label: "Planlanan",
                            render: (r) => Number(r.amount_planned || 0).toLocaleString(),
                        },
                        { key: "currency", label: "Para Birimi" },
                        {
                            key: "wp_id",
                            label: "İş Paketi",
                            render: (r) => (r.wp_id ? r.wp_id.slice(0, 8) : "-"),
                        },
                        { key: "notes", label: "Notlar" },
                    ]}
                />
            </section>

            <section>
                <h2 className="text-lg font-medium mb-2">Gerçekleşen Maliyetler</h2>

                {/* 🔹 Para birimi filtresi */}
                <div className="mb-2">
                    <select
                        value={curAC}
                        onChange={(e) => setCurAC(e.target.value)}
                        className="rounded-lg bg-black/20 border border-white/20 px-3 py-2"
                    >
                        <option value="">Para Birimi (tümü)</option>
                        {currencies.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <DataTable
                    rows={actualCostsFiltered}
                    searchableKeys={["category", "currency", "doc_ref"]}
                    columns={[
                        { key: "posting_date", label: "Tarih" },
                        {
                            key: "amount_actual",
                            label: "Tutar",
                            render: (r) => Number(r.amount_actual || 0).toLocaleString(),
                        },
                        { key: "currency", label: "Para Birimi" },
                        {
                            key: "wp_id",
                            label: "İş Paketi",
                            render: (r) => (r.wp_id ? r.wp_id.slice(0, 8) : "-"),
                        },
                        { key: "category", label: "Kategori" },
                        { key: "doc_ref", label: "Belge Ref." },
                    ]}
                />
            </section>

            {/* WP kırılımında finans özeti */}
            <section>
                <h2 className="text-lg font-medium mb-2">İş Paketi Bazında Finans</h2>
                <DataTable
                    rows={fin.by_wp}
                    searchableKeys={["code"]}
                    columns={[
                        { key: "code", label: "İş Paketi" },
                        {
                            key: "planned",
                            label: "Planlanan",
                            render: (r) => Number(r.planned || 0).toLocaleString(),
                        },
                        {
                            key: "actual",
                            label: "Gerçekleşen",
                            render: (r) => Number(r.actual || 0).toLocaleString(),
                        },
                        {
                            key: "variance",
                            label: "Fark",
                            render: (r) => Number(r.variance || 0).toLocaleString(),
                        },
                    ]}
                />
            </section>
        </div>
    );
}
