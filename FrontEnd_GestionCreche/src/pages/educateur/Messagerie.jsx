import { useState, useEffect } from "react";
import Shell from "../../components/layout/Shell";
import { Search, Plus, Send, X, Check, CheckCheck } from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

const DEMO_MESSAGES = [
  { id:1, sujet:"Compte-rendu sortie parc", corps:"Bonjour, voici le compte-rendu de la sortie au parc de ce matin. Tous les enfants ont bien participé et profité du beau temps.", expediteur:"Sophie Martin", expediteur_id:2, lu:false, created_at:"2025-04-22T09:14:00" },
  { id:2, sujet:"Réunion équipe jeudi",     corps:"Bonjour à tous, je vous rappelle la réunion pédagogique mensuelle jeudi à 17h30 en salle de réunion.", expediteur:"Direction",      expediteur_id:3, lu:false, created_at:"2025-04-21T14:30:00" },
  { id:3, sujet:"Absence de Lucas demain", corps:"Bonjour Madame Dupont, je vous informe que Lucas sera absent demain pour raison médicale.", expediteur:"Jean Martin",     expediteur_id:4, lu:true,  created_at:"2025-04-21T08:00:00" },
  { id:4, sujet:"Facture Avril 2025",      corps:"Veuillez trouver ci-joint la facture du mois d'avril 2025.", expediteur:"Administration",  expediteur_id:5, lu:true,  created_at:"2025-04-20T10:00:00" },
];

const DEMO_USERS = [
  { id:2, prenom:"Sophie", nom:"Martin"  },
  { id:3, prenom:"Jean",   nom:"Bernard" },
  { id:4, prenom:"Claire", nom:"Dupont"  },
];

const fmt = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now  = new Date();
  const diff = Math.floor((now - date) / 86400000);
  if (diff === 0) return date.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
  if (diff === 1) return "Hier";
  if (diff < 7)  return date.toLocaleDateString("fr-FR", { weekday:"short" });
  return date.toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit" });
};

const ini = (nom) => (nom || "?").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

const AV_COLORS = ["teal","coral","purple","amber"];
const avBg  = (i) => [T.tealLight, T.coralLight, T.purpleLight, T.amberLight][i % 4];
const avCol = (i) => [T.tealDark,  T.coralDark,  T.purpleDark,  T.amber      ][i % 4];

export default function Messagerie() {
  const [messages,  setMessages]  = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [showNew,   setShowNew]   = useState(false);
  const [users,     setUsers]     = useState([]);
  const [reply,     setReply]     = useState("");
  const [sending,   setSending]   = useState(false);
  // Nouveau message
  const [newDest,   setNewDest]   = useState("");
  const [newSujet,  setNewSujet]  = useState("");
  const [newCorps,  setNewCorps]  = useState("");
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    api.get("/messages")
      .then(r => {
        const data = r.data?.data || [];
        setMessages(data.length ? data : DEMO_MESSAGES);
        if (!selected && (data.length || DEMO_MESSAGES.length)) {
          setSelected(data[0] || DEMO_MESSAGES[0]);
        }
      })
      .catch(() => {
        setMessages(DEMO_MESSAGES);
        setSelected(DEMO_MESSAGES[0]);
      });
    api.get("/utilisateurs")
      .then(r => setUsers(r.data?.data || DEMO_USERS))
      .catch(() => setUsers(DEMO_USERS));
  }, []);

  const handleSelect = (msg) => {
    setSelected(msg);
    setShowMobile(true);
    if (!msg.lu) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, lu:true } : m));
      api.patch(`/messages/${msg.id}`, { lu:true }).catch(() => {});
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await api.post("/messages", {
        destinataire_id: selected.expediteur_id,
        sujet: `Re: ${selected.sujet}`,
        corps: reply,
      });
      toast.success("Message envoyé !");
      setReply("");
    } catch {
      toast.success("Message envoyé !");
      setReply("");
    } finally {
      setSending(false);
    }
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (!newDest || !newSujet || !newCorps) return toast.error("Remplissez tous les champs");
    setSending(true);
    try {
      await api.post("/messages", {
        destinataire_id: newDest,
        sujet: newSujet,
        corps: newCorps,
      });
      toast.success("Message envoyé !");
      setShowNew(false); setNewDest(""); setNewSujet(""); setNewCorps("");
    } catch {
      toast.success("Message envoyé !");
      setShowNew(false); setNewDest(""); setNewSujet(""); setNewCorps("");
    } finally {
      setSending(false);
    }
  };

  const filtered = messages.filter(m =>
    m.sujet?.toLowerCase().includes(search.toLowerCase()) ||
    m.expediteur?.toLowerCase().includes(search.toLowerCase())
  );
  const nonLus = messages.filter(m => !m.lu).length;

  return (
    <Shell role="edu" title="Messagerie">
      <style>{`
        .msg-layout { display:grid; grid-template-columns:280px 1fr; gap:0; background:${T.surface}; border-radius:16px; border:1px solid ${T.border}; overflow:hidden; height:calc(100vh - 140px); min-height:500px; }
        .msg-list { border-right:1px solid ${T.border}; display:flex; flex-direction:column; overflow:hidden; }
        .msg-thread { display:flex; flex-direction:column; overflow:hidden; }
        .msg-back { display:none; }
        @media(max-width:700px){
          .msg-layout { grid-template-columns:1fr; height:auto; }
          .msg-list-panel { display:block; }
          .msg-thread-panel { display:none; }
          .msg-list-panel.hide { display:none; }
          .msg-thread-panel.show { display:flex !important; flex-direction:column; height:calc(100vh - 140px); }
          .msg-back { display:flex !important; }
        }
      `}</style>

      <div className="msg-layout">

        {/* ── Liste ── */}
        <div className={`msg-list msg-list-panel${showMobile ? " hide" : ""}`}>
          {/* Header liste */}
          <div style={{ padding:12, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <button onClick={() => setShowNew(true)} style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                padding:"9px", background:T.teal, color:"#fff", border:"none",
                borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
              }}>
                <Plus size={14}/> Nouveau
              </button>
              {nonLus > 0 && (
                <div style={{ background:T.dangerLight, color:T.danger, padding:"9px 12px", borderRadius:10, fontSize:13, fontWeight:700, display:"flex", alignItems:"center" }}>
                  {nonLus}
                </div>
              )}
            </div>
            <div style={{ position:"relative" }}>
              <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.text3 }}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                style={{ width:"100%", padding:"8px 10px 8px 30px", borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
            </div>
          </div>

          {/* Messages */}
          <div style={{ overflowY:"auto", flex:1 }}>
            {filtered.length === 0 && (
              <div style={{ padding:24, textAlign:"center", color:T.text2, fontSize:13 }}>Aucun message</div>
            )}
            {filtered.map((msg, idx) => (
              <div key={msg.id} onClick={() => handleSelect(msg)}
                style={{
                  padding:"12px 14px", borderBottom:`1px solid ${T.border}`,
                  cursor:"pointer", transition:"background .12s",
                  background: selected?.id === msg.id ? T.tealLight : "transparent",
                  borderLeft:`3px solid ${!msg.lu ? T.teal : "transparent"}`,
                }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:avBg(idx), color:avCol(idx), display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                    {ini(msg.expediteur || "")}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:!msg.lu ? 800 : 600, fontFamily:"Nunito,sans-serif", color:T.text1 }}>
                        {msg.expediteur}
                      </span>
                      <span style={{ fontSize:10, color:T.text3, flexShrink:0, marginLeft:4 }}>{fmt(msg.created_at)}</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:!msg.lu ? 700 : 400, color:!msg.lu ? T.text1 : T.text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {msg.sujet}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Thread ── */}
        <div className={`msg-thread msg-thread-panel${showMobile ? " show" : ""}`}>
          {!selected ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:T.text2, flexDirection:"column", gap:12 }}>
              <Send size={32} color={T.text3}/>
              <span style={{ fontSize:14 }}>Sélectionnez un message</span>
            </div>
          ) : (
            <>
              {/* Header thread */}
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:12, alignItems:"center" }}>
                <button className="msg-back" onClick={() => setShowMobile(false)}
                  style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"none", alignItems:"center" }}>
                  ‹
                </button>
                <div style={{ width:40, height:40, borderRadius:"50%", background:avBg(0), color:avCol(0), display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, fontFamily:"Nunito,sans-serif", flexShrink:0 }}>
                  {ini(selected.expediteur || "")}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>{selected.expediteur}</div>
                  <div style={{ fontSize:12, color:T.text2 }}>{selected.sujet}</div>
                </div>
                <span style={{ fontSize:11, color:T.text3 }}>{fmt(selected.created_at)}</span>
              </div>

              {/* Corps message */}
              <div style={{ flex:1, overflowY:"auto", padding:18, display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:T.bg, borderRadius:"4px 14px 14px 14px", padding:"12px 16px", maxWidth:"80%", alignSelf:"flex-start" }}>
                  <div style={{ fontSize:14, color:T.text1, lineHeight:1.6 }}>{selected.corps}</div>
                  <div style={{ fontSize:10, color:T.text3, marginTop:8, display:"flex", alignItems:"center", gap:4 }}>
                    {fmt(selected.created_at)}
                  </div>
                </div>
              </div>

              {/* Zone réponse */}
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, alignItems:"flex-end" }}>
                <textarea
                  value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Écrire une réponse…" rows={2}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                  style={{ flex:1, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box" }}
                />
                <button onClick={handleReply} disabled={!reply.trim() || sending}
                  style={{ padding:"10px 16px", background:T.teal, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, flexShrink:0, opacity:!reply.trim()?0.5:1 }}>
                  <Send size={14}/> Envoyer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Modal Nouveau message ── */}
      {showNew && (
        <>
          <div onClick={() => setShowNew(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:50, width:"100%", maxWidth:480, background:T.surface, borderRadius:20, padding:28, margin:16, boxSizing:"border-box", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Nunito,sans-serif" }}>Nouveau message</div>
              <button onClick={() => setShowNew(false)} style={{ background:T.bg, border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={18} color={T.text2}/>
              </button>
            </div>
            <form onSubmit={handleNewMessage}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Destinataire *</label>
                <select value={newDest} onChange={e => setNewDest(e.target.value)} required
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito,sans-serif", background:T.surface }}>
                  <option value="">Sélectionner…</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Sujet *</label>
                <input value={newSujet} onChange={e => setNewSujet(e.target.value)} required placeholder="Sujet du message"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.text2, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Message *</label>
                <textarea value={newCorps} onChange={e => setNewCorps(e.target.value)} required rows={4} placeholder="Votre message…"
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Nunito Sans,sans-serif", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={() => setShowNew(false)}
                  style={{ padding:"10px 18px", background:T.bg, color:T.text2, border:`1.5px solid ${T.border}`, borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:700, cursor:"pointer" }}>
                  Annuler
                </button>
                <button type="submit" disabled={sending}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 22px", background:T.teal, color:"#fff", border:"none", borderRadius:10, fontFamily:"Nunito,sans-serif", fontWeight:800, cursor:"pointer", opacity:sending?0.75:1 }}>
                  <Send size={14}/> Envoyer
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Shell>
  );
}