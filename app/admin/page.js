"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Field, ColorField, StringListEditor } from "./fields";
import { setPath } from "../../lib/set-path";

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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("guidelines");

  if (status === "loading") {
    return (
      <main className="page">
        <p className="schedule-intro">Chargement…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="page">
        <section className="card" style={{ alignItems: "center", textAlign: "center" }}>
          <div className="kicker">Admin</div>
          <h2>Connexion</h2>
          <p className="schedule-intro">Réservé au directeur et à sa famille.</p>
          <button className="admin-btn admin-btn--primary" onClick={() => signIn("github")}>
            Se connecter avec GitHub
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
            <h2>Bonjour {session.user?.login || session.user?.name}</h2>
          </div>
          <button className="admin-btn" onClick={() => signOut()}>
            Se déconnecter
          </button>
        </div>
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "guidelines" ? " admin-tab--active" : ""}`} onClick={() => setTab("guidelines")}>
            Charte de marque
          </button>
          <button className={`admin-tab${tab === "devoirs" ? " admin-tab--active" : ""}`} onClick={() => setTab("devoirs")}>
            Devoirs
          </button>
          <button className={`admin-tab${tab === "photos" ? " admin-tab--active" : ""}`} onClick={() => setTab("photos")}>
            Photos
          </button>
        </div>
      </section>

      {tab === "guidelines" && <GuidelinesEditor />}
      {tab === "devoirs" && <DevoirsEditor />}
      {tab === "photos" && <PhotosEditor />}
    </main>
  );
}

function useSavedFlash() {
  const [message, setMessage] = useState(null);
  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }
  return [message, flash];
}

function GuidelinesEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    fetch("/api/admin/guidelines")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  function set(path, value) {
    setData((prev) => setPath(prev, path, value));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/guidelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!data) return <section className="card"><p className="schedule-intro">Impossible de charger le contenu.</p></section>;

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

function emptyDevoir() {
  return {
    id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    eleve: "Maël",
    matiere: "",
    titre: "",
    description: "",
    date: "",
    fait: false,
  };
}

function DevoirsEditor() {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    fetch("/api/admin/devoirs")
      .then((r) => r.json())
      .then((json) => {
        setList(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  function updateAt(i, patch) {
    setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/devoirs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!list) return <section className="card"><p className="schedule-intro">Impossible de charger les devoirs.</p></section>;

  return (
    <section className="card">
      <h2>Devoirs</h2>
      {list.length === 0 ? <p className="schedule-intro">Aucun devoir pour l'instant.</p> : null}
      {list.map((d, i) => (
        <div className="admin-devoir-row" key={d.id}>
          <div className="admin-grid admin-grid--2">
            <Field label="Élève" value={d.eleve} onChange={(v) => updateAt(i, { eleve: v })} />
            <Field label="Matière" value={d.matiere} onChange={(v) => updateAt(i, { matiere: v })} />
          </div>
          <Field label="Titre" value={d.titre} onChange={(v) => updateAt(i, { titre: v })} />
          <Field label="Description" value={d.description} onChange={(v) => updateAt(i, { description: v })} textarea />
          <div className="admin-grid admin-grid--2">
            <label className="admin-field">
              <span className="admin-field__label">Date</span>
              <input
                className="admin-field__input"
                type="date"
                value={d.date || ""}
                onChange={(e) => updateAt(i, { date: e.target.value })}
              />
            </label>
            <label className="admin-field admin-field--checkbox">
              <input type="checkbox" checked={!!d.fait} onChange={(e) => updateAt(i, { fait: e.target.checked })} />
              <span>Fait</span>
            </label>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={() => setList((prev) => prev.filter((_, idx) => idx !== i))}
          >
            Supprimer ce devoir
          </button>
          <hr className="admin-divider" />
        </div>
      ))}
      <button type="button" className="admin-btn" onClick={() => setList((prev) => [...prev, emptyDevoir()])}>
        + Ajouter un devoir
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

function PhotosEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busySlot, setBusySlot] = useState(null);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    fetch("/api/admin/guidelines")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  async function upload(slot, file) {
    setBusySlot(slot);
    setError(null);
    try {
      const form = new FormData();
      form.append("slot", slot);
      form.append("file", file);
      const res = await fetch("/api/admin/photos", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      flash("Photo envoyée ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusySlot(null);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!data) return <section className="card"><p className="schedule-intro">Impossible de charger le contenu.</p></section>;

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
