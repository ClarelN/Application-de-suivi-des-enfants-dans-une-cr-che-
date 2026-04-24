import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Download, CreditCard, Check, Clock } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO = [
  { id:1, mois:4, annee:2025, montant_du:"245.00", statut:"impayé", pdf_chemin:null      },
  { id:2, mois:3, annee:2025, montant_du:"245.00", statut:"payé",   pdf_chemin:"/f2.pdf" },
  { id:3, mois:2, annee:2025, montant_du:"245.00", statut:"payé",   pdf_chemin:"/f3.pdf" },
  { id:4, mois:1, annee:2025, montant_du:"245.00", statut:"payé",   pdf_chemin:"/f4.pdf" },
];

const MOIS = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function Factures() {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    api.get("/parent/factures")
      .then(r => setFactures(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setFactures(DEMO));
  }, []);

  const totalDu = factures
    .filter(f => f.statut === "impayé")
    .reduce((acc, f) => acc + parseFloat(f.montant_du||0), 0);

  const handleDownload = (f) => {
    if (f.pdf_chemin) {
      window.open(`http://127.0.0.1:8000/storage/${f.pdf_chemin}`, "_blank");
    } else {
      toast.error("PDF non disponible pour cette facture");
    }
  };

  return (
    <Shell role="parent" title="Mes factures">

      {/* Résumé */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <div style={{ background:T.dangerLight, borderRadius:14, padding:18, border:`1px solid ${T.danger}25` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <CreditCard size={16} color={T.danger}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.danger }}>Montant restant dû</span>
          </div>
          <div style={{ fontSize:28, fontWeight:900, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
            {totalDu.toFixed(2)} €
          </div>
          <div style={{ fontSize:12, color:T.text2 }}>
            {factures.filter(f => f.statut==="impayé").length} facture{factures.filter(f => f.statut==="impayé").length>1?"s":""} impayée{factures.filter(f => f.statut==="impayé").length>1?"s":""}
          </div>
        </div>
        <div style={{ background:T.tealLight, borderRadius:14, padding:18, border:`1px solid ${T.teal}25` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <Check size={16} color={T.teal}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.tealDark }}>Factures payées</span>
          </div>
          <div style={{ fontSize:28, fontWeight:900, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
            {factures.filter(f => f.statut==="payé").length}
          </div>
          <div style={{ fontSize:12, color:T.text2 }}>cette année</div>
        </div>
      </div>

      {/* Liste */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
          Historique des factures
        </div>
        {factures.map((f, i) => (
          <div key={f.id || i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:`1px solid ${T.border}` }}>
            {/* Icône */}
            <div style={{ width:44, height:44, borderRadius:12, background:f.statut==="payé"?T.tealLight:T.dangerLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {f.statut==="payé"
                ? <Check size={20} color={T.teal}/>
                : <Clock size={20} color={T.danger}/>}
            </div>

            {/* Infos */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>
                {MOIS[f.mois]} {f.annee}
              </div>
              <div style={{ fontSize:12, color:T.text2 }}>Lucas Martin</div>
            </div>

            {/* Montant */}
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:16, fontWeight:900, fontFamily:"Nunito,sans-serif", color:f.statut==="payé"?T.teal:T.danger }}>
                {parseFloat(f.montant_du).toFixed(2)} €
              </div>
              <span style={{ background:f.statut==="payé"?T.tealLight:T.dangerLight, color:f.statut==="payé"?T.tealDark:T.danger, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                {f.statut==="payé" ? "Payé" : "Impayé"}
              </span>
            </div>

            {/* Télécharger */}
            <button onClick={() => handleDownload(f)} style={{
              padding:"8px 12px", background:T.bg, border:`1px solid ${T.border}`,
              borderRadius:9, cursor:"pointer", display:"flex", alignItems:"center", gap:5,
              color:T.text2, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12,
            }}>
              <Download size={13}/> PDF
            </button>
          </div>
        ))}
      </div>
    </Shell>
  );
}