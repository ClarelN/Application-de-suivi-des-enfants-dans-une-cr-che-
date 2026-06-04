import Shell from "../../components/layout/Shell";
import { BarChart2, FileText, Users, Baby, CreditCard, TrendingUp } from "lucide-react";
import { T } from "../../constants/theme";
import { useState } from "react";

const RAPPORTS = [
  { id:"presences",  label:"Rapport de présences",   desc:"Taux de présence par groupe et par période", Icon:Users,     color:T.teal,   bg:T.tealLight   },
  { id:"enfants",    label:"Liste des enfants",       desc:"Fiche complète de tous les enfants inscrits",Icon:Baby,      color:T.purple, bg:T.purpleLight },
  { id:"factures",   label:"Rapport de facturation",  desc:"État des paiements et impayés",              Icon:CreditCard,color:T.coral,  bg:T.coralLight  },
  { id:"incidents",  label:"Rapport d'incidents",     desc:"Récapitulatif des incidents par période",    Icon:TrendingUp,color:T.amber,  bg:T.amberLight  },
  { id:"activites",  label:"Rapport d'activités",     desc:"Suivi des activités et sorties",             Icon:BarChart2, color:T.teal,   bg:T.tealLight   },
];

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function Rapports() {
  const [mois,  setMois]  = useState(new Date().getMonth());
  const [annee, setAnnee] = useState(new Date().getFullYear());

  return (
    <Shell role="admin" title="Rapports">

      {/* Période */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>Période :</div>
        <select value={mois} onChange={e => setMois(Number(e.target.value))}
          style={{ padding:"8px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito,sans-serif" }}>
          {MOIS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select value={annee} onChange={e => setAnnee(Number(e.target.value))}
          style={{ padding:"8px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito,sans-serif" }}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{ fontSize:13, color:T.text2 }}>
          Rapports pour <strong>{MOIS[mois]} {annee}</strong>
        </span>
      </div>

      {/* Cartes rapports */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:16 }}>
        {RAPPORTS.map(r => (
          <div key={r.id} style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20 }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
              <div style={{ width:46, height:46, borderRadius:12, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <r.Icon size={22} color={r.color}/>
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>{r.label}</div>
                <div style={{ fontSize:12, color:T.text2, marginTop:3, lineHeight:1.5 }}>{r.desc}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:T.bg, borderRadius:10, border:`1px solid ${T.border}` }}>
              <FileText size={14} color={T.text3}/>
              <span style={{ fontSize:13, color:T.text2, fontFamily:"Nunito,sans-serif" }}>
                Export PDF — fonctionnalité à venir
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats globales */}
      <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, marginTop:20 }}>
        <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
          <BarChart2 size={15} color={T.purple}/> Aperçu du mois — {MOIS[mois]} {annee}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:12 }}>
          {[
            ["Taux présence moyen","87%",    T.teal,   T.tealLight  ],
            ["Incidents signalés", "5",      T.amber,  T.amberLight ],
            ["Factures émises",    "47",     T.purple, T.purpleLight],
            ["Taux recouvrement",  "74%",    T.coral,  T.coralLight ],
          ].map(([label, val, color, bg]) => (
            <div key={label} style={{ background:bg, borderRadius:12, padding:"14px" }}>
              <div style={{ fontSize:24, fontWeight:900, color, fontFamily:"Nunito,sans-serif" }}>{val}</div>
              <div style={{ fontSize:11, color:T.text2, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
