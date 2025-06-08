let output = document.getElementById("output");
let input = document.getElementById("command");

let teams = {};
let userTeam = "Astros";
let currentTeamRoster = [];
let seasonStats = {};
let injuries = {};
let coaches = {
  manager: "Dusty Baker",
  hittingCoach: "Alex Cintron",
  pitchingCoach: "Brent Strom"
};
let archives = [];
let currentSeason = 1;

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const cmd = input.value.trim().toLowerCase();
    handleCommand(cmd);
    input.value = "";
  }
});

fetch('rosters/mlb_2024_rosters.json')
  .then(res => res.json())
  .then(data => {
    teams = data;
    currentTeamRoster = data[userTeam];
    initializeStats(currentTeamRoster);
    print(`Loaded ${userTeam} roster. Type 'menu' to begin.`);
  });

function handleCommand(cmd) {
  if (cmd === "news") {
    viewNews();
    return;
  }
  if (cmd === "menu") {
    print("Commands: TEAM, ROSTER, SIM, TRADE, DRAFT, SWITCH TEAM, DEVELOP, FINANCIALS, STATS, PLAYOFFS, RETIRE, INJURIES, COACHES, FIRE COACH, SAVE, LOAD, ARCHIVES, CAREER STATS player_name, END SEASON, QUIT");
  } else if (cmd === "team") {
    print(`You are the GM of the ${userTeam}.`);
  } else if (cmd === "roster") {
    printRoster(currentTeamRoster);
  } else if (cmd === "sim") {
    simulateGame();
  } else if (cmd === "trade") {
    tradePlayer();
  } else if (cmd === "draft") {
    draftPlayer();
  } else if (cmd === "switch team") {
    switchTeam();
  } else if (cmd === "develop") {
    developPlayers();
  } else if (cmd === "financials") {
    viewFinancials();
  } else if (cmd === "stats") {
    viewStats();
  } else if (cmd === "playoffs") {
    simulatePlayoffs();
  } else if (cmd === "retire") {
    retirePlayers();
  } else if (cmd === "injuries") {
    checkInjuries();
  } else if (cmd === "coaches") {
    viewCoaches();
  } else if (cmd === "fire coach") {
    fireCoach();
  } else if (cmd === "save") {
    saveGame();
  } else if (cmd === "load") {
    loadGame();
  } else if (cmd === "archives") {
    viewArchives();
  } else if (cmd.startsWith("career stats")) {
    let name = cmd.replace("career stats", "").trim();
    showCareerStats(name);
  } else if (cmd === "end season") {
    archiveSeason();
  } else {
    print("Unknown command. Try 'menu'.");
  }
}

function initializeStats(players) {
  players.forEach(p => {
    seasonStats[p.name] = { hits: 0, hr: 0, wins: 0, so: 0 };
  });
}

function printRoster(players) {
  print("Team Roster:");
  players.forEach(p => {
    let status = injuries[p.name] ? " (Injured)" : "";
    print(`${p.name} - ${p.position} - OVR: ${p.ovr} - $${p.salary}M${status}`);
  });
}

function simulateGame() {
  let win = Math.random() < 0.5;
  print(win ? "You won today's game!" : "You lost today's game.");
  currentTeamRoster.forEach(p => {
    if (!injuries[p.name]) {
      seasonStats[p.name].hits += Math.floor(Math.random() * 3);
      seasonStats[p.name].hr += Math.random() < 0.1 ? 1 : 0;
      if (p.position === "SP") {
        seasonStats[p.name].wins += win ? 1 : 0;
        seasonStats[p.name].so += Math.floor(Math.random() * 6);
      }
    }
    if (Math.random() < 0.05) { injuries[p.name] = true; logNews(`Injury: ${p.name} was injured in the game`); }
  });
}

function tradePlayer() {
  if (currentTeamRoster.length > 0) {
    let removed = currentTeamRoster.pop();
    let newPlayer = { name: "Juan Rivera", position: "CF", ovr: 80, salary: 2.5 };
    currentTeamRoster.push(newPlayer);
    seasonStats[newPlayer.name] = { hits: 0, hr: 0, wins: 0, so: 0 };
    print(`You traded ${removed.name} for ${newPlayer.name}`);
    logNews(`Trade: ${removed.name} traded for ${newPlayer.name}`);
  }
}

function draftPlayer() {
  let draftPick = {
    name: "Mike Johnson",
    position: "SP",
    ovr: Math.floor(70 + Math.random() * 20),
    salary: 0.7
  };
  currentTeamRoster.push(draftPick);
  seasonStats[draftPick.name] = { hits: 0, hr: 0, wins: 0, so: 0 };
  print(`You drafted ${draftPick.name} (${draftPick.position}) with OVR ${draftPick.ovr}`);
  logNews(`Draft: ${draftPick.name} added to roster`);
}

function switchTeam() {
  let teamNames = Object.keys(teams);
  let index = teamNames.indexOf(userTeam);
  userTeam = teamNames[(index + 1) % teamNames.length];
  currentTeamRoster = teams[userTeam];
  print(`Switched to ${userTeam}`);
}

function developPlayers() {
  currentTeamRoster.forEach(p => {
    let change = Math.floor(Math.random() * 5) - 2;
    p.ovr = Math.max(40, Math.min(99, p.ovr + change));
  });
  print("Player development cycle complete.");
}

function viewFinancials() {
  let totalSalary = currentTeamRoster.reduce((sum, p) => sum + (p.salary || 0), 0);
  print(`Total Team Payroll: $${totalSalary.toFixed(1)}M`);
}

function viewStats() {
  print("Season Stats:");
  for (let player of currentTeamRoster) {
    let s = seasonStats[player.name];
    print(`${player.name} - H:${s.hits} HR:${s.hr} W:${s.wins} SO:${s.so}`);
  }
}

function simulatePlayoffs() {
  let teamsIn = Object.keys(teams).sort(() => 0.5 - Math.random()).slice(0, 4);
  print("Playoff Simulation:");
  teamsIn.forEach((team, i) => {
    print(`${i + 1}. ${team}`);
  });
  print(`${teamsIn[0]} defeats ${teamsIn[1]} in the final!`);
}

function retirePlayers() {
  currentTeamRoster = currentTeamRoster.filter(p => {
    let retire = Math.random() < 0.1;
    if (retire) { print(`${p.name} has retired.`); logNews(`Retirement: ${p.name} has left the game`); }
    return !retire;
  });
}

function checkInjuries() {
  let injured = Object.keys(injuries);
  if (injured.length === 0) {
    print("No current injuries.");
  } else {
    injured.forEach(name => print(`${name} is injured.`));
  }
}

function viewCoaches() {
  print(`Manager: ${coaches.manager}`);
  print(`Hitting Coach: ${coaches.hittingCoach}`);
  print(`Pitching Coach: ${coaches.pitchingCoach}`);
}

function fireCoach() {
  let positions = Object.keys(coaches);
  let pos = positions[Math.floor(Math.random() * positions.length)];
  let old = coaches[pos];
  let newCoach = "Coach " + Math.floor(Math.random() * 100);
  coaches[pos] = newCoach;
  print(`You fired ${old} and hired ${newCoach} as ${pos}.`);
}

function archiveSeason() {
  archives.push({ season: currentSeason++, stats: JSON.parse(JSON.stringify(seasonStats)) });
  print("Season archived.");
  seasonStats = {};
  initializeStats(currentTeamRoster);
}

function viewArchives() {
  if (archives.length === 0) {
    print("No archived seasons.");
    return;
  }
  print("Archived Seasons:");
  archives.forEach(a => print(`Season ${a.season}`));
}

function showCareerStats(playerName) {
  let career = { hits: 0, hr: 0, wins: 0, so: 0 };
  archives.forEach(season => {
    if (season.stats[playerName]) {
      career.hits += season.stats[playerName].hits;
      career.hr += season.stats[playerName].hr;
      career.wins += season.stats[playerName].wins;
      career.so += season.stats[playerName].so;
    }
  });
  print(`${playerName} Career Stats - H:${career.hits} HR:${career.hr} W:${career.wins} SO:${career.so}`);
}

function saveGame() {
  const state = {
    userTeam,
    roster: currentTeamRoster,
    stats: seasonStats,
    injuries,
    coaches,
    archives,
    currentSeason
  };
  localStorage.setItem("gmSimSave", JSON.stringify(state));
  print("Game saved.");
}

function loadGame() {
  const state = JSON.parse(localStorage.getItem("gmSimSave"));
  if (state) {
    userTeam = state.userTeam;
    currentTeamRoster = state.roster;
    seasonStats = state.stats;
    injuries = state.injuries;
    coaches = state.coaches;
    archives = state.archives;
    currentSeason = state.currentSeason;
    print(`Game loaded for ${userTeam}.`);
  } else {
    print("No save data found.");
  }
}

function print(text) {
  output.innerHTML += `<p>> ${text}</p>`;
}


let newsLog = [];

function logNews(headline) {
  const timestamp = new Date().toLocaleString();
  newsLog.unshift(`[${timestamp}] ${headline}`);
  if (newsLog.length > 20) newsLog.pop(); // Keep recent 20 headlines
}

function viewNews() {
  if (newsLog.length === 0) {
    print("No news headlines yet.");
  } else {
    print("Latest News:");
    newsLog.slice(0, 10).forEach(n => print(n));
  }
}
