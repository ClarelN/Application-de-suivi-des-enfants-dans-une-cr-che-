import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import { ArrowLeft, Check, Camera, AlertTriangle, ChevronDown } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const EMPTY = {
  nom:"", prenom:"", date_naissance:"", sexe:"M",
  groupe_id:"", allergie:"", obs_medicale:"", statut:"actif",
};

export default function AdminFormulaireEnfant() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form,    setForm]    = useState(EMPTY);
  const [groupes, setGroupes] = useState([]);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    api.get("/groupes")
      .then(r => setGroupes(r.data?.data || [
        { id:1, nom:"Les Poussins" },
        { id:2, nom:"Les Lutins"   },
        { id:3, nom:"Les Étoiles"  },
      ]))
      .catch(() => setGroupes([
        { id:1, nom:"Les Poussins" },
        { id:2, nom:"Les Lutins"   },
        { id:3, nom:"Les Étoiles"  },
      ]));

    if (isEdit) {
      api.get(`/enfants/${id}`)
        .then(r => {
          const e = r.data?.data;
          if (e) setForm({
            nom:            e.nom            || "",
            prenom:         e.prenom         || "",
            date_naissance: e.date_naissance || "",
            sexe:           e.sexe           || "M",
            groupe_id:      e.groupe_id      || e.groupe?.id || "",
            allergie:       e.allergie       || "",
            obs_medicale:   e.obs_medicale   || "",
            statut:         e.statut         || "actif",
          });
        }).catch(() => {});
    }
  }, [id]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]:val }));
    setErrors(e => ({ ...e, [key]:"" }));
  };

  const validate = () => {
    const err = {};
    if (!form.nom.trim())      err.nom            = "Obligatoire";
    if (!form.prenom.trim())   err.prenom         = "Obligatoire";
    if (!form.date_naissance)  err.date_naissance = "Obligatoire";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/enfants/${id}`, form);
        toast.success("Enfant modifié !");
      } else {
        await api.post("/enfants", form);
        toast.success("Enfant inscrit !");
      }
      navigate("/admin/enfants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (err) => ({
    width:"100%", padding:"10px 12px", borderRadius:10,
    border:`1.5px solid ${err ? T.danger : T.border}`,
    fontSize:14, fontFamily:"Nunito Sans,sans-serif",
    color:T.text1, background:T.surface, outline:"none", boxSizing:"border-box",
  });

  const Field = ({ label, error, children }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:11, color:T.danger, marginTop:4 }}>{error}</div>}
    </div>
  );

  return (
    <Shell role="admin" title={isEdit ? "Modifier l'enfant" : "Inscrire un enfant"}>
      <button onClick={() => navigate("/admin/enfants")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:T.text2, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:18, fontFamily:"Nunito,sans-serif" }}>
        <ArrowLeft size={16}/> Retour à la liste
      </button>

      <form onSubmit={handleSubmit} style={{ maxWidth:720 }}>
        <div style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>

          <div style={{ background:`linear-gradient(135deg, ${T.purple}, ${T.purpleDark})`, padding:"18px 24px" }}>
            <div style={{ fontSize:16, fontWeight:800, fontFamily:"Nunito,sans-serif", color:"#fff" }}>
              {isEdit ? "Modifier les informations de l'enfant" : "Inscription d'un nouvel enfant"}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Les champs * sont obligatoires</div>
          </div>

          <div style={{ padding:24 }}>
            {/* Photo */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:T.purpleLight, border:`2px dashed ${T.purple}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", cursor:"pointer" }}>
                  <Camera size={28} color={T.purple}/>
                </div>
                <span style={{ fontSize:12, color:T.purple, fontWeight:700, cursor:"pointer" }}>
                  {isEdit ? "Changer la photo" : "Ajouter une photo"}
                </span>
              </div>
            </div>

            <div style={{ fontSize:11, fontWeight:800, color:T.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ height:1, background:T.purpleLight, flex:1 }}/>
              Informations personnelles
              <div style={{ height:1, background:T.purpleLight, flex:1 }}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Nom *" error={errors.nom}>
                <input value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Martin" style={inputStyle(errors.nom)}/>
              </Field>
              <Field label="Prénom *" error={errors.prenom}>
                <input value={form.prenom} onChange={e => set("prenom", e.target.value)} placeholder="Lucas" style={inputStyle(errors.prenom)}/>
              </Field>
              <Field label="Date de naissance *" error={errors.date_naissance}>
                <input type="date" value={form.date_naissance} onChange={e => set("date_naissance", e.target.value)} style={inputStyle(errors.date_naissance)}/>
              </Field>
              <Field label="Sexe *">
                <div style={{ display:"flex", gap:10 }}>
                  {[["M","Masculin"],["F","Féminin"]].map(([val, label]) => (
                    <div key={val} onClick={() => set("sexe", val)} style={{ flex:1, padding:"10px", borderRadius:10, textAlign:"center", border:`2px solid ${form.sexe===val?T.purple:T.border}`, background:form.sexe===val?T.purpleLight:T.surface, cursor:"pointer", fontSize:13, fontWeight:700, color:form.sexe===val?T.purple:T.text2, transition:"all .15s" }}>
                      {label}
                    </div>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Groupe">
              <div style={{ position:"relative" }}>
                <select value={form.groupe_id} onChange={e => set("groupe_id", e.target.value)} style={{ ...inputStyle(false), appearance:"none", paddingRight:36, cursor:"pointer" }}>
                  <option value="">Sans groupe</option>
                  {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:T.text3, pointerEvents:"none" }}/>
              </div>
            </Field>

            <div style={{ fontSize:11, fontWeight:800, color:T.danger, textTransform:"uppercase", letterSpacing:"0.08em", margin:"20px 0 16px", display:"flex", alignItems:"center", gap:8 }}>
              <AlertTriangle size={12}/>
              <div style={{ height:1, background:T.dangerLight, flex:1 }}/>
              Informations médicales
              <div style={{ height:1, background:T.dangerLight, flex:1 }}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Allergies">
                <textarea value={form.allergie} onChange={e => set("allergie", e.target.value)} rows={3} placeholder="Listez les allergies…" style={{ ...inputStyle(false), resize:"none" }}/>
              </Field>
              <Field label="Observations médicales">
                <textarea value={form.obs_medicale} onChange={e => set("obs_medicale", e.target.value)} rows={3} placeholder="Antécédents, traitements…" style={{ ...inputStyle(false), resize:"none" }}/>
              </Field>
            </div>

            {isEdit && (
              <Field label="Statut">
                <div style={{ display:"flex", gap:10 }}>
                  {[["actif","Actif"],["inactif","Inactif"],["archive","Archivé"]].map(([val, label]) => (
                    <div key={val} onClick={() => set("statut", val)} style={{ padding:"9px 16px", borderRadius:10, cursor:"pointer", border:`2px solid ${form.statut===val?T.purple:T.border}`, background:form.statut===val?T.purpleLight:T.surface, fontSize:13, fontWeight:700, color:form.statut===val?T.purple:T.text2, transition:"all .15s" }}>
                      {label}
                    </div>
                  ))}
                </div>
              </Field>
            )}

            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:16, borderTop:`1px solid ${T.border}`, marginTop:8 }}>
              <button type="button" onClick={() => navigate("/admin/enfants")} style={{ padding:"10px 20px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 28px", background:T.purple, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:14, cursor:saving?"not-allowed":"pointer", opacity:saving?0.75:1 }}>
                <Check size={15}/>
                {saving ? "Enregistrement…" : isEdit ? "Sauvegarder" : "Inscrire l'enfant"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Shell>
  );
}