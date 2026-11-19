export function LogoSymbol() {
  return (
    <svg className="logo-symbol" viewBox="0 0 40 40" fill="none" aria-label="Símbolo GAMBO">
      <path d="M6 23V19C6 10.7 12.3 5 20 5s14 5.7 14 14v4" stroke="currentColor" strokeWidth="3" />
      <path
        d="M6 23h10l4 5 4-5h10M11 29c2 4 5.1 6 9 6s7-2 9-6"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M16 23h8" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
export function Logo() {
  return (
    <div className="logo">
      <LogoSymbol />
      <span className="logo-word">
        GAMBO<span className="text-primary">.</span>
      </span>
    </div>
  );
}
