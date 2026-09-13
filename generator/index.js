const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

// Edit the values in this block, then run: node generator/index.js
// Use "—" for anything you would rather leave blank on the card.
const PROFILE = {
  header: "aman@thecloverforge",
  // Set this to your date of birth in YYYY-MM-DD format to enable uptime.
  birthDate: "YYYY-MM-DD",
  system: {
    os: "macOS, Linux, Android",
    host: "thecloverforge.com",
    kernel: "Lead Developer",
    ide: "VS Code, nano, Vim",
  },
  languages: {
    programming: "JavaScript, Python",
    web: "React, Next.js",
    backend: "AWS, GCP, Node.js",
    human: "English, Punjabi, Hindi, Japanese N5",
  },
  hobbies: {
    Tech: "I think, I create",
    General: "FPV drones, Piano, Learning Japanese",
  },
  contact: {
    github: "github.com/AmanCiphers",
    portfolio: "aman.thecloverforge.com",
    linkedin: "linkedin.com/in/amanciphers",
    email: "fullstackdev.aman@gmail.com",
  },
  stats: {
    repos: "25",
    contributed: "—",
    stars: "1",
    commits: "—",
    followers: "3",
    following: "9",
    linesOfCode: "∞",
  },
};

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  }[character]));
}

function limitText(value, maximum) {
  const text = String(value);
  return text.length > maximum ? `${text.slice(0, maximum - 1)}…` : text;
}

function calculateAge(birthDate, timeZone = "Asia/Kolkata") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return "set PROFILE.birthDate";

  const birth = new Date(`${birthDate}T00:00:00+05:30`);
  if (Number.isNaN(birth.getTime())) return "set PROFILE.birthDate";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date()).reduce((result, part) => ({
    ...result,
    ...(part.type === "literal" ? {} : { [part.type]: Number(part.value) }),
  }), {});

  let years = parts.year - Number(birthDate.slice(0, 4));
  let months = parts.month - Number(birthDate.slice(5, 7));
  let days = parts.day - Number(birthDate.slice(8, 10));
  let hours = parts.hour;

  if (days < 0) {
    months -= 1;
    const previousMonth = parts.month === 1 ? 12 : parts.month - 1;
    const previousYear = previousMonth === 12 ? parts.year - 1 : parts.year;
    days += new Date(Date.UTC(previousYear, previousMonth, 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return "set a past birth date";
  return `${years} years, ${months} months, ${days} days, ${hours} hours`;
}

function text(x, y, value, fill, options = "") {
  return `<text x="${x}" y="${y}" fill="${fill}" ${options}>${escapeXml(value)}</text>`;
}

function generateSvg(theme) {
  const dark = theme === "dark";
  const c = dark
    ? { bg: "#0f0d0a", surface: "#1a1410", raised: "#211a14", text: "#e8dfd5", muted: "#c9b7a0", faint: "#8b7b6d", accent: "#d5a373", line: "#4a3f2f" }
    : { bg: "#f7f1e9", surface: "#f5f2ed", raised: "#fffaf4", text: "#3c2b20", muted: "#705d4b", faint: "#ab8b66", accent: "#b77c42", line: "#d5a373" };
  const mono = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const serif = "ui-serif, Georgia, Cambria, Times New Roman, serif";
  const rightX = 610;
  const valueX = 1470;
  const leaderStart = 900;
  const banner = [
    "    _    __  __    _    _   _",
    "   / \\  |  \\/  |  / \\  | \\ | |",
    "  / _ \\ | |\\/| | / _ \\ |  \\| |",
    " / ___ \\| |  | |/ ___ \\| |\\  |",
    "/_/   \\_\\_|  |_/_/   \\_\\_| \\_|",
  ].map((line, index) => text(70, 156 + index * 28, line, c.accent, `font-family="${mono}" font-size="17" font-weight="700" xml:space="preserve"`)).join("\n    ");
  const row = (y, label, value) => {
    const displayValue = limitText(value, 47);
    // At 20px, a monospace glyph is approximately 12px wide. The small gap
    // ensures the dotted leader ends just before the right-aligned value.
    const leaderEnd = Math.max(leaderStart, valueX - displayValue.length * 12 - 18);
    return `${text(rightX, y, `${label}:`, c.accent, `font-family="${mono}" font-size="20" font-weight="700"`)}
    <path d="M${leaderStart} ${y}H${leaderEnd}" stroke="${c.faint}" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 9" opacity=".8"/>
    <text x="${valueX}" y="${y}" fill="${c.muted}" font-family="${mono}" font-size="20" text-anchor="end">${escapeXml(displayValue)}</text>`;
  };
  const section = (y, label) => `<text x="${rightX}" y="${y}" fill="${c.text}" font-family="${mono}" font-size="19">─ ${escapeXml(label)} </text>
    <path d="M${rightX + 170} ${y}H1470" stroke="${c.line}" stroke-width="2"/>`;
  const statLine = (y, parts) => text(rightX, y, parts.map(([label, value]) => `${label}: ${value}`).join("  |  "), c.muted, `font-family="${mono}" font-size="19"`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" viewBox="0 0 1500 1000" role="img" aria-labelledby="title description">
  <title id="title">Aman Ciphers — developer profile</title>
  <desc id="description">A warm terminal-style developer profile with manually editable system, contact, and GitHub statistics.</desc>
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.surface}"/><stop offset="1" stop-color="${c.bg}"/></linearGradient>
    <pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="${c.accent}" opacity=".08"/><circle cx="13" cy="11" r=".5" fill="${c.accent}" opacity=".06"/></pattern>
  </defs>
  <rect width="1500" height="1000" rx="22" fill="${c.bg}"/>
  <rect x="18" y="18" width="1464" height="964" rx="17" fill="url(#paper)" stroke="${c.line}"/>
  <rect x="18" y="18" width="1464" height="964" rx="17" fill="url(#grain)"/>
  <circle cx="56" cy="57" r="6" fill="#c76c5f"/><circle cx="78" cy="57" r="6" fill="${c.accent}"/><circle cx="100" cy="57" r="6" fill="#728d68"/>
  <text x="1370" y="62" fill="${c.faint}" font-family="${mono}" font-size="11" font-weight="700" text-anchor="end" letter-spacing="2">PROFILE / 01</text>
  <path d="M48 92H1452" stroke="${c.line}" stroke-opacity=".75"/>
  <g dominant-baseline="middle">
    ${banner}
    <text x="70" y="336" fill="${c.text}" font-family="${serif}" font-size="39" font-weight="700">Aman Ciphers</text>
    <path d="M70 368H510" stroke="${c.line}"/>
    <text x="70" y="408" fill="${c.muted}" font-family="${mono}" font-size="16">// full-stack developer</text>
    <text x="70" y="438" fill="${c.muted}" font-family="${mono}" font-size="16">// engineering student</text>
    <text x="70" y="468" fill="${c.muted}" font-family="${mono}" font-size="16">// backend · systems · developer tools</text>
    <rect x="70" y="523" width="440" height="184" rx="13" fill="${c.raised}" fill-opacity=".7" stroke="${c.line}" stroke-opacity=".75"/>
    <text x="96" y="558" fill="${c.faint}" font-family="${mono}" font-size="11" font-weight="700" letter-spacing="1.8">WORKBENCH</text>
    <text x="96" y="598" fill="${c.accent}" font-family="${mono}" font-size="15" font-weight="700">focus</text>
    <text x="190" y="598" fill="${c.muted}" font-family="${mono}" font-size="15">backend systems</text>
    <text x="96" y="634" fill="${c.accent}" font-family="${mono}" font-size="15" font-weight="700">craft</text>
    <text x="190" y="634" fill="${c.muted}" font-family="${mono}" font-size="15">web experiences</text>
    <text x="96" y="670" fill="${c.accent}" font-family="${mono}" font-size="15" font-weight="700">home</text>
    <text x="190" y="670" fill="${c.muted}" font-family="${mono}" font-size="15">thecloverforge.com</text>
    <path d="M555 120V934" stroke="${c.line}" stroke-opacity=".75"/>
    ${text(rightX, 118, PROFILE.header, c.text, `font-family="${mono}" font-size="27" font-weight="700"`)}
    <path d="M610 140H1470" stroke="${c.line}"/>
    ${row(177, "OS", PROFILE.system.os)}
    ${row(215, "Uptime", calculateAge(PROFILE.birthDate))}
    ${row(253, "Host", PROFILE.system.host)}
    ${row(291, "Kernel", PROFILE.system.kernel)}
    ${row(329, "IDE", PROFILE.system.ide)}
    ${section(372, "Languages")}
    ${row(406, "Languages.Programming", PROFILE.languages.programming)}
    ${row(438, "Languages.Web", PROFILE.languages.web)}
    ${row(470, "Languages.Backend", PROFILE.languages.backend)}
    ${row(502, "Languages.Human", PROFILE.languages.human)}
    ${section(548, "Hobbies")}
    ${row(582, "Hobbies.Tech", PROFILE.hobbies.Tech)}
    ${row(614, "Hobbies.General", PROFILE.hobbies.General)}
    ${section(660, "Contact")}
    ${row(694, "GitHub", PROFILE.contact.github)}
    ${row(726, "Portfolio", PROFILE.contact.portfolio)}
    ${row(758, "LinkedIn", PROFILE.contact.linkedin)}
    ${row(790, "Email", PROFILE.contact.email)}
    ${section(836, "GitHub Stats")}
    ${statLine(866, [["Repos", PROFILE.stats.repos], ["Contributed", PROFILE.stats.contributed], ["Stars", PROFILE.stats.stars]])}
    ${statLine(894, [["Commits", PROFILE.stats.commits], ["Followers", PROFILE.stats.followers], ["Following", PROFILE.stats.following]])}
    ${statLine(922, [["Lines of code", PROFILE.stats.linesOfCode]])}
  </g>
</svg>\n`;
}

fs.writeFileSync(path.join(ROOT, "light_mode.svg"), generateSvg("light"));
fs.writeFileSync(path.join(ROOT, "dark_mode.svg"), generateSvg("dark"));
console.log("Profile SVGs generated.");
