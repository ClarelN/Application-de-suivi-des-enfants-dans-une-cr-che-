import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  Baby, AlertTriangle, BookOpen,
  UserCheck, ChevronRight, CheckSquare
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";

const DEMO_ENFANT = {
  id:1, nom:"Martin", prenom:"Lucas",
  date_naissance:"2021-03-15", sexe:"M",
  allergie:"Arachides, fruits à coque",
  obs_medicale:"Asthme léger — inhalateur dans le sac",
  statut:"actif", statut_presence:"present",
  groupe:{ nom:"Les Poussins" },
  personnes_autorisees:[
    { id:1, nom:"Martin",  prenom:"Sophie", lien_parente:"Mère",       telephone:"06 12 34 56 78" },
    { id:2, nom:"Martin",  prenom:"Jean",   lien_parente:"Père",       telephone:"06 98 76 54 32" },
    { id:3, nom:"Dupont",  prenom:"Claire", lien_parente:"Grand-mère", telephone:"06 55 44 33 22" },
  ],
};

const DEMO_SUIVIS = [
  { id:1, date:"2025-04-22", repas:"Très bien mangé", sieste_debut:"13:30", sieste_fin:"15:00", humeur:4, note:"Journée agréable" },
  { id:2, date:"2025-04-21", repas:"Bien mangé",      sieste_debut:"14:00", sieste_fin:"15:30", humeur:3, note:"Un peu fatigué"   },
  { id:3, date:"2025-04-20", repas:"Peu mangé",       sieste_debut:"13:00", sieste_fin:"14:30", humeur:2, note:"Pas dans son assiette" },
];

const HUMEUR_ICONS = ["","😢","😐","🙂","😄","🤩"];

const calcAge = (dob) => {
  if (!dob) return "";
  const m = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*30.44));
  return m >= 24 ? `${Math.floor(m/12)} ans` : `${m} mois`;
};

export default function MonEnfant() {
  const navigate = useNavigate();
  const [enfant, setEnfant] = useState(null);
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    api.get("/parent/enfant")
      .then(r => setEnfant(r.data?.data || DEMO_ENFANT))
      .catch(() => setEnfant(DEMO_ENFANT));
    api.get("/parent/suivis")
      .then(r => setSuivis(r.data?.data?.slice(0,3) || DEMO_SUIVIS))
      .catch(() => setSuivis(DEMO_SUIVIS));
  }, []);

  const e = enfant || DEMO_ENFANT;
  const ini = `${(e.prenom||"?")[0]}${(e.nom||"?")[0]}`;

  const presColors = {
    present: [T.tealLight,   T.tealDark, "Présent"],
    absent:  [T.dangerLight, T.danger,   "Absent" ],
    retard:  [T.amberLight,  T.amber,    "Retard" ],
  };
  const [pbg, pcol, plabel] = presColors[e.statut_presence] || presColors.present;

  const displaySuivis  = suivis.length  ? suivis  : DEMO_SUIVIS;
  const personnes      = e.personnes_autorisees || DEMO_ENFANT.personnes_autorisees;
  const pBgs  = [T.coralLight,  T.tealLight,  T.purpleLight];
  const pCols = [T.coralDark,   T.tealDark,   T.purpleDark ];

  return (
    <Shell role="parent" title="Mon enfant">
      <style>{`
        .enfant-grid { display:grid; grid-template-columns:280px 1fr; gap:18px; }
        .enfant-right { display:flex; flex-direction:column; gap:14px; }
        @media(max-width:800px){ .enfant-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="enfant-grid">

        {/* ── Colonne gauche ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Carte identité */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", margin:"0 auto 12px", background:pbg, border:`3px solid ${pcol}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:pcol, fontFamily:"Nunito,sans-serif" }}>
              {ini}
            </div>
            <div style={{ fontSize:19, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              {e.prenom} {e.nom}
            </div>
            <div style={{ fontSize:12, color:T.text2, margin:"4px 0 8px" }}>
              {e.groupe?.nom} · {calcAge(e.date_naissance)}
            </div>
            <span style={{ background:pbg, color:pcol, padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700 }}>
              {plabel}
            </span>

            <div style={{ height:1, background:T.border, margin:"14px 0" }}/>

            {[[Baby,"Naissance",new Date(e.date_naissance).toLocaleDateString("fr-FR")],[UserCheck,"Sexe",e.sexe==="M"?"Masculin":"Féminin"]].map(([Icon,l,v]) => (
              <div key={l} style={{ display:"flex", gap:10, alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${T.border}`, textAlign:"left" }}>
                <Icon size={14} color={T.text3}/>
                <div>
                  <div style={{ fontSize:10, color:T.text3, fontWeight:700, textTransform:"uppercase" }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{v}</div>
                </div>
              </div>
            ))}

            {/* Actions parent */}
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button onClick={() => navigate("/parent/journal")} style={{ flex:1, padding:"9px", background:T.coralLight, color:T.coral, border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                <BookOpen size={13}/> Journal
              </button>
              <button onClick={() => navigate("/parent/signaler-absence")} style={{ flex:1, padding:"9px", background:T.dangerLight, color:T.danger, border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                Absence
              </button>
            </div>
          </div>

          {/* Personnes autorisées */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, fontSize:13, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              Personnes autorisées
            </div>
            {personnes.map((p, i) => (
              <div key={p.id} style={{ display:"flex", gap:10, padding:"10px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:pBgs[i%3], color:pCols[i%3], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{p.prenom} {p.nom}</div>
                  <div style={{ fontSize:11, color:T.text2 }}>{p.lien_parente} · {p.telephone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="enfant-right">

          {/* Infos médicales */}
          <div style={{ background:T.dangerLight, borderRadius:14, border:`1px solid ${T.danger}25`, padding:18 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.danger, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <AlertTriangle size={14}/> Informations médicales
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <div style={{ fontSize:10, color:T.danger, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Allergies</div>
                <div style={{ fontSize:13 }}>{e.allergie || "Aucune"}</div>
              </div>
              <div>
                <div style={{ fontSize:10, color:T.amber, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Observations</div>
                <div style={{ fontSize:13 }}>{e.obs_medicale || "Aucune"}</div>
              </div>
            </div>
          </div>

          {/* Derniers suivis */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <BookOpen size={14} color={T.coral}/> Derniers suivis
              </div>
              <button onClick={() => navigate("/parent/journal")} style={{ background:"none", border:"none", cursor:"pointer", color:T.coral, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
                Voir tout <ChevronRight size={12}/>
              </button>
            </div>
            {displaySuivis.map((s, i) => (
              <div key={s.id || i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:38, height:38, borderRadius:10, background:T.coralLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {HUMEUR_ICONS[s.humeur] || "🙂"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>
                    {new Date(s.date).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
                  </div>
                  <div style={{ fontSize:12, color:T.text2 }}>
                    🍽️ {s.repas} · 😴 {s.sieste_debut}–{s.sieste_fin}
                  </div>
                </div>
                {s.note && (
                  <div style={{ fontSize:12, color:T.text2, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {s.note}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </Shell>
  );
}