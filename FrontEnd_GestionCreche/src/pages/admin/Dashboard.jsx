import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  Baby, CheckSquare, AlertTriangle, CreditCard,
  ChevronRight, TrendingUp, Users, Layers
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";

const DEMO_STATS = { enfants:47, presents:38, incidents:3, factures_impayees:12 };
const DEMO_GROUPES = [
  { nom:"Les Poussins", presents:12, total:15, color:T.teal   },
  { nom:"Les Lutins",   presents:9,  total:12, color:T.coral  },
  { nom:"Les Étoiles",  presents:17, total:20, color:T.purple },
];
const DEMO_INCIDENTS = [
  { id:1, type:"Réaction allergique", gravite:"élevée",  enfant:{ prenom:"Emma",  nom:"D." }, date:"2025-04-21" },
  { id:2, type:"Chute légère",         gravite:"faible",  enfant:{ prenom:"Noah",  nom:"B." }, date:"2025-04-20" },
  { id:3, type:"Conflit",              gravite:"moyenne", enfant:{ prenom:"Lucas", nom:"M." }, date:"2025-04-19" },
];
const DEMO_FACTURES = [
  { id:1, enfant:{ prenom:"Lucas", nom:"Martin"  }, montant_du:"245,00 €", statut:"impayé" },
  { id:2, id:2, enfant:{ prenom:"Emma",  nom:"Dupont"  }, montant_du:"245,00 €", statut:"impayé" },
  { id:3, enfant:{ prenom:"Noah",  nom:"Bernard" }, montant_du:"245,00 €", statut:"impayé" },
];

const G_MAP = {
  élevée:  [T.dangerLight, T.danger],
  moyenne: [T.amberLight,  T.amber ],
  faible:  [T.tealLight,   T.teal  ],
};

export default function DashAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats,    setStats]    = useState(DEMO_STATS);
  const [groupes,  setGroupes]  = useState(DEMO_GROUPES);
  const [incidents,setIncidents]= useState(DEMO_INCIDENTS);
  const [factures, setFactures] = useState(DEMO_FACTURES);

  useEffect(() => {
    api.get("/admin/stats")
      .then(r => { if (r.data?.data) setStats(r.data.data); })
      .catch(() => {});
    api.get("/groupes")
      .then(r => { if (r.data?.data?.length) setGroupes(r.data.data); })
      .catch(() => {});
    api.get("/incidents?traite=false")
      .then(r => { if (r.data?.data?.length) setIncidents(r.data.data.slice(0,3)); })
      .catch(() => {});
    api.get("/factures?statut=impayé")
      .then(r => { if (r.data?.data?.length) setFactures(r.data.data.slice(0,3)); })
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday:"long", day:"numeric", month:"long", year:"numeric"
  });

  const STAT_CARDS = [
    { label:"Enfants inscrits",    value:stats.enfants,            Icon:Baby,          color:T.teal,   bg:T.tealLight,   path:"/admin/enfants"     },
    { label:"Présents aujourd'hui",value:stats.presents,           Icon:CheckSquare,   color:T.purple, bg:T.purpleLight, path:"/edu/presences"     },
    { label:"Incidents ouverts",   value:stats.incidents,          Icon:AlertTriangle, color:T.amber,  bg:T.amberLight,  path:"/admin/incidents"   },
    { label:"Factures impayées",   value:stats.factures_impayees,  Icon:CreditCard,    color:T.danger, bg:T.dangerLight, path:"/admin/facturation" },
  ];

  return (
    <Shell role="admin" title="Tableau de bord">
      <style>{`
        .admin-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
        .admin-grid  { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .admin-right { display:flex; flex-direction:column; gap:16px; }
        @media(max-width:900px){ .admin-stats { grid-template-columns:1fr 1fr; } .admin-grid { grid-template-columns:1fr; } }
        @media(max-width:500px){ .admin-stats { grid-template-columns:1fr 1fr; } }
      `}</style>

      {/* Bannière */}
      <div style={{
        background:`linear-gradient(135deg, ${T.purple}, ${T.purpleDark})`,
        borderRadius:18, padding:"20px 24px", marginBottom:22, color:"#fff",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
      }}>
        <div>
          <div style={{ fontSize:13, opacity:.75, marginBottom:2 }}>{today}</div>
          <div style={{ fontSize:20, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
            Bonjour {user.prenom} 👋
          </div>
          <div style={{ fontSize:13, opacity:.75, marginTop:4 }}>Tableau de bord administrateur</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => navigate("/admin/enfants")} style={{
            background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)",
            borderRadius:12, padding:"9px 14px", color:"#fff",
            fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
            display:"flex", alignItems:"center", gap:5,
          }}>
            <Baby size={13}/> Enfants
          </button>
          <button onClick={() => navigate("/admin/utilisateurs")} style={{
            background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)",
            borderRadius:12, padding:"9px 14px", color:"#fff",
            fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
            display:"flex", alignItems:"center", gap:5,
          }}>
            <Users size={13}/> Utilisateurs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {STAT_CARDS.map(({ label, value, Icon, color, bg, path }) => (
          <div key={label} onClick={() => navigate(path)}
            style={{ background:T.surface, borderRadius:14, padding:16, border:`1px solid ${T.border}`, cursor:"pointer", transition:"box-shadow .15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ width:38, height:38, borderRadius:10, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
              <Icon size={18} color={color}/>
            </div>
            <div style={{ fontSize:28, fontWeight:900, color, fontFamily:"Nunito,sans-serif" }}>{value}</div>
            <div style={{ fontSize:12, color:T.text2, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid">

        {/* Présences par groupe */}
        <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
              <Layers size={14} color={T.purple}/> Présences par groupe
            </div>
            <span style={{ fontSize:12, color:T.text2 }}>
              {new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"long" })}
            </span>
          </div>
          <div style={{ padding:"14px 16px" }}>
            {(groupes.length ? groupes : DEMO_GROUPES).map(g => (
              <div key={g.nom} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{g.nom}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:g.color || T.teal }}>
                    {g.presents}/{g.total}
                  </span>
                </div>
                <div style={{ height:8, background:T.bg, borderRadius:10 }}>
                  <div style={{ height:8, background:g.color || T.teal, borderRadius:10, width:`${Math.round((g.presents/g.total)*100)}%`, transition:"width .3s" }}/>
                </div>
                <div style={{ fontSize:11, color:T.text2, marginTop:3 }}>
                  {Math.round((g.presents/g.total)*100)}% de taux de présence
                </div>
              </div>
            ))}
            <button onClick={() => navigate("/admin/groupes")} style={{
              width:"100%", padding:"9px", background:T.purpleLight, color:T.purple,
              border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700,
              fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, marginTop:4,
            }}>
              Gérer les groupes <ChevronRight size={13}/>
            </button>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="admin-right">

          {/* Incidents */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <AlertTriangle size={14} color={T.amber}/> Incidents récents
              </div>
              <button onClick={() => navigate("/admin/incidents")} style={{ background:"none", border:"none", cursor:"pointer", color:T.teal, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
                Voir tout <ChevronRight size={12}/>
              </button>
            </div>
            {incidents.map(inc => {
              const [bg, col] = G_MAP[inc.gravite] || G_MAP.moyenne;
              return (
                <div key={inc.id} style={{ display:"flex", gap:10, padding:"10px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <AlertTriangle size={15} color={col}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{inc.type}</div>
                    <div style={{ fontSize:11, color:T.text2 }}>
                      {inc.enfant?.prenom} {inc.enfant?.nom} · {new Date(inc.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <span style={{ background:bg, color:col, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, textTransform:"capitalize" }}>
                    {inc.gravite}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Factures impayées */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <CreditCard size={14} color={T.danger}/> Factures impayées
              </div>
              <button onClick={() => navigate("/admin/facturation")} style={{ background:"none", border:"none", cursor:"pointer", color:T.teal, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
                Voir tout <ChevronRight size={12}/>
              </button>
            </div>
            {factures.map((f, idx) => (
              <div key={f.id || idx} style={{ display:"flex", gap:10, padding:"10px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:T.dangerLight, color:T.danger, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                  {(f.enfant?.prenom||"?")[0]}{(f.enfant?.nom||"?")[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{f.enfant?.prenom} {f.enfant?.nom}</div>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:T.danger }}>{f.montant_du}</span>
              </div>
            ))}
            <div style={{ padding:"10px 16px", background:T.dangerLight, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:T.danger, fontWeight:700 }}>
                Total impayé : {factures.length * 245},00 €
              </span>
              <button onClick={() => navigate("/admin/facturation")} style={{
                padding:"6px 12px", background:T.danger, color:"#fff", border:"none",
                borderRadius:8, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
              }}>
                Gérer
              </button>
            </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}