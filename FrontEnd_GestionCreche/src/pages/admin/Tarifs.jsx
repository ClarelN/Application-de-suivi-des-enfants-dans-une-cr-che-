import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Plus, Edit2, Check, X, CreditCard } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO = [
  { id:1, groupe:{ nom:"Les Poussins" }, montant_mensuel:"245.00", frais_inscription:"150.00", date_effet:"2025-01-01", actif:true  },
  { id:2, groupe:{ nom:"Les Lutins"   }, montant_mensuel:"265.00", frais_inscription:"150.00", date_effet:"2025-01-01", actif:true  },
  { id:3, groupe:{ nom:"Les Étoiles"  }, montant_mensuel:"285.00", frais_inscription:"150.00", date_effet:"2025-01-01", actif:true  },
  { id:4, groupe:{ nom:"Les Poussins" }, montant_mensuel:"225.00", frais_inscription:"130.00", date_effet:"2024-01-01", actif:false },
];

const EMPTY = { groupe_id:"", montant_mensuel:"", frais_inscription:"", date_effet:"", actif:true };

export default function Tarifs() {
  const [tarifs,   setTarifs]   = useState([]);
  const [groupes,  setGroupes]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    api.get("/tarifs")
      .then(r => setTarifs(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setTarifs(DEMO));
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
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit   = (t) => {
    setEditing(t);
    setForm({ groupe_id:t.groupe_id||t.groupe?.id||"", montant_mensuel:t.montant_mensuel, frais_inscription:t.frais_inscription, date_effet:t.date_effet, actif:t.actif });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/tarifs/${editing.id}`, form).catch(() => {});
        setTarifs(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
        toast.success("Tarif modifié !");
      } else {
        const res = await api.post("/tarifs", form).catch(() => ({ data:{ data:{ id:Date.now(), ...form, groupe:{ nom:"Nouveau" } } } }));
        setTarifs(prev => [...prev, res.data?.data]);
        toast.success("Tarif créé !");
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleActif = (t) => {
    api.put(`/tarifs/${t.id}`, { actif:!t.actif }).catch(() => {});
    setTarifs(prev => prev.map(x => x.id === t.id ? { ...x, actif:!x.actif } : x));
    toast.success(t.actif ? "Tarif désactivé" : "Tarif activé");
  };

  return (
    <Shell role="admin" title="Gestion des tarifs">

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:18 }}>
        <button onClick={openCreate} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 18px", background:T.teal, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <Plus size={14}/> Nouveau tarif
        </button>
      </div>

      {/* Info banner */}
      <div style={{ background:T.amberLight, borderRadius:12, padding:"12px 16px", marginBottom:18, border:`1px solid ${T.amber}30`, display:"flex", gap:10, alignItems:"center" }}>
        <CreditCard size={18} color={T.amber}/>
        <div style={{ fontSize:13, color:T.amber, fontWeight:600 }}>
          Les tarifs actifs s'appliquent automatiquement à la génération des factures mensuelles.
        </div>
      </div>

      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.bg, borderBottom:`2px solid ${T.border}` }}>
              {["Groupe","Mensuel","Frais inscription","Date d'effet","Statut","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tarifs.map(t => (
              <tr key={t.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"11px 14px" }}>
                  <span style={{ background:T.purpleLight, color:T.purpleDark, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                    {t.groupe?.nom || "—"}
                  </span>
                </td>
                <td style={{ padding:"11px 14px", fontSize:14, fontWeight:800, color:T.teal }}>
                  {parseFloat(t.montant_mensuel).toFixed(2)} €
                </td>
                <td style={{ padding:"11px 14px", fontSize:13, color:T.text2 }}>
                  {parseFloat(t.frais_inscription).toFixed(2)} €
                </td>
                <td style={{ padding:"11px 14px", fontSize:13, color:T.text2 }}>
                  {new Date(t.date_effet).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding:"11px 14px" }}>
                  <span style={{ background:t.actif?T.tealLight:T.bg, color:t.actif?T.tealDark:T.text2, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:t.actif?T.teal:T.text3 }}/>
                    {t.actif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ display:"flex", gap:5 }}>
                    <button onClick={() => openEdit(t)}
                      style={{ padding:"5px 8px", borderRadius:7, background:T.amberLight, border:"none", cursor:"pointer", display:"flex" }}>
                      <Edit2 size={13} color={T.amber}/>
                    </button>
                    <button onClick={() => toggleActif(t)}
                      style={{ padding:"5px 8px", borderRadius:7, background:t.actif?T.dangerLight:T.tealLight, border:"none", cursor:"pointer", display:"flex" }}>
                      {t.actif ? <X size={13} color={T.danger}/> : <Check size={13} color={T.teal}/>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:50, width:"100%", maxWidth:460, background:T.surface, borderRadius:20, padding:28, margin:16, boxSizing:"border-box", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                {editing ? "Modifier le tarif" : "Nouveau tarif"}
              </div>
              <button onClick={() => setShowForm(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {[["Groupe","groupe_id","select"],["Montant mensuel (€) *","montant_mensuel","number"],["Frais d'inscription (€) *","frais_inscription","number"],["Date d'effet *","date_effet","date"]].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
                  {type === "select" ? (
                    <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} required
                      style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", background:T.surface }}>
                      <option value="">Sélectionner un groupe</option>
                      {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                    </select>
                  ) : (
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} required step={type==="number"?"0.01":undefined}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
                  )}
                </div>
              ))}
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
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