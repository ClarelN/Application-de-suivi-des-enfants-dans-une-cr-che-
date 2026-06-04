import { useState, useEffect, useRef, useCallback } from "react";
import Shell from "../../components/layout/Shell";
import {
  Search, Plus, Send, X, Paperclip, Download,
  FileText, ArrowLeft, Image, Film, MessageSquare,
} from "lucide-react";
import { T } from "../../constants/theme";
import api from "../../services/api";
import toast from "react-hot-toast";

// ── Helpers ──────────────────────────────────────────────────────────────────

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
};

const getShellRole = (role) => {
  if (role === "administrateur") return "admin";
  if (role === "educateur")      return "edu";
  return "parent";
};

const nomContact = (u) =>
  u ? `${u.prenom || ""} ${u.nom || ""}`.trim() || "?" : "?";

const iniContact = (u) =>
  nomContact(u).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

const fmtDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now  = new Date();
  const diff = Math.floor((now - date) / 86400000);
  if (diff === 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (diff === 1) return "Hier";
  if (diff < 7)  return date.toLocaleDateString("fr-FR", { weekday: "short" });
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};

const fmtHeure = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const fmtTaille = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024)        return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const ROLE_LABEL = {
  educateur:      "Éducateur",
  administrateur: "Administrateur",
  parent:         "Parent",
};

const AV_BG  = [T.tealLight,  T.coralLight,  T.purpleLight, T.amberLight];
const AV_COL = [T.tealDark,   T.coralDark,   T.purpleDark,  T.amber];
const avBg  = (id) => AV_BG[(id  || 0) % 4];
const avCol = (id) => AV_COL[(id || 0) % 4];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Messagerie() {
  const me     = getStoredUser();
  const myId   = me.id;
  const role   = getShellRole(me.role);

  // ── State ──
  const [convs,       setConvs]       = useState([]);   // liste conversations
  const [contacts,    setContacts]    = useState([]);   // contacts dispo
  const [selected,    setSelected]    = useState(null); // contact actif
  const [messages,    setMessages]    = useState([]);   // messages de la conv
  const [text,        setText]        = useState("");
  const [file,        setFile]        = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [sending,     setSending]     = useState(false);
  const [loadingConv, setLoadingConv] = useState(false);
  const [search,      setSearch]      = useState("");
  const [showPicker,  setShowPicker]  = useState(false);
  const [mobileConv,  setMobileConv]  = useState(false); // mobile: vue conversation
  const [lightbox,    setLightbox]    = useState(null);  // URL image plein écran

  const bottomRef   = useRef(null);
  const fileRef     = useRef(null);
  const textareaRef = useRef(null);

  // ── Chargement initial ──
  useEffect(() => {
    api.get("/messages").then(r => setConvs(r.data?.data || [])).catch(() => {});
    api.get("/messages/contacts").then(r => setContacts(r.data?.data || [])).catch(() => {});
  }, []);

  // ── Charger conversation quand on change de contact ──
  useEffect(() => {
    if (!selected) return;
    setLoadingConv(true);
    setMessages([]);
    api.get(`/messages/conversation/${selected.id}`)
      .then(r => {
        setMessages(r.data?.data || []);
        api.get("/messages").then(r2 => setConvs(r2.data?.data || [])).catch(() => {});
      })
      .catch(() => toast.error("Impossible de charger la conversation"))
      .finally(() => setLoadingConv(false));
  }, [selected?.id]);

  // ── Scroll vers le bas à chaque nouveau message ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Sélectionner un contact ──
  const selectContact = (contact) => {
    setSelected(contact);
    setShowPicker(false);
    setMobileConv(true);
    setText("");
    clearFile();
  };

  // ── Gestion fichier ──
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 50 Mo)");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/") || f.type.startsWith("video/")) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = useCallback(() => {
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [filePreview]);

  // ── Envoi ──
  const handleSend = async () => {
    if (!selected || (!text.trim() && !file) || sending) return;
    setSending(true);
    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append("destinataire_id", selected.id);
        if (text.trim()) fd.append("corps", text.trim());
        fd.append("fichier", file);
        res = await api.post("/messages", fd);
      } else {
        res = await api.post("/messages", {
          destinataire_id: selected.id,
          corps: text.trim(),
        });
      }
      const newMsg = res.data?.data || res.data;
      setMessages(prev => [...prev, newMsg]);
      setText("");
      clearFile();
      api.get("/messages").then(r => setConvs(r.data?.data || [])).catch(() => {});
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filtres ──
  const filteredConvs = convs.filter(c =>
    nomContact(c.contact).toLowerCase().includes(search.toLowerCase())
  );

  // Contacts sans conversation existante (pour le picker "Nouveau")
  const newContacts = contacts.filter(c =>
    !convs.find(cv => cv.contact?.id === c.id) &&
    nomContact(c).toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = convs.reduce((a, c) => a + (c.non_lus || 0), 0);

  // ── Rendu d'un message ──
  const renderMessage = (msg, i) => {
    const isMine = msg.expediteur_id === myId || msg.expediteur?.id === myId;
    const time   = msg.envoye_le || msg.created_at;

    return (
      <div key={msg.id || i} style={{
        display: "flex",
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 10,
      }}>

        {/* Avatar */}
        {!isMine && (
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: avBg(selected?.id), color: avCol(selected?.id),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 10, fontFamily: "Nunito,sans-serif",
          }}>
            {iniContact(selected)}
          </div>
        )}

        {/* Bulle */}
        <div style={{
          maxWidth: "68%",
          background: isMine ? T.teal : T.surface,
          color: isMine ? "#fff" : T.text1,
          borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          padding: msg.fichier_type ? "10px 12px" : "9px 14px",
          border: isMine ? "none" : `1px solid ${T.border}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}>

          {/* IMAGE */}
          {msg.fichier_type === "image" && msg.fichier_url && (
            <img
              src={msg.fichier_url}
              alt={msg.fichier_nom || "image"}
              onClick={() => setLightbox(msg.fichier_url)}
              style={{
                maxWidth: "100%", maxHeight: 260, borderRadius: 10,
                display: "block", cursor: "zoom-in",
                marginBottom: msg.corps ? 8 : 0,
              }}
            />
          )}

          {/* VIDÉO */}
          {msg.fichier_type === "video" && msg.fichier_url && (
            <video
              controls
              style={{
                maxWidth: "100%", maxHeight: 260, borderRadius: 10,
                display: "block", marginBottom: msg.corps ? 8 : 0,
              }}
            >
              <source src={msg.fichier_url} />
            </video>
          )}

          {/* FICHIER */}
          {msg.fichier_type === "file" && msg.fichier_url && (
            <a
              href={msg.fichier_url}
              download={msg.fichier_nom}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 10,
                background: isMine ? "rgba(255,255,255,0.15)" : T.bg,
                textDecoration: "none",
                color: isMine ? "#fff" : T.text1,
                marginBottom: msg.corps ? 8 : 0,
              }}
            >
              <FileText size={22} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.fichier_nom}
                </div>
                <div style={{ fontSize: 10, opacity: 0.65 }}>
                  {fmtTaille(msg.fichier_taille)}
                </div>
              </div>
              <Download size={14} style={{ flexShrink: 0 }} />
            </a>
          )}

          {/* TEXTE */}
          {msg.corps && (
            <div style={{ fontSize: 14, lineHeight: 1.55, wordBreak: "break-word" }}>
              {msg.corps}
            </div>
          )}

          {/* Heure */}
          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 5, textAlign: "right" }}>
            {fmtHeure(time)}
          </div>
        </div>
      </div>
    );
  };

  // ── Rendu ──
  return (
    <Shell role={role} title="Messagerie">
      <style>{`
        .msg-root {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: calc(100vh - 140px);
          min-height: 540px;
          background: ${T.surface};
          border-radius: 16px;
          border: 1px solid ${T.border};
          overflow: hidden;
        }
        .msg-left  { border-right: 1px solid ${T.border}; display:flex; flex-direction:column; overflow:hidden; }
        .msg-right { display:flex; flex-direction:column; overflow:hidden; }

        @media (max-width: 740px) {
          .msg-root { grid-template-columns: 1fr; }
          .msg-left.mobile-hide  { display: none; }
          .msg-right.mobile-hide { display: none; }
        }
      `}</style>

      <div className="msg-root">

        {/* ══ PANNEAU GAUCHE : conversations ══ */}
        <div className={`msg-left${mobileConv ? " mobile-hide" : ""}`}>

          {/* En-tête */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 15, flex: 1 }}>
                Messages
                {totalUnread > 0 && (
                  <span style={{ background: T.danger, color: "#fff", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginLeft: 6 }}>
                    {totalUnread}
                  </span>
                )}
              </span>
              <button
                onClick={() => setShowPicker(s => !s)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 12px",
                  background: showPicker ? T.teal : T.tealLight,
                  color: showPicker ? "#fff" : T.teal,
                  border: "none", borderRadius: 9,
                  fontFamily: "Nunito,sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >
                <Plus size={13} /> Nouveau
              </button>
            </div>

            {/* Recherche */}
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.text3 }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                style={{ width: "100%", padding: "8px 10px 8px 30px", borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: "Nunito Sans,sans-serif", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>

            {/* ── Picker "Nouveau" ── */}
            {showPicker && (
              <div style={{ borderBottom: `2px solid ${T.teal}30` }}>
                <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Choisir un contact
                </div>
                {[...contacts].sort((a, b) => nomContact(a).localeCompare(nomContact(b))).map(c => (
                  <div
                    key={c.id} onClick={() => selectContact(c)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", cursor: "pointer",
                      background: selected?.id === c.id ? T.tealLight : "transparent",
                      borderBottom: `1px solid ${T.border}`,
                      transition: "background .1s",
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: avBg(c.id), color: avCol(c.id), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, fontFamily: "Nunito,sans-serif", flexShrink: 0 }}>
                      {iniContact(c)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{nomContact(c)}</div>
                      <div style={{ fontSize: 11, color: T.text2 }}>{ROLE_LABEL[c.role] || c.role}</div>
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div style={{ padding: 20, textAlign: "center", color: T.text3, fontSize: 13 }}>Aucun contact disponible</div>
                )}
              </div>
            )}

            {/* ── Liste conversations ── */}
            {filteredConvs.length === 0 && !showPicker && (
              <div style={{ padding: 32, textAlign: "center", color: T.text2, fontSize: 13 }}>
                Aucune conversation — cliquez sur <strong>Nouveau</strong>
              </div>
            )}

            {filteredConvs.map(conv => {
              const contact  = conv.contact;
              const dm       = conv.dernier_message;
              const unread   = conv.non_lus || 0;
              const isSel    = selected?.id === contact?.id;
              const preview  = dm?.fichier_type
                ? (dm.fichier_type === "image" ? "[Image]" : dm.fichier_type === "video" ? "[Vidéo]" : `[Fichier] ${dm.fichier_nom || ""}`)
                : (dm?.corps || "");

              return (
                <div
                  key={contact?.id}
                  onClick={() => selectContact(contact)}
                  style={{
                    padding: "12px 14px", cursor: "pointer",
                    borderBottom: `1px solid ${T.border}`,
                    borderLeft: `3px solid ${unread > 0 ? T.teal : "transparent"}`,
                    background: isSel ? T.tealLight : "transparent",
                    transition: "background .12s",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {/* Avatar + badge */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: avBg(contact?.id), color: avCol(contact?.id), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "Nunito,sans-serif" }}>
                        {iniContact(contact)}
                      </div>
                      {unread > 0 && (
                        <div style={{ position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, background: T.danger, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: `2px solid ${T.surface}` }}>
                          {unread}
                        </div>
                      )}
                    </div>
                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: unread > 0 ? 800 : 600, fontFamily: "Nunito,sans-serif" }}>
                          {nomContact(contact)}
                        </span>
                        <span style={{ fontSize: 10, color: T.text3, flexShrink: 0, marginLeft: 6 }}>
                          {fmtDate(dm?.envoye_le || dm?.created_at)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: unread > 0 ? T.text1 : T.text2, fontWeight: unread > 0 ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {preview || <span style={{ color: T.text3, fontStyle: "italic" }}>Pas encore de message</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ PANNEAU DROIT : conversation ══ */}
        <div className={`msg-right${!mobileConv ? " mobile-hide" : ""}`}>

          {!selected ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: T.text2 }}>
              <MessageSquare size={56} color={T.text3}/>
              <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 16 }}>
                Sélectionnez une conversation
              </div>
              <div style={{ fontSize: 13, color: T.text3 }}>
                ou cliquez sur <strong>Nouveau</strong> pour démarrer
              </div>
            </div>
          ) : (
            <>
              {/* En-tête conversation */}
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  onClick={() => setMobileConv(false)}
                  style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 9px", cursor: "pointer", fontSize: 18, color: T.text2, display: "flex", alignItems: "center" }}
                >
                  ‹
                </button>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: avBg(selected.id), color: avCol(selected.id), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "Nunito,sans-serif", flexShrink: 0 }}>
                  {iniContact(selected)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "Nunito,sans-serif" }}>{nomContact(selected)}</div>
                  <div style={{ fontSize: 11, color: T.text2 }}>{ROLE_LABEL[selected.role] || selected.role}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column" }}>
                {loadingConv && (
                  <div style={{ textAlign: "center", padding: 24, color: T.text3, fontSize: 13 }}>Chargement…</div>
                )}
                {!loadingConv && messages.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: T.text3 }}>
                    <MessageSquare size={40} color={T.text3}/>
                    <div style={{ fontSize: 13 }}>Démarrez la conversation avec {nomContact(selected)}</div>
                  </div>
                )}
                {messages.map(renderMessage)}
                <div ref={bottomRef} />
              </div>

              {/* Aperçu fichier sélectionné */}
              {file && (
                <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.border}`, background: T.bg, display: "flex", alignItems: "center", gap: 10 }}>
                  {file.type.startsWith("image/") && filePreview && (
                    <img src={filePreview} alt="" style={{ height: 54, width: 54, objectFit: "cover", borderRadius: 8 }} />
                  )}
                  {file.type.startsWith("video/") && filePreview && (
                    <video src={filePreview} style={{ height: 54, borderRadius: 8 }} muted />
                  )}
                  {!file.type.startsWith("image/") && !file.type.startsWith("video/") && (
                    <div style={{ width: 54, height: 54, borderRadius: 8, background: T.tealLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={26} color={T.teal} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: T.text2 }}>{fmtTaille(file.size)}</div>
                  </div>
                  <button onClick={clearFile} style={{ background: T.dangerLight, border: "none", borderRadius: 7, padding: 5, cursor: "pointer", display: "flex" }}>
                    <X size={16} color={T.danger} />
                  </button>
                </div>
              )}

              {/* Zone de saisie */}
              <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "flex-end" }}>
                {/* Input fichier caché */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {/* Bouton pièce jointe */}
                <button
                  onClick={() => fileRef.current?.click()}
                  title="Joindre un fichier"
                  style={{
                    padding: "10px", flexShrink: 0,
                    background: T.bg, border: `1.5px solid ${T.border}`,
                    borderRadius: 10, cursor: "pointer",
                    display: "flex", alignItems: "center", color: T.text2,
                  }}
                >
                  <Paperclip size={18} />
                </button>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={file ? "Ajouter un commentaire…" : "Écrire un message…"}
                  rows={1}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10,
                    border: `1.5px solid ${T.border}`,
                    fontSize: 14, fontFamily: "Nunito Sans,sans-serif",
                    resize: "none", boxSizing: "border-box",
                    maxHeight: 110, overflowY: "auto",
                  }}
                />

                {/* Bouton envoyer */}
                <button
                  onClick={handleSend}
                  disabled={(!text.trim() && !file) || sending}
                  style={{
                    padding: "10px 16px", flexShrink: 0,
                    background: T.teal, color: "#fff",
                    border: "none", borderRadius: 10, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "Nunito,sans-serif", fontWeight: 700, fontSize: 13,
                    opacity: (!text.trim() && !file) || sending ? 0.5 : 1,
                    transition: "opacity .15s",
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Lightbox image plein écran ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={lightbox}
            alt=""
            style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 12, objectFit: "contain" }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </Shell>
  );
}
