// src/components/ProjectForm.jsx
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProjectForm({ onSubmit, defaultValues, submitLabel = "Create" }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm({ defaultValues });

    const [domains, setDomains] = useState([]);
    const [orgUnits, setOrgUnits] = useState([]);

    useEffect(() => {
        // lookup'ları paralel çek
        Promise.all([
            api.get("/projects/domains"),   // ← yeni endpoint
            api.get("/org-units"),
        ])
            .then(([d, ou]) => {
                setDomains(Array.isArray(d.data) ? d.data : []);
                setOrgUnits(Array.isArray(ou.data) ? ou.data : []);
            })
            .catch(() => {
                // fallback: en azından form boş kalmasın
                setDomains((d) => d.length ? d : ["it", "finance", "ops"]);
            });
    }, []);

    const submit = async (data) => {
        await onSubmit(data);
        if (submitLabel === "Create") reset();
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="grid md:grid-cols-3 gap-3">
                <div>
                    <label className="block text-sm mb-1">Code</label>
                    <input {...register("code", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring"
                        placeholder="PRJ-001" />
                    {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input {...register("title", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring"
                        placeholder="My Project" />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Domain</label>
                    <select {...register("domain", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring">
                        <option value="" disabled>Seçiniz…</option>
                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.domain && <p className="text-red-400 text-xs mt-1">{errors.domain.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Org Unit (UUID)</label>
                    <select {...register("org_unit_id", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring">
                        <option value="" disabled>Seçiniz…</option>
                        {orgUnits.map(ou => (
                            <option key={ou.org_unit_id} value={ou.org_unit_id}>
                                {ou.name}{ou.code ? ` (${ou.code})` : ""}
                            </option>
                        ))}
                    </select>
                    {errors.org_unit_id && <p className="text-red-400 text-xs mt-1">{errors.org_unit_id.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Start Date</label>
                    <input type="date" {...register("start_date", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring" />
                    {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                        {...register("status", { required: "Required" })}
                        className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:ring"
                    >
                        <option value="planned">planned</option>
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                    </select>
                    {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}
                </div>
            </div>

            <div className="pt-2">
                <button
                    disabled={isSubmitting}
                    className="rounded-xl px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition"
                    type="submit"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
