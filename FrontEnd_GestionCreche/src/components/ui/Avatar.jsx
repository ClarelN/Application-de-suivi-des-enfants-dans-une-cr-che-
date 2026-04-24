import { T } from "../../constants/theme";

const colors = {
  teal:   { bg: T.tealLight,   col: T.tealDark },
  coral:  { bg: T.coralLight,  col: T.coralDark },
  purple: { bg: T.purpleLight, col: T.purpleDark },
  amber:  { bg: T.amberLight,  col: T.amber },
};

export default function Avatar({ initials, color="teal", size=40 }) {
  const c = colors[color] || colors.teal;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: c.bg, color: c.col,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.33,
      fontFamily: "Nunito,sans-serif", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}