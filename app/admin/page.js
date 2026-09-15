"use client";

import { useEffect, useState } from "react";
import { Field, ColorField, StringListEditor } from "./fields";
import { setPath } from "../../lib/set-path";

const TOKEN_KEY = "eppp_admin_token";

const COLOR_LABELS = {
  paper: "Papier (fond)",
  card: "Carte",
  cardAlt: "Carte (clair)",
  ink: "Encre",
  inkSoft: "Encre douce",
  muted: "Gris discret",
  mutedOnDark: "Gris sur fond sombre",
  mutedOnDark2: "Gris sur fond sombre (2)",
  red: "Rouge (liens)",
  redLogo: "Rouge cantine (logo)",
  blue: "Bleu sieste",
  green: "Vert cour",
  greenDark: "Vert foncé (mission)",
  greenOnDark: "Vert clair sur fond sombre",
  greenPale: "Vert pâle",
  greenBright: "Vert vif",
  yellow: "Jaune goûter",
  yellowPale: "Jaune pâle",
  purple: "Violet (mauvais exemple)",
};

const STUDENT_LABEL_BY_ID = { marin: "Marin", mael: "Maël", parents: "Maman & Papa", jojo: "Jojo" };
const GOODS_LABEL_BY_ID = { cahier: "Cahier", tampon: "Tampon", affiche: "Affiche" };

async function adminFetch(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json;
}

function useSavedFlash() {
  const [message, setMessage] = useState(null);
  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }
  return [message, flash];
}

export default function AdminPage() {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [tab, setTab] = useState("guidelines");

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY));
    } catch {}
    setHydrated(true);
  }, []);

  function connect() {
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(TOKEN_KEY, trimmed);
    } catch {}
    setToken(trimmed);
    setTokenInput("");
  }

  function disconnect() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setToken(null);
  }

  if (!hydrated) {
    return (
      <main className="page">
        <p className="schedule-intro">Chargement…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="page">
        <section className="card" style={{ gap: 18 }}>
          <div className="kicker">Admin</div>
          <h2>Connexion</h2>
          <p className="schedule-intro">
            Colle ton token GitHub (fine-grained, accès en écriture sur ce seul repo). Il reste dans ton navigateur —
            il n'est jamais envoyé ailleurs qu'à GitHub, via ce site.
          </p>
          <Field label="Token GitHub" value={tokenInput} onChange={setTokenInput} />
          <button className="admin-btn admin-btn--primary" onClick={connect} disabled={!tokenInput.trim()}>
            Se connecter
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <div className="admin-header">
          <div>
            <div className="kicker">Admin</div>
            <h2>Bonjour !</h2>
          </div>
          <button className="admin-btn" onClick={disconnect}>
            Oublier le token
          </button>
        </div>
        <div className="admin-tabs">
          {[
            ["guidelines", "Charte de marque"],
            ["devoirs", "Devoirs"],
            ["fiches", "Fiches prof"],
            ["messages", "Messages"],
            ["planning", "Emploi du temps"],
            ["recompenses", "Récompenses"],
            ["notes", "Carnet de notes"],
            ["galerie", "Galerie"],
            ["photos", "Photos"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`admin-tab${tab === key ? " admin-tab--active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {tab === "guidelines" && <GuidelinesEditor token={token} />}
      {tab === "devoirs" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/devoirs"
          title="Devoirs"
          emptyText="Aucun devoir pour l'instant."
          makeEmpty={() => ({
            id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Maël",
            matiere: "",
            titre: "",
            description: "",
            date: "",
            fait: false,
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
            { key: "fait", label: "Fait", type: "checkbox" },
          ]}
        />
      )}
      {tab === "fiches" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/fiches"
          title="Fiches prof"
          emptyText="Le classeur est vide."
          makeEmpty={() => ({
            id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            matiere: "",
            titre: "",
            contenu: "",
            date: "",
          })}
          fields={[
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "contenu", label: "Contenu", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "messages" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/messages"
          title="Messages"
          emptyText="Aucun message."
          makeEmpty={() => ({
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            auteur: "",
            texte: "",
            date: new Date().toISOString(),
          })}
          fields={[
            { key: "auteur", label: "Auteur" },
            { key: "texte", label: "Message", type: "textarea" },
          ]}
        />
      )}
      {tab === "planning" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/planning"
          title="Emploi du temps"
          emptyText="Rien de programmé pour l'instant."
          makeEmpty={() => ({
            id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            jour: "Lundi",
            debut: "",
            fin: "",
            matiere: "",
            eleve: "",
          })}
          fields={[
            { key: "jour", label: "Jour", type: "select", options: JOURS },
            { key: "debut", label: "Début", type: "time" },
            { key: "fin", label: "Fin", type: "time" },
            { key: "matiere", label: "Matière" },
            { key: "eleve", label: "Élève" },
          ]}
        />
      )}
      {tab === "recompenses" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/recompenses"
          title="Récompenses"
          emptyText="Pas encore de tampon distribué."
          makeEmpty={() => ({
            id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Marin",
            tampon: "⭐",
            motif: "",
            date: new Date().toISOString().slice(0, 10),
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "tampon", label: "Tampon (emoji)" },
            { key: "motif", label: "Motif", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "notes" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/notes"
          title="Carnet de notes"
          emptyText="Aucune évaluation pour l'instant."
          makeEmpty={() => ({
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Maël",
            matiere: "",
            titre: "",
            note: "",
            appreciation: "",
            date: new Date().toISOString().slice(0, 10),
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "note", label: "Note" },
            { key: "appreciation", label: "Appréciation", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "galerie" && <GalerieEditor token={token} />}
      {tab === "photos" && <PhotosEditor token={token} />}
    </main>
  );
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function GuidelinesEditor({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch("/api/admin/guidelines", token)
      .then(setData)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token]);

  function set(path, value) {
    setData((prev) => setPath(prev, path, value));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await adminFetch("/api/admin/guidelines", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!data) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <>
      <section className="card">
        <h2>Couleurs</h2>
        <div className="admin-grid">
          {Object.entries(data.colors).map(([key, value]) => (
            <ColorField key={key} label={COLOR_LABELS[key] || key} value={value} onChange={(v) => set(`colors.${key}`, v)} />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Couverture</h2>
        <Field label="Mention (haut gauche)" value={data.cover.meta1} onChange={(v) => set("cover.meta1", v)} />
        <Field label="Mention (haut droite)" value={data.cover.meta2} onChange={(v) => set("cover.meta2", v)} />
        <Field label="Citation manuscrite" value={data.cover.quote} onChange={(v) => set("cover.quote", v)} textarea />
        <Field label="Titre" value={data.cover.title} onChange={(v) => set("cover.title", v)} />
        <Field label="Sous-titre" value={data.cover.lede} onChange={(v) => set("cover.lede", v)} textarea />
        {data.cover.facts.map((f, i) => (
          <div className="admin-grid admin-grid--2" key={i}>
            <Field label={`Fait ${i + 1} — libellé`} value={f.label} onChange={(v) => set(`cover.facts.${i}.label`, v)} />
            <Field label={`Fait ${i + 1} — valeur`} value={f.value} onChange={(v) => set(`cover.facts.${i}.value`, v)} />
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Mission</h2>
        <Field label="Repère (kicker)" value={data.mission.kicker} onChange={(v) => set("mission.kicker", v)} />
        <Field label="Titre" value={data.mission.title} onChange={(v) => set("mission.title", v)} textarea />
        <Field label="Paragraphe 1" value={data.mission.paragraph1} onChange={(v) => set("mission.paragraph1", v)} textarea />
        <Field label="Passage souligné (en fin de paragraphe 1)" value={data.mission.highlight} onChange={(v) => set("mission.highlight", v)} />
        <Field label="Paragraphe 2" value={data.mission.paragraph2} onChange={(v) => set("mission.paragraph2", v)} textarea />
        <StringListEditor label="Pastilles" items={data.mission.pills} onChange={(v) => set("mission.pills", v)} />
      </section>

      <section className="card">
        <h2>Logo</h2>
        <Field label="Repère (kicker)" value={data.logo.kicker} onChange={(v) => set("logo.kicker", v)} />
        <Field label="Titre" value={data.logo.title} onChange={(v) => set("logo.title", v)} />
        <Field label="Légende zone de protection" value={data.logo.protectionCaption} onChange={(v) => set("logo.protectionCaption", v)} textarea />
        <Field label="Description" value={data.logo.description} onChange={(v) => set("logo.description", v)} textarea />
        <StringListEditor label="Règles" items={data.logo.rules} onChange={(v) => set("logo.rules", v)} />
        <Field label="Note manuscrite" value={data.logo.handNote} onChange={(v) => set("logo.handNote", v)} />
      </section>

      <section className="card">
        <h2>Couleurs (section)</h2>
        <Field label="Repère (kicker)" value={data.colorsSection.kicker} onChange={(v) => set("colorsSection.kicker", v)} />
        <Field label="Titre" value={data.colorsSection.title} onChange={(v) => set("colorsSection.title", v)} />
        <Field label="Intro" value={data.colorsSection.intro} onChange={(v) => set("colorsSection.intro", v)} textarea />
        {data.colorsSection.swatches.map((s, i) => (
          <div className="admin-grid admin-grid--2" key={i}>
            <Field label={`Feutre ${i + 1} — nom`} value={s.name} onChange={(v) => set(`colorsSection.swatches.${i}.name`, v)} />
            <Field label={`Feutre ${i + 1} — usage`} value={s.usage} onChange={(v) => set(`colorsSection.swatches.${i}.usage`, v)} />
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Typographies</h2>
        <Field label="Repère (kicker)" value={data.typography.kicker} onChange={(v) => set("typography.kicker", v)} />
        <Field label="Titre" value={data.typography.title} onChange={(v) => set("typography.title", v)} />
        {data.typography.rows.map((row, i) => (
          <div className="admin-grid admin-grid--2" key={i}>
            <Field label={`Écriture ${i + 1} — nom`} value={row.label} onChange={(v) => set(`typography.rows.${i}.label`, v)} />
            <Field label={`Écriture ${i + 1} — description`} value={row.desc} onChange={(v) => set(`typography.rows.${i}.desc`, v)} textarea />
          </div>
        ))}
      </section>

      <section className="card">
        <h2>La classe</h2>
        <Field label="Repère (kicker)" value={data.students.kicker} onChange={(v) => set("students.kicker", v)} />
        <Field label="Titre" value={data.students.title} onChange={(v) => set("students.title", v)} />
        {data.students.list.map((s, i) => (
          <div className="admin-grid admin-grid--2" key={s.id}>
            <Field label={`${STUDENT_LABEL_BY_ID[s.id] || s.id} — nom affiché`} value={s.name} onChange={(v) => set(`students.list.${i}.name`, v)} />
            <Field label={`${STUDENT_LABEL_BY_ID[s.id] || s.id} — description`} value={s.desc} onChange={(v) => set(`students.list.${i}.desc`, v)} textarea />
          </div>
        ))}
        <Field label="Citation manuscrite de fin" value={data.students.footerQuote} onChange={(v) => set("students.footerQuote", v)} />
      </section>

      <section className="card">
        <h2>Emploi du temps</h2>
        <Field label="Repère (kicker)" value={data.schedule.kicker} onChange={(v) => set("schedule.kicker", v)} />
        <Field label="Titre" value={data.schedule.title} onChange={(v) => set("schedule.title", v)} />
        <Field label="Intro" value={data.schedule.intro} onChange={(v) => set("schedule.intro", v)} textarea />
        {data.schedule.rows.map((row, i) => (
          <div className="admin-grid admin-grid--2" key={i}>
            <Field label={`Étape ${i + 1} — repère`} value={row.time} onChange={(v) => set(`schedule.rows.${i}.time`, v)} />
            <Field label={`Étape ${i + 1} — description`} value={row.desc} onChange={(v) => set(`schedule.rows.${i}.desc`, v)} textarea />
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Règlement</h2>
        <Field label="Repère (kicker)" value={data.rules.kicker} onChange={(v) => set("rules.kicker", v)} />
        <Field label="Titre" value={data.rules.title} onChange={(v) => set("rules.title", v)} />
        <StringListEditor label="Règles" items={data.rules.list} onChange={(v) => set("rules.list", v)} />
      </section>

      <section className="card">
        <h2>Interdits</h2>
        <Field label="Repère (kicker)" value={data.bans.kicker} onChange={(v) => set("bans.kicker", v)} />
        <Field label="Titre" value={data.bans.title} onChange={(v) => set("bans.title", v)} />
        <StringListEditor label="Interdits" items={data.bans.list} onChange={(v) => set("bans.list", v)} />
      </section>

      <section className="card">
        <h2>Papeterie</h2>
        <Field label="Repère (kicker)" value={data.goods.kicker} onChange={(v) => set("goods.kicker", v)} />
        <Field label="Titre" value={data.goods.title} onChange={(v) => set("goods.title", v)} />
        {data.goods.items.map((item, i) => (
          <div className="admin-grid admin-grid--2" key={item.id}>
            <Field label={`${GOODS_LABEL_BY_ID[item.id] || item.id} — libellé`} value={item.label} onChange={(v) => set(`goods.items.${i}.label`, v)} />
            <Field label={`${GOODS_LABEL_BY_ID[item.id] || item.id} — légende placeholder`} value={item.caption} onChange={(v) => set(`goods.items.${i}.caption`, v)} />
          </div>
        ))}
        <Field label="Citation manuscrite de fin" value={data.goods.footerQuote} onChange={(v) => set("goods.footerQuote", v)} />
      </section>

      <section className="card admin-save-bar">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-success">{message}</p> : null}
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer sur GitHub"}
        </button>
      </section>
    </>
  );
}

function AdminListEditor({ token, endpoint, title, emptyText, makeEmpty, fields }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch(endpoint, token)
      .then(setList)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token, endpoint]);

  function updateAt(i, patch) {
    setList((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await adminFetch(endpoint, token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!list) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <section className="card">
      <h2>{title}</h2>
      {list.length === 0 ? <p className="schedule-intro">{emptyText}</p> : null}
      {list.map((item, i) => (
        <div className="admin-devoir-row" key={item.id}>
          {fields.map((f) =>
            f.type === "checkbox" ? (
              <label className="admin-field admin-field--checkbox" key={f.key}>
                <input type="checkbox" checked={!!item[f.key]} onChange={(e) => updateAt(i, { [f.key]: e.target.checked })} />
                <span>{f.label}</span>
              </label>
            ) : f.type === "date" || f.type === "time" ? (
              <label className="admin-field" key={f.key}>
                <span className="admin-field__label">{f.label}</span>
                <input
                  className="admin-field__input"
                  type={f.type}
                  value={item[f.key] || ""}
                  onChange={(e) => updateAt(i, { [f.key]: e.target.value })}
                />
              </label>
            ) : f.type === "select" ? (
              <label className="admin-field" key={f.key}>
                <span className="admin-field__label">{f.label}</span>
                <select
                  className="admin-field__input"
                  value={item[f.key] || ""}
                  onChange={(e) => updateAt(i, { [f.key]: e.target.value })}
                >
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <Field
                key={f.key}
                label={f.label}
                value={item[f.key]}
                onChange={(v) => updateAt(i, { [f.key]: v })}
                textarea={f.type === "textarea"}
              />
            )
          )}
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={() => setList((prev) => prev.filter((_, idx) => idx !== i))}
          >
            Supprimer
          </button>
          <hr className="admin-divider" />
        </div>
      ))}
      <button type="button" className="admin-btn" onClick={() => setList((prev) => [...prev, makeEmpty()])}>
        + Ajouter
      </button>

      <div className="admin-save-bar">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-success">{message}</p> : null}
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer sur GitHub"}
        </button>
      </div>
    </section>
  );
}

function PhotosEditor({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busySlot, setBusySlot] = useState(null);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch("/api/admin/guidelines", token)
      .then(setData)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token]);

  async function upload(slot, file) {
    setBusySlot(slot);
    setError(null);
    try {
      const form = new FormData();
      form.append("slot", slot);
      form.append("file", file);
      await adminFetch("/api/admin/photos", token, { method: "POST", body: form });
      flash("Photo envoyée ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusySlot(null);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!data) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <section className="card">
      <h2>Photos</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}
      <div className="admin-grid admin-grid--2">
        {data.students.list.map((s) => (
          <PhotoSlot
            key={s.id}
            label={STUDENT_LABEL_BY_ID[s.id] || s.name}
            photo={s.photo}
            busy={busySlot === `students:${s.id}`}
            onUpload={(file) => upload(`students:${s.id}`, file)}
          />
        ))}
        {data.goods.items.map((g) => (
          <PhotoSlot
            key={g.id}
            label={GOODS_LABEL_BY_ID[g.id] || g.label}
            photo={g.photo}
            busy={busySlot === `goods:${g.id}`}
            onUpload={(file) => upload(`goods:${g.id}`, file)}
          />
        ))}
      </div>
    </section>
  );
}

function GalerieEditor({ token }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newLegende, setNewLegende] = useState("");
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch("/api/admin/galerie", token)
      .then(setList)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token]);

  function updateAt(i, patch) {
    setList((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  async function uploadPhoto(file) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("legende", newLegende);
      const res = await adminFetch("/api/admin/galerie-photo", token, { method: "POST", body: form });
      setList((prev) => [...(prev || []), res.entry]);
      setNewLegende("");
      flash("Photo ajoutée ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await adminFetch("/api/admin/galerie", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!list) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <section className="card">
      <h2>Galerie</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}

      <div className="admin-field">
        <span className="admin-field__label">Ajouter une photo</span>
        <Field label="Légende" value={newLegende} onChange={setNewLegende} />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPhoto(file);
            e.target.value = "";
          }}
        />
        {uploading ? <span className="admin-field__label">Envoi…</span> : null}
      </div>

      <hr className="admin-divider" />

      {list.length === 0 ? <p className="schedule-intro">Pas encore de photo.</p> : null}
      <div className="admin-grid admin-grid--2">
        {list.map((item, i) => (
          <div className="admin-photo-slot" key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.legende || ""} className="admin-photo-slot__preview" />
            <Field label="Légende" value={item.legende} onChange={(v) => updateAt(i, { legende: v })} />
            <label className="admin-field">
              <span className="admin-field__label">Date</span>
              <input
                className="admin-field__input"
                type="date"
                value={(item.date || "").slice(0, 10)}
                onChange={(e) => updateAt(i, { date: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => setList((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="admin-save-bar">
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer sur GitHub"}
        </button>
      </div>
    </section>
  );
}

function PhotoSlot({ label, photo, busy, onUpload }) {
  return (
    <div className="admin-photo-slot">
      <div className="admin-field__label">{label}</div>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={label} className="admin-photo-slot__preview" />
      ) : (
        <div className="admin-photo-slot__preview admin-photo-slot__preview--empty">Pas encore de photo</div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      {busy ? <span className="admin-field__label">Envoi…</span> : null}
    </div>
  );
}
