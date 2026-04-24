import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  Search, Eye, BookOpen, CheckSquare,
  AlertTriangle, Camera, Filter
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";

const DEMO = [
  { id:1, nom:"Martin",   prenom:"Lucas", groupe:{ nom:"Les Poussins" }, date_naissance:"2021-03-15", sexe:"M", allergie:"Arachides", statut:"actif", statut_presence:"present" },
  { id:2, nom:"Dupont",   prenom:"Emma",  groupe:{ nom:"Les Poussins" }, date_naissance:"2022-06-10", sexe:"F", allergie:null,         statut:"actif", statut_presence:"absent"  },
  { id:3, nom:"Bernard",  prenom:"Noah",  groupe:{ nom:"Les Poussins" }, date_naissance:"2020-11-22", sexe:"M", allergie:"Lactose",    statut:"actif", statut_presence:"retard"  },
  { id:4, nom:"Rousseau", prenom:"Léa",   groupe:{ nom:"Les Poussins" }, date_naissance:"2021-07-05", sexe:"F", allergie:null,         statut:"actif", statut_presence:"present" },
  { id:5, nom:"Petit",    prenom:"Tom",   groupe:{ nom:"Les Poussins" }, date_naissance:"2022-01-18", sexe:"M", allergie:"Gluten",     statut:"actif", statut_presence:"present" },
];

const calcAge = (dob) => {
  if (!dob) return "—";
  const m = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*30.44));
  return m >= 24 ? `${Math.floor(m/12)} ans` : `${m} mois`;
};

export default function Enfants() {
  const navigate = useNavigate();
  const [enfants, setEnfants] = useState([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enfants")
      .then(r => setEnfants(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setEnfants(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const filtered = enfants.filter(e =>
    `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase())
  );

  const presConfig = {
    present: [T.tealLight,   T.tealDark, "Présent"],
    absent:  [T.dangerLight, T.danger,   "Absent" ],
    retard:  [T.amberLight,  T.amber,    "Retard" ],
  };

  return (
    <Shell role="edu" title="Enfants du groupe">
      <style>{`
        .enfants-row { display:flex; align-items:center; gap:12px; padding:13px 16px; border-bottom:1px solid ${T.border}; cursor:pointer; transition:background .12s; }
        .enfants-row:hover { background:${T.bg}; }
        .enfants-actions { display:flex; gap:6px; }
        @media(max-width:600px){
          .col-age { display:none; }
          .col-allergie { display:none; }
        }
      `}</style>

      {/* Info banner */}
      <div style={{ background:T.tealLight, borderRadius:12, padding:"12px 16px", marginBottom:18, display:"flex", alignItems:"center", gap:10, border:`1px solid ${T.teal}30` }}>
        <div style={{ width:34, height:34, borderRadius:9, background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Eye size={16} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.tealDark, fontFamily:"Nunito,sans-serif" }}>
            Accès en consultation
          </div>
          <div style={{ fontSize:12, color:T.teal }}>
            Vous pouvez consulter les fiches et réaliser vos actions métier (présences, suivis, incidents)
          </div>
        </div>
      </div>

      {/* Toolbar — pas de bouton Ajouter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ flex:1, position:"relative", minWidth:200 }}>
          <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un enfant…"
            style={{ width:"100%", padding:"9px 12px 9px 33px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito Sans,sans-serif", outline:"none", boxSizing:"border-box" }}/>
        </div>
        {/* Raccourcis rapides */}
        <button onClick={() => navigate("/edu/presences")} style={{
          display:"flex", alignItems:"center", gap:6, padding:"9px 14px",
          background:T.tealLight, color:T.teal, border:`1px solid ${T.teal}30`,
          borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
        }}>
          <CheckSquare size={13}/> Présences
        </button>
        <button onClick={() => navigate("/edu/suivi")} style={{
          display:"flex", alignItems:"center", gap:6, padding:"9px 14px",
          background:T.coralLight, color:T.coral, border:`1px solid ${T.coral}30`,
          borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
        }}>
          <BookOpen size={13}/> Suivi
        </button>
      </div>

      {/* Liste */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"10px 16px", background:T.bg, borderBottom:`2px solid ${T.border}`, display:"grid", gridTemplateColumns:"1fr 80px 80px 120px 180px", gap:8, alignItems:"center" }}>
          {[["Enfant",""],["Âge","col-age"],["Allergie","col-allergie"],["Présence",""],["Actions",""]].map(([h, cls]) => (
            <div key={h} className={cls} style={{ fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:40, color:T.text2 }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:T.text2 }}>Aucun enfant trouvé</div>
        ) : filtered.map(e => {
          const s = e.statut_presence || "present";
          const [pbg, pcol, plabel] = presConfig[s] || presConfig.present;
          const ini = `${(e.prenom||"?")[0]}${(e.nom||"?")[0]}`;

          return (
            <div key={e.id} className="enfants-row"
              style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 120px 180px", gap:8, alignItems:"center", padding:"12px 16px", borderBottom:`1px solid ${T.border}`, cursor:"default" }}>

              {/* Enfant */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:pbg, color:pcol, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                  {ini}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>
                    {e.prenom} {e.nom}
                  </div>
                  <div style={{ fontSize:11, color:T.text2 }}>{e.groupe?.nom}</div>
                </div>
              </div>

              {/* Âge */}
              <div className="col-age" style={{ fontSize:12, color:T.text2 }}>
                {calcAge(e.date_naissance)}
              </div>

              {/* Allergie */}
              <div className="col-allergie">
                {e.allergie
                  ? <span style={{ display:"flex", alignItems:"center", gap:3, color:T.danger, fontSize:11, fontWeight:700 }}>
                      <AlertTriangle size={11}/> Oui
                    </span>
                  : <span style={{ color:T.text3, fontSize:12 }}>—</span>
                }
              </div>

              {/* Présence */}
              <div>
                <span style={{ background:pbg, color:pcol, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:pcol }}/>
                  {plabel}
                </span>
              </div>

              {/* Actions métier uniquement */}
              <div style={{ display:"flex", gap:5 }}>
                {/* Voir fiche — lecture seule */}
                <button
                  onClick={() => navigate(`/edu/enfants/${e.id}`)}
                  title="Voir la fiche"
                  style={{ padding:"6px 10px", borderRadius:8, background:T.tealLight, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:T.teal, fontFamily:"Nunito,sans-serif" }}>
                  <Eye size={12}/> Fiche
                </button>

                {/* Suivi journalier */}
                <button
                  onClick={() => navigate("/edu/suivi", { state:{ enfantId:e.id, enfantNom:`${e.prenom} ${e.nom}` } })}
                  title="Saisir un suivi"
                  style={{ padding:"6px 10px", borderRadius:8, background:T.coralLight, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:T.coral, fontFamily:"Nunito,sans-serif" }}>
                  <BookOpen size={12}/> Suivi
                </button>

                {/* Incident */}
                <button
                  onClick={() => navigate("/edu/incidents", { state:{ enfantId:e.id, enfantNom:`${e.prenom} ${e.nom}` } })}
                  title="Signaler un incident"
                  style={{ padding:"6px 10px", borderRadius:8, background:T.amberLight, border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <AlertTriangle size={12} color={T.amber}/>
                </button>
              </div>
            </div>
          );
        })}

        <div style={{ padding:"12px 16px", background:T.bg, borderTop:`1px solid ${T.border}`, fontSize:12, color:T.text2 }}>
          {filtered.length} enfant{filtered.length > 1 ? "s" : ""} dans le groupe
        </div>
      </div>
    </Shell>
  );
}