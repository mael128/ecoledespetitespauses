import guidelines from "../content/guidelines.json";
import { Multiline } from "../lib/text";

const fontFamily = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "Karla, sans-serif",
  hand: "Caveat, cursive",
};

function LogoMark({ size = 112, barW = 19, barH = 50, gap = 14, bg = "var(--red-logo)", barColor = "var(--card)" }) {
  return (
    <div
      className="logo-mark"
      style={{ width: size, height: size, gap, background: bg }}
      aria-hidden="true"
    >
      <div className="logo-mark__bar" style={{ width: barW, height: barH, background: barColor }} />
      <div className="logo-mark__bar" style={{ width: barW, height: barH, background: barColor }} />
    </div>
  );
}

export default function HomePage() {
  const { cover, mission, logo, colorsSection, typography, students, schedule, rules, bans, goods } = guidelines;

  return (
    <main className="page">
      {/* Couverture */}
      <section className="card cover" aria-label="Couverture">
        <div className="cover__tape" aria-hidden="true" />
        <div className="cover__meta">
          <span>{cover.meta1}</span>
          <span>{cover.meta2}</span>
        </div>
        <div className="cover__brand">
          <LogoMark />
          <p className="hand cover__quote">{cover.quote}</p>
          <svg className="cover__doodle" viewBox="0 0 120 90" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M12 70c8-26 22-40 34-40s16 10 10 18-18 8-22 0 4-22 20-28 30 2 34 14" />
            <path d="M92 26l6 10 11 2-8 8 2 11-11-6-10 6 2-11-8-8 11-2z" stroke="var(--yellow)" />
            <path d="M20 82h74" stroke="var(--ink)" />
          </svg>
        </div>
        <h1>{cover.title}</h1>
        <p className="cover__lede">{cover.lede}</p>
        <div className="cover__facts">
          {cover.facts.map((f) => (
            <div key={f.label}>
              <strong>{f.label}</strong>
              <br />
              {f.value}
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="card card--green mission" aria-label="Mission">
        <div className="kicker">{mission.kicker}</div>
        <h2>{mission.title}</h2>
        <div className="mission__copy">
          <p>
            {mission.paragraph1} <strong>{mission.highlight}</strong>
          </p>
          <p>{mission.paragraph2}</p>
        </div>
        <div className="mission__pills">
          {mission.pills.map((p, i) => (
            <div key={p} className={`pill pill--${["peach", "green", "blue"][i % 3]}`}>
              {p}
            </div>
          ))}
          <svg className="mission__doodle" viewBox="0 0 70 30" fill="none" stroke="var(--yellow)" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M4 20c8-12 16 8 24-4s16 10 24-2" />
            <path d="M56 6l8 8-8 8" />
          </svg>
        </div>
      </section>

      {/* Logo */}
      <section className="card" aria-label="Logo">
        <div className="kicker">{logo.kicker}</div>
        <h2>{logo.title}</h2>
        <div className="logo-grid">
          <div className="logo-showcase">
            <div className="logo-showcase__ring">
              <LogoMark size={96} barW={16} barH={44} gap={12} />
            </div>
            <div className="logo-showcase__caption">
              <Multiline text={logo.protectionCaption} />
            </div>
          </div>
          <div className="logo-rules">
            <p>{logo.description}</p>
            <ul>
              {logo.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="hand">{logo.handNote}</p>
          </div>
        </div>
        <div className="logo-examples">
          <div className="logo-example">
            <LogoMark size={54} barW={9} barH={25} gap={7} />
            <div className="logo-example__label" style={{ color: "var(--green)" }}>OUI</div>
          </div>
          <div className="logo-example logo-example--dark">
            <LogoMark size={54} barW={9} barH={25} gap={7} bg="var(--card)" barColor="var(--red-logo)" />
            <div className="logo-example__label" style={{ color: "var(--green-bright)" }}>OUI</div>
          </div>
          <div className="logo-example logo-example--egg">
            <LogoMark size={54} barW={9} barH={25} gap={7} />
            <div className="logo-example__label" style={{ color: "var(--red)" }}>NON — pas d'œuf</div>
          </div>
          <div className="logo-example">
            <LogoMark size={54} barW={9} barH={25} gap={7} bg="var(--purple)" barColor="var(--yellow)" />
            <div className="logo-example__label" style={{ color: "var(--red)" }}>NON — pas ces couleurs</div>
          </div>
        </div>
      </section>

      {/* Couleurs */}
      <section className="card" aria-label="Couleurs">
        <div className="kicker">{colorsSection.kicker}</div>
        <div className="section-head">
          <h2>{colorsSection.title}</h2>
          <svg className="icon" style={{ width: 120 }} viewBox="0 0 130 40" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M6 30c14-16 26 6 40-8" stroke="var(--red-logo)" />
            <path d="M50 28c12-14 22 4 34-8" stroke="var(--green)" />
            <path d="M88 26c10-12 20 4 34-10" stroke="var(--blue)" />
          </svg>
        </div>
        <p className="schedule-intro">{colorsSection.intro}</p>
        <div className="color-swatches">
          {colorsSection.swatches.map((s) => (
            <div className="swatch" key={s.name}>
              <div className="swatch__chip" style={{ background: `var(--${cssVarFromKey(s.colorKey)})` }} />
              <div className="swatch__info">
                {s.name}
                <br />
                <span>{guidelines.colors[s.colorKey]}</span>
                <br />
                <span>{s.usage}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="neutral-swatches">
          {colorsSection.neutrals.map((s) => (
            <div className="swatch swatch--neutral" key={s.name}>
              <div
                className="swatch__chip"
                style={{
                  background: `var(--${cssVarFromKey(s.colorKey)})`,
                  border: s.colorKey === "card" ? "1px solid var(--ink)" : "none",
                }}
              />
              <div className="swatch__info">
                {s.name}
                <br />
                <span>
                  {guidelines.colors[s.colorKey]} — {s.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typographies */}
      <section className="card card--dark" aria-label="Typographies">
        <div className="kicker">{typography.kicker}</div>
        <h2>{typography.title}</h2>
        <div className="type-list">
          {typography.rows.map((row) => (
            <div className="type-row" key={row.label}>
              <div
                className={`type-row__sample type-row__sample--${row.family}`}
                style={{ fontFamily: fontFamily[row.family] }}
              >
                Aa Bb 123
              </div>
              <div className="type-row__desc">
                <strong>{row.label}</strong>
                <br />
                <Multiline text={row.desc} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Les élèves */}
      <section className="card" aria-label="Les élèves">
        <div className="kicker">{students.kicker}</div>
        <h2>{students.title}</h2>
        <div className="class-grid">
          {students.list.map((s) => (
            <div className="student" key={s.id}>
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt={s.name} className="student__photo" style={{ objectFit: "cover" }} />
              ) : (
                <div className="student__photo">photo de {s.name.split(",")[0]}</div>
              )}
              <div>
                <strong className="student__name">{s.name}</strong>
                <div className="student__desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="class-footer">
          <p className="hand">{students.footerQuote}</p>
          <svg className="class-footer__doodle" viewBox="0 0 90 40" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <circle cx="22" cy="20" r="13" stroke="var(--green)" />
            <path d="M16 20l5 6 9-12" stroke="var(--green)" />
            <path d="M44 28c6-10 12-10 18 0" stroke="var(--ink)" />
            <path d="M70 12v16" stroke="var(--yellow)" />
            <path d="M62 20h16" stroke="var(--yellow)" />
          </svg>
        </div>
      </section>

      {/* Emploi du temps */}
      <section className="card" aria-label="Emploi du temps">
        <div className="kicker">{schedule.kicker}</div>
        <div className="section-head section-head--grow">
          <h2>{schedule.title}</h2>
          <svg className="icon" style={{ width: 74 }} viewBox="0 0 80 80" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <circle cx="40" cy="42" r="26" stroke="var(--green)" />
            <path d="M40 42V26M40 42l14 8" stroke="var(--ink)" />
            <path d="M40 8v6M14 18l4 4M66 18l-4 4" stroke="var(--yellow)" />
          </svg>
        </div>
        <p className="schedule-intro">{schedule.intro}</p>
        <div className="schedule">
          {schedule.rows.map((row) => (
            <div className="schedule__row" key={row.time}>
              <div className="schedule__time">{row.time}</div>
              <div className="schedule__desc">{row.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Règles */}
      <section className="card card--dark" aria-label="Règlement">
        <div className="kicker">{rules.kicker}</div>
        <div className="section-head">
          <h2>{rules.title}</h2>
          <svg className="icon" style={{ width: 94 }} viewBox="0 0 100 44" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M8 34c10-22 24-22 34-6" stroke="var(--green-bright)" />
            <path d="M42 28l4-12 8 10" stroke="var(--green-bright)" />
            <path d="M60 30c8-16 20-16 32-4" stroke="var(--yellow)" />
            <path d="M88 18l6 8-10 2" stroke="var(--yellow)" />
          </svg>
        </div>
        <div className="rules-grid">
          {rules.list.map((r, i) => (
            <div className="rule" key={r}>
              <div className="rule__number">{i + 1}</div>
              <div className="rule__text">{r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interdits */}
      <section className="card" aria-label="Ce qu'il ne faut pas faire">
        <div className="kicker">{bans.kicker}</div>
        <div className="section-head">
          <h2>{bans.title}</h2>
          <svg className="icon" style={{ width: 56 }} viewBox="0 0 60 60" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <circle cx="30" cy="30" r="22" stroke="var(--red)" />
            <path d="M16 44L44 16" stroke="var(--ink)" />
          </svg>
        </div>
        <div className="bans-grid">
          {bans.list.map((b) => (
            <div className="ban" key={b}>
              <div className="ban__label">NON</div>
              <div className="ban__text">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Papeterie */}
      <section className="card" aria-label="Papeterie et goodies">
        <div className="kicker">{goods.kicker}</div>
        <div className="section-head">
          <h2>{goods.title}</h2>
          <svg className="icon" style={{ width: 104 }} viewBox="0 0 110 40" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M6 30l14-22 8 5-14 22-10 3z" stroke="var(--green)" />
            <path d="M36 32h30" stroke="var(--ink)" />
            <path d="M78 10v22M70 14l8-6 8 6" stroke="var(--red-logo)" />
            <path d="M96 28c4-8 10-4 10 2" stroke="var(--yellow)" />
          </svg>
        </div>
        <div className="goods-grid">
          {goods.items.map((item) => (
            <div className="good" key={item.id}>
              {item.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photo} alt={item.label} className="good__photo" style={{ objectFit: "cover" }} />
              ) : (
                <div className="good__photo">{item.caption}</div>
              )}
              <div className="good__label">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="papeterie__footer">
          <p className="hand">{goods.footerQuote}</p>
          <div className="stamp">
            APPROUVÉ
            <br />
            PAR LE
            <br />
            DIRECTEUR
          </div>
        </div>
      </section>
    </main>
  );
}

function cssVarFromKey(key) {
  return key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
