import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import api from "../api/axios";
import DataTable from "../components/DataTable";

function DepartmentList() {
    const [rows, setRows] = useState([]);
    useEffect(() => { api.get("/org-units").then(r => setRows(r.data)); }, []);

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold mb-2">Departmanlar</h1>
            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Ad</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Kod</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Tür</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Detay</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {rows.map(d => (
                            <tr key={d.org_unit_id}>
                                <td className="px-4 py-3 text-sm">{d.name}</td>
                                <td className="px-4 py-3 text-sm">{d.code}</td>
                                <td className="px-4 py-3 text-sm">{d.type}</td>
                                <td className="px-4 py-3 text-sm">
                                    <Link to={String(d.org_unit_id)} className="text-indigo-300 hover:underline">
                                        Görüntüle
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {!rows.length && (
                            <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">Kayıt yok</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DepartmentDetail() {
    const { org_unit_id } = useParams();
    const [dep, setDep] = useState(null);
    const [projects, setProjects] = useState([]);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        api.get(`/org-units/${org_unit_id}`).then(r => setDep(r.data));
        // mevcut read-only yapıyı kullanarak ilişkileri filtreleyerek çekiyoruz:
        api.get(`/projects?org_unit_id=${org_unit_id}`).then(r => {
            setProjects(Array.isArray(r.data) ? r.data : r.data?.items ?? []);
        });
        api.get(`/persons?org_unit_id=${org_unit_id}`).then(r => {
            setPeople(Array.isArray(r.data) ? r.data : r.data?.items ?? []);
        }).catch(() => setPeople([])); // persons route yoksa boş geç
    }, [org_unit_id]);

    if (!dep) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <div>
                <Link to=".." relative="path" className="text-indigo-300 hover:underline text-sm">← Back</Link>
                <h1 className="text-2xl font-semibold mt-1">{dep.name}</h1>
                <div className="text-sm text-slate-300">Kod: {dep.code} · Tür: {dep.type}</div>
            </div>

            <section>
                <h2 className="text-lg font-medium mb-2">Projeler</h2>
                <DataTable
                    rows={projects}
                    searchableKeys={["code", "title", "status", "domain"]}
                    columns={[
                        { key: "code", label: "Kod" },
                        { key: "title", label: "Başlık" },
                        { key: "domain", label: "Alan" },
                        { key: "status", label: "Durum" },
                    ]}
                />
            </section>

            <section>
                <h2 className="text-lg font-medium mb-2">Kişiler</h2>
                <DataTable
                    rows={people}
                    searchableKeys={["name", "email", "title", "code"]}
                    columns={[
                        { key: "name", label: "Ad" },
                        { key: "email", label: "E-posta" },
                        { key: "title", label: "Unvan" },
                        { key: "code", label: "Kod" },
                    ]}
                />
            </section>
        </div>
    );
}

export default function Departments() {
    return (
        <Routes>
            <Route index element={<DepartmentList />} />
            <Route path=":org_unit_id" element={<DepartmentDetail />} />
        </Routes>
    );
}
