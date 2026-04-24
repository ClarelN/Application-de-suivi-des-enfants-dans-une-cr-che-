import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Plus, Edit2, Eye, Trash2, Users, X, Check } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DEMO = [
  { id:1, nom:"Les Poussins", age_min_mois:0,  age_max_mois:18, capacite_max:15, nb_enfants:12, couleur:T.teal   },
  { id:2, nom:"Les Lutins",   age_min_mois:18, age_max_mois:36, capacite_max:12, nb_enfants:9,  couleur:T.coral  },
  { id:3, nom:"Les Étoiles",  age_min_mois:36, age_max_mois:60, capacite_max:20, nb_enfants:17, couleur:T.purple },
];

const EMPTY = { nom:"", age_min_mois:"", age_max_mois:"", capacite_max:"", couleur:T.teal };

export default function Groupes() {
  const [groupes,   setGroupes]  = useState([]);
  const [showForm,  setShowForm] = useState(false);
  const [editing,   setEditing]  = useState(null);
  const [form,      setForm]     = useState(EMPTY);
  const [saving,    setSaving]   = useState(false);

  useEffect(() => {
    api.get("/groupes")
      .then(r => setGroupes(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setGroupes(DEMO));
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit   = (g) => { setEditing(g); setForm({ nom:g.nom, age_min_mois:g.age_min_mois, age_max_mois:g.age_max_mois, capacite_max:g.capacite_max, couleur:g.couleur||T.teal }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/groupes/${editing.id}`, form).catch(() => {});
        setGroupes(prev => prev.map(g => g.id === editing.id ? { ...g, ...form } : g));
        toast.success("Groupe modifié !");
      } else {
        const res = await api.post("/groupes", form).catch(() => ({ data:{ data:{ id:Date.now(), ...form, nb_enfants:0 } } }));
        setGroupes(prev => [...prev, res.data?.data || { id:Date.now(), ...form, nb_enfants:0 }]);
        toast.success("Groupe créé !");
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (g) => {
    Swal.fire({
      title:"Supprimer ce groupe ?",
      text:`Supprimer "${g.nom}" ? Les enfants ne seront pas supprimés.`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:T.danger,
      cancelButtonColor:T.text2,
      confirmButtonText:"Oui, supprimer",
      cancelButtonText:"Annuler",
    }).then(r => {
      if (r.isConfirmed) {
        api.delete(`/groupes/${g.id}`).catch(() => {});
        setGroupes(prev => prev.filter(x => x.id !== g.id));
        toast.success("Groupe supprimé");
      }
    });
  };

  const COULEURS = [T.teal, T.coral, T.purple, T.amber, T.danger, "#3B48CC"];

  return (
    <Shell role="admin" title="Groupes">

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:18 }}>
        <button onClick={openCreate} style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"10px 18px", background:T.teal, color:"#fff",
          border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif",
          fontWeight:700, fontSize:13, cursor:"pointer",
        }}>
          <Plus size={14}/> Nouveau groupe
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
        {groupes.map(g => {
          const c = g.couleur || T.teal;
          const pct = Math.round(((g.nb_enfants||0) / (g.capacite_max||1)) * 100);
          return (
            <div key={g.id} style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
              {/* Header coloré */}
              <div style={{ background:`${c}18`, padding:"18px 16px", borderBottom:`3px solid ${c}` }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${c}25`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                  <Users size={22} color={c}/>
                </div>
                <div style={{ fontSize:17, fontWeight:800, color:c, fontFamily:"Nunito,sans-serif" }}>{g.nom}</div>
                <div style={{ fontSize:12, color:T.text2, marginTop:2 }}>
                  {g.age_min_mois} – {g.age_max_mois} mois · max {g.capacite_max} enfants
                </div>
              </div>
              {/* Body */}
              <div style={{ padding:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:T.text2 }}>Occupation</span>
                  <span style={{ fontSize:13, fontWeight:800, color:c }}>{g.nb_enfants||0}/{g.capacite_max}</span>
                </div>
                <div style={{ height:8, background:T.bg, borderRadius:10, marginBottom:14 }}>
                  <div style={{ height:8, background:c, borderRadius:10, width:`${pct}%`, transition:"width .3s" }}/>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => openEdit(g)} style={{
                    flex:1, padding:"8px", background:T.amberLight, color:T.amber,
                    border:"none", borderRadius:9, fontFamily:"Nunito,sans-serif",
                    fontWeight:700, fontSize:12, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                  }}>
                    <Edit2 size={12}/> Modifier
                  </button>
                  <button onClick={() => handleDelete(g)} style={{
                    padding:"8px 10px", background:T.dangerLight, color:T.danger,
                    border:"none", borderRadius:9, cursor:"pointer", display:"flex", alignItems:"center",
                  }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:50, width:"100%", maxWidth:460, background:T.surface, borderRadius:20, padding:28, margin:16, boxSizing:"border-box", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                {editing ? "Modifier le groupe" : "Nouveau groupe"}
              </div>
              <button onClick={() => setShowForm(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {[["Nom du groupe *","nom","text","Ex: Les Coccinelles"],["Âge minimum (mois) *","age_min_mois","number","0"],["Âge maximum (mois) *","age_max_mois","number","18"],["Capacité maximum *","capacite_max","number","15"]].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} required placeholder={ph}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Couleur</label>
                <div style={{ display:"flex", gap:10 }}>
                  {COULEURS.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, couleur:c }))}
                      style={{ width:32, height:32, borderRadius:"50%", background:c, cursor:"pointer", border:`3px solid ${form.couleur===c ? T.text1 : "transparent"}`, transition:"border .15s" }}/>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding:"10px 18px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.teal, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:"pointer", opacity:saving?0.75:1 }}>
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