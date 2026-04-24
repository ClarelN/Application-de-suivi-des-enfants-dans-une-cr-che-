import { T } from "../../constants/theme";

export default function Card({ children, style }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 18,
      ...style,
    }}>
      {children}
    </div>
  );
}