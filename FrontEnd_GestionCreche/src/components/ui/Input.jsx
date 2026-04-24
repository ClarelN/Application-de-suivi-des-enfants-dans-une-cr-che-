import { T } from "../../constants/theme";

export default function Input({ label, placeholder, type="text", value, onChange, error, name }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 700, color: T.text2,
          display: "block", marginBottom: 5,
          textTransform: "uppercase", letterSpacing: "0.07em"
        }}>
          {label}
        </label>
      )}
      <input
        type={type} name={name}
        defaultValue={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          width: "100%", padding: "10px 12px",
          borderRadius: 10,
          border: `1.5px solid ${error ? T.danger : T.border}`,
          fontSize: 14, fontFamily: "Nunito Sans,sans-serif",
          color: T.text1, background: T.surface,
          outline: "none", boxSizing: "border-box",
          boxShadow: error ? `0 0 0 3px rgba(226,75,74,.1)` : "none",
        }}
      />
      {error && (
        <div style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}