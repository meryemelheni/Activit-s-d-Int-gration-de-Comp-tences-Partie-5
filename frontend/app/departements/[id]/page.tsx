"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Etudiant {
  id: number;
  cin: string;
  nom: string;
  email: string;
  dateNaissance: string;
  anneePremiereInscription: number;
}

interface Departement {
  id: number;
  nom: string;
}

export default function DepartementEtudiantsPage() {
  const { id } = useParams();
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [departement, setDepartement] = useState<Departement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch departement info
      const deptRes = await fetch(`/api/departements/${id}`);
      if (!deptRes.ok) throw new Error("Département non trouvé");
      const deptData = await deptRes.json();
      setDepartement(deptData);

      // Fetch students for this department
      const etudiantsRes = await fetch(`/api/etudiants?departementId=${id}`);
      if (!etudiantsRes.ok) throw new Error("Erreur lors du chargement des étudiants");
      const etudiantsData = await etudiantsRes.json();
      setEtudiants(etudiantsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Étudiants du département : <span className="text-violet-600">{departement?.nom}</span>
        </h1>
        <Link 
          href="/departements"
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
        >
          ← Retour aux départements
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">CIN</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">Nom</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600">Année</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {etudiants.length > 0 ? (
              etudiants.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{e.cin}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{e.nom}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{e.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{e.anneePremiereInscription}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                  Aucun étudiant trouvé dans ce département.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
