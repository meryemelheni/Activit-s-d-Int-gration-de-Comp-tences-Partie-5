"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Departement {
  id: number;
  nom: string;
}

export default function DepartementForm() {
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [nom, setNom] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNom, setEditingNom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartements();
  }, []);

  const fetchDepartements = async () => {
    try {
      const res = await fetch('/api/departements');
      if (!res.ok) throw new Error('Erreur lors du chargement des départements');
      const data = await res.json();
      setDepartements(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/departements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      
      setNom("");
      setSuccess("Département ajouté avec succès !");
      fetchDepartements();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/departements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editingNom }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      
      setEditingId(null);
      setEditingNom("");
      setSuccess("Département modifié avec succès !");
      fetchDepartements();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce département ?')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/departements/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      
      setSuccess("Département supprimé !");
      fetchDepartements();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Ajouter un Département</h2>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du département"
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Ajouter
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      </div>

      {/* Tableau des départements */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">Nom</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departements.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm text-slate-500">#{d.id}</td>
                <td className="px-6 py-4 text-sm">
                  {editingId === d.id ? (
                    <input
                      type="text"
                      value={editingNom}
                      onChange={(e) => setEditingNom(e.target.value)}
                      className="px-2 py-1 border border-violet-300 rounded outline-none"
                    />
                  ) : (
                    <Link 
                      href={`/departements/${d.id}`}
                      className="font-medium text-slate-700 hover:text-violet-600 transition-colors"
                    >
                      {d.nom}
                    </Link>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editingId === d.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(d.id)}
                        className="text-xs font-semibold text-green-600 hover:underline"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-semibold text-slate-500 hover:underline"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(d.id);
                          setEditingNom(d.nom);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
