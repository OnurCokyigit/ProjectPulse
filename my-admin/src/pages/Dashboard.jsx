import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
    const [m, setM] = useState({ projects: 0, work_packages: 0, activities: 0, assets: 0, budget_items: 0 });

    useEffect(() => {
        api.get("/metrics").then(r => setM(r.data)).catch(() => { });
    }, []);

    const Card = ({ title, value }) => (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm text-slate-400">{title}</div>
            <div className="text-3xl font-semibold mt-1">{value}</div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gösterge Paneli</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card title="Projeler" value={m.projects} />
                <Card title="İş Paketleri" value={m.work_packages} />
                <Card title="Aktiviteler" value={m.activities} />
                <Card title="Varlıklar" value={m.assets} />
                <Card title="Bütçe Kalemleri" value={m.budget_items} />
            </div>
        </div>
    );
}
