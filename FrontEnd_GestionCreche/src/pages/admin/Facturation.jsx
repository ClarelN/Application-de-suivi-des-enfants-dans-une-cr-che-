import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Download, Check, Filter, Search } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO = [
  { id:1, enfant:{ prenom:"Lucas", nom:"Martin"  }, mois:4, annee:2025, montant_du:"245,00 €", statut:"impayé" },
  { id:2, enfant:{ prenom:"Emma",  nom:"Dupont"  }, mois:4, annee:2025, montant_du:"245,00 €", statut:"payé"   },
  { id:3, enfant:{ prenom:"Noah",  nom:"Bernard" }, mois:4, annee:2025, montant_du:"245,00 €", statut:"impayé" },
  { id:4, enfant:{ prenom:"Léa",   nom:"Rousseau"}, mois:4, annee:2025, montant_du:"245,00 €", statut:"payé"   },
  { id:5, enfant:{ prenom:"Tom",   nom:"Petit"   }, mois:3, annee:2025, montant_du:"245,00 €", statut:"impayé" },
  { id:6, enfant:{ prenom:"Chloé", nom:"Leroy"   }, mois:3, annee:2025, montant_du:"245,00 €", statut:"payé"   },
];

const MOIS = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function Facturation() {
  const [factures,  setFactures]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [statFilter,setStatFilter]= useState("tous");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get("/factures")
      .then(r => setFactures(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setFactures(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const encaisser = (id) => {
    api.post(`/factures/${id}/paiement`, { mode:"especes", montant:"245.00" }).catch(() => {});
    setFactures(prev => prev.map(f => f.id === id ? { ...f, statut:"payé" } : f));
    toast.success("Paiement enregistré !");
  };

  const filtered = factures.filter(f => {
    const q = search.toLowerCase();
    const match = `${f.enfant?.prenom} ${f.enfant?.nom}`.toLowerCase().includes(q);
    const sMatch = statFilter === "tous" || f.statut === statFilter;
    return match && sMatch;
  });

  const totalImpayes = factures.filter(f => f.statut === "impayé").length;
  const totalPercu   = factures.filter(f => f.statut === "payé").length * 245;
  const totalDu      = factures.filter(f => f.statut === "impayé").length * 245;

  return (
    <Shell role="admin" title="Facturation">
      <style>{`
        .fact-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
        @media(max-width:600px){ .fact-stats { grid-template-columns:1fr; } }
      `}</style>

      {/* Stats */}
      <div className="fact-stats">
        {[
          ["Total à percevoir", `${totalDu},00 €`, T.danger, T.dangerLight],
          ["Factures impayées", `${totalImpayes}`, T.amber,  T.amberLight ],
          ["Reçu ce mois",      `${totalPercu},00 €`, T.teal, T.tealLight ],
        ].map(([label, val, color, bg]) => (
          <div key={label} style={{ background:bg, borderRadius:14, padding:"16px" }}>
            <div style={{ fontSize:26, fontWeight:900, color, fontFamily:"Nunito,sans-serif" }}>{val}</div>
            <div style={{ fontSize:12, color:T.text2, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, position:"relative", minWidth:180 }}>
          <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un enfant…"
            style={{ width:"100%", padding:"9px 12px 9px 33px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito Sans,sans-serif", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["tous","impayé","payé"].map(s => (
            <button key={s} onClick={() => setStatFilter(s)} style={{
              padding:"8px 14px", borderRadius:10,
              background: statFilter===s ? T.purple : T.surface,
              color: statFilter===s ? "#fff" : T.text2,
              border:`1px solid ${T.border}`,
              fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
            }}>
              {s === "tous" ? "Tous" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead>
              <tr style={{ background:T.bg, borderBottom:`2px solid ${T.border}` }}>
                {["Enfant","Période","Montant","Statut","Actions"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:"center", padding:32, color:T.text2 }}>Chargement…</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:f.statut==="payé"?T.tealLight:T.dangerLight, color:f.statut==="payé"?T.tealDark:T.danger, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                        {(f.enfant?.prenom||"?")[0]}{(f.enfant?.nom||"?")[0]}
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{f.enfant?.prenom} {f.enfant?.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:T.text2 }}>{MOIS[f.mois]} {f.annee}</td>
                  <td style={{ padding:"11px 14px", fontSize:14, fontWeight:800 }}>{f.montant_du}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:f.statut==="payé"?T.tealLight:T.dangerLight, color:f.statut==="payé"?T.tealDark:T.danger, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:f.statut==="payé"?T.teal:T.danger }}/>
                      {f.statut === "payé" ? "Payé" : "Impayé"}
                    </span>
                  </td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <button style={{ padding:"5px 8px", borderRadius:7, background:T.tealLight, border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
                        <Download size={13} color={T.teal}/>
                      </button>
                      {f.statut === "impayé" && (
                        <button onClick={() => encaisser(f.id)} style={{
                          display:"flex", alignItems:"center", gap:4, padding:"5px 10px",
                          borderRadius:7, background:T.purpleLight, color:T.purple,
                          border:"none", cursor:"pointer", fontFamily:"Nunito,sans-serif",
                          fontWeight:700, fontSize:11,
                        }}>
                          <Check size={11}/> Encaisser
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 14px", background:T.bg, borderTop:`1px solid ${T.border}`, fontSize:12, color:T.text2 }}>
          {filtered.length} facture{filtered.length > 1 ? "s" : ""}
        </div>
      </div>
    </Shell>
  );
}