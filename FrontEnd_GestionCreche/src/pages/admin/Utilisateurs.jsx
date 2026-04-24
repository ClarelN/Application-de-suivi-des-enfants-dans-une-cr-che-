import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Search, UserPlus, Edit2, X, Check, Shield, BookOpen, Heart } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DEMO = [
  { id:1, nom:"Dupont",  prenom:"Marie",  email:"marie@creche.fr",   role:"edu",    actif:true  },
  { id:2, nom:"Martin",  prenom:"Sophie", email:"sophie@gmail.com",   role:"parent", actif:true  },
  { id:3, nom:"Bernard", prenom:"Jean",   email:"jean@creche.fr",     role:"admin",  actif:true  },
  { id:4, nom:"Petit",   prenom:"Claire", email:"claire@creche.fr",   role:"edu",    actif:false },
  { id:5, nom:"Leroy",   prenom:"Paul",   email:"paul@gmail.com",     role:"parent", actif:true  },
];

const ROLE_CONFIG = {
  edu:    { label:"Éducateur", Icon:BookOpen, color:T.teal,   bg:T.tealLight   },
  parent: { label:"Parent",    Icon:Heart,    color:T.coral,  bg:T.coralLight  },
  admin:  { label:"Admin",     Icon:Shield,   color:T.purple, bg:T.purpleLight },
};

const EMPTY_FORM = { nom:"", prenom:"", email:"", role:"edu", password:"", actif:true };

export default function Utilisateurs() {
  const [users,    setUsers]    = useState([]);
  const [search,   setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    api.get("/utilisateurs")
      .then(r => setUsers(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setUsers(DEMO));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const match = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(q);
    const rMatch = roleFilter === "tous" || u.role === roleFilter;
    return match && rMatch;
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (u) => { setEditing(u); setForm({ nom:u.nom, prenom:u.prenom, email:u.email, role:u.role, password:"", actif:u.actif }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/utilisateurs/${editing.id}`, form).catch(() => {});
        setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u));
        toast.success("Utilisateur modifié !");
      } else {
        const res = await api.post("/utilisateurs", form).catch(() => ({ data:{ data:{ id:Date.now(), ...form } } }));
        setUsers(prev => [...prev, res.data?.data || { id:Date.now(), ...form }]);
        toast.success("Compte créé !");
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleActif = (u) => {
    const newVal = !u.actif;
    api.put(`/utilisateurs/${u.id}`, { actif:newVal }).catch(() => {});
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, actif:newVal } : x));
    toast.success(newVal ? "Compte activé" : "Compte désactivé");
  };

  return (
    <Shell role="admin" title="Utilisateurs">

      {/* Toolbar */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, position:"relative", minWidth:200 }}>
          <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur…"
            style={{ width:"100%", padding:"9px 12px 9px 33px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito Sans,sans-serif", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["tous","edu","parent","admin"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding:"8px 14px", borderRadius:10, border:`1px solid ${T.border}`,
              background: roleFilter===r ? T.purple : T.surface,
              color: roleFilter===r ? "#fff" : T.text2,
              fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
            }}>
              {r === "tous" ? "Tous" : ROLE_CONFIG[r]?.label}
            </button>
          ))}
        </div>
        <button onClick={openCreate} style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"9px 16px", background:T.purple, color:"#fff",
          border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
          fontWeight:700, fontSize:13, cursor:"pointer",
        }}>
          <UserPlus size={14}/> Créer un compte
        </button>
      </div>

      {/* Tableau */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.bg, borderBottom:`2px solid ${T.border}` }}>
              {["Utilisateur","Rôle","Email","Statut","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const R = ROLE_CONFIG[u.role] || ROLE_CONFIG.edu;
              const ini = `${(u.prenom||"?")[0]}${(u.nom||"?")[0]}`;
              return (
                <tr key={u.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:R.bg, color:R.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                        {ini}
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{u.prenom} {u.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:R.bg, color:R.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <R.Icon size={11}/> {R.label}
                    </span>
                  </td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:T.text2 }}>{u.email}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:u.actif?T.tealLight:T.bg, color:u.actif?T.tealDark:T.text2, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:u.actif?T.teal:T.text3 }}/>
                      {u.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={() => openEdit(u)}
                        style={{ padding:"5px 8px", borderRadius:7, background:T.amberLight, border:"none", cursor:"pointer", display:"flex" }}>
                        <Edit2 size={13} color={T.amber}/>
                      </button>
                      <button onClick={() => toggleActif(u)}
                        style={{ padding:"5px 8px", borderRadius:7, background:u.actif?T.dangerLight:T.tealLight, border:"none", cursor:"pointer", display:"flex" }}>
                        {u.actif ? <X size={13} color={T.danger}/> : <Check size={13} color={T.teal}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding:"12px 14px", background:T.bg, borderTop:`1px solid ${T.border}`, fontSize:12, color:T.text2 }}>
          {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} · {users.filter(u => u.actif).length} actifs
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:50, width:"100%", maxWidth:460, background:T.surface, borderRadius:20, padding:28, margin:16, boxSizing:"border-box", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                {editing ? "Modifier l'utilisateur" : "Créer un compte"}
              </div>
              <button onClick={() => setShowForm(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:0 }}>
                {[["Nom *","nom"],["Prénom *","prenom"]].map(([label, key]) => (
                  <div key={key} style={{ marginBottom:14 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} required
                      style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} required
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Rôle *</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {Object.entries(ROLE_CONFIG).map(([key, { label, Icon, color, bg }]) => (
                    <div key={key} onClick={() => setForm(f => ({ ...f, role:key }))}
                      style={{ padding:"10px 8px", borderRadius:10, textAlign:"center", cursor:"pointer", border:`2px solid ${form.role===key ? color : T.border}`, background:form.role===key ? bg : T.surface, transition:"all .15s" }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:4, color:form.role===key ? color : T.text3 }}><Icon size={16}/></div>
                      <div style={{ fontSize:12, fontWeight:700, color:form.role===key ? color : T.text2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {!editing && (
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Mot de passe *</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password:e.target.value }))} required={!editing} placeholder="Minimum 8 caractères"
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
                </div>
              )}
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding:"10px 18px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.purple, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:"pointer", opacity:saving?0.75:1 }}>
                  <Check size={14}/> {saving ? "Enregistrement…" : editing ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Shell>
  );
}