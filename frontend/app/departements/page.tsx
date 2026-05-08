import DepartementForm from "../../components/DepartementForm";
import Link from "next/link";

async function getDepartements() {
  try {
    const response = await fetch("http://etudiant-service:8081/api/departements", { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function getEtudiants() {
  try {
    const response = await fetch("http://etudiant-service:8081/api/etudiants", { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function DepartementsPage() {
  const [departements, etudiants] = await Promise.all([getDepartements(), getEtudiants()]);

  return (
    <section>
      <div className="stats-grid">
        <article className="stat-card">
          <p className="stat-value">{etudiants.length}</p>
          <p className="stat-label">Etudiants</p>
        </article>
        <article className="stat-card">
          <p className="stat-value">{departements.length}</p>
          <p className="stat-label">Departements</p>
        </article>
      </div>

      <div className="tabs">
        <Link className="tab-link" href="/etudiants">
          Etudiants
        </Link>
        <Link className="tab-link" href="/departements">
          Departements
        </Link>
      </div>

      <h2 className="subsection-title">Liste des Departements</h2>

      {/* DepartementForm gère lui-même l'ajout, modification, suppression et affichage */}
      <DepartementForm />
    </section>
  );
}