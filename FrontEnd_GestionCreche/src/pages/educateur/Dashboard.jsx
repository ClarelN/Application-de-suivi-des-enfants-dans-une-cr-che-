import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import {
  Baby, CheckSquare, BookOpen, AlertTriangle,
  MessageSquare, Clock, TrendingUp, ChevronRight
} from "lucide-react";
import { T } from "../../constants/theme";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function DashEdu() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats]       = useState({ presents:0, absents:0, retards:0, suivis:0 });
  const [enfants, setEnfants]   = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      api.get("/enfants").catch(() => ({ data: { data: [] } })),
      api.get(`/attendances?date=${today}`).catch(() => ({ data: { data: [] } })),
      api.get("/incidents?traite=false").catch(() => ({ data: { data: [] } })),
      api.get("/messages?lu=false").catch(() => ({ data: { data: [] } })),
    ]).then(([enfantsRes, attendRes, incRes, msgRes]) => {
      const att = attendRes.data?.data || [];
      setEnfants(enfantsRes.data?.data || []);
      setStats({
        presents: att.filter(a => a.statut === "present").length,
        absents:  att.filter(a => a.statut === "absent").length,
        retards:  att.filter(a => a.statut === "retard").length,
        suivis:   (enfantsRes.data?.data?.length || 0) - att.length,
      });
      setIncidents(incRes.data?.data?.slice(0, 3) || []);
      setMessages(msgRes.data?.data?.slice(0, 3) || []);
    }).finally(() => setLoading(false));
  }, []);

  // ── Données de démo si API vide ──
  const demoEnfants = [
    { id:1, nom:"Martin",  prenom:"Lucas", statut_presence:"present" },
    { id:2, nom:"Dupont",  prenom:"Emma",  statut_presence:"absent"  },
    { id:3, nom:"Bernard", prenom:"Noah",  statut_presence:"retard"  },
    { id:4, nom:"Rousseau",prenom:"Léa",   statut_presence:"present" },
    { id:5, nom:"Petit",   prenom:"Tom",   statut_presence:"present" },
  ];
  const demoStats = { presents:12, absents:2, retards:1, suivis:5 };
  const demoIncidents = [
    { id:1, type:"Réaction allergique", enfant_nom:"Emma D.",   gravite:"élevée"  },
    { id:2, type:"Chute légère",         enfant_nom:"Noah B.",   gravite:"faible"  },
    { id:3, type:"Conflit",              enfant_nom:"Lucas M.",  gravite:"moyenne" },
  ];
  const demoMessages = [
    { id:1, sujet:"Compte-rendu sortie parc", expediteur:"Sophie Martin" },
    { id:2, sujet:"Réunion équipe jeudi",      expediteur:"Direction"     },
    { id:3, sujet:"Absence de Lucas demain",   expediteur:"Jean Martin"   },
  ];

  const displayStats    = stats.presents > 0 ? stats : demoStats;
  const displayEnfants  = enfants.length > 0  ? enfants.slice(0,5) : demoEnfants;
  const displayIncidents= incidents.length > 0 ? incidents : demoIncidents;
  const displayMessages = messages.length > 0  ? messages : demoMessages;

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday:"long", day:"numeric", month:"long", year:"numeric"
  });

  const statCards = [
    { label:"Présents",      value:displayStats.presents, Icon:CheckSquare, color:T.teal,   bg:T.tealLight },
    { label:"Absents",       value:displayStats.absents,  Icon:Clock,       color:T.danger, bg:T.dangerLight },
    { label:"Retards",       value:displayStats.retards,  Icon:TrendingUp,  color:T.amber,  bg:T.amberLight },
    { label:"Suivis à faire",value:displayStats.suivis,   Icon:BookOpen,    color:T.purple, bg:T.purpleLight },
  ];

  const graviteColor = (g) => {
    if (!g) return "amber";
    if (g === "élevée" || g === "high")   return "danger";
    if (g === "faible" || g === "low")    return "teal";
    return "amber";
  };

  return (
    <Shell role="edu" title="Tableau de bord">
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
        .dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .dash-right-col { display: flex; flex-direction: column; gap: 16px; }
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr 1fr; }
          .dash-bottom { grid-template-columns: 1fr; }
        }
        @media (max-width: 500px) {
          .dash-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      {/* ── Bannière bienvenue ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`,
        borderRadius: 18, padding: "20px 24px",
        marginBottom: 22, color: "#fff",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: .75, marginBottom: 2 }}>{today}</div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Nunito,sans-serif" }}>
            Bonjour {user.prenom} 👋
          </div>
          <div style={{ fontSize: 13, opacity: .75, marginTop: 4 }}>
            Groupe Les Poussins
          </div>
        </div>
        <button onClick={() => navigate("/edu/presences")} style={{
          background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)",
          borderRadius: 12, padding: "10px 18px",
          color: "#fff", fontFamily: "Nunito,sans-serif", fontWeight: 700,
          fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          <CheckSquare size={15}/>
          Pointer les présences
        </button>
      </div>

      {/* ── Cartes stats ── */}
      <div className="dash-grid">
        {statCards.map(({ label, value, Icon, color, bg }) => (
          <div key={label} style={{
            background: T.surface, borderRadius: 14,
            padding: "16px", border: `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: bg, display: "flex", alignItems: "center",
              justifyContent: "center", marginBottom: 10,
            }}>
              <Icon size={18} color={color}/>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "Nunito,sans-serif" }}>
              {loading ? "—" : value}
            </div>
            <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Bas du dashboard ── */}
      <div className="dash-bottom">

        {/* Liste enfants du jour */}
        <div style={{
          background: T.surface, borderRadius: 14,
          border: `1px solid ${T.border}`, overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "Nunito,sans-serif" }}>
              Mes enfants aujourd'hui
            </div>
            <button onClick={() => navigate("/edu/enfants")} style={{
              background: T.tealLight, border: "none", borderRadius: 8,
              padding: "5px 10px", color: T.teal, fontWeight: 700,
              fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              Voir tout <ChevronRight size={12}/>
            </button>
          </div>

          {displayEnfants.map((e, idx) => {
            const s = e.statut_presence || "present";
            const ini = `${(e.prenom||"?")[0]}${(e.nom||"?")[0]}`;
            const bgAv = s==="present" ? T.tealLight : s==="retard" ? T.amberLight : T.dangerLight;
            const colAv = s==="present" ? T.tealDark : s==="retard" ? T.amber : T.danger;
            const badgeBg = s==="present" ? T.tealLight : s==="retard" ? T.amberLight : T.dangerLight;
            const badgeCol = s==="present" ? T.tealDark : s==="retard" ? T.amber : T.danger;

            return (
              <div key={e.id || idx} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px", borderBottom: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/edu/enfants/${e.id}`)}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: bgAv, color: colAv,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 12, fontFamily: "Nunito,sans-serif", flexShrink: 0,
                }}>
                  {ini}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 700, fontFamily: "Nunito,sans-serif" }}>
                  {e.prenom} {e.nom}
                </div>
                <span style={{
                  background: badgeBg, color: badgeCol,
                  padding: "3px 10px", borderRadius: 20,
                  fontSize: 11, fontWeight: 700, fontFamily: "Nunito,sans-serif",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:badgeCol }}/>
                  {s === "present" ? "Présent" : s === "retard" ? "Retard" : "Absent"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Colonne droite */}
        <div className="dash-right-col">

          {/* Incidents */}
          <div style={{
            background: T.surface, borderRadius: 14,
            border: `1px solid ${T.border}`, overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <AlertTriangle size={15} color={T.orange || T.amber}/>
                Incidents ouverts
              </div>
              <button onClick={() => navigate("/edu/incidents")} style={{
                background: T.dangerLight, border: "none", borderRadius: 8,
                padding: "5px 10px", color: T.danger, fontWeight: 700,
                fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              }}>
                Voir tout <ChevronRight size={12}/>
              </button>
            </div>
            {displayIncidents.map((inc, idx) => {
              const gc = graviteColor(inc.gravite);
              const gcMap = { danger:T.danger, teal:T.teal, amber:T.amber };
              const gbgMap = { danger:T.dangerLight, teal:T.tealLight, amber:T.amberLight };
              return (
                <div key={inc.id || idx} style={{
                  display: "flex", gap: 10, alignItems: "center",
                  padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: gbgMap[gc] || T.amberLight,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <AlertTriangle size={15} color={gcMap[gc] || T.amber}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Nunito,sans-serif" }}>
                      {inc.type || inc.description}
                    </div>
                    <div style={{ fontSize: 11, color: T.text2 }}>
                      {inc.enfant_nom || `${inc.enfant?.prenom || ""} ${inc.enfant?.nom || ""}`}
                    </div>
                  </div>
                  <span style={{
                    background: gbgMap[gc], color: gcMap[gc],
                    padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    fontFamily: "Nunito,sans-serif", textTransform: "capitalize",
                  }}>
                    {inc.gravite || "—"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Messages non lus */}
          <div style={{
            background: T.surface, borderRadius: 14,
            border: `1px solid ${T.border}`, overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "Nunito,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <MessageSquare size={15} color={T.teal}/>
                Messages non lus
              </div>
              <span style={{
                background: T.tealLight, color: T.tealDark,
                padding: "3px 10px", borderRadius: 20,
                fontSize: 11, fontWeight: 700, fontFamily: "Nunito,sans-serif",
              }}>
                {displayMessages.length}
              </span>
            </div>
            {displayMessages.map((msg, idx) => (
              <div key={msg.id || idx} onClick={() => navigate("/edu/messagerie")} style={{
                display: "flex", gap: 10, alignItems: "center",
                padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
                cursor: "pointer", borderLeft: `3px solid ${T.teal}`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: T.tealLight, color: T.tealDark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, fontFamily: "Nunito,sans-serif", flexShrink: 0,
                }}>
                  {(msg.expediteur || msg.expediteur_nom || "?").split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Nunito,sans-serif",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.sujet}
                  </div>
                  <div style={{ fontSize: 11, color: T.text2 }}>
                    {msg.expediteur || msg.expediteur_nom}
                  </div>
                </div>
                <ChevronRight size={14} color={T.text3}/>
              </div>
            ))}
          </div>

          {/* Raccourci suivi */}
          <div onClick={() => navigate("/edu/suivi")} style={{
            background: T.amberLight, borderRadius: 14,
            border: `1px solid ${T.amber}30`,
            padding: "14px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: T.amber + "25",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={20} color={T.amber}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.amber, fontFamily: "Nunito,sans-serif" }}>
                {displayStats.suivis} suivis en attente
              </div>
              <div style={{ fontSize: 12, color: T.text2 }}>Appuyer pour saisir maintenant</div>
            </div>
            <ChevronRight size={16} color={T.amber}/>
          </div>

        </div>
      </div>
    </Shell>
  );
}