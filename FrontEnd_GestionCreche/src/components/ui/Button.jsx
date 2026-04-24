const styles = {
  teal:    { bg:"#1D9E75", col:"#fff",     border:"none" },
  coral:   { bg:"#D85A30", col:"#fff",     border:"none" },
  purple:  { bg:"#534AB7", col:"#fff",     border:"none" },
  outline: { bg:"transparent", col:"#1A1A1A", border:"1.5px solid #E0DED6" },
  danger:  { bg:"#FCEBEB", col:"#E24B4A",  border:"1.5px solid #E24B4A" },
};

export default function Button({ children, variant="teal", sm, full, onClick, icon: Icon, type="button" }) {
  const s = styles[variant] || styles.teal;
  return (
    <button type={type} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 6, padding: sm ? "7px 12px" : "10px 18px",
      borderRadius: 10, fontSize: sm ? 12 : 14,
      fontFamily: "Nunito,sans-serif", fontWeight: 700,
      background: s.bg, color: s.col, border: s.border,
      cursor: "pointer", width: full ? "100%" : "auto",
      transition: "opacity 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {Icon && <Icon size={sm ? 13 : 15} strokeWidth={2.5}/>}
      {children}
    </button>
  );
}