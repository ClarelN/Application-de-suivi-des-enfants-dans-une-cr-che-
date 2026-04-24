import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  ArrowLeft, Edit2, AlertTriangle, Baby,
  UserCheck, Layers, Calendar, Plus, BookOpen
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
    { id:1, nom:"Martin",  prenom:"Sophie", lien_parente:"Mère",      telephone:"06 12 34 56 78" },
    { id:2, nom:"Martin",  prenom:"Jean",   lien_parente:"Père",      telephone:"06 98 76 54 32" },
    { id:3, nom:"Dupont",  prenom:"Claire", lien_parente:"Grand-mère",telephone:"06 55 44 33 22" },
  ],
};

const DEMO_SUIVIS = [
  { id:1, date:"2025-04-21", repas:"Bien", sieste_debut:"13:30", sieste_fin:"15:00", humeur:"Joyeux",     note:"RAS" },
  { id:2, date:"2025-04-20", repas:"Peu",  sieste_debut:"14:00", sieste_fin:"15:30", humeur:"Calme",      note:"Fatigué" },
  { id:3, date:"2025-04-19", repas:"Bien", sieste_debut:"13:00", sieste_fin:"15:00", humeur:"Très actif", note:"Super journée" },
];

const calcAge = (dob) => {
  if (!dob) return "—";
  const diff = Date.now() - new Date(dob).getTime();
  const m = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  return m >= 24 ? `${Math.floor(m/12)} ans` : `${m} mois`;
};

const InfoRow = ({ Icon, label, value }) => (
  <div style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
    <Icon size={14} color={T.text3} style={{ marginTop:2, flexShrink:0 }}/>
    <div>
      <div style={{ fontSize:10, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color:T.text1 }}>{value}</div>
    </div>
  </div>
);

export default function FicheEnfant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enfant, setEnfant] = useState(null);
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    api.get(`/enfants/${id}`)
      .then(r => setEnfant(r.data?.data))
      .catch(() => setEnfant(DEMO_ENFANT));
    api.get(`/suivis?enfant_id=${id}`)
      .then(r => setSuivis(r.data?.data?.slice(0,3) || []))
      .catch(() => setSuivis(DEMO_SUIVIS));
  }, [id]);

  if (!enfant) return (
    <Shell role="edu" title="Fiche enfant">
      <div style={{ textAlign:"center", padding:60, color:T.text2 }}>Chargement…</div>
    </Shell>
  );

  const ini = `${(enfant.prenom||"?")[0]}${(enfant.nom||"?")[0]}`;
  const [pbg, pcol, plabel] = {
    present:[T.tealLight, T.tealDark, "Présent"],
    absent: [T.dangerLight, T.danger, "Absent"],
    retard: [T.amberLight, T.amber,   "Retard"],
  }[enfant.statut_presence] || [T.bg, T.text2, "—"];

  const displaySuivis = suivis.length ? suivis : DEMO_SUIVIS;
  const personnes = enfant.personnes_autorisees || DEMO_ENFANT.personnes_autorisees;
  const pColors = ["coral","teal","purple","amber"];

  return (
    <Shell role="edu" title="Fiche enfant">
      <style>{`
        .fiche-grid { display:grid; grid-template-columns:260px 1fr; gap:18px; }
        .fiche-right { display:flex; flex-direction:column; gap:16px; }
        @media(max-width:800px){
          .fiche-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Retour */}
      <button onClick={() => navigate("/edu/enfants")}
        style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:T.text2, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:14, fontFamily:"Nunito,sans-serif" }}>
        <ArrowLeft size={16}/> Retour à la liste
      </button>

      <div className="fiche-grid">

        {/* ── Colonne gauche ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, textAlign:"center" }}>
            <div style={{
              width:80, height:80, borderRadius:"50%", margin:"0 auto 12px",
              background:pbg, border:`3px solid ${pcol}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:30, fontWeight:800, color:pcol, fontFamily:"Nunito,sans-serif",
            }}>{ini}</div>
            <div style={{ fontSize:18, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              {enfant.prenom} {enfant.nom}
            </div>
            <div style={{ fontSize:12, color:T.text2, margin:"4px 0 8px" }}>
              {enfant.groupe?.nom || "—"} · {calcAge(enfant.date_naissance)}
            </div>
            <span style={{ background:T.tealLight, color:T.tealDark, padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
              {enfant.statut || "actif"}
            </span>

            <div style={{ height:1, background:T.border, margin:"14px 0" }}/>

            <InfoRow Icon={Baby}      label="Naissance" value={new Date(enfant.date_naissance).toLocaleDateString("fr-FR")}/>
            <InfoRow Icon={UserCheck} label="Sexe"      value={enfant.sexe === "M" ? "Masculin" : "Féminin"}/>
            <InfoRow Icon={Layers}    label="Groupe"    value={enfant.groupe?.nom || "—"}/>

            <div style={{ display:"flex", gap:8, marginTop:14 }}>
                {/* Remplacer les boutons Modifier/Archiver par des actions métier */}
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                <button onClick={() => navigate("/edu/suivi", { state:{ enfantId:enfant.id } })}
                    style={{ flex:1, padding:"9px", background:T.coralLight, color:T.coral, border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                    <BookOpen size={13}/> Suivi
                </button>
                <button onClick={() => navigate("/edu/presences")}
                    style={{ flex:1, padding:"9px", background:T.tealLight, color:T.teal, border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                    <CheckSquare size={13}/> Présence
                </button>
                </div>
            </div>
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="fiche-right">

          {/* Infos médicales */}
          <div style={{ background:T.dangerLight, borderRadius:14, border:`1px solid ${T.danger}25`, padding:18 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.danger, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <AlertTriangle size={14}/> Informations médicales
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <div style={{ fontSize:10, color:T.danger, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Allergies</div>
                <div style={{ fontSize:13, color:T.text1 }}>{enfant.allergie || "Aucune"}</div>
              </div>
              <div>
                <div style={{ fontSize:10, color:T.amber, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Observations</div>
                <div style={{ fontSize:13, color:T.text1 }}>{enfant.obs_medicale || "Aucune"}</div>
              </div>
            </div>
          </div>

          {/* Personnes autorisées */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                Personnes autorisées
              </div>
              <button style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", background:T.tealLight, color:T.teal, border:"none", borderRadius:8, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                <Plus size={12}/> Ajouter
              </button>
            </div>
            {personnes.map((p, i) => {
              const cMap = { coral:[T.coralLight,T.coralDark], teal:[T.tealLight,T.tealDark], purple:[T.purpleLight,T.purpleDark], amber:[T.amberLight,T.amber] };
              const [bg, col] = cMap[pColors[i % pColors.length]] || cMap.teal;
              const ini2 = `${(p.prenom||"?")[0]}${(p.nom||"?")[0]}`;
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:bg, color:col, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>{ini2}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{p.prenom} {p.nom}</div>
                    <div style={{ fontSize:11, color:T.text2 }}>{p.lien_parente}</div>
                  </div>
                  <div style={{ fontSize:12, color:T.text2 }}>{p.telephone}</div>
                </div>
              );
            })}
          </div>

          {/* Derniers suivis */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <BookOpen size={14} color={T.teal}/> Derniers suivis
              </div>
              <button onClick={() => navigate("/edu/suivi")}
                style={{ padding:"6px 12px", background:T.tealLight, color:T.teal, border:"none", borderRadius:8, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                + Nouveau
              </button>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:T.bg }}>
                  {["Date","Repas","Sieste","Humeur","Note"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, fontWeight:700, color:T.text2, textTransform:"uppercase", borderBottom:`2px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displaySuivis.map((s, i) => (
                  <tr key={s.id || i} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"9px 12px", fontSize:12, color:T.text2 }}>
                      {new Date(s.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding:"9px 12px", fontSize:12 }}>{s.repas}</td>
                    <td style={{ padding:"9px 12px", fontSize:12 }}>
                      {s.sieste_debut && s.sieste_fin ? `${s.sieste_debut}–${s.sieste_fin}` : "—"}
                    </td>
                    <td style={{ padding:"9px 12px", fontSize:12 }}>{s.humeur}</td>
                    <td style={{ padding:"9px 12px", fontSize:12, color:T.text2 }}>{s.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Shell>
  );
}