import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Check, Utensils, Moon, Smile, FileText, ChevronDown } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO_ENFANTS = [
  { id:1, prenom:"Lucas",  nom:"Martin"   },
  { id:2, prenom:"Emma",   nom:"Dupont"   },
  { id:3, prenom:"Noah",   nom:"Bernard"  },
  { id:4, prenom:"Léa",    nom:"Rousseau" },
  { id:5, prenom:"Tom",    nom:"Petit"    },
];

const REPAS_OPTIONS = ["Très bien mangé","Bien mangé","Peu mangé","N'a pas mangé"];
const HUMEURS = [
  { val:1, label:"Triste",    icon:"😢" },
  { val:2, label:"Neutre",    icon:"😐" },
  { val:3, label:"Bien",      icon:"🙂" },
  { val:4, label:"Super",     icon:"😄" },
  { val:5, label:"Excellent", icon:"🤩" },
];

export default function Suivi() {
  const [enfants,  setEnfants]  = useState([]);
  const [enfantId, setEnfantId] = useState("");
  const [date,     setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [repas,    setRepas]    = useState("");
  const [siesteD,  setSiesteD]  = useState("");
  const [siesteF,  setSiesteF]  = useState("");
  const [humeur,   setHumeur]   = useState(0);
  const [note,     setNote]     = useState("");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    api.get("/enfants")
      .then(r => setEnfants(r.data?.data?.length ? r.data.data : DEMO_ENFANTS))
      .catch(() => setEnfants(DEMO_ENFANTS));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enfantId) return toast.error("Sélectionnez un enfant");
    if (!repas)    return toast.error("Indiquez le repas");
    if (!humeur)   return toast.error("Indiquez l'humeur");

    setSaving(true);
    try {
      await api.post("/suivis", {
        enfant_id:    enfantId,
        date,
        repas,
        sieste_debut: siesteD || null,
        sieste_fin:   siesteF || null,
        humeur,
        note,
      });
      toast.success("Suivi enregistré !");
      setRepas(""); setSiesteD(""); setSiesteF(""); setHumeur(0); setNote(""); setEnfantId("");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const enfantSelectionne = enfants.find(e => e.id === Number(enfantId));

  return (
    <Shell role="edu" title="Suivi journalier">
      <style>{`
        .suivi-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .suivi-repas { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .suivi-humeurs { display:flex; justify-content:space-between; gap:8px; }
        @media(max-width:640px){
          .suivi-grid { grid-template-columns:1fr; }
          .suivi-humeurs { gap:4px; }
        }
      `}</style>

      <form onSubmit={handleSubmit} style={{ maxWidth:680 }}>
        <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>

          {/* Header */}
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, background:`linear-gradient(135deg, ${T.teal}, ${T.tealDark})` }}>
            <div style={{ fontSize:16, fontWeight:800, fontFamily:"Nunito,sans-serif", color:"#fff" }}>
              Nouveau suivi journalier
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>
              Remplissez les informations pour l'enfant
            </div>
          </div>

          <div style={{ padding:20 }}>

            {/* Enfant + Date */}
            <div className="suivi-grid" style={{ marginBottom:20 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Enfant *
                </label>
                <div style={{ position:"relative" }}>
                  <select
                    value={enfantId}
                    onChange={e => setEnfantId(e.target.value)}
                    required
                    style={{ width:"100%", padding:"10px 36px 10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", background:T.surface, color:T.text1, appearance:"none", cursor:"pointer" }}
                  >
                    <option value="">Sélectionner un enfant</option>
                    {enfants.map(e => (
                      <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:T.text3, pointerEvents:"none" }}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Date
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif" }}/>
              </div>
            </div>

            {/* Carte enfant sélectionné */}
            {enfantSelectionne && (
              <div style={{ background:T.tealLight, borderRadius:12, padding:"10px 14px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:T.teal, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, fontFamily:"Nunito,sans-serif" }}>
                  {enfantSelectionne.prenom[0]}{enfantSelectionne.nom[0]}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.tealDark, fontFamily:"Nunito,sans-serif" }}>
                    {enfantSelectionne.prenom} {enfantSelectionne.nom}
                  </div>
                  <div style={{ fontSize:11, color:T.teal }}>Suivi du {new Date(date).toLocaleDateString("fr-FR")}</div>
                </div>
              </div>
            )}

            {/* Repas */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:6, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                <Utensils size={13}/> Repas *
              </label>
              <div className="suivi-repas">
                {REPAS_OPTIONS.map(opt => (
                  <div key={opt} onClick={() => setRepas(opt)}
                    style={{
                      padding:"11px 12px", borderRadius:10, cursor:"pointer", textAlign:"center",
                      border:`2px solid ${repas===opt ? T.teal : T.border}`,
                      background: repas===opt ? T.tealLight : T.surface,
                      fontSize:13, fontWeight:700,
                      color: repas===opt ? T.teal : T.text2,
                      transition:"all .15s",
                    }}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            {/* Sieste */}
            <div className="suivi-grid" style={{ marginBottom:20 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:6, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  <Moon size={13}/> Sieste début
                </label>
                <input type="time" value={siesteD} onChange={e => setSiesteD(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif" }}/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:6, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  <Moon size={13}/> Sieste fin
                </label>
                <input type="time" value={siesteF} onChange={e => setSiesteF(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif" }}/>
              </div>
            </div>

            {/* Humeur */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:6, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                <Smile size={13}/> Humeur *
              </label>
              <div className="suivi-humeurs">
                {HUMEURS.map(h => (
                  <div key={h.val} onClick={() => setHumeur(h.val)}
                    style={{ textAlign:"center", cursor:"pointer", flex:1 }}>
                    <div style={{
                      height:52, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
                      border:`2px solid ${humeur===h.val ? T.teal : T.border}`,
                      background: humeur===h.val ? T.tealLight : T.bg,
                      fontSize:26, marginBottom:4, transition:"all .15s",
                    }}>
                      {h.icon}
                    </div>
                    <div style={{ fontSize:10, color:humeur===h.val ? T.teal : T.text3, fontWeight:700 }}>
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:6, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                <FileText size={13}/> Note / Observations
              </label>
              <textarea
                value={note} onChange={e => setNote(e.target.value)}
                rows={3} placeholder="Observations du jour, événements particuliers…"
                style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box", color:T.text1 }}
              />
            </div>

            {/* Boutons */}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <button type="button"
                style={{ padding:"10px 20px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Annuler
              </button>
              <button type="submit" disabled={saving}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 24px", background:T.teal, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:14, cursor:saving?"not-allowed":"pointer", opacity:saving?0.75:1 }}>
                <Check size={15}/> {saving ? "Enregistrement…" : "Enregistrer le suivi"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Shell>
  );
}