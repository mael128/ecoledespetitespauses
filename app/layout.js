import Link from "next/link";
import "./globals.css";
import guidelines from "../content/guidelines.json";

export const metadata = {
  title: "L'École des Petites Pauses",
  description: "Charte de marque officielle de L'École des Petites Pauses.",
};

function colorVarsCss(colors) {
  const map = {
    paper: "--paper",
    card: "--card",
    cardAlt: "--card-alt",
    ink: "--ink",
    inkSoft: "--ink-soft",
    muted: "--muted",
    mutedOnDark: "--muted-on-dark",
    mutedOnDark2: "--muted-on-dark-2",
    red: "--red",
    redLogo: "--red-logo",
    blue: "--blue",
    green: "--green",
    greenDark: "--green-dark",
    greenOnDark: "--green-on-dark",
    greenPale: "--green-pale",
    greenBright: "--green-bright",
    yellow: "--yellow",
    yellowPale: "--yellow-pale",
    purple: "--purple",
  };
  const lines = Object.entries(map)
    .filter(([key]) => colors[key])
    .map(([key, cssVar]) => `${cssVar}: ${colors[key]};`)
    .join(" ");
  return `:root { ${lines} }`;
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Karla:wght@400;500;700&family=Caveat:wght@600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{ __html: colorVarsCss(guidelines.colors) }}
        />
      </head>
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--paper)" }}>
          <nav className="site-nav" style={{ marginTop: "clamp(14px, 3vw, 24px)" }}>
            <Link href="/">Charte de marque</Link>
            <Link href="/devoirs">Devoirs</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
