"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Departement {
  id: number;
  nom: string;
}

interface Etudiant {
  id: number;
  cin: string;
  nom: string;
  email: string;
  dateNaissance: string;
  anneePremiereInscription: number;
  departement: Departement;
}

export default function EtudiantsPage() {
  const router = useRouter();
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cin: '',
    nom: '',
    email: '',
    dateNaissance: '',
    annee: '',
    departementId: ''
  });

  useEffect(() => {
    fetchEtudiants();
    fetchDepartements();
  }, []);

  const fetchEtudiants = async () => {
    try {
      const res = await fetch('/api/etudiants');
      if (!res.ok) throw new Error('Erreur lors du chargement des étudiants');
      const data = await res.json();
      setEtudiants(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/etudiants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cin: formData.cin,
          nom: formData.nom,
          email: formData.email,
          dateNaissance: formData.dateNaissance,
          anneePremiereInscription: Number(formData.annee),
          departement: { id: Number(formData.departementId) }
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'étudiant');
      
      setFormData({ cin: '', nom: '', email: '', dateNaissance: '', annee: '', departementId: '' });
      fetchEtudiants();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet étudiant ?')) return;
    try {
      const res = await fetch(`/api/etudiants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      fetchEtudiants();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Gestion des Étudiants
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/departements')}
              className="px-4 py-2 bg-white text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors shadow-sm"
            >
              Gérer Départements
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="font-bold">Erreur:</span> {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white font-semibold">Ajouter un nouvel étudiant</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">CIN</label>
              <input 
                type="text" required value={formData.cin}
                onChange={e => setFormData({...formData, cin: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
                placeholder="Ex: 12345678"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Nom Complet</label>
              <input 
                type="text" required value={formData.nom}
                onChange={e => setFormData({...formData, nom: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                placeholder="Ex: Ahmed Ben Salah"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input 
                type="email" required value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                placeholder="Ex: ahmed@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Date de Naissance</label>
              <input 
                type="date" required value={formData.dateNaissance}
                onChange={e => setFormData({...formData, dateNaissance: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Année d'Inscription</label>
              <input 
                type="number" required value={formData.annee}
                onChange={e => setFormData({...formData, annee: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                placeholder="Ex: 2024"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Département</label>
              <select 
                required value={formData.departementId}
                onChange={e => setFormData({...formData, departementId: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Sélectionner...</option>
                {departements.map(d => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button 
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md active:scale-95"
              >
                Ajouter l'étudiant
              </button>
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CIN</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom & Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Naissance</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Année</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {etudiants.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{e.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{e.cin}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{e.nom}</div>
                      <div className="text-xs text-slate-500">{e.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{e.dateNaissance}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{e.anneePremiereInscription}</td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/departements/${e.departement?.id}`}
                        className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium hover:bg-violet-200 transition-colors cursor-pointer"
                      >
                        {e.departement?.nom}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => router.push(`/etudiants/${e.id}`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {etudiants.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                Aucun étudiant trouvé.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
