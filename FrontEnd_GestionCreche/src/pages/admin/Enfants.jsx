import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  Search, Plus, Eye, Edit2, Trash2,
  Filter, AlertTriangle, ChevronLeft, ChevronRight
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DEMO = [
  { id:1, nom:"Martin",   prenom:"Lucas", groupe:{ nom:"Les Poussins" }, date_naissance:"2021-03-15", sexe:"M", allergie:"Arachides", statut:"actif"   },
  { id:2, nom:"Dupont",   prenom:"Emma",  groupe:{ nom:"Les Lutins"   }, date_naissance:"2022-06-10", sexe:"F", allergie:null,         statut:"actif"   },
  { id:3, nom:"Bernard",  prenom:"Noah",  groupe:{ nom:"Les Étoiles"  }, date_naissance:"2020-11-22", sexe:"M", allergie:"Lactose",    statut:"actif"   },
  { id:4, nom:"Rousseau", prenom:"Léa",   groupe:{ nom:"Les Poussins" }, date_naissance:"2021-07-05", sexe:"F", allergie:null,         statut:"actif"   },
  { id:5, nom:"Petit",    prenom:"Tom",   groupe:{ nom:"Les Lutins"   }, date_naissance:"2022-01-18", sexe:"M", allergie:"Gluten",     statut:"inactif" },
  { id:6, nom:"Leroy",    prenom:"Chloé", groupe:{ nom:"Les Étoiles"  }, date_naissance:"2020-09-03", sexe:"F", allergie:null,         statut:"actif"   },
];

const calcAge = (dob) => {
  if (!dob) return "—";
  const m = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*30.44));
  return m >= 24 ? `${Math.floor(m/12)} ans` : `${m} mois`;
};

export default function AdminEnfants() {
  const navigate  = useNavigate();
  const [enfants,  setEnfants]   = useState([]);
  const [search,   setSearch]    = useState("");
  const [groupe,   setGroupe]    = useState("tous");
  const [statut,   setStatut]    = useState("tous");
  const [loading,  setLoading]   = useState(true);
  const [page,     setPage]      = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    api.get("/enfants")
      .then(r => setEnfants(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setEnfants(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const groupes = ["tous", ...new Set(DEMO.map(e => e.groupe?.nom))];

  const filtered = enfants.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = `${e.prenom} ${e.nom}`.toLowerCase().includes(q);
    const matchGroupe = groupe === "tous" || e.groupe?.nom === groupe;
    const matchStatut = statut === "tous" || e.statut === statut;
    return matchSearch && matchGroupe && matchStatut;
  });

  const total     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const handleDelete = (e) => {
    Swal.fire({
      title: "Supprimer cet enfant ?",
      text: `Supprimer ${e.prenom} ${e.nom} ? Toutes les données associées seront supprimées.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: T.danger,
      cancelButtonColor: T.text2,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(r => {
      if (r.isConfirmed) {
        api.delete(`/enfants/${e.id}`).catch(() => {});
        setEnfants(prev => prev.filter(x => x.id !== e.id));
        toast.success("Enfant supprimé");
      }
    });
  };

  return (
    <Shell role="admin" title="Gestion des enfants">
      <style>{`
        .ae-toolbar { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        .ae-col-hide { }
        @media(max-width:700px){ .ae-col-hide { display:none; } }
      `}</style>

      {/* Stats rapides */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          ["Total inscrits",   enfants.length,                                    T.purple, T.purpleLight],
          ["Actifs",           enfants.filter(e => e.statut==="actif").length,    T.teal,   T.tealLight  ],
          ["Avec allergies",   enfants.filter(e => e.allergie).length,            T.danger, T.dangerLight],
          ["Inactifs/Archivés",enfants.filter(e => e.statut!=="actif").length,    T.amber,  T.amberLight ],
        ].map(([label, val, color, bg]) => (
          <div key={label} style={{ background:bg, borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:22, fontWeight:900, color, fontFamily:"Nunito,sans-serif" }}>{val}</div>
            <div style={{ fontSize:11, color:T.text2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="ae-toolbar">
        <div style={{ flex:1, position:"relative", minWidth:200 }}>
          <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un enfant…"
            style={{ width:"100%", padding:"9px 12px 9px 33px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito Sans,sans-serif", outline:"none", boxSizing:"border-box" }}/>
        </div>

        <div style={{ position:"relative" }}>
          <Filter size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
          <select value={groupe} onChange={e => { setGroupe(e.target.value); setPage(1); }}
            style={{ padding:"9px 12px 9px 28px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito,sans-serif", background:T.surface }}>
            {groupes.map(g => <option key={g} value={g}>{g === "tous" ? "Tous les groupes" : g}</option>)}
          </select>
        </div>

        <div style={{ display:"flex", gap:6 }}>
          {["tous","actif","inactif"].map(s => (
            <button key={s} onClick={() => { setStatut(s); setPage(1); }} style={{
              padding:"8px 12px", borderRadius:9,
              background: statut===s ? T.purple : T.surface,
              color: statut===s ? "#fff" : T.text2,
              border:`1px solid ${T.border}`,
              fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
            }}>
              {s === "tous" ? "Tous" : s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        <button onClick={() => navigate("/admin/enfants/nouveau")} style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"9px 16px", background:T.teal, color:"#fff",
          border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
          fontWeight:700, fontSize:13, cursor:"pointer",
        }}>
          <Plus size={14}/> Inscrire un enfant
        </button>
      </div>

      {/* Tableau */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead>
              <tr style={{ background:T.bg, borderBottom:`2px solid ${T.border}` }}>
                {[["Enfant",""],["Groupe","ae-col-hide"],["Âge","ae-col-hide"],["Allergie","ae-col-hide"],["Statut",""],["Actions",""]].map(([h, cls]) => (
                  <th key={h} className={cls} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign:"center", padding:32, color:T.text2 }}>Chargement…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:"center", padding:32, color:T.text2 }}>Aucun enfant trouvé</td></tr>
              ) : paginated.map(e => {
                const ini = `${(e.prenom||"?")[0]}${(e.nom||"?")[0]}`;
                return (
                  <tr key={e.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:T.tealLight, color:T.tealDark, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                          {ini}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{e.prenom} {e.nom}</div>
                          <div style={{ fontSize:11, color:T.text2 }}>{e.sexe === "M" ? "Garçon" : "Fille"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ae-col-hide" style={{ padding:"11px 14px" }}>
                      <span style={{ background:T.purpleLight, color:T.purpleDark, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                        {e.groupe?.nom || "—"}
                      </span>
                    </td>
                    <td className="ae-col-hide" style={{ padding:"11px 14px", fontSize:13, color:T.text2 }}>
                      {calcAge(e.date_naissance)}
                    </td>
                    <td className="ae-col-hide" style={{ padding:"11px 14px" }}>
                      {e.allergie
                        ? <span style={{ display:"flex", alignItems:"center", gap:4, color:T.danger, fontSize:12, fontWeight:700 }}><AlertTriangle size={12}/>{e.allergie}</span>
                        : <span style={{ color:T.text3 }}>—</span>}
                    </td>
                    <td style={{ padding:"11px 14px" }}>
                      <span style={{ background:e.statut==="actif"?T.tealLight:T.bg, color:e.statut==="actif"?T.tealDark:T.text2, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:e.statut==="actif"?T.teal:T.text3 }}/>
                        {e.statut || "actif"}
                      </span>
                    </td>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        <button onClick={() => navigate(`/admin/enfants/${e.id}`)}
                          style={{ padding:"5px 8px", borderRadius:7, background:T.tealLight, border:"none", cursor:"pointer", display:"flex" }}>
                          <Eye size={13} color={T.teal}/>
                        </button>
                        <button onClick={() => navigate(`/admin/enfants/${e.id}/modifier`)}
                          style={{ padding:"5px 8px", borderRadius:7, background:T.amberLight, border:"none", cursor:"pointer", display:"flex" }}>
                          <Edit2 size={13} color={T.amber}/>
                        </button>
                        <button onClick={() => handleDelete(e)}
                          style={{ padding:"5px 8px", borderRadius:7, background:T.dangerLight, border:"none", cursor:"pointer", display:"flex" }}>
                          <Trash2 size={13} color={T.danger}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderTop:`1px solid ${T.border}`, background:T.bg, flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:T.text2 }}>
            {filtered.length} enfant{filtered.length > 1 ? "s" : ""} · Page {page}/{total||1}
          </span>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ padding:"6px 10px", borderRadius:8, background:T.surface, border:`1px solid ${T.border}`, cursor:page===1?"not-allowed":"pointer", opacity:page===1?0.4:1, display:"flex" }}>
              <ChevronLeft size={15} color={T.text2}/>
            </button>
            <button onClick={() => setPage(p => Math.min(total,p+1))} disabled={page===total||total===0}
              style={{ padding:"6px 10px", borderRadius:8, background:T.surface, border:`1px solid ${T.border}`, cursor:page===total?"not-allowed":"pointer", opacity:page===total?0.4:1, display:"flex" }}>
              <ChevronRight size={15} color={T.text2}/>
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}