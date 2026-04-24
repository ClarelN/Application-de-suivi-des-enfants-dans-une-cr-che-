import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";

const DEMO = [
  { id:1, date:"2025-04-22", repas:"Très bien mangé", sieste_debut:"13:30", sieste_fin:"15:00", humeur:4, note:"Journée agréable, Lucas a bien participé aux activités." },
  { id:2, date:"2025-04-21", repas:"Bien mangé",      sieste_debut:"14:00", sieste_fin:"15:30", humeur:3, note:"Un peu fatigué en fin de journée."                        },
  { id:3, date:"2025-04-20", repas:"Peu mangé",       sieste_debut:"13:00", sieste_fin:"14:30", humeur:2, note:"Pas dans son assiette, peut-être une poussée de dents ?"  },
  { id:4, date:"2025-04-19", repas:"Très bien mangé", sieste_debut:"13:30", sieste_fin:"15:00", humeur:5, note:"Excellente journée, très actif et souriant !"              },
  { id:5, date:"2025-04-18", repas:"Bien mangé",      sieste_debut:"14:00", sieste_fin:"15:00", humeur:4, note:"RAS."                                                     },
  { id:6, date:"2025-04-17", repas:"Bien mangé",      sieste_debut:"13:30", sieste_fin:"14:45", humeur:3, note:"Journée calme."                                           },
  { id:7, date:"2025-04-16", repas:"Peu mangé",       sieste_debut:"14:00", sieste_fin:"15:30", humeur:2, note:"Semble fatigué."                                          },
];

const HUMEUR_ICONS  = ["","😢","😐","🙂","😄","🤩"];
const HUMEUR_LABELS = ["","Triste","Neutre","Bien","Super","Excellent"];
const HUMEUR_COLORS = ["",T.danger, T.text2, T.teal, T.teal, T.teal];
const MOIS = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function Journal() {
  const [suivis, setSuivis] = useState([]);
  const [page,   setPage]   = useState(1);
  const PER_PAGE = 5;

  useEffect(() => {
    api.get("/parent/suivis")
      .then(r => setSuivis(r.data?.data?.length ? r.data.data : DEMO))
      .catch(() => setSuivis(DEMO));
  }, []);

  const total     = Math.ceil(suivis.length / PER_PAGE);
  const paginated = suivis.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <Shell role="parent" title="Journal de suivi">

      {/* Header info */}
      <div style={{ background:`linear-gradient(135deg, ${T.coral}, ${T.coralDark})`, borderRadius:16, padding:"16px 20px", marginBottom:20, color:"#fff", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <BookOpen size={24} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>Journal de Lucas Martin</div>
          <div style={{ fontSize:12, opacity:.8 }}>{suivis.length} entrées · Les Poussins</div>
        </div>
      </div>

      {/* Liste suivis */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {paginated.length === 0 && (
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:40, textAlign:"center", color:T.text2 }}>
            Aucun suivi enregistré
          </div>
        )}

        {paginated.map((s, i) => {
          const date    = new Date(s.date);
          const humeur  = s.humeur || 3;
          const hColor  = HUMEUR_COLORS[humeur] || T.teal;
          const hBg     = humeur <= 2 ? T.dangerLight : humeur === 3 ? T.bg : T.tealLight;

          return (
            <div key={s.id || i} style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>

              {/* Date header */}
              <div style={{ padding:"12px 18px", background:T.bg, borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", textTransform:"capitalize" }}>
                    {date.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, background:hBg, padding:"5px 12px", borderRadius:20 }}>
                  <span style={{ fontSize:18 }}>{HUMEUR_ICONS[humeur]}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:hColor }}>{HUMEUR_LABELS[humeur]}</span>
                </div>
              </div>

              <div style={{ padding:"14px 18px" }}>
                {/* Infos grille */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))", gap:10, marginBottom:s.note ? 14 : 0 }}>
                  {[
                    ["🍽️", "Repas",  s.repas || "—"],
                    ["😴", "Sieste", s.sieste_debut && s.sieste_fin ? `${s.sieste_debut} → ${s.sieste_fin}` : "Non renseigné"],
                  ].map(([icon, label, val]) => (
                    <div key={label} style={{ background:T.bg, borderRadius:10, padding:"10px 12px" }}>
                      <div style={{ fontSize:11, color:T.text2, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>
                        {icon} {label}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.text1 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Note éducateur */}
                {s.note && (
                  <div style={{ background:`${T.coralLight}80`, borderRadius:10, padding:"10px 14px", borderLeft:`3px solid ${T.coral}`, marginTop:10 }}>
                    <div style={{ fontSize:11, color:T.coral, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>
                      📝 Note de l'éducateur
                    </div>
                    <div style={{ fontSize:13, color:T.text1, lineHeight:1.6 }}>{s.note}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, padding:"12px 16px", background:T.surface, borderRadius:12, border:`1px solid ${T.border}` }}>
          <span style={{ fontSize:12, color:T.text2 }}>
            Page {page} sur {total} · {suivis.length} entrées
          </span>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              style={{ padding:"7px 12px", borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, cursor:page===1?"not-allowed":"pointer", opacity:page===1?0.4:1, display:"flex", alignItems:"center", gap:4, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, color:T.text2 }}>
              <ChevronLeft size={15}/> Précédent
            </button>
            <button onClick={() => setPage(p => Math.min(total, p+1))} disabled={page === total}
              style={{ padding:"7px 12px", borderRadius:9, background:T.coral, border:"none", cursor:page===total?"not-allowed":"pointer", opacity:page===total?0.4:1, display:"flex", alignItems:"center", gap:4, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, color:"#fff" }}>
              Suivant <ChevronRight size={15}/>
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}