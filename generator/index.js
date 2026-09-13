const fs = require("fs");

const USERNAME = "amanciphers";

function generateSVG(theme) {
  const dark = theme === "dark";

  const background = dark ? "#11161c" : "#f5f7fa";
  const foreground = dark ? "#d6deeb" : "#24292f";
  const secondary = dark ? "#8b9bb4" : "#57606a";
  const accent = dark ? "#e5a85c" : "#9a6700";
  const green = dark ? "#7ee787" : "#1a7f37";

  return `
<svg
  width="1500"
  height="820"
  viewBox="0 0 1500 820"
  xmlns="http://www.w3.org/2000/svg"
>

  <rect
    x="15"
    y="15"
    width="1470"
    height="790"
    rx="25"
    fill="${background}"
  />

  <g
    font-family="JetBrains Mono, Fira Code, monospace"
    font-size="24"
  >

    <!-- ASCII -->
    <text
      x="70"
      y="90"
      fill="${foreground}"
      xml:space="preserve"
    >
      <tspan x="70" dy="0">       ███████╗</tspan>
      <tspan x="70" dy="30">       ██╔════╝</tspan>
      <tspan x="70" dy="30">       ███████╗</tspan>
      <tspan x="70" dy="30">       ╚════██║</tspan>
      <tspan x="70" dy="30">       ███████║</tspan>
      <tspan x="70" dy="30">       ╚══════╝</tspan>
    </text>

    <!-- Header -->
    <text x="590" y="70" fill="${foreground}">
      aman@cloverforge
    </text>

    <text x="590" y="105" fill="${secondary}">
      ───────────────────────────────────────────────
    </text>

    <!-- System -->
    <text x="590" y="155" fill="${accent}">Role:</text>
    <text x="850" y="155" fill="${foreground}">
      Backend Engineer
    </text>

    <text x="590" y="195" fill="${accent}">University:</text>
    <text x="850" y="195" fill="${foreground}">
      SBS State University
    </text>

    <text x="590" y="235" fill="${accent}">Focus:</text>
    <text x="850" y="235" fill="${foreground}">
      Backend &amp; Systems
    </text>

    <!-- Stack -->
    <text x="590" y="300" fill="${secondary}">
      ── Stack ─────────────────────────────────────
    </text>

    <text x="590" y="345" fill="${accent}">Backend:</text>
    <text x="850" y="345" fill="${foreground}">
      Node.js • Express
    </text>

    <text x="590" y="385" fill="${accent}">Frontend:</text>
    <text x="850" y="385" fill="${foreground}">
      React • Next.js
    </text>

    <text x="590" y="425" fill="${accent}">Database:</text>
    <text x="850" y="425" fill="${foreground}">
      PostgreSQL
    </text>

    <text x="590" y="465" fill="${accent}">Tools:</text>
    <text x="850" y="465" fill="${foreground}">
      Docker • Git • Linux
    </text>

    <!-- Projects -->
    <text x="590" y="530" fill="${secondary}">
      ── Projects ──────────────────────────────────
    </text>

    <text x="590" y="575" fill="${accent}">Current:</text>
    <text x="850" y="575" fill="${foreground}">
      CloverForge
    </text>

    <text x="590" y="615" fill="${accent}">Building:</text>
    <text x="850" y="615" fill="${foreground}">
      Developer Tools
    </text>

    <!-- Status -->
    <text x="590" y="680" fill="${secondary}">
      ── Status ────────────────────────────────────
    </text>

    <text x="590" y="725" fill="${green}">
      ●
    </text>

    <text x="625" y="725" fill="${foreground}">
      Building something interesting...
    </text>

  </g>

</svg>
`;
}

fs.writeFileSync("light_mode.svg", generateSVG("light"));
fs.writeFileSync("dark_mode.svg", generateSVG("dark"));

console.log("SVGs generated.");
