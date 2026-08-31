const ITEMS = [
  "Structured tasks",
  "Offer letter",
  "Certificate",
  "Portfolio work",
  "Mentor support",
] as const;

export function TrustBar() {
  return (
    <div className="trust-bar" aria-label="Platform highlights">
      <ul className="trust-bar-list">
        {ITEMS.map((item) => (
          <li key={item} className="trust-bar-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
