const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const USERNAME = process.env.GITHUB_USERNAME || "AmanCiphers";
const API_TOKEN = process.env.GITHUB_TOKEN;
const ROOT = path.resolve(__dirname, "..");

function request(pathname) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: "api.github.com", path: pathname, headers: { "User-Agent": "AmanCiphers-profile-readme", Accept: "application/vnd.github+json", ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}) } }, (response) => {
      let body = "";
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) return reject(new Error(`GitHub API returned ${response.statusCode}`));
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    }).on("error", reject);
  });
}

async function getStats() {
  const user = await request(`/users/${encodeURIComponent(USERNAME)}`);
  const repositoryCount = Number(user.public_repos) || 0;
  const pages = Math.max(1, Math.ceil(repositoryCount / 100));
  const repositoryPages = await Promise.all(
    Array.from({ length: pages }, (_, index) => request(
      `/users/${encodeURIComponent(USERNAME)}/repos?per_page=100&page=${index + 1}&type=owner&sort=updated`,
    )),
  );
  const repos = repositoryPages.flat();
  const ownedRepos = repos.filter((repo) => !repo.fork);
  const languages = [...new Set(ownedRepos.map((repo) => repo.language).filter(Boolean))].slice(0, 4);
  return {
    repos: String(repositoryCount),
    followers: String(user.followers ?? 0),
    following: String(user.following ?? 0),
    stars: String(ownedRepos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0)),
    languages: languages.length ? languages.join(" · ") : "not enough data yet",
  };
}

function escapeXml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[character])); }
function text(x, y, value, fill, options = "") { return `<text x="${x}" y="${y}" fill="${fill}" ${options}>${escapeXml(value)}</text>`; }

function generateSvg(theme, stats) {
  const dark = theme === "dark";
  const c = dark ? { bg: "#0d1117", panel: "#161b22", border: "#30363d", text: "#c9d1d9", muted: "#8b949e", accent: "#e3b341", green: "#3fb950", blue: "#79c0ff" } : { bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de", text: "#1f2328", muted: "#57606a", accent: "#9a6700", green: "#1a7f37", blue: "#0969da" };
  const mono = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const lines = [];
  const add = (x, y, value, fill, options = "") => lines.push(text(x, y, value, fill, options));
  const row = (y, label, value) => { add(470, y, `${label}:`, c.accent, 'font-weight="700"'); add(620, y, value, c.text); };
  add(470, 92, "aman@cloverforge", c.text, 'font-size="27" font-weight="700"');
  add(470, 122, "────────────────────────────────", c.muted, 'font-size="18"');
  row(164, "role", "Engineering student · software developer");
  row(200, "school", "Shaheed Bhagat Singh State University");
  row(236, "focus", "Backend · systems · developer tools");
  add(470, 298, "── stack", c.blue, 'font-weight="700"'); add(570, 298, "────────────────────────", c.muted);
  row(338, "direction", "Building foundations in software engineering"); row(374, "languages", stats.languages);
  add(470, 450, "── projects", c.blue, 'font-weight="700"'); add(600, 450, "─────────────────────", c.muted);
  row(490, "now", "Open-source work in progress"); row(526, "next", "Projects will appear here as they ship");
  add(470, 590, "── github stats", c.blue, 'font-weight="700"'); add(650, 590, "─────────────────", c.muted);
  [["repos", stats.repos], ["followers", stats.followers], ["following", stats.following], ["stars", stats.stars]].forEach(([label, value], index) => row(630 + index * 30, label, value));
  add(470, 770, "●", c.green, 'font-size="23"'); add(500, 770, "Building something interesting…", c.text);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="820" viewBox="0 0 1200 820" role="img" aria-labelledby="title description">
  <title id="title">Aman’s developer profile</title><desc id="description">A terminal-style profile card with GitHub statistics.</desc>
  <rect width="1200" height="820" rx="18" fill="${c.bg}"/><rect x="20" y="20" width="1160" height="780" rx="14" fill="${c.panel}" stroke="${c.border}"/>
  <circle cx="52" cy="50" r="6" fill="#ff7b72"/><circle cx="74" cy="50" r="6" fill="#e3b341"/><circle cx="96" cy="50" r="6" fill="#3fb950"/>
  <g font-family="${mono}" font-size="17" dominant-baseline="middle">
    <text x="88" y="244" fill="${c.accent}" font-size="35" font-weight="700">&lt;/&gt;</text><text x="88" y="294" fill="${c.text}" font-size="23" font-weight="700">A M A N</text>
    <text x="88" y="334" fill="${c.muted}" font-size="14">crafting systems,</text><text x="88" y="358" fill="${c.muted}" font-size="14">one commit at a time.</text><path d="M88 410h270" stroke="${c.border}" stroke-width="2"/>
    <text x="88" y="450" fill="${c.green}" font-size="18">$</text><text x="112" y="450" fill="${c.text}" font-size="14">whoami</text><text x="88" y="482" fill="${c.muted}" font-size="14">engineering student</text>
    <text x="88" y="512" fill="${c.green}" font-size="18">$</text><text x="112" y="512" fill="${c.text}" font-size="14">status</text><text x="88" y="544" fill="${c.muted}" font-size="14">learning · building · iterating</text><path d="M410 76v680" stroke="${c.border}" stroke-width="2"/>
    ${lines.join("\n    ")}
  </g>
</svg>\n`;
}

async function main() {
  let stats;
  try {
    stats = await getStats();
  } catch (error) {
    // Keep the last known-good card if GitHub's API is briefly unavailable.
    // This avoids committing placeholders over real statistics.
    console.warn(`Could not refresh GitHub data; retaining existing SVGs: ${error.message}`);
    return;
  }
  fs.writeFileSync(path.join(ROOT, "light_mode.svg"), generateSvg("light", stats));
  fs.writeFileSync(path.join(ROOT, "dark_mode.svg"), generateSvg("dark", stats));
  console.log("Profile SVGs generated.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
