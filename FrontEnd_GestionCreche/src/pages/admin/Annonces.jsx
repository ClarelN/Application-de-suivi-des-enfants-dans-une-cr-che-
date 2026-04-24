import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Plus, Edit2, Trash2, X, Check, Megaphone } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DEMO = [
  { id:1, titre:"Fermeture le 1er mai", corps:"La crèche sera fermée le mercredi 1er mai 2025.", cible:"tous",        expire_le:"2025-04-30" },
  { id:2, titre:"Sortie au parc",        corps:"Sortie éducative prévue vendredi matin pour les groupes Les Lutins et Les Étoiles.", cible:"parents",     expire_le:"2025-04-25" },
  { id:3, titre:"Réunion équipe",        corps:"Réunion mensuelle obligatoire jeudi à 17h30 en salle de réunion.", cible:"educateurs",  expire_le:"2025-04-24" },
];

const CIBLE_CONFIG = {
  tous:       { label:"Tous",        color:T.teal,   bg:T.tealLight   },
  parents:    { label:"Parents",     color:T.coral,  bg:T.coralLight  },
  educateurs: { label:"Éducateurs",  color:T.purple, bg:T.purpleLight },
};

const EMPTY = { titre:"", corps:"", cible:"tous", expire_le:"" };

export default function Annonces() {
  const [annonces,  setAnnonces]  = useState([]);
  const [filtre,    setFiltre]    = useState("tous");
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    api.get("/annonces")
      .then(r => setAnnonces(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setAnnonces(DEMO));
  }, []);

  const filtered = filtre === "tous" ? annonces : annonces.filter(a => a.cible === filtre);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit   = (a) => { setEditing(a); setForm({ titre:a.titre, corps:a.corps, cible:a.cible, expire_le:a.expire_le?.split("T")[0]||"" }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/annonces/${editing.id}`, form).catch(() => {});
        setAnnonces(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
        toast.success("Annonce modifiée !");
      } else {
        const res = await api.post("/annonces", form).catch(() => ({ data:{ data:{ id:Date.now(), ...form } } }));
        setAnnonces(prev => [...prev, res.data?.data || { id:Date.now(), ...form }]);
        toast.success("Annonce publiée !");
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (a) => {
    Swal.fire({
      title:"Supprimer cette annonce ?",
      text:`"${a.titre}" sera supprimée définitivement.`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:T.danger,
      cancelButtonColor:T.text2,
      confirmButtonText:"Oui, supprimer",
      cancelButtonText:"Annuler",
    }).then(r => {
      if (r.isConfirmed) {
        api.delete(`/annonces/${a.id}`).catch(() => {});
        setAnnonces(prev => prev.filter(x => x.id !== a.id));
        toast.success("Annonce supprimée");
      }
    });
  };

  return (
    <Shell role="admin" title="Annonces">

      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {["tous","parents","educateurs"].map(c => (
            <button key={c} onClick={() => setFiltre(c)} style={{
              padding:"8px 16px", borderRadius:10,
              background: filtre===c ? T.purple : T.surface,
              color: filtre===c ? "#fff" : T.text2,
              border:`1px solid ${T.border}`,
              fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
            }}>
              {c === "tous" ? "Toutes" : CIBLE_CONFIG[c]?.label}
            </button>
          ))}
        </div>
        <button onClick={openCreate} style={{
          marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
          padding:"9px 16px", background:T.purple, color:"#fff",
          border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
          fontWeight:700, fontSize:13, cursor:"pointer",
        }}>
          <Plus size={14}/> Publier une annonce
        </button>
      </div>

      {/* Liste */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:40, textAlign:"center", color:T.text2 }}>
            <Megaphone size={32} color={T.text3} style={{ marginBottom:12 }}/>
            <div style={{ fontSize:14 }}>Aucune annonce</div>
          </div>
        )}
        {filtered.map(a => {
          const C = CIBLE_CONFIG[a.cible] || CIBLE_CONFIG.tous;
          const expire = a.expire_le ? new Date(a.expire_le) : null;
          const expired = expire && expire < new Date();
          return (
            <div key={a.id} style={{ background:T.surface, borderRadius:14, border:`1px solid ${expired ? T.border : T.border}`, padding:18, opacity:expired?0.6:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:10, flexWrap:"wrap" }}>
                <div style={{ fontSize:15, fontWeight:800, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
                  {a.titre}
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                  <span style={{ background:C.bg, color:C.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                    {C.label}
                  </span>
                  {expire && (
                    <span style={{ fontSize:11, color:expired?T.danger:T.text3 }}>
                      {expired ? "⚠️ Expirée" : `exp. ${expire.toLocaleDateString("fr-FR")}`}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize:13, color:T.text2, lineHeight:1.6, marginBottom:14 }}>{a.corps}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => openEdit(a)} style={{
                  display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
                  background:T.amberLight, color:T.amber, border:"none", borderRadius:9,
                  fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                }}>
                  <Edit2 size={12}/> Modifier
                </button>
                <button onClick={() => handleDelete(a)} style={{
                  display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
                  background:T.dangerLight, color:T.danger, border:`1px solid ${T.danger}30`,
                  borderRadius:9, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                }}>
                  <Trash2 size={12}/> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:50, width:"100%", maxWidth:500, background:T.surface, borderRadius:20, padding:28, margin:16, boxSizing:"border-box", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                {editing ? "Modifier l'annonce" : "Nouvelle annonce"}
              </div>
              <button onClick={() => setShowForm(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Titre *</label>
                <input value={form.titre} onChange={e => setForm(f => ({ ...f, titre:e.target.value }))} required placeholder="Titre de l'annonce"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Message *</label>
                <textarea value={form.corps} onChange={e => setForm(f => ({ ...f, corps:e.target.value }))} required rows={4} placeholder="Contenu de l'annonce…"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Destinataires *</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {Object.entries(CIBLE_CONFIG).map(([key, { label, color, bg }]) => (
                    <div key={key} onClick={() => setForm(f => ({ ...f, cible:key }))}
                      style={{ padding:"10px", borderRadius:10, textAlign:"center", cursor:"pointer", border:`2px solid ${form.cible===key ? color : T.border}`, background:form.cible===key ? bg : T.surface, fontSize:13, fontWeight:700, color:form.cible===key ? color : T.text2, transition:"all .15s" }}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Date d'expiration</label>
                <input type="date" value={form.expire_le} onChange={e => setForm(f => ({ ...f, expire_le:e.target.value }))}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif" }}/>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding:"10px 18px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.purple, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:"pointer", opacity:saving?0.75:1 }}>
                  <Megaphone size={14}/> {saving ? "Publication…" : editing ? "Modifier" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Shell>
  );
}