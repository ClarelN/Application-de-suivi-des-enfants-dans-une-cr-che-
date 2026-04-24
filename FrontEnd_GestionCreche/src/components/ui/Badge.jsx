import { T } from "../../constants/theme";

const map = {
  teal:   [T.tealLight,   T.tealDark],
  coral:  [T.coralLight,  T.coralDark],
  purple: [T.purpleLight, T.purpleDark],
  amber:  [T.amberLight,  T.amber],
  danger: [T.dangerLight, T.danger],
  gray:   ["#F1EFE8",     T.text2],
};

export default function Badge({ children, color = "teal", dot }) {
  const [bg, col] = map[color] || map.teal;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, fontFamily: "Nunito,sans-serif",
      background: bg, color: col,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: col }}/>}
      {children}
    </span>
  );
}