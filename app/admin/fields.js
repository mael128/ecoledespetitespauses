"use client";

export function Field({ label, value, onChange, textarea, mono }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      {textarea ? (
        <textarea
          className="admin-field__input admin-field__input--textarea"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={mono ? { fontFamily: "var(--font-mono)" } : undefined}
        />
      ) : (
        <input
          className="admin-field__input"
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <label className="admin-field admin-field--color">
      <span className="admin-field__label">{label}</span>
      <div className="admin-color-row">
        <input type="color" value={value ?? "#000000"} onChange={(e) => onChange(e.target.value)} />
        <input
          className="admin-field__input"
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

export function StringListEditor({ label, items, onChange }) {
  const list = items || [];
  return (
    <div className="admin-field">
      <span className="admin-field__label">{label}</span>
      <div className="admin-list">
        {list.map((item, i) => (
          <div className="admin-list__row" key={i}>
            <textarea
              className="admin-field__input admin-field__input--textarea"
              value={item}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
            >
              Supprimer
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...list, ""])}>
          + Ajouter
        </button>
      </div>
    </div>
  );
}
