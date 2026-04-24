import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import { CheckSquare, Clock, X, Check, Filter } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO = [
  { id:1, prenom:"Lucas",  nom:"Martin",   groupe:"Les Poussins", statut:"present" },
  { id:2, prenom:"Emma",   nom:"Dupont",   groupe:"Les Poussins", statut:"absent"  },
  { id:3, prenom:"Noah",   nom:"Bernard",  groupe:"Les Poussins", statut:"retard"  },
  { id:4, prenom:"Léa",    nom:"Rousseau", groupe:"Les Poussins", statut:"present" },
  { id:5, prenom:"Tom",    nom:"Petit",    groupe:"Les Poussins", statut:"present" },
  { id:6, prenom:"Chloé",  nom:"Leroy",    groupe:"Les Poussins", statut:"absent"  },
];

const today = new Date().toLocaleDateString("fr-FR", {
  weekday:"long", day:"numeric", month:"long", year:"numeric"
});

const TABS = ["Pointage", "Rapport du jour", "Historique"];

export default function Presences() {
  const [tab,      setTab]      = useState(0);
  const [enfants,  setEnfants]  = useState([]);
  const [statuts,  setStatuts]  = useState({});
  const [heures,   setHeures]   = useState({});
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    api.get("/enfants")
      .then(r => {
        const data = r.data?.data || [];
        setEnfants(data.length ? data : DEMO);
        const init = {};
        (data.length ? data : DEMO).forEach(e => { init[e.id] = e.statut || "present"; });
        setStatuts(init);
      })
      .catch(() => {
        setEnfants(DEMO);
        const init = {};
        DEMO.forEach(e => { init[e.id] = e.statut; });
        setStatuts(init);
      });
  }, []);

  const setStatut = (id, val) => setStatuts(s => ({ ...s, [id]: val }));
  const setHeure  = (id, val) => setHeures(s => ({ ...s, [id]: val }));

  const toutPresent = () => {
    const all = {};
    enfants.forEach(e => { all[e.id] = "present"; });
    setStatuts(all);
    toast.success("Tous les enfants marqués présents");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today_date = new Date().toISOString().split("T")[0];
      await Promise.all(enfants.map(e =>
        api.post("/attendances/mark", {
          enfant_id: e.id,
          date: today_date,
          status: statuts[e.id] || "present",
        }).catch(() => {})
      ));
      toast.success("Présences enregistrées !");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    present: Object.values(statuts).filter(s => s === "present").length,
    retard:  Object.values(statuts).filter(s => s === "retard").length,
    absent:  Object.values(statuts).filter(s => s === "absent").length,
  };

  const ini = (e) => `${(e.prenom||"?")[0]}${(e.nom||"?")[0]}`;
  const avColors = {
    present: [T.tealLight,   T.tealDark],
    retard:  [T.amberLight,  T.amber],
    absent:  [T.dangerLight, T.danger],
  };

  return (
    <Shell role="edu" title="Présences">
      <style>{`
        .pres-tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
        .pres-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px; }
        .pres-row { display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid ${T.border}; }
        .pres-btns { display:flex; gap:6px; }
        .pres-btn { padding:7px 14px; border-radius:9px; border:none; font-family:Nunito,sans-serif; font-weight:700; font-size:13px; cursor:pointer; transition:all .15s; }
        @media(max-width:600px){
          .pres-stats { grid-template-columns:1fr 1fr 1fr; }
          .pres-hide { display:none; }
          .pres-btns { gap:4px; }
          .pres-btn { padding:7px 10px; font-size:12px; }
        }
      `}</style>

      {/* Tabs */}
      <div className="pres-tabs">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding:"8px 18px", borderRadius:10,
            background: tab===i ? T.teal : T.surface,
            color: tab===i ? "#fff" : T.text2,
            border:`1px solid ${tab===i ? T.teal : T.border}`,
            fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
          }}>{t}</button>
        ))}
        <div style={{ marginLeft:"auto", fontSize:13, color:T.text2, display:"flex", alignItems:"center" }}>
          {today}
        </div>
      </div>

      {/* Stats */}
      <div className="pres-stats">
        {[
          [CheckSquare, counts.present, "Présents",  T.teal,   T.tealLight],
          [Clock,       counts.retard,  "Retards",   T.amber,  T.amberLight],
          [X,           counts.absent,  "Absents",   T.danger, T.dangerLight],
        ].map(([Icon, val, label, color, bg]) => (
          <div key={label} style={{ background:bg, borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon size={18} color={color}/>
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:900, color, fontFamily:"Nunito,sans-serif" }}>{val}</div>
              <div style={{ fontSize:11, color:T.text2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau pointage */}
      {tab === 0 && (
        <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              Groupe Les Poussins — {enfants.length} enfants
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={toutPresent} style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"8px 14px", background:T.tealLight, color:T.teal,
                border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
                fontWeight:700, fontSize:12, cursor:"pointer",
              }}>
                <Check size={13}/> Tout présent
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"8px 16px", background:T.teal, color:"#fff",
                border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
                fontWeight:700, fontSize:12, cursor:"pointer",
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>

          {/* Lignes */}
          {enfants.map(e => {
            const s = statuts[e.id] || "present";
            const [bg, col] = avColors[s] || avColors.present;
            return (
              <div key={e.id} className="pres-row">
                <div style={{ width:40, height:40, borderRadius:"50%", background:bg, color:col, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                  {ini(e)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>
                    {e.prenom} {e.nom}
                  </div>
                  <div className="pres-hide" style={{ fontSize:11, color:T.text2 }}>{e.groupe}</div>
                </div>
                <input
                  type="time"
                  value={heures[e.id] || "08:30"}
                  onChange={ev => setHeure(e.id, ev.target.value)}
                  className="pres-hide"
                  style={{ padding:"6px 10px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:12, fontFamily:"Nunito,sans-serif", width:92 }}
                />
                <div className="pres-btns">
                  {[["P", T.teal, "present"],["R", T.amber, "retard"],["A", T.danger, "absent"]].map(([l, c, v]) => (
                    <button key={v} className="pres-btn" onClick={() => setStatut(e.id, v)}
                      style={{
                        background: s===v ? c : T.bg,
                        color: s===v ? "#fff" : T.text2,
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rapport */}
      {tab === 1 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {[["present","Présents",T.teal,T.tealLight],["retard","Retards",T.amber,T.amberLight],["absent","Absents",T.danger,T.dangerLight]].map(([key,label,color,bg]) => (
            <div key={key} style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, background:bg }}>
                <span style={{ fontSize:13, fontWeight:800, color, fontFamily:"Nunito,sans-serif" }}>{label}</span>
              </div>
              {enfants.filter(e => (statuts[e.id]||"present") === key).map(e => (
                <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, fontFamily:"Nunito,sans-serif" }}>
                    {ini(e)}
                  </div>
                  <span style={{ fontSize:13, fontWeight:600 }}>{e.prenom} {e.nom}</span>
                </div>
              ))}
              {enfants.filter(e => (statuts[e.id]||"present") === key).length === 0 && (
                <div style={{ padding:16, fontSize:13, color:T.text3, textAlign:"center" }}>Aucun</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Historique */}
      {tab === 2 && (
        <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:24, textAlign:"center", color:T.text2 }}>
          <Clock size={32} color={T.text3} style={{ marginBottom:12 }}/>
          <div style={{ fontSize:14, fontWeight:600 }}>Historique disponible quand le backend est connecté</div>
        </div>
      )}
    </Shell>
  );
}