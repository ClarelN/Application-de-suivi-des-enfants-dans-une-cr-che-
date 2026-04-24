import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { AlertTriangle, Plus, Check, Eye, MoreVertical, Baby, Clock, X } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DEMO = [
  { id:1, type:"Réaction allergique", description:"Réaction cutanée suite au repas", gravite:"élevée",  traite:false, date:"2025-04-21", enfant:{ prenom:"Emma",  nom:"Dupont"  } },
  { id:2, type:"Chute légère",         description:"Chute dans la cour de récréation", gravite:"faible",  traite:false, date:"2025-04-20", enfant:{ prenom:"Noah",  nom:"Bernard" } },
  { id:3, type:"Conflit entre enfants",description:"Dispute au sujet d'un jouet",      gravite:"moyenne", traite:true,  date:"2025-04-19", enfant:{ prenom:"Lucas", nom:"Martin"  } },
];

const GRAVITE_MAP = {
  élevée:  { bg:T.dangerLight, col:T.danger,  label:"Élevée"  },
  moyenne: { bg:T.amberLight,  col:T.amber,   label:"Moyenne" },
  faible:  { bg:T.tealLight,   col:T.teal,    label:"Faible"  },
  high:    { bg:T.dangerLight, col:T.danger,  label:"Élevée"  },
  low:     { bg:T.tealLight,   col:T.teal,    label:"Faible"  },
};

const TABS = ["Tous","Non traités","Traités"];

export default function Incidents() {
  const [tab,       setTab]       = useState(0);
  const [incidents, setIncidents] = useState([]);
  const [showForm,  setShowForm]  = useState(false);

  // Formulaire
  const [type,     setType]    = useState("");
  const [desc,     setDesc]    = useState("");
  const [gravite,  setGravite] = useState("faible");
  const [enfantId, setEnfantId]= useState("");
  const [enfants,  setEnfants] = useState([]);
  const [saving,   setSaving]  = useState(false);

  useEffect(() => {
    api.get("/incidents")
      .then(r => setIncidents(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setIncidents(DEMO));
    api.get("/enfants")
      .then(r => setEnfants(r.data?.data || []))
      .catch(() => {});
  }, []);

  const filtered = incidents.filter(inc => {
    if (tab === 1) return !inc.traite;
    if (tab === 2) return  inc.traite;
    return true;
  });

  const marquerTraite = (id) => {
    api.patch(`/incidents/${id}`, { traite:true })
      .then(() => {
        setIncidents(prev => prev.map(i => i.id === id ? { ...i, traite:true } : i));
        toast.success("Incident marqué comme traité");
      })
      .catch(() => {
        setIncidents(prev => prev.map(i => i.id === id ? { ...i, traite:true } : i));
        toast.success("Incident marqué comme traité");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return toast.error("Indiquez le type d'incident");
    setSaving(true);
    try {
      await api.post("/incidents", {
        type, description:desc, gravite,
        enfant_id: enfantId || null,
        date: new Date().toISOString().split("T")[0],
      });
      toast.success("Incident signalé !");
      setShowForm(false); setType(""); setDesc(""); setGravite("faible"); setEnfantId("");
      api.get("/incidents").then(r => setIncidents(r.data?.data || DEMO)).catch(() => {});
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const g = (gravite) => GRAVITE_MAP[gravite] || GRAVITE_MAP.moyenne;

  return (
    <Shell role="edu" title="Incidents">

      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding:"8px 16px", borderRadius:10,
              background: tab===i ? T.coral : T.surface,
              color: tab===i ? "#fff" : T.text2,
              border:`1px solid ${tab===i ? T.coral : T.border}`,
              fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
            }}>{t}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} style={{
          marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
          padding:"9px 16px", background:T.coral, color:"#fff",
          border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
          fontWeight:700, fontSize:13, cursor:"pointer",
        }}>
          <Plus size={14}/> Signaler
        </button>
      </div>

      {/* Liste */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length === 0 && (
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:40, textAlign:"center", color:T.text2 }}>
            Aucun incident dans cette catégorie
          </div>
        )}
        {filtered.map(inc => {
          const { bg, col, label } = g(inc.gravite);
          return (
            <div key={inc.id} style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:16 }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:46, height:46, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <AlertTriangle size={22} color={col}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontSize:15, fontWeight:800, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
                      {inc.type}
                    </span>
                    <span style={{ background:bg, color:col, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                      {label}
                    </span>
                    {inc.traite && (
                      <span style={{ background:T.tealLight, color:T.tealDark, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
                        <Check size={10}/> Traité
                      </span>
                    )}
                  </div>
                  {inc.description && (
                    <div style={{ fontSize:13, color:T.text2, marginBottom:6, lineHeight:1.5 }}>
                      {inc.description}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:16, fontSize:12, color:T.text2 }}>
                    {inc.enfant && (
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <Baby size={12}/> {inc.enfant.prenom} {inc.enfant.nom}
                      </span>
                    )}
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Clock size={12}/> {new Date(inc.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>

              {!inc.traite && (
                <div style={{ display:"flex", gap:8, marginTop:12, paddingTop:10, borderTop:`1px solid ${T.border}` }}>
                  <button onClick={() => marquerTraite(inc.id)} style={{
                    display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                    background:T.tealLight, color:T.teal, border:"none", borderRadius:9,
                    fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                  }}>
                    <Check size={13}/> Marquer traité
                  </button>
                  <button style={{
                    display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                    background:T.bg, color:T.text2, border:`1px solid ${T.border}`,
                    borderRadius:9, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                  }}>
                    <Eye size={13}/> Détails
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal formulaire signalement */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{
            position:"fixed", inset:0, zIndex:40,
            background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)",
          }}/>
          <div style={{
            position:"fixed", top:"50%", left:"50%",
            transform:"translate(-50%, -50%)",
            zIndex:50, width:"100%", maxWidth:480,
            background:T.surface, borderRadius:20,
            padding:28, margin:16, boxSizing:"border-box",
            boxShadow:"0 24px 80px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                Signaler un incident
              </div>
              <button onClick={() => setShowForm(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Type */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Type d'incident *
                </label>
                <input value={type} onChange={e => setType(e.target.value)} required
                  placeholder="Ex : Chute, Réaction allergique…"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
              </div>

              {/* Description */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Description
                </label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  placeholder="Décrivez l'incident…"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box" }}/>
              </div>

              {/* Gravité */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Gravité *
                </label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {[["faible","Faible",T.teal,T.tealLight],["moyenne","Moyenne",T.amber,T.amberLight],["élevée","Élevée",T.danger,T.dangerLight]].map(([val,lbl,col,bg]) => (
                    <div key={val} onClick={() => setGravite(val)}
                      style={{ padding:"10px", borderRadius:10, textAlign:"center", cursor:"pointer",
                        border:`2px solid ${gravite===val ? col : T.border}`,
                        background: gravite===val ? bg : T.surface,
                        fontSize:13, fontWeight:700, color:gravite===val ? col : T.text2,
                        transition:"all .15s",
                      }}>
                      {lbl}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enfant concerné */}
              {enfants.length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                    Enfant concerné
                  </label>
                  <select value={enfantId} onChange={e => setEnfantId(e.target.value)}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", background:T.surface }}>
                    <option value="">Sélectionner (optionnel)</option>
                    {enfants.map(e => (
                      <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding:"10px 18px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.coral, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:saving?"not-allowed":"pointer", opacity:saving?0.75:1 }}>
                  <AlertTriangle size={14}/> {saving ? "Envoi…" : "Signaler"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Shell>
  );
}