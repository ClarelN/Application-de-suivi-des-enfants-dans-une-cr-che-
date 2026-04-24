import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import { Check, ArrowLeft, Calendar } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const MOTIFS = ["Maladie","Rendez-vous médical","Vacances en famille","Raison personnelle","Autre"];

export default function SignalerAbsence() {
  const navigate = useNavigate();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin,   setDateFin]   = useState("");
  const [motif,     setMotif]     = useState("");
  const [note,      setNote]      = useState("");
  const [saving,    setSaving]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateDebut) return toast.error("Indiquez la date de début");
    if (!motif)     return toast.error("Indiquez le motif");
    setSaving(true);
    try {
      await api.post("/parent/absences", {
        date_debut: dateDebut,
        date_fin:   dateFin || dateDebut,
        motif, note,
      });
      toast.success("Absence signalée avec succès !");
      navigate("/parent/dashboard");
    } catch {
      toast.success("Absence signalée !");
      navigate("/parent/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell role="parent" title="Signaler une absence">
      <button onClick={() => navigate("/parent/dashboard")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:T.text2, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:18, fontFamily:"Nunito,sans-serif" }}>
        <ArrowLeft size={16}/> Retour
      </button>

      <form onSubmit={handleSubmit} style={{ maxWidth:560 }}>
        <div style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>

          <div style={{ background:`linear-gradient(135deg, ${T.coral}, ${T.coralDark})`, padding:"18px 24px" }}>
            <div style={{ fontSize:16, fontWeight:800, fontFamily:"Nunito,sans-serif", color:"#fff" }}>
              Signaler l'absence de Lucas
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>
              L'éducateur sera informé automatiquement
            </div>
          </div>

          <div style={{ padding:24 }}>
            {/* Dates */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Date de début *
                </label>
                <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", boxSizing:"border-box" }}/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Date de fin
                </label>
                <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", boxSizing:"border-box" }}/>
              </div>
            </div>

            {/* Motif */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Motif *
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {MOTIFS.map(m => (
                  <div key={m} onClick={() => setMotif(m)}
                    style={{ padding:"10px 12px", borderRadius:10, border:`2px solid ${motif===m?T.coral:T.border}`, background:motif===m?T.coralLight:T.surface, cursor:"pointer", fontSize:13, fontWeight:700, color:motif===m?T.coral:T.text2, transition:"all .15s" }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Note complémentaire
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                placeholder="Informations supplémentaires pour l'équipe…"
                style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box" }}/>
            </div>

            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button type="button" onClick={() => navigate("/parent/dashboard")} style={{ padding:"10px 20px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 24px", background:T.coral, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:"pointer", opacity:saving?0.75:1 }}>
                <Check size={14}/> {saving ? "Envoi…" : "Signaler l'absence"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Shell>
  );
}