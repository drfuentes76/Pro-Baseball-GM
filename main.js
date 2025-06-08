
let output = document.getElementById("output");
let input = document.getElementById("command");

let userTeam = "Astros";
let currentTeamRoster = [
  { name: "Jose Altuve", position: "2B", ovr: 91, salary: 29 },
  { name: "Yordan Alvarez", position: "LF", ovr: 93, salary: 19 },
  { name: "Framber Valdez", position: "SP", ovr: 88, salary: 17 }
];
let seasonStats = {};
let newsLog = [];

function handleCommand(cmd) {
  if (cmd === "menu") {
    print("Commands: ROSTER, SIM, TRADE, DRAFT, STATS, NEWS");
  } else if (cmd === "roster") {
    print("Team Roster:");
    currentTeamRoster.forEach(p => {
      print(`${p.name} - ${p.position} - OVR: ${p.ovr} - $${p.salary}M`);
    });
  } else if (cmd === "sim") {
    simulateGame();
  } else if (cmd === "trade") {
    tradePlayer();
  } else if (cmd === "draft") {
    draftPlayer();
  } else if (cmd === "stats") {
    viewStats();
  } else if (cmd === "news") {
    viewNews();
  } else {
    print(`Unknown command: ${cmd}`);
  }
}

function print(text) {
  output.innerHTML += `<p>> ${text}</p>`;
  output.scrollTop = output.scrollHeight;
}

function simulateGame() {
  let result = Math.random() < 0.5 ? "win" : "loss";
  print(`You ${result} today's game.`);
  logNews(`Sim result: ${result}`);
  currentTeamRoster.forEach(p => {
    if (!seasonStats[p.name]) {
      seasonStats[p.name] = { hits: 0, hr: 0 };
    }
    seasonStats[p.name].hits += Math.floor(Math.random() * 4);
    seasonStats[p.name].hr += Math.random() < 0.1 ? 1 : 0;
  });
}

function tradePlayer() {
  let removed = currentTeamRoster.pop();
  let newPlayer = { name: "Juan Rivera", position: "CF", ovr: 80, salary: 2.5 };
  currentTeamRoster.push(newPlayer);
  print(`Traded ${removed.name} for ${newPlayer.name}`);
  logNews(`Trade: ${removed.name} → ${newPlayer.name}`);
}

function draftPlayer() {
  let rookie = {
    name: "Mike Johnson",
    position: "SP",
    ovr: Math.floor(70 + Math.random() * 20),
    salary: 0.6
  };
  currentTeamRoster.push(rookie);
  print(`Drafted ${rookie.name}, OVR ${rookie.ovr}`);
  logNews(`Draft: ${rookie.name} joins the team`);
}

function viewStats() {
  print("Season Stats:");
  for (let player in seasonStats) {
    let s = seasonStats[player];
    print(`${player} - Hits: ${s.hits}, HR: ${s.hr}`);
  }
}

function viewNews() {
  if (newsLog.length === 0) {
    print("No news yet.");
  } else {
    print("Recent News:");
    newsLog.slice(-10).reverse().forEach(n => print(n));
  }
}

function logNews(headline) {
  const timestamp = new Date().toLocaleTimeString();
  newsLog.push(`[${timestamp}] ${headline}`);
}

window.handleCommand = handleCommand;
