
let userTeam = "Astros";
let currentTeamRoster = window.initialRoster = [
  { name: "Jose Altuve", position: "2B", ovr: 91, salary: 29 },
  { name: "Yordan Alvarez", position: "LF", ovr: 93, salary: 19 },
  { name: "Framber Valdez", position: "SP", ovr: 88, salary: 17 }
];
let seasonStats = {};
let newsLog = [];

function handleCommand(cmd) {
  hideAllPages();
  document.getElementById("main-menu").classList.add("hidden");

  if (cmd === "roster") {
    document.getElementById("roster-page").style.display = "block";
    let out = currentTeamRoster.map(p => `${p.name} - ${p.position} - OVR: ${p.ovr} - $${p.salary}M - Morale: ${p.morale} ${p.role ? "- " + p.role : ""}`).join("<br>");
    document.getElementById("roster-output").innerHTML = out;
  } else if (cmd === "sim") {
    document.getElementById("sim-page").style.display = "block";
    let result = Math.random() < 0.5 ? "Win" : "Loss";
    logNews(`Game result: ${result}`);
    document.getElementById("sim-output").innerText = `You ${result} today's game.`;
  } else if (cmd === "trade") {
    document.getElementById("trade-page").style.display = "block";
    let removed = currentTeamRoster.pop();
    let newPlayer = { name: "Juan Rivera", position: "CF", ovr: 80, salary: 2.5 };
    currentTeamRoster.push(newPlayer);
    logNews(`Trade: ${removed.name} → ${newPlayer.name}`);
    document.getElementById("trade-output").innerText = `Traded ${removed.name} for ${newPlayer.name}`;
  } else if (cmd === "draft") {
    document.getElementById("draft-page").style.display = "block";
    let rookie = {
      name: "Mike Johnson",
      position: "SP",
      ovr: Math.floor(70 + Math.random() * 20),
      salary: 0.6
    };
    currentTeamRoster.push(rookie);
    logNews(`Drafted: ${rookie.name}`);
    document.getElementById("draft-output").innerText = `Drafted ${rookie.name}, OVR ${rookie.ovr}`;
  } else if (cmd === "stats") {
    document.getElementById("stats-page").style.display = "block";
    let stats = "";
    for (let p of currentTeamRoster) {
      if (!seasonStats[p.name]) seasonStats[p.name] = { hits: 0, hr: 0 };
      seasonStats[p.name].hits += Math.floor(Math.random() * 4);
      seasonStats[p.name].hr += Math.random() < 0.1 ? 1 : 0;
      let s = seasonStats[p.name];
      stats += `${p.name} - Hits: ${s.hits}, HR: ${s.hr}<br>`;
    }
    document.getElementById("stats-output").innerHTML = stats;
  } else if (cmd === "news") {
    document.getElementById("news-page").style.display = "block";
    let news = newsLog.slice(-10).reverse().join("<br>") || "No news yet.";
    document.getElementById("news-output").innerHTML = news;
  }
}

function goBack() {
  hideAllPages();
  document.getElementById("main-menu").classList.remove("hidden");
}

function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  pages.forEach(p => p.style.display = "none");
}

function logNews(msg) {
  let timestamp = new Date().toLocaleTimeString();
  newsLog.push(`[${timestamp}] ${msg}`);
}


currentTeamRoster = currentTeamRoster.map(p => ({
  ...p,
  years: 3,
  agent: ['Cooperative', 'Greedy', 'Unpredictable'][Math.floor(Math.random() * 3)]
}));



let freeAgents = [
  { name: "Carlos Gomez", position: "OF", ovr: 75, salary: 0, years: 0, agent: "Greedy" },
  { name: "Jake Marisnick", position: "CF", ovr: 72, salary: 0, years: 0, agent: "Cooperative" }
];

function handleCommand(cmd) {
  hideAllPages();
  document.getElementById("main-menu").classList.add("hidden");

  if (cmd === "contract office") {
    document.getElementById("contract-office-page").style.display = "block";

    // Free Agents
    let faOut = freeAgents.map(p =>
      `${p.name} (${p.position}) - OVR: ${p.ovr} - Agent: ${p.agent} <button onclick='signFreeAgent("${p.name}")'>Sign</button>`
    ).join("<br>");
    document.getElementById("free-agents-output").innerHTML = faOut || "No free agents.";

    // Arbitration (players with 1-5 years and expired)
    let arbOut = currentTeamRoster.filter(p => p.years === 0 && !p.arbitrated).map(p =>
      `${p.name} eligible for arbitration (Agent: ${p.agent}) <button onclick='offerArbitration("${p.name}")'>Offer Arbitration</button>`
    ).join("<br>");
    document.getElementById("arbitration-output").innerHTML = arbOut || "No arbitration cases.";

    // Contract Offer Player List
    let select = document.getElementById("player-select");
    select.innerHTML = "";
    currentTeamRoster.forEach(p => {
      let opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = `${p.name} (${p.agent})`;
      select.appendChild(opt);
    });
  }
}

function signFreeAgent(name) {
  let player = freeAgents.find(p => p.name === name);
  if (player) {
    player.salary = 1 + Math.floor(Math.random() * 5);
    player.years = 2 + Math.floor(Math.random() * 3);
    currentTeamRoster.push(player);
    freeAgents = freeAgents.filter(p => p.name !== name);
    alert(`${player.name} signed!`);
    handleCommand("contract office");
  }
}

function offerArbitration(name) {
  let player = currentTeamRoster.find(p => p.name === name);
  if (player && !player.arbitrated) {
    let offer = 3 + Math.random() * 3;
    let accept = Math.random() < (player.agent === "Cooperative" ? 0.9 : player.agent === "Greedy" ? 0.6 : 0.7);
    if (accept) {
      player.salary = parseFloat(offer.toFixed(1));
      player.years = 1;
      alert(`${player.name} accepted arbitration at $${player.salary}M.`);
    } else {
      alert(`${player.name} rejected arbitration!`);
    }
    player.arbitrated = true;
    handleCommand("contract office");
  }
}

function submitContractOffer() {
  let name = document.getElementById("player-select").value;
  let salary = parseFloat(document.getElementById("offer-salary").value);
  let years = parseInt(document.getElementById("offer-years").value);
  let player = currentTeamRoster.find(p => p.name === name);
  if (!player || isNaN(salary) || isNaN(years)) {
    document.getElementById("contract-feedback").innerText = "Invalid input.";
    return;
  }
  let minAccept = player.ovr / 10;
  let accepted = salary >= minAccept && Math.random() < (player.agent === "Greedy" ? 0.5 : 0.85);
  if (accepted) {
    player.salary = salary;
    player.years = years;
    document.getElementById("contract-feedback").innerText = `${player.name} accepted $${salary}M for ${years} years.`;
  } else {
    document.getElementById("contract-feedback").innerText = `${player.name} rejected the offer.`;
  }
}


let currentWeek = 1;
const tradeDeadlineWeek = 16;

function advanceWeek() {
  if (currentWeek < 20) currentWeek++;
  let msg = `Week ${currentWeek} of 20`;
  if (currentWeek === tradeDeadlineWeek) {
    msg += " – Trade deadline reached!";
  } else if (currentWeek > tradeDeadlineWeek) {
    msg += " – Trades disabled.";
  }
  alert(msg);
  logNews(msg);
  generateTradeRumors();
  generateBlockbusterTrade();
  mediaEvent();
  checkTradeDemandsAndFanReaction();
  updateTradeButton();
}

function updateTradeButton() {
  let btn = document.getElementById("trade-btn");
  if (!btn) return;
  if (currentWeek >= tradeDeadlineWeek) {
    btn.disabled = true;
    btn.textContent = "Trade Deadline Passed";
  } else {
    btn.disabled = false;
    btn.textContent = "Trade";
  }
}

document.addEventListener('DOMContentLoaded', updateTradeButton);
function generateTradeRumors() {
  let candidates = currentTeamRoster.filter(p => p.years <= 1);
  if (candidates.length === 0) return;
  let player = candidates[Math.floor(Math.random() * candidates.length)];
  let rumorTypes = [
    `Rumors swirl around ${player.name}'s future with the ${userTeam}.`,
    `${player.name} is reportedly unhappy and may request a trade.`,
    `${player.name} seen talking with rival scouts at recent game.`
  ];
  logNews(rumorTypes[Math.floor(Math.random() * rumorTypes.length)]);
}

function generateBlockbusterTrade() {
  let stars = currentTeamRoster.filter(p => p.ovr > 88 && p.years <= 1);
  if (stars.length === 0 || Math.random() > 0.3) return;
  let traded = stars[Math.floor(Math.random() * stars.length)];
  logNews(`🔥 BLOCKBUSTER: ${traded.name} traded to the Dodgers in a stunning move!`);
}


currentTeamRoster = currentTeamRoster.map(p => ({
  ...p,
  morale: 60 + Math.floor(Math.random() * 40) // morale between 60-100
}));


function mediaEvent() {
  let candidates = currentTeamRoster.filter(p => p.years === 1 && p.morale < 70);
  if (candidates.length === 0 || Math.random() > 0.4) return;
  let player = candidates[Math.floor(Math.random() * candidates.length)];
  let q = `Media asks about ${player.name}'s future with the team.`;
  let choice = prompt(`${q}\nChoose: 1) Support Player  2) Deny Rumors  3) Deflect`);

  if (choice === "1") {
    player.morale += 10;
    logNews(`GM publicly supports ${player.name}. Morale boosted.`);
  } else if (choice === "2") {
    player.morale += 5;
    logNews(`GM denies trade rumors about ${player.name}.`);
  } else if (choice === "3") {
    player.morale -= 5;
    logNews(`GM deflects media question on ${player.name}. Morale drops.`);
  }
  player.morale = Math.max(0, Math.min(100, player.morale));
}


currentTeamRoster.forEach(p => {
  if (!p.role && p.ovr > 88) p.role = "Captain";
  else if (!p.role && p.ovr > 82) p.role = "Veteran";
});


function checkTradeDemandsAndFanReaction() {
  // Trade Demands
  let lowMorale = currentTeamRoster.filter(p => p.morale < 40 && !p.tradeRequested);
  lowMorale.forEach(p => {
    p.tradeRequested = true;
    logNews(`🚨 ${p.name} has requested a trade due to low morale.`);
  });

  // Fan Reaction
  if (Math.random() < 0.2) {
    let negatives = ["Fans boo GM after losing streak.", "Fan forums explode after failed press conference."];
    let positives = ["Fans praise front office loyalty.", "Stadium erupts after key win!"];
    let reaction = Math.random() < 0.5 ? negatives : positives;
    logNews(`📣 ${reaction[Math.floor(Math.random() * reaction.length)]}`);
  }

  // Leadership Check
  let leaders = currentTeamRoster.filter(p => p.role === "Captain");
  if (leaders.length === 0) {
    currentTeamRoster.forEach(p => p.morale -= 3);
    logNews("Team morale dips with no captain in clubhouse.");
  }
}
