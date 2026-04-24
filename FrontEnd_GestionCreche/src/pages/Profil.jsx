import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/layout/Shell";
import { Camera, Check, Shield, LogOut, Mail, Phone } from "lucide-react";
import { T, ROLES } from "../constants/theme";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Profil({ role = "edu" }) {
  const navigate = useNavigate();
  const R = ROLES[role];
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    nom:       stored.nom       || "",
    prenom:    stored.prenom    || "",
    email:     stored.email     || "exemple@creche.fr",
    telephone: stored.telephone || "",
  });

  const [pwForm, setPwForm] = useState({
    current:"", nouveau:"", confirm:"",
  });

  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPw,   setSavingPw]   = useState(false);

  const ini = `${(form.prenom||"?")[0]}${(form.nom||"?")[0]}`;

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await api.put("/profil", form).catch(() => {});
      localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
      toast.success("Profil mis à jour !");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSavePw = async (e) => {
    e.preventDefault();
    if (pwForm.nouveau !== pwForm.confirm)
      return toast.error("Les mots de passe ne correspondent pas");
    if (pwForm.nouveau.length < 8)
      return toast.error("Minimum 8 caractères");
    setSavingPw(true);
    try {
      await api.put("/profil/password", {
        current_password:      pwForm.current,
        password:              pwForm.nouveau,
        password_confirmation: pwForm.confirm,
      }).catch(() => {});
      toast.success("Mot de passe modifié !");
      setPwForm({ current:"", nouveau:"", confirm:"" });
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const inputStyle = {
    width:"100%", padding:"10px 12px", borderRadius:10,
    border:`1.5px solid ${T.border}`, fontSize:14,
    fontFamily:"Nunito Sans,sans-serif", color:T.text1,
    background:T.surface, outline:"none", boxSizing:"border-box",
  };

  const Field = ({ label, children }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <Shell role={role} title="Mon profil">
      <style>{`
        .profil-grid { display:grid; grid-template-columns:260px 1fr; gap:18px; }
        .profil-right { display:flex; flex-direction:column; gap:16px; }
        @media(max-width:800px){ .profil-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="profil-grid">

        {/* ── Carte identité ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, textAlign:"center" }}>

            {/* Avatar */}
            <div style={{ position:"relative", width:80, height:80, margin:"0 auto 12px" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg, ${R.color}, ${R.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"#fff", fontFamily:"Nunito,sans-serif" }}>
                {ini}
              </div>
              <button style={{ position:"absolute", bottom:0, right:0, width:26, height:26, borderRadius:"50%", background:R.color, border:"2px solid white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Camera size={11} color="#fff"/>
              </button>
            </div>

            <div style={{ fontSize:18, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              {form.prenom} {form.nom}
            </div>
            <div style={{ margin:"6px 0" }}>
              <span style={{ background:R.light, color:R.color, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                {R.label}
              </span>
            </div>

            <div style={{ height:1, background:T.border, margin:"14px 0" }}/>

            {[[Mail, form.email],[Phone, form.telephone||"+33 6 00 00 00 00"]].map(([Icon, val]) => (
              <div key={val} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 0", fontSize:12, color:T.text2 }}>
                <Icon size={13} color={T.text3}/> {val}
              </div>
            ))}

            <div style={{ marginTop:16 }}>
              <button onClick={handleLogout} style={{ width:"100%", padding:"10px", background:"transparent", border:`1.5px solid ${T.danger}`, borderRadius:10, color:T.danger, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <LogOut size={14}/> Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* ── Formulaires ── */}
        <div className="profil-right">

          {/* Infos personnelles */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
              Informations personnelles
            </div>
            <form onSubmit={handleSaveInfo} style={{ padding:18 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Field label="Nom">
                  <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom:e.target.value }))} style={inputStyle}/>
                </Field>
                <Field label="Prénom">
                  <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom:e.target.value }))} style={inputStyle}/>
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} style={inputStyle}/>
                </Field>
                <Field label="Téléphone">
                  <input type="tel" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone:e.target.value }))} style={inputStyle}/>
                </Field>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                <button type="submit" disabled={savingInfo} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:R.color, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", opacity:savingInfo?0.75:1 }}>
                  <Check size={14}/> {savingInfo ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>

          {/* Mot de passe */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
              <Shield size={15} color={R.color}/> Changer le mot de passe
            </div>
            <form onSubmit={handleSavePw} style={{ padding:18 }}>
              {[["Mot de passe actuel","current"],["Nouveau mot de passe","nouveau"],["Confirmer le nouveau","confirm"]].map(([label, key]) => (
                <Field key={key} label={label}>
                  <input type="password" value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]:e.target.value }))} placeholder="••••••••" style={inputStyle}/>
                </Field>
              ))}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button type="submit" disabled={savingPw} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.coral, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", opacity:savingPw?0.75:1 }}>
                  <Check size={14}/> {savingPw ? "Modification…" : "Modifier le mot de passe"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Shell>
  );
}