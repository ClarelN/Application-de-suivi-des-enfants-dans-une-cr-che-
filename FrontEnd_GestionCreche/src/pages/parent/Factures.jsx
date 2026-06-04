import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Download, CreditCard, Check, Clock } from "lucide-react";
import { T } from "../../constants/theme";
import api, { storageUrl } from "../../services/api";
import toast from "react-hot-toast";

const MOIS = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const STATUT = {
  regle:               { label:"Payé",    color:"teal",   isPaid:true  },
  en_attente:          { label:"Impayé",  color:"danger", isPaid:false },
  partiellement_regle: { label:"Partiel", color:"amber",  isPaid:false },
};
const getStatut = (s) => STATUT[s] || STATUT.en_attente;

export default function Factures() {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    api.get("/parent/factures")
      .then(r => setFactures(r.data?.data || []))
      .catch(() => {});
  }, []);

  const totalDu = factures
    .filter(f => !getStatut(f.statut).isPaid)
    .reduce((acc, f) => acc + parseFloat(f.montant_du||0), 0);

  const handleDownload = (f) => {
    if (f.pdf_chemin) {
      window.open(storageUrl(f.pdf_chemin), "_blank");
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
            {Math.round(totalDu).toLocaleString('fr-FR')} FCFA
          </div>
          <div style={{ fontSize:12, color:T.text2 }}>
            {factures.filter(f => !getStatut(f.statut).isPaid).length} facture{factures.filter(f => !getStatut(f.statut).isPaid).length>1?"s":""} impayée{factures.filter(f => !getStatut(f.statut).isPaid).length>1?"s":""}
          </div>
        </div>
        <div style={{ background:T.tealLight, borderRadius:14, padding:18, border:`1px solid ${T.teal}25` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <Check size={16} color={T.teal}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.tealDark }}>Factures payées</span>
          </div>
          <div style={{ fontSize:28, fontWeight:900, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
            {factures.filter(f => f.statut==="regle").length}
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
            <div style={{ width:44, height:44, borderRadius:12, background:getStatut(f.statut).isPaid?T.tealLight:T.dangerLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {getStatut(f.statut).isPaid
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
              <div style={{ fontSize:16, fontWeight:900, fontFamily:"Nunito,sans-serif", color:getStatut(f.statut).isPaid?T.teal:T.danger }}>
                {Math.round(parseFloat(f.montant_du)||0).toLocaleString('fr-FR')} FCFA
              </div>
              <span style={{ background:getStatut(f.statut).isPaid?T.tealLight:T.dangerLight, color:getStatut(f.statut).isPaid?T.tealDark:T.danger, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                {getStatut(f.statut).label}
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