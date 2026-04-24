import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../../components/layout/Shell";
import {
  Baby, CreditCard, MessageSquare, Calendar,
  ChevronRight, Utensils, Moon, Smile, FileText,
  CheckCircle, AlertTriangle
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";

const DEMO_ENFANT = {
  id:1, prenom:"Lucas", nom:"Martin",
  groupe:{ nom:"Les Poussins" }, date_naissance:"2021-03-15",
  allergie:"Arachides", statut_presence:"present",
};

const DEMO_SUIVI = {
  repas:"A très bien mangé", sieste_debut:"13:30", sieste_fin:"15:00",
  humeur:4, note:"Journée très agréable, Lucas a bien participé aux activités.",
};

const DEMO_MESSAGES = [
  { id:1, sujet:"Compte-rendu sortie parc", expediteur:"Marie Dupont", lu:false },
  { id:2, sujet:"Fermeture exceptionnelle", expediteur:"Administration", lu:false },
];

const DEMO_FACTURE = { montant_du:"245,00 €", mois:"Avril", annee:2025, statut:"impayé" };

const DEMO_EVENTS = [
  { id:1, titre:"Sortie au parc municipal", date_debut:"2025-04-25", places_restantes:7 },
  { id:2, titre:"Spectacle de marionnettes", date_debut:"2025-05-02", places_restantes:12 },
];

const HUMEUR_ICONS = ["","😢","😐","🙂","😄","🤩"];

const calcAge = (dob) => {
  if (!dob) return "";
  const m = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*30.44));
  return m >= 24 ? `${Math.floor(m/12)} ans` : `${m} mois`;
};

export default function DashParent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [enfant,   setEnfant]   = useState(null);
  const [suivi,    setSuivi]    = useState(null);
  const [messages, setMessages] = useState([]);
  const [facture,  setFacture]  = useState(null);
  const [events,   setEvents]   = useState([]);

  useEffect(() => {
    api.get("/parent/enfant")
      .then(r => setEnfant(r.data?.data || DEMO_ENFANT))
      .catch(() => setEnfant(DEMO_ENFANT));
    api.get("/parent/suivi-today")
      .then(r => setSuivi(r.data?.data || DEMO_SUIVI))
      .catch(() => setSuivi(DEMO_SUIVI));
    api.get("/messages?lu=false")
      .then(r => setMessages(r.data?.data?.slice(0,3) || DEMO_MESSAGES))
      .catch(() => setMessages(DEMO_MESSAGES));
    api.get("/parent/facture-pending")
      .then(r => setFacture(r.data?.data || DEMO_FACTURE))
      .catch(() => setFacture(DEMO_FACTURE));
    api.get("/evenements")
      .then(r => setEvents(r.data?.data?.slice(0,2) || DEMO_EVENTS))
      .catch(() => setEvents(DEMO_EVENTS));
  }, []);

  const e = enfant || DEMO_ENFANT;
  const s = suivi  || DEMO_SUIVI;
  const f = facture || DEMO_FACTURE;

  const presColor = {
    present: [T.tealLight,   T.tealDark,  "Présent" ],
    absent:  [T.dangerLight, T.danger,    "Absent"  ],
    retard:  [T.amberLight,  T.amber,     "Retard"  ],
  }[e.statut_presence] || [T.bg, T.text2, "—"];

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday:"long", day:"numeric", month:"long"
  });

  return (
    <Shell role="parent" title="Tableau de bord">
      <style>{`
        .parent-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .parent-right { display:flex; flex-direction:column; gap:14px; }
        @media(max-width:800px){ .parent-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Bannière enfant */}
      <div style={{
        background:`linear-gradient(135deg, ${T.coral}, ${T.coralDark})`,
        borderRadius:18, padding:"20px 24px", marginBottom:22, color:"#fff",
        display:"flex", gap:20, alignItems:"center", flexWrap:"wrap",
      }}>
        <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Baby size={36} color="#fff" strokeWidth={1.5}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, opacity:.8 }}>Bonjour {user.prenom} 👋 · {today}</div>
          <div style={{ fontSize:22, fontWeight:800, fontFamily:"Nunito,sans-serif", marginTop:2 }}>
            {e.prenom} {e.nom}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
            <span style={{ background:"rgba(255,255,255,0.2)", padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
              {e.groupe?.nom} · {calcAge(e.date_naissance)}
            </span>
            <span style={{ background:presColor[0], color:presColor[1], padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
              {presColor[2]}
            </span>
            {e.allergie && (
              <span style={{ background:"rgba(226,75,74,0.25)", color:"#fff", padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
                <AlertTriangle size={11}/> {e.allergie}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => navigate("/parent/mon-enfant")} style={{
          background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.35)",
          borderRadius:12, padding:"10px 16px", color:"#fff",
          fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13,
          cursor:"pointer", display:"flex", alignItems:"center", gap:6,
        }}>
          <Baby size={14}/> Voir la fiche
        </button>
      </div>

      <div className="parent-grid">

        {/* Journal du jour */}
        <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>Journal d'aujourd'hui</div>
            <button onClick={() => navigate("/parent/journal")} style={{ background:T.coralLight, color:T.coral, border:"none", borderRadius:8, padding:"5px 10px", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              Historique <ChevronRight size={12}/>
            </button>
          </div>
          {[[Utensils,"Repas",s.repas],[Moon,"Sieste",s.sieste_debut&&s.sieste_fin?`${s.sieste_debut} → ${s.sieste_fin}`:"Non renseigné"],[Smile,"Humeur",`${HUMEUR_ICONS[s.humeur]||"🙂"} ${["","Triste","Neutre","Bien","Super","Excellent"][s.humeur]||"Non renseigné"}`],[FileText,"Note éducateur",s.note||"Aucune note"]].map(([Icon, label, val]) => (
            <div key={label} style={{ display:"flex", gap:14, padding:"12px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:T.coralLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={15} color={T.coral}/>
              </div>
              <div>
                <div style={{ fontSize:11, color:T.text2, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</div>
                <div style={{ fontSize:13, color:T.text1, fontWeight:600, marginTop:2, lineHeight:1.5 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Colonne droite */}
        <div className="parent-right">

          {/* Facture */}
          {f && (
            <div style={{ background:T.dangerLight, borderRadius:14, border:`1px solid ${T.danger}25`, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <CreditCard size={15} color={T.danger}/>
                <span style={{ fontSize:13, fontWeight:800, color:T.danger }}>Facture en attente</span>
              </div>
              <div style={{ fontSize:28, fontWeight:900, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
                {f.montant_du}
              </div>
              <div style={{ fontSize:12, color:T.text2, marginBottom:12 }}>
                {f.mois} {f.annee}
              </div>
              <button style={{ width:"100%", padding:"10px", background:T.coral, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                Télécharger la facture PDF
              </button>
            </div>
          )}

          {/* Messages */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <MessageSquare size={14} color={T.coral}/> Messages
              </div>
              {messages.filter(m => !m.lu).length > 0 && (
                <span style={{ background:T.dangerLight, color:T.danger, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                  {messages.filter(m => !m.lu).length} non lu{messages.filter(m => !m.lu).length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {messages.map(msg => (
              <div key={msg.id} onClick={() => navigate("/parent/messagerie")}
                style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border}`, cursor:"pointer", borderLeft:`3px solid ${!msg.lu ? T.coral : "transparent"}`, background:!msg.lu?`${T.coralLight}40`:"transparent" }}>
                <div style={{ fontSize:13, fontWeight:!msg.lu?800:600, fontFamily:"Nunito,sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {msg.sujet}
                </div>
                <div style={{ fontSize:11, color:T.text2, marginTop:2 }}>{msg.expediteur}</div>
              </div>
            ))}
            <div onClick={() => navigate("/parent/messagerie")} style={{ padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, color:T.coral, fontSize:13, fontWeight:700 }}>
              Voir tous les messages <ChevronRight size={13}/>
            </div>
          </div>

          {/* Événements */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <Calendar size={14} color={T.purple}/> Événements à venir
              </div>
            </div>
            {events.map(ev => (
              <div key={ev.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontSize:13, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>{ev.titre}</div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:12, color:T.text2 }}>
                    {new Date(ev.date_debut).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
                  </span>
                  <span style={{ fontSize:11, background:T.purpleLight, color:T.purpleDark, padding:"2px 8px", borderRadius:20, fontWeight:700 }}>
                    {ev.places_restantes} places
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Shell>
  );
}