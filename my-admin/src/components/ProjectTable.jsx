// src/components/ProjectTable.jsx
import { useState } from "react";

function getId(row) {
    return row.id ?? row.project_id ?? row.wp_id ?? row.uuid ?? row._id;
}

export default function ProjectTable({ rows, onUpdate, onDelete }) {
    const [editId, setEditId] = useState(null);
    const [editModel, setEditModel] = useState({ code: "", title: "", status: "planned" });

    const startEdit = (row) => {
        setEditId(getId(row));
        setEditModel({
            code: row.code ?? "",
            title: row.title ?? "",
            status: row.status ?? "planned",
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditModel({ code: "", title: "", status: "planned" });
    };

    const saveEdit = async () => {
        await onUpdate(editId, editModel); // title + code + status patch edilir
        cancelEdit();
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {rows.map((row) => {
                        const id = getId(row);

                        if (editId === id) {
                            return (
                                <tr key={id} className="bg-white/5">
                                    <td className="px-4 py-3">
                                        <input
                                            className="w-full rounded-lg border border-white/20 bg-black/20 px-2 py-1"
                                            value={editModel.code}
                                            onChange={(e) => setEditModel((s) => ({ ...s, code: e.target.value }))}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            className="w-full rounded-lg border border-white/20 bg-black/20 px-2 py-1"
                                            value={editModel.title}
                                            onChange={(e) => setEditModel((s) => ({ ...s, title: e.target.value }))}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            className="w-full rounded-lg border border-white/20 bg-black/20 px-2 py-1"
                                            value={editModel.status}
                                            onChange={(e) => setEditModel((s) => ({ ...s, status: e.target.value }))}
                                        >
                                            <option value="planned">planned</option>
                                            <option value="active">active</option>
                                            <option value="completed">completed</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button onClick={saveEdit} className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700">Save</button>
                                        <button onClick={cancelEdit} className="px-3 py-1 rounded-lg bg-slate-600 hover:bg-slate-700">Cancel</button>
                                    </td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={id}>
                                <td className="px-4 py-3 text-sm">{row.code}</td>
                                <td className="px-4 py-3 text-sm">{row.title}</td>
                                <td className="px-4 py-3 text-sm">{row.status}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => startEdit(row)} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700">Edit</button>
                                    <button
                                        onClick={() => { if (confirm("Silinsin mi?")) onDelete(id); }}
                                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">No data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
