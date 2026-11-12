/* Schrijven A2 ExamenSimulatie: vanilla JS, geen dependencies. */

const {
  size: EXAM_SIZE,
  durationSeconds: DURATION_SECONDS,
  composition: COMPOSITION,
  maxPoints: MAX_POINTS,
  passPercent: PASS_PERCENT,
} = EXAM_BLUEPRINT;

const PASS_POINTS = Math.round((MAX_POINTS * PASS_PERCENT) / 100);
const OPBOUW = `1 formulier (max ${RUBRIEK.formulier.max} punten) + ${EXAM_SIZE - 1} teksten (max ${RUBRIEK.tekst.max} punten elk)`;
const HISTORY_KEY = "schrijven-a2-geschiedenis";

const $ = (id) => document.getElementById(id);

const screens = {
  start: $("screen-start"),
  exam: $("screen-exam"),
  check: $("screen-check"),
  result: $("screen-result"),
};

const els = {
  timer: $("timer"),
  answeredCount: $("answered-count"),
  progressFill: $("progress-fill"),
  taskType: $("task-type"),
  taskCount: $("task-count"),
  taskTitle: $("task-title"),
  taskSituation: $("task-situation"),
  taskInstruction: $("task-instruction"),
  taskPoints: $("task-points"),
  taskInput: $("task-input"),
  taskMeter: $("task-meter"),
  prev: $("btn-prev"),
  next: $("btn-next"),
  counter: $("task-counter"),
  navigator: $("navigator"),
  checkList: $("check-list"),
  checkTotal: $("check-total"),
  verdict: $("verdict"),
  score: $("score"),
  resultLine: $("result-line"),
  resultStats: $("result-stats"),
  criterionStats: $("criterion-stats"),
  taskScores: $("task-scores"),
  jsonPreview: $("json-preview"),
};

let examen = [];
let vasteModus = false;
let papierModus = false;
let antwoorden = {};
let eisen = {};
let scores = {};
let notities = {};
let scoreBron = "zelf";
let current = 0;
let remaining = DURATION_SECONDS;
let endAt = 0;
let timerId = null;
let finished = false;
let tijdGebruikt = 0;
let geschiedenisBewaard = false;

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

/* ── Examen samenstellen ──────────────────────────────────────────── */

function pickExam() {
  if (vasteModus) return VASTE_EXAMENS[0].taken.slice();
  return COMPOSITION.map((type) => {
    const pool = TAKEN.filter((taak) => taak.type === type);
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

function printLines(aantal) {
  return `<div class="print-lines">${"<span></span>".repeat(aantal)}</div>`;
}

function printInvul(taak) {
  if (taak.type === "formulier") {
    return `<div class="print-form">${taak.velden
      .map((veld) => {
        if (veld.soort === "keuze") {
          return `<div class="print-field"><span>${esc(veld.label)}</span><span class="print-options">${veld.opties
            .map((optie) => `[ ] ${esc(optie)}`)
            .join("")}</span></div>`;
        }
        if (veld.soort === "lang") {
          return `<div class="print-field"><span>${esc(veld.label)}</span></div>${printLines(3)}`;
        }
        return `<div class="print-field"><span>${esc(veld.label)}</span><span class="print-line"></span></div>`;
      })
      .join("")}</div>`;
  }
  const kop =
    taak.type === "correspondentie"
      ? `<p><b>Aan:</b> ${esc(taak.email.aan)}</p><p><b>Onderwerp:</b> ${esc(taak.email.onderwerp)}</p><p class="print-aanhef">${esc(taak.email.aanhef)}</p>`
      : taak.type === "bericht"
        ? `<p class="print-aanhef">${esc(taak.aanhef)}</p>`
        : `<p class="print-hint">Optionele eerste zin: <b>${esc(taak.start)}</b></p>`;
  const slot =
    taak.type === "correspondentie"
      ? `<p class="print-afsluiting">${esc(taak.email.afsluiting)} [uw naam]</p>`
      : taak.type === "bericht"
        ? `<p class="print-afsluiting">${esc(taak.afsluiting)} [uw naam]</p>`
        : "";
  return `${kop}${printLines(14)}${slot}`;
}

function bouwPrintBlad(taken) {
  $("print-sheet").innerHTML = `
    <div class="print-meta">
      <p><b>Naam:</b> ______________________________</p>
      <p><b>Datum:</b> ____________ &nbsp; <b>Start:</b> ______ &nbsp; <b>Eind:</b> ______</p>
      <p class="print-uitleg">Schrijven A2 · ${taken.length} opdrachten · 40 minuten. Schrijf met pen. Geen woordenboek, geen telefoon.</p>
    </div>
    ${taken
      .map(
        (taak, index) => `
      <article class="print-task">
        <p class="print-kop">Opdracht ${index + 1} van ${taken.length}</p>
        <h1>${esc(taak.titel)}</h1>
        <p>${esc(taak.situatie)}</p>
        <p><b>${esc(taak.opdracht)}</b></p>
        ${(taak.punten || []).length ? `<ul>${taak.punten.map((punt) => `<li>${esc(punt)}</li>`).join("")}</ul>` : ""}
        ${printInvul(taak)}
      </article>`
      )
      .join("")}`;
}

function startPapier() {
  vasteModus = false;
  const gekozen = pickExam();
  bouwPrintBlad(gekozen);
  window.print();
  startExam(false, gekozen, true);
}

function startExam(vast = false, gekozen = null, papier = false) {
  vasteModus = vast;
  papierModus = papier;
  clearInterval(timerId);
  examen = gekozen || pickExam();
  antwoorden = {};
  eisen = {};
  scores = {};
  notities = {};
  scoreBron = "zelf";
  examen.forEach((taak) => {
    antwoorden[taak.id] = taak.type === "formulier" ? {} : "";
    eisen[taak.id] = eisenVoor(taak).map(() => false);
    scores[taak.id] = {};
  });
  current = 0;
  remaining = DURATION_SECONDS;
  finished = false;
  geschiedenisBewaard = false;
  els.timer.classList.remove("danger");
  els.timer.textContent = formatTime(remaining);
  endAt = Date.now() + DURATION_SECONDS * 1000;
  $("paper-banner").classList.toggle("hidden", !papierModus);

  showScreen("exam");
  renderTask();
  renderNavigator();
  updateProgress();
  timerId = setInterval(tick, 250);
}

function tick() {
  remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  els.timer.textContent = formatTime(remaining);
  els.timer.classList.toggle("danger", remaining <= 300);
  if (remaining <= 0) {
    clearInterval(timerId);
    if (papierModus) {
      window.alert("De tijd is om. Voer nu je papieren antwoorden in en klik op Inleveren.");
      return;
    }
    finish(true);
  }
}

/* ── Antwoorden: lezen en meten ───────────────────────────────────── */

function tekstVan(taak) {
  const antwoord = antwoorden[taak.id];
  if (taak.type !== "formulier") return String(antwoord || "");
  return taak.velden
    .map((veld) => (antwoord[veld.label] ? `${veld.label}: ${antwoord[veld.label]}` : ""))
    .filter(Boolean)
    .join("\n");
}

/* Dezelfde tekst, maar met echte regeleinden. JSON.stringify vlakt ze af
   tot \n, en juist de groet, de afsluiting en de alinea's zijn examenstof. */
function tekstenMetRegeleinden() {
  return examen
    .map((taak) => `### ${taak.id}\n\n\`\`\`\n${tekstVan(taak)}\n\`\`\``)
    .join("\n\n");
}

function isKlaar(taak) {
  if (taak.type === "formulier") {
    return taak.velden.every((veld) => String(antwoorden[taak.id][veld.label] || "").trim());
  }
  return String(antwoorden[taak.id] || "").trim().length > 0;
}

/* Groet en afsluiting horen niet bij de body. Zonder deze knip telt
   "Noëlle" als derde zin en lijken woorden en zinnen te hoog. */
function tekstZonderGroet(tekst) {
  const regels = tekst.split(/\r?\n/);
  const groet = /^\s*(beste|geachte|hallo|hoi|lieve|dag)\b/i;
  const afsluiting =
    /^\s*(met vriendelijke|groet|groetjes|hartelijke|tot ziens|tot volgende week|tot morgen|doei|liefs|alvast bedankt)/i;
  const eerste = regels.findIndex((regel) => groet.test(regel));
  if (eerste !== -1) {
    // Groet en eerste zin op één regel? Alleen de groet wegknippen.
    if (/[.!?]/.test(regels[eerste])) regels[eerste] = regels[eerste].replace(groet, "");
    else regels.splice(0, eerste + 1);
  }
  const laatste = regels.findIndex((regel) => afsluiting.test(regel));
  if (laatste !== -1) regels.splice(laatste);
  return regels.join("\n");
}

/* Alleen letters, zodat "Bel me als er iets is" ook telt zonder "!". */
function kaal(tekst) {
  return tekst.toLowerCase().replace(/[^\p{L}]/gu, "");
}

function metingen(taak) {
  const tekst = tekstVan(taak);
  if (taak.type === "formulier") {
    const zinnen = tekst.split(/[.!?]+/).filter((zin) => zin.trim().length > 1).length;
    return {
      woorden: tekst.split(/\s+/).filter(Boolean).length,
      zinnen,
      tekens: tekst.trim().length,
      hele_zinnen: zinnen > 0,
      ingevulde_velden: taak.velden.filter((veld) =>
        String(antwoorden[taak.id][veld.label] || "").trim()
      ).length,
      aantal_velden: taak.velden.length,
    };
  }
  // Groet en afsluiting horen niet bij de body: niet bij de zinnen,
  // niet bij de woorden en niet bij de tekens.
  const body = tekstZonderGroet(tekst);
  const zinnen = body.split(/[.!?]+|\n{2,}/).filter((zin) => zin.trim().length > 1).length;
  return {
    woorden: body.split(/\s+/).filter(Boolean).length,
    zinnen,
    tekens: body.trim().length,
    hele_zinnen: zinnen > 0,
    heeft_aanhef: /^\s*(beste|geachte|hallo|hoi|lieve|dag)\b/i.test(tekst),
    heeft_afsluiting:
      Boolean(taak.afsluiting && kaal(tekst).includes(kaal(taak.afsluiting))) ||
      /(groet|groetjes|met vriendelijke|hartelijke|tot ziens|tot volgende week|tot morgen|doei|liefs|alvast bedankt)/i.test(
        tekst
      ),
  };
}

/* ── Schermen ─────────────────────────────────────────────────────── */

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => {
    element.classList.toggle("hidden", key !== name);
  });
  window.scrollTo(0, 0);
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/* ── Opdracht renderen ────────────────────────────────────────────── */

function renderTask() {
  const taak = examen[current];
  const type = TYPES[taak.type];
  const antwoord = antwoorden[taak.id];

  els.taskType.textContent = type.naam;
  els.taskCount.textContent = `Opdracht ${current + 1} van ${examen.length}`;
  els.taskTitle.textContent = taak.titel;
  els.taskSituation.textContent = taak.situatie;
  els.taskInstruction.textContent = taak.opdracht;
  els.taskPoints.innerHTML = (taak.punten || [])
    .map((punt) => `<li>${esc(punt)}</li>`)
    .join("");

  if (taak.type === "formulier") {
    els.taskInput.innerHTML = `<div class="form-grid">${taak.velden
      .map((veld, index) => {
        const waarde = antwoord[veld.label] || "";
        const id = `veld-${index}`;
        if (veld.soort === "keuze") {
          return `
            <div class="field wide">
              <label for="${id}">${esc(veld.label)}</label>
              <select id="${id}" data-veld="${esc(veld.label)}">
                <option value="">Maak een keuze</option>
                ${veld.opties
                  .map((optie) => `<option value="${esc(optie)}"${waarde === optie ? " selected" : ""}>${esc(optie)}</option>`)
                  .join("")}
              </select>
            </div>`;
        }
        if (veld.soort === "lang") {
          return `
            <div class="field wide">
              <label for="${id}">${esc(veld.label)}</label>
              <textarea id="${id}" rows="2" data-veld="${esc(veld.label)}">${esc(waarde)}</textarea>
            </div>`;
        }
        return `
          <div class="field">
            <label for="${id}">${esc(veld.label)}</label>
            <input id="${id}" type="text" data-veld="${esc(veld.label)}"
              value="${esc(waarde)}" ${veld.hint ? `placeholder="${esc(veld.hint)}"` : ""}>
          </div>`;
      })
      .join("")}</div>`;
  } else {
    const hint =
      taak.type === "correspondentie"
        ? `Begin met: <strong>${esc(taak.email.aanhef)}</strong>. Eindig met: <strong>${esc(taak.email.afsluiting)} [uw naam]</strong>. Geen inleiding: meteen het eerste punt.`
        : taak.type === "bericht"
          ? `Begin met: <strong>${esc(taak.aanhef)}</strong>. Eindig met: <strong>${esc(taak.afsluiting)} [uw naam]</strong>. Geen inleiding: meteen het eerste punt.`
          : `Optionele eerste zin: <strong>${esc(taak.start)}</strong>`;
    els.taskInput.innerHTML = `
      ${taak.type === "correspondentie"
        ? `<div class="mail-head">
             <span><b>Aan:</b> ${esc(taak.email.aan)}</span>
             <span><b>Onderwerp:</b> ${esc(taak.email.onderwerp)}</span>
           </div>`
        : ""}
      <p class="write-hint">${hint}</p>
      <textarea id="answer-text" class="write-box" rows="10"
        aria-label="Uw antwoord op deze opdracht"></textarea>`;
    $("answer-text").value = antwoord;
  }

  els.prev.disabled = current === 0;
  els.next.textContent = current === examen.length - 1 ? "Inleveren" : "Volgende →";
  updateMeter();
}

function updateMeter() {
  const taak = examen[current];
  if (papierModus) {
    els.taskMeter.textContent = "Papier · schrijf op het blad";
    return;
  }
  const m = metingen(taak);
  if (taak.type === "formulier") {
    els.taskMeter.textContent = `${m.ingevulde_velden} van ${m.aantal_velden} velden ingevuld · ${m.woorden} woorden`;
  } else {
    els.taskMeter.textContent = `${m.woorden} woorden · ${m.zinnen} zinnen`;
  }
}

function renderNavigator() {
  els.navigator.innerHTML = examen
    .map((taak, index) => {
      const classes = ["nav-dot"];
      if (isKlaar(taak)) classes.push("answered");
      if (index === current) classes.push("current");
      return `<button class="${classes.join(" ")}" type="button" data-q="${index}"
        aria-label="Opdracht ${index + 1}">${index + 1}</button>`;
    })
    .join("");
}

function updateProgress() {
  const klaar = examen.filter(isKlaar).length;
  els.answeredCount.textContent = String(klaar);
  els.progressFill.style.width = `${(klaar / examen.length) * 100}%`;
}

function goTo(index) {
  if (index < 0 || index >= examen.length) return;
  current = index;
  renderTask();
  renderNavigator();
  document.querySelector(".exam-shell").scrollIntoView({ block: "start" });
}

/* ── Invoer ───────────────────────────────────────────────────────── */

els.taskInput.addEventListener("input", (event) => {
  const taak = examen[current];
  const veld = event.target.closest("[data-veld]");
  if (veld) {
    antwoorden[taak.id][veld.dataset.veld] = veld.value;
  } else if (event.target.id === "answer-text") {
    antwoorden[taak.id] = event.target.value;
  }
  updateMeter();
  updateProgress();
  renderNavigator();
});

els.navigator.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-q]");
  if (button) goTo(Number(button.dataset.q));
});

els.prev.addEventListener("click", () => goTo(current - 1));
els.next.addEventListener("click", () => {
  if (current === examen.length - 1) submitWithConfirm();
  else goTo(current + 1);
});

function submitWithConfirm() {
  const open = examen.filter((taak) => !isKlaar(taak)).length;
  if (open > 0 && !window.confirm(`${open} opdracht(en) zijn nog niet klaar. Wil je toch inleveren?`)) {
    return;
  }
  finish(false);
}

function finish(auto = false) {
  if (finished) return;
  finished = true;
  clearInterval(timerId);
  tijdGebruikt = DURATION_SECONDS - remaining;

  renderCheck();
  showScreen("check");
  if (auto) window.alert("De tijd is om. Je werk is ingeleverd. Je kunt nu nakijken.");
}

/* ── Nakijken: eisen + rubric ─────────────────────────────────────── */

function renderCheck() {
  els.checkList.innerHTML = examen
    .map((taak, index) => {
      const type = TYPES[taak.type];
      const eisenLijst = eisenVoor(taak);
      const profiel = profielVoor(taak);
      const taakScores = scores[taak.id];
      const adequacyNul = taakScores.adequaatheid === 0;
      const antwoordHtml =
        taak.type === "formulier"
          ? `<dl class="answer-dl">${taak.velden
              .map(
                (veld) =>
                  `<dt>${esc(veld.label)}</dt><dd>${
                    esc(antwoorden[taak.id][veld.label] || "") || "-"
                  }</dd>`
              )
              .join("")}</dl>`
          : `<pre class="answer-text">${esc(antwoorden[taak.id] || "") || "-"}</pre>`;

      return `
        <article class="check-card" data-task="${taak.id}">
          <div class="review-top">
            <span class="review-num">Opdracht ${index + 1}</span>
            <span class="theme-chip">${esc(type.naam)}</span>
            <span class="badge" data-points>${taakPunten(taak)} / ${profiel.max}</span>
          </div>
          <h3>${esc(taak.titel)}</h3>
          ${antwoordHtml}
          <h4>Eisen uit de opdracht</h4>
          <div class="check-items">
            ${eisenLijst
              .map(
                (eis, i) => `
              <label class="check-item">
                <input type="checkbox" data-eis="${i}"${eisen[taak.id][i] ? " checked" : ""}>
                <span>${esc(eis)}</span>
              </label>`
              )
              .join("")}
          </div>
          <h4>Beoordeling</h4>
          <div class="rubric">
            ${profiel.criteria
              .map((id) => {
                const criterium = CRITERIA[id];
                const gekozen = taakScores[id];
                const uit = id !== "adequaatheid" && adequacyNul;
                const uitleg =
                  gekozen == null
                    ? `Kies een score: 0 = onvoldoende, ${criterium.max} = goed.`
                    : scoresVoor(id, taak)[gekozen];
                return `
                <div class="rubric-row" data-crit="${id}">
                  <div class="rubric-head">
                    <label for="score-${taak.id}-${id}">${esc(criterium.naam)}</label>
                    <select id="score-${taak.id}-${id}" data-score${uit ? " disabled" : ""}>
                      <option value="">-</option>
                      ${Array.from({ length: criterium.max + 1 }, (_, n) => `<option value="${n}"${gekozen === n ? " selected" : ""}>${n}</option>`).join("")}
                    </select>
                  </div>
                  <p class="rubric-desc">${esc(uitleg)}</p>
                </div>`;
              })
              .join("")}
          </div>
          <details class="rubric-help">
            <summary>Wat betekenen de scores?</summary>
            ${profiel.criteria
              .map((id) => {
                const criterium = CRITERIA[id];
                return `<div class="rubric-help-row">
                  <strong>${esc(criterium.naam)} (0-${criterium.max})</strong>
                  ${criterium.specifiek ? `<p class="tiny">${esc(criterium.specifiek)}</p>` : ""}
                  ${Object.entries(scoresVoor(id, taak))
                    .map(([n, tekst]) => `<p><b>${n}</b> ${esc(tekst)}</p>`)
                    .join("")}
                  ${criterium.ijkpunten ? `<p class="tiny">${esc(criterium.ijkpunten)}</p>` : ""}
                </div>`;
              })
              .join("")}
          </details>
          <label class="note-label">Wat ging mis? (optioneel, in je eigen woorden)
            <textarea data-note rows="2">${esc(notities[taak.id] || "")}</textarea>
          </label>
        </article>`;
    })
    .join("");

  updateCheckTotal();
}

function taakPunten(taak) {
  return Object.values(scores[taak.id] || {}).reduce((som, n) => som + Number(n || 0), 0);
}

function updateCheckTotal() {
  const totaal = examen.reduce((som, taak) => som + taakPunten(taak), 0);
  els.checkTotal.textContent = `${totaal} / ${MAX_POINTS} punten`;
  examen.forEach((taak) => {
    const card = els.checkList.querySelector(`[data-task="${taak.id}"]`);
    if (card) card.querySelector("[data-points]").textContent = `${taakPunten(taak)} / ${maxPunten(taak)}`;
  });
}

els.checkList.addEventListener("change", (event) => {
  const card = event.target.closest("[data-task]");
  if (!card) return;
  const taak = examen.find((item) => item.id === card.dataset.task);
  if (!taak) return;

  if (event.target.matches("[data-eis]")) {
    eisen[taak.id][Number(event.target.dataset.eis)] = event.target.checked;
    return;
  }

  if (event.target.matches("[data-score]")) {
    scoreBron = scoreBron === "llm" ? "gemengd" : "zelf";
    const criterium = event.target.closest("[data-crit]").dataset.crit;
    const waarde = event.target.value;
    scores[taak.id][criterium] = waarde === "" ? null : Number(waarde);

    // Officiële regel: adequaatheid 0 => alle andere aspecten 0.
    if (criterium === "adequaatheid") {
      card.querySelectorAll(".rubric-row").forEach((row) => {
        if (row.dataset.crit === "adequaatheid") return;
        const select = row.querySelector("[data-score]");
        const critId = row.dataset.crit;
        if (waarde === "0") {
          select.value = "0";
          select.disabled = true;
          scores[taak.id][critId] = 0;
        } else {
          select.disabled = false;
          scores[taak.id][critId] = select.value === "" ? null : Number(select.value);
        }
      });
    }

    const row = event.target.closest(".rubric-row");
    const criteriumData = CRITERIA[criterium];
    const desc = row.querySelector(".rubric-desc");
    desc.textContent =
      waarde === ""
        ? `Kies een score: 0 = onvoldoende, ${criteriumData.max} = goed.`
        : criteriumData.scores[Number(waarde)];
    updateCheckTotal();
  }
});

els.checkList.addEventListener("input", (event) => {
  if (!event.target.matches("[data-note]")) return;
  const card = event.target.closest("[data-task]");
  notities[card.dataset.task] = event.target.value;
});

/* ── Resultaat ────────────────────────────────────────────────────── */

function criterionRows() {
  return Object.keys(CRITERIA)
    .map((id) => {
      const taken = examen.filter((taak) => profielVoor(taak).criteria.includes(id));
      const score = taken.reduce((som, taak) => som + Number(scores[taak.id][id] || 0), 0);
      const max = taken.length * CRITERIA[id].max;
      const baseline = taken.length * (A2_BASELINE[id] ?? CRITERIA[id].max);
      return {
        id,
        naam: CRITERIA[id].naam,
        max,
        baseline,
        score,
        verloren: Math.max(0, baseline - score),
        percent: max ? Math.round((score / max) * 100) : 100,
      };
    })
    .filter((row) => row.max > 0)
    .sort((a, b) => a.percent - b.percent);
}

function totaalPunten() {
  return examen.reduce((som, taak) => som + taakPunten(taak), 0);
}

function baselinePunten() {
  return examen.reduce(
    (som, taak) =>
      som + profielVoor(taak).criteria.reduce((deel, id) => deel + A2_BASELINE[id], 0),
    0
  );
}

function renderResult() {
  const score = totaalPunten();
  const percent = Math.round((score / MAX_POINTS) * 100);
  const gehaald = percent >= PASS_PERCENT;

  els.verdict.textContent = gehaald ? "VOLDOENDE (schatting)" : "NOG OEFENEN";
  els.verdict.className = `verdict ${gehaald ? "pass" : "fail"}`;
  els.score.textContent = `${score} / ${MAX_POINTS}`;
  els.score.className = `score ${gehaald ? "pass" : "fail"}`;
  const door = scoreBron === "llm" ? "Nagekeken door een LLM" : scoreBron === "gemengd" ? "LLM plus eigen aanpassingen" : "Je eigen schatting";
  els.resultLine.textContent = gehaald
    ? `${percent}% van de punten. ${door}; dat is boven de vuistregel van ${PASS_PERCENT}%, maar geen oordeel van DUO.`
    : `${percent}% van de punten. ${door}. De vuistregel is ${PASS_PERCENT}% (${PASS_POINTS} van ${MAX_POINTS}). Kijk hieronder waar de punten weggaan.`;

  els.resultStats.innerHTML = `
    <div class="stat"><span class="stat-label">Punten</span><strong>${score}/${MAX_POINTS}</strong></div>
    <div class="stat"><span class="stat-label">Percentage</span><strong>${percent}%</strong></div>
    <div class="stat"><span class="stat-label">Vuistregel</span><strong>${PASS_POINTS}/${MAX_POINTS}</strong></div>
    <div class="stat"><span class="stat-label">Tijd</span><strong>${formatTime(tijdGebruikt)}</strong></div>`;

  els.criterionStats.innerHTML = criterionRows()
    .map((row) => {
      const tone = row.percent < 50 ? "low" : row.percent < 75 ? "mid" : "high";
      return `
        <div class="theme-row">
          <div class="theme-row-head">
            <span>${esc(row.naam)}</span>
            <strong>${row.score}/${row.max}</strong>
          </div>
          <div class="bar"><div class="bar-fill ${tone}" style="width:${row.percent}%"></div></div>
        </div>`;
    })
    .join("");

  els.taskScores.innerHTML = examen
    .map((taak) => {
      const eisenLijst = eisenVoor(taak);
      const gedaan = eisen[taak.id].filter(Boolean).length;
      return `
        <div class="theme-row">
          <div class="theme-row-head">
            <span>${esc(taak.titel)}</span>
            <strong>${taakPunten(taak)}/${maxPunten(taak)}</strong>
          </div>
          <div class="bar"><div class="bar-fill ${
            taakPunten(taak) / maxPunten(taak) < 0.5 ? "low" : taakPunten(taak) / maxPunten(taak) < 0.75 ? "mid" : "high"
          }" style="width:${Math.round((taakPunten(taak) / maxPunten(taak)) * 100)}%"></div></div>
          <p class="tiny">Eisen afgevinkt: ${gedaan} van ${eisenLijst.length}</p>
        </div>`;
    })
    .join("");

  bewaarGeschiedenis(score, percent);
  const json = bouwExport(score, percent);
  els.jsonPreview.textContent = JSON.stringify(json, null, 2).slice(0, 900) + "\n  …";
}

function showResult() {
  const open = examen.reduce(
    (som, taak) => som + profielVoor(taak).criteria.filter((id) => scores[taak.id][id] == null).length,
    0
  );
  if (open > 0) {
    const door = window.confirm(
      `Je hebt ${open} criterium/criteria nog niet beoordeeld. Die tellen als 0. Wil je doorgaan?`
    );
    if (!door) return;
  }
  renderResult();
  showScreen("result");
}

/* ── JSON voor een LLM ────────────────────────────────────────────── */

const LEESINSTRUCTIE =
  "You are reviewing one attempt at the Dutch inburgeringsexamen Schrijven A2 (CEFR A2 writing). " +
  "The numbers under score come from score.bron (the candidate or an LLM): treat them as unverified and re-check every answer yourself against beoordelingsmodel. " +
  "For each opdracht: (1) list which eisen are actually met, with evidence from the text; (2) quote each incorrect or weak phrase exactly and give the corrected Dutch sentence; (3) name the error type (woordvolgorde, werkwoordvorm, lidwoord, spelling, voorzetsel, woordkeuze, samenhang). " +
  "Then output, in this order: (a) a ranked list of 3-5 focus areas, each with the number of supporting errors and one concrete drill; (b) a 2-week practice plan with 15 minutes per day; (c) 10 new A2 writing prompts in Dutch that target the weakest two focus areas. " +
  "Explanations in English, all Dutch examples in correct A2 Dutch. Be specific and brief. Do not praise, do not restate the task.";

function structuurVan(taak) {
  if (taak.type === "correspondentie") {
    return {
      aan: taak.email.aan,
      onderwerp: taak.email.onderwerp,
      aanhef: taak.email.aanhef,
      afsluiting: taak.email.afsluiting,
    };
  }
  if (taak.type === "bericht") return { aanhef: taak.aanhef, afsluiting: taak.afsluiting };
  if (taak.type === "vrije_tekst") return { optionele_startzin: taak.start };
  return null;
}

function bouwExport(score, percent) {
  const criteria = Object.fromEntries(
    Object.entries(CRITERIA).map(([id, criterium]) => [
      id,
      {
        naam: criterium.naam,
        max: criterium.max,
        scores: criterium.scores,
        ...(criterium.scores_per_profiel ? { scores_per_profiel: criterium.scores_per_profiel } : {}),
        ...(criterium.specifiek ? { specifiek: criterium.specifiek } : {}),
        ...(criterium.ijkpunten ? { ijkpunten: criterium.ijkpunten } : {}),
      },
    ])
  );

  return {
    tool: "Schrijven A2 ExamenSimulatie",
    schema_version: 1,
    gegenereerd: new Date().toISOString(),
    taal: "nl",
    leesinstructie_voor_llm: LEESINSTRUCTIE,
    examen: {
      onderdeel: "Schrijven A2 (Inburgeringsexamen)",
      oefenexamen: vasteModus ? VASTE_EXAMENS[0].naam : "willekeurige opdrachten uit de bank",
      niveau: "A2 (ERK)",
      duur_minuten: 40,
      aantal_opdrachten: EXAM_SIZE,
      opbouw: OPBOUW,
      max_punten: MAX_POINTS,
      officiele_cesuur:
        "Per examen vastgesteld door de minister en niet openbaar. Deze tool gebruikt " +
        `${PASS_PERCENT}% (${PASS_POINTS}/${MAX_POINTS}) als vuistregel voor de schatting.`,
      in_het_echt: {
        medium: "pen en papier; de pen krijgt u van DUO",
        duur: "maximaal 40 minuten, plus 15 minuten uitleg vooraf",
        mee_nemen: "alleen een geldig identiteitsbewijs; geen pen, papier, telefoon, horloge of woordenboek",
        beoordeling: "door gecertificeerde beoordelaars, niet door een computer",
        uitslag: "per brief, in de praktijk ongeveer 16 weken",
      },
      bronnen: [
        "https://www.inburgeren.nl/examen-doen/inhoud-taalexamens-a2-b1-b2.jsp",
        "https://www.inburgeren.nl/images/examenreglement.pdf",
        "https://duo.nl/zakelijk/images/beoordelingsmodel-schrijven-a2-formulieren.pdf",
        "https://duo.nl/zakelijk/images/beoordelingsmodel-vrij-schrijven-en-correspondentie.pdf",
        "https://www.inburgeren.nl/images/oefenexamen-schrijven-1.pdf",
        "https://www.inburgeren.nl/images/oefenexamen-schrijven-2.pdf",
        "https://www.inburgeren.nl/images/oefenexamen-schrijven-3.pdf",
      ],
    },
    beoordelingsmodel: { criteria, profielen: RUBRIEK },
    score: {
      totaal: score,
      max: MAX_POINTS,
      percentage: percent,
      schatting_voldoende: percent >= PASS_PERCENT,
      bron: scoreBron,
      zelfbeoordeeld: scoreBron === "zelf",
      a2_baseline: baselinePunten(),
      per_criterium: criterionRows().map((row) => ({
        criterium: row.id,
        naam: row.naam,
        score: row.score,
        max: row.max,
        baseline: row.baseline,
        percentage: row.percent,
        punten_verloren: row.verloren,
        advies: CRITERIA[row.id].advies,
      })),
      tijd_gebruikt_minuten: Math.round(tijdGebruikt / 60),
    },
    opdrachten: examen.map((taak, index) => ({
      nummer: index + 1,
      id: taak.id,
      soort: taak.type,
      titel: taak.titel,
      situatie: taak.situatie,
      opdracht: taak.opdracht,
      punten_uit_de_opdracht: taak.punten || [],
      velden:
        taak.type === "formulier"
          ? taak.velden.map((veld) => ({
              label: veld.label,
              soort: veld.soort,
              waarde: antwoorden[taak.id][veld.label] || "",
            }))
          : null,
      verwachte_structuur: structuurVan(taak),
      eisen: eisenVoor(taak).map((eis, i) => ({ eis, afgevinkt: Boolean(eisen[taak.id][i]) })),
      ...(taak.type === "formulier" ? { antwoord: antwoorden[taak.id] } : {}),
      tekst: tekstVan(taak),
      metingen: metingen(taak),
      beoordeling: profielVoor(taak).criteria.map((id) => ({
        criterium: id,
        score: scores[taak.id][id] ?? null,
        max: CRITERIA[id].max,
      })),
      punten: taakPunten(taak),
      max_punten: maxPunten(taak),
      notitie: notities[taak.id] || "",
    })),
    geschiedenis: laadGeschiedenis(),
  };
}

function bewaarGeschiedenis(score, percent) {
  if (geschiedenisBewaard) return;
  geschiedenisBewaard = true;
  const geschiedenis = laadGeschiedenis();
  const entry = {
    datum: new Date().toISOString(),
    totaal: score,
    max: MAX_POINTS,
    percentage: percent,
    per_criterium: Object.fromEntries(criterionRows().map((row) => [row.id, `${row.score}/${row.max}`])),
  };
  const laatste = geschiedenis[geschiedenis.length - 1];
  if (laatste && laatste.datum.slice(0, 16) === entry.datum.slice(0, 16)) return;
  geschiedenis.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(geschiedenis.slice(-20)));
}

function laadGeschiedenis() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function downloadJson() {
  const json = bouwExport(totaalPunten(), Math.round((totaalPunten() / MAX_POINTS) * 100));
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  link.href = url;
  link.download = `schrijven-a2-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyJson() {
  const json = bouwExport(totaalPunten(), Math.round((totaalPunten() / MAX_POINTS) * 100));
  try {
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    $("btn-copy").textContent = "Gekopieerd ✓";
  } catch {
    $("btn-copy").textContent = "Kopiëren lukte niet";
  }
  setTimeout(() => ($("btn-copy").textContent = "Kopieer JSON"), 2000);
}

/* ── Nakijken door een LLM (rondje: opdracht kopiëren, JSON terug) ── */

const LLM_KOP = [
  "You are a certified rater for the Dutch inburgeringsexamen Schrijven A2 (CEFR A2).",
  `Grade the ${EXAM_SIZE} writing tasks below.`,
  "",
  "## Context",
  "- The candidate writes at level A2. A2 Dutch is short and simple. Do not reward B1 complexity and do not penalise the absence of it.",
  `- Maximum score is ${MAX_POINTS}: one formulier (max ${RUBRIEK.formulier.max} points) and ${EXAM_SIZE - 1} texts (max ${RUBRIEK.tekst.max} points each).`,
  "- Score per task, per criterion, with the official DUO descriptors in beoordelingsmodel.criteria[].scores.",
  "- For spelling, use beoordelingsmodel.criteria.spelling.scores_per_profiel[profiel]; the top-level scores is the text version.",
  "- The `eisen` list of a task is its task-specific requirement list. Check every item against the answer.",
  "- Inventing names, addresses and dates is required by the tasks. That is not an error.",
  "- The aanhef and the afsluiting are already in the task. The candidate copies them and writes only their own name under the closing.",
  "- A2 is short: one idea per sentence, about 8 words, words copied from the task. Long sentences with subordinate clauses are not better writing at this level, they are more places to lose points. Never reward complexity and never ask for it.",
  "",
  "## Scoring rules (strict)",
  "1. Give every criterion an integer inside its range. Never leave one out.",
  "2. adequaatheid = 0 only when the text is unreadable, empty, or clearly an answer to a different task. When adequaatheid is 0, all other criteria of that task must be 0.",
  "3. Anchor adequaatheid to the eisen list, not to your taste: all eisen true = 2 (acceptabel, the DUO baseline); 3 only when the text is also an excellent, not merely complete, answer; exactly one eisen false = at most 1; two or more false = 0 or 1.",
  "4. Judge only what is written. If a greeting or closing is not in the text, it is not there.",
  "5. Count every error exactly once, in one category. Spelling is how words are written (letters, d/t, -en, capitals, de/het, a misspelled verb form). Grammatica is sentence structure (word order, verb position, missing or wrong auxiliary, agreement across the sentence). Never deduct for the same mistake twice.",
  "6. A short correct answer beats a long incorrect one. Do not reward length.",
  "7. eisen: one JSON boolean per item, same length and order as in the task: true or false, never the strings \"true\" / \"false\". true only if it is really in the answer. The eis 'Geen inleidende zin' is false when the text opens with a sentence that answers no bullet point of the task (a wish, a how-are-you, an 'I am writing you this letter because').",
  "8. notitie: one short sentence in Dutch naming the biggest problem of that task. It must not contradict the eisen you marked true.",
  "9. Before answering, re-read each text once. Every deduction must point to a concrete word or sentence. If you cannot quote it, do not deduct.",
].join("\n");

function llmOpdracht(taak, index) {
  const profiel = profielVoor(taak);
  return {
    nummer: index + 1,
    id: taak.id,
    soort: taak.type,
    titel: taak.titel,
    situatie: taak.situatie,
    opdracht: taak.opdracht,
    punten_uit_de_opdracht: taak.punten || [],
    verwachte_structuur: structuurVan(taak),
    eisen: eisenVoor(taak),
    velden:
      taak.type === "formulier"
        ? taak.velden.map((veld) => ({
            label: veld.label,
            waarde: antwoorden[taak.id][veld.label] || "",
          }))
        : null,
    tekst: tekstVan(taak),
    metingen: metingen(taak),
    profiel: TYPES[taak.type].profiel,
    criteria: profiel.criteria,
    max_punten: profiel.max,
  };
}

function bouwLlmOpdracht() {
  const payload = {
    examen: {
      onderdeel: "Schrijven A2 (Inburgeringsexamen)",
      niveau: "A2 (ERK)",
      duur_minuten: 40,
      aantal_opdrachten: examen.length,
      max_punten: MAX_POINTS,
      a2_baseline: baselinePunten(),
      opbouw: OPBOUW,
    },
    beoordelingsmodel: {
      criteria: Object.fromEntries(
        Object.entries(CRITERIA).map(([id, criterium]) => [
          id,
          {
            naam: criterium.naam,
            max: criterium.max,
            scores: criterium.scores,
            ...(criterium.scores_per_profiel ? { scores_per_profiel: criterium.scores_per_profiel } : {}),
            ...(criterium.specifiek ? { specifiek: criterium.specifiek } : {}),
            ...(criterium.ijkpunten ? { ijkpunten: criterium.ijkpunten } : {}),
          },
        ])
      ),
      profielen: RUBRIEK,
    },
    opdrachten: examen.map(llmOpdracht),
  };

  const voorbeeld = {
    scores: examen.map((taak) => {
      const profiel = profielVoor(taak);
      return {
        id: taak.id,
        criteria: Object.fromEntries(profiel.criteria.map((id) => [id, `<0-${CRITERIA[id].max}>`])),
        eisen: eisenVoor(taak).map(() => false),
        notitie: "<één zin in het Nederlands>",
      };
    }),
  };

  const blok = (object) => "```json\n" + JSON.stringify(object, null, 2) + "\n```";

  return [
    LLM_KOP,
    "",
    "## Examen, rubric en antwoorden",
    "",
    blok(payload),
    "",
    "## Antwoorden, met regeleinden",
    "",
    tekstenMetRegeleinden(),
    "",
    "## Required output",
    "",
    "Return exactly one JSON object and nothing else: no prose and no code fences around your answer.",
    "The block below only shows the shape (fenced here for readability).",
    "Replace every <...> placeholder with a number. For eisen use real JSON booleans; the false values below are only a type example, so evaluate each one.",
    "Use these ids and criteria, in this order:",
    "",
    blok(voorbeeld),
  ].join("\n");
}

async function kopieerTekst(tekst, { status, manual, veld, klaar, mislukt }) {
  $(veld).value = tekst;
  try {
    await navigator.clipboard.writeText(tekst);
    $(status).textContent = klaar;
  } catch {
    const wrap = $(manual);
    wrap.classList.remove("hidden");
    wrap.open = true;
    $(veld).select();
    $(status).textContent = mislukt;
  }
}

async function copyLlmOpdracht() {
  await kopieerTekst(bouwLlmOpdracht(), {
    status: "llm-status",
    manual: "llm-manual",
    veld: "llm-prompt",
    klaar: "Gekopieerd. Plak dit in je LLM en plak de JSON die je terugkrijgt hieronder.",
    mislukt: "Klembord niet beschikbaar. Kopieer de tekst hierboven handmatig.",
  });
}

function parseJsonLos(raw) {
  const schoon = String(raw || "")
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  const eerste = schoon.indexOf("{");
  const laatste = schoon.lastIndexOf("}");
  if (eerste < 0 || laatste <= eerste) throw new Error("geen JSON-object gevonden");
  return JSON.parse(schoon.slice(eerste, laatste + 1));
}

function criteriaUit(item) {
  const bron = item.criteria ?? item.beoordeling ?? {};
  if (Array.isArray(bron)) {
    return Object.fromEntries(bron.filter(Boolean).map((rij) => [rij.criterium, rij.score]));
  }
  return bron;
}

/* LLM's sturen soms "true"/"ja"/1 in plaats van true. Alles wat we niet
   herkennen (zoals de placeholder "<true|false>") wordt overgeslagen. */
function eisWaarde(eis) {
  if (typeof eis === "boolean") return eis;
  if (typeof eis === "number") return eis !== 0;
  if (typeof eis === "string") {
    const waarde = eis.trim().toLowerCase();
    if (["true", "ja", "yes", "1", "gedaan", "wel", "aanwezig"].includes(waarde)) return true;
    if (["false", "nee", "no", "0", "niet", "niet gedaan", "ontbreekt", "afwezig"].includes(waarde)) return false;
    return null;
  }
  if (eis && typeof eis === "object") {
    const binnen = eis.afgevinkt ?? eis.behandeld ?? eis.gedaan ?? eis.waar ?? eis.voldaan;
    return binnen === undefined ? null : eisWaarde(binnen);
  }
  return null;
}

function eisenUit(item) {
  if (!Array.isArray(item.eisen)) return null;
  const waarden = item.eisen.map(eisWaarde);
  if (waarden.every((waarde) => waarde === null)) return null;
  return waarden.map((waarde) => waarde === true);
}

function verwerkLlmScores() {
  const status = $("llm-status");
  let data;
  try {
    data = parseJsonLos($("llm-input").value);
  } catch (fout) {
    status.textContent = `Kon de JSON niet lezen (${fout.message}). Plak het volledige antwoord van de LLM.`;
    return;
  }

  const lijst = Array.isArray(data) ? data : data.scores || data.opdrachten || data.beoordeling;
  if (!Array.isArray(lijst)) {
    status.textContent = 'Geen lijst met scores gevonden. Verwacht: {"scores": [ ... ]}.';
    return;
  }

  let verwerkt = 0;
  let gezet = 0;
  let eisenOnbruikbaar = 0;
  const bronVooraf = scoreBron;
  const onbekend = [];

  for (const item of lijst) {
    if (!item || typeof item !== "object") continue;
    const taak = examen.find((kandidaat) => kandidaat.id === item.id) || examen[Number(item.nummer) - 1];
    if (!taak) {
      onbekend.push(item.id ?? item.nummer ?? "?");
      continue;
    }
    const profiel = profielVoor(taak);
    const binnen = criteriaUit(item);
    let taakGezet = 0;

    for (const id of profiel.criteria) {
      const waarde = Number(binnen[id]);
      if (!Number.isFinite(waarde)) continue;
      scores[taak.id][id] = Math.min(CRITERIA[id].max, Math.max(0, Math.round(waarde)));
      gezet += 1;
      taakGezet += 1;
    }

    // Geen eisen meegeven is normaal bij een correctie; onleesbare eisen niet.
    const llmEisen = eisenUit(item);
    if (llmEisen) eisen[taak.id] = eisenVoor(taak).map((_, i) => llmEisen[i] === true);
    else if (Array.isArray(item.eisen)) eisenOnbruikbaar += 1;

    const heeftNotitie = Object.prototype.hasOwnProperty.call(item, "notitie");
    const notitie = typeof item.notitie === "string" ? item.notitie.trim() : "";
    if (heeftNotitie) {
      notities[taak.id] = notitie && !/^<.*>$/.test(notitie) ? notitie.slice(0, 500) : "";
    } else if (taakGezet > 0) {
      // Een correctie zonder notitie: de oude notitie hoort niet meer bij de nieuwe score.
      notities[taak.id] = "";
    }

    if (scores[taak.id].adequaatheid === 0) {
      for (const id of profiel.criteria) {
        if (id !== "adequaatheid") scores[taak.id][id] = 0;
      }
    }
    verwerkt += 1;
  }

  if (verwerkt > 0) scoreBron = bronVooraf === "zelf" ? "llm" : "gemengd";
  renderCheck();

  if (verwerkt === 0) {
    status.textContent = `Geen enkele opdracht herkend (${onbekend.join(", ")}). De id's moeten kloppen, bijvoorbeeld mail-01.`;
    return;
  }

  const verwacht = examen.reduce((som, taak) => som + profielVoor(taak).criteria.length, 0);
  const delen = [
    `${verwerkt} van ${examen.length} opdrachten verwerkt`,
    `${gezet} van ${verwacht} criteria`,
    `${totaalPunten()} / ${MAX_POINTS} punten`,
  ];
  if (onbekend.length) delen.push(`niet herkend: ${onbekend.join(", ")}`);
  if (eisenOnbruikbaar) delen.push(`eisen onleesbaar bij ${eisenOnbruikbaar} opdracht(en), vink die zelf af`);
  status.textContent = `${delen.join(" · ")}. Controleer de scores hieronder en klik op "Bekijk resultaat".`;
  document.getElementById("check-total").scrollIntoView({ block: "center" });
}

/* ── Leeropdracht: dezelfde poging, maar als lesmateriaal ─────────── */

const LEER_KOP = [
  "You are my Dutch tutor. I am preparing for the inburgeringsexamen Schrijven A2 and I want to pass.",
  "Below is one practice attempt, scored with the official DUO rubric at CEFR A2.",
  "",
  "Teach me the 20% that earns 80% of the points. Do not analyse for the sake of analysis.",
  "",
  "## How this exam scores, in one paragraph",
  `${EXAM_SIZE} tasks, ${MAX_POINTS} points: one formulier (${RUBRIEK.formulier.max}) and ${EXAM_SIZE - 1} texts (${RUBRIEK.tekst.max} each). Every task is judged on task coverage first (adequaatheid). Adequaatheid 0 (unreadable, empty, or not an answer to this task) makes every other criterion 0 for that task, and missing one required point caps adequaatheid at 1, while all required points = 2 (acceptabel); 3 is only for an excellent text. So the cheapest points in this exam are: answer every bullet point, fill every form field, copy the greeting and the closing the task gives you, write your name under it, and skip the introduction. Language polish only pays after that.`,
  "",
  "## A2 means short",
  "The exam tasks already contain the aanhef and the afsluiting. The candidate copies them and adds their own name; nothing else goes before the first bullet point. Reward the shortest text that answers every point: sentences of about 8 words, one idea per sentence, verbs and nouns copied from the task. Treat every longer alternative as a risk, not as progress. A candidate who knows a word but not its spelling should use the simpler word.",
  "",
  "## What to produce, in this order",
  "1. **Ranked fixes.** First check each score in `prioriteit` against my text. If you disagree, use your own score for the ranking, not `prioriteit`. Then give up to 3 changes that would earn me the most points next attempt, using my actual errors. If I am already at `a2_baseline`, say so and stop. `algemeen_advies` is generic: do not copy it. Scores above `a2_baseline` are polish, not errors. For each fix: the rule in one sentence, why a rater deducts, and how many points it is worth.",
  "2. **Proof from my own text.** For each fix, quote the exact sentence I wrote, then give the corrected Dutch sentence. Bold what changed.",
  "3. **Minimum rule set.** At most 5 rules to memorise, each in Dutch with an English gloss and one short example.",
  "4. **7-day plan.** 15 minutes a day. Give the writing prompt for each day (in Dutch, A2 level) and what I must check afterwards.",
  "5. **5 exercises** built from my own mistakes. Put the answers at the very end under the heading Antwoorden, clearly separated.",
  "6. **Corrections to my scores, machine-readable.** Very last, after the answers, give exactly one JSON object and nothing after it: {\"scores\":[{\"id\":\"<task id>\",\"criteria\":{\"<criterium>\": <getal>}}]}. Only the criteria where your score differs from mine, using the task ids from opdrachten. No eisen, no notes, no text after the JSON.",
  "",
  "## Constraints",
  "- Judge at A2. Do not teach B1 grammar, subordinate-clause stacking or long sentences. Short correct Dutch is the goal. Every fix you give must be at most as long as what I wrote.",
  "- Explain in English. Every Dutch example must be correct Dutch.",
  "- Use my errors, not generic ones. If I made no mistake in a category, say nothing about that category.",
  "- A fix must map to a criterion in that task's `profiel`; otherwise it is worth 0 points. Use the per-task `scores` to see which text loses the points.",
  "- For spelling, use `beoordelingsmodel.criteria.spelling.scores_per_profiel` with the task's `profiel`.",
  "- If one of my scores looks wrong to you, say so per criterion and give your own score with a reason. If a score is right, leave it out of the JSON.",
  "- No praise, no restating of the task, short sentences.",
].join("\n");

function leerOpdrachtData() {
  const rijen = criterionRows().sort((a, b) => b.verloren - a.verloren);

  return {
    examen: {
      onderdeel: "Schrijven A2 (Inburgeringsexamen)",
      niveau: "A2 (ERK)",
      max_punten: MAX_POINTS,
      opbouw: OPBOUW,
      cesuur_uitleg: `De officiele cesuur is niet openbaar; ${PASS_PERCENT}% (${PASS_POINTS}/${MAX_POINTS}) is de vuistregel.`,
    },
    mijn_score: {
      totaal: totaalPunten(),
      max: MAX_POINTS,
      percentage: Math.round((totaalPunten() / MAX_POINTS) * 100),
      gehaald_volgens_vuistregel: totaalPunten() >= PASS_POINTS,
      a2_baseline: baselinePunten(),
      a2_baseline_uitleg:
        "Een complete, eenvoudige A2-tekst met enkele fouten. Punten daarboven zijn polish, geen eis.",
      bron: scoreBron,
    },
    teksten: tekstenMetRegeleinden(),
    prioriteit: rijen.map((rij) => ({
      criterium: rij.id,
      naam: rij.naam,
      score: `${rij.score}/${rij.max}`,
      baseline: `${rij.baseline}/${rij.max}`,
      punten_verloren: rij.verloren,
      algemeen_advies: CRITERIA[rij.id].advies,
    })),
    beoordelingsmodel: {
      criteria: Object.fromEntries(
        Object.entries(CRITERIA).map(([id, criterium]) => [
          id,
          {
            naam: criterium.naam,
            max: criterium.max,
            scores: criterium.scores,
            ...(criterium.scores_per_profiel ? { scores_per_profiel: criterium.scores_per_profiel } : {}),
            ...(criterium.specifiek ? { specifiek: criterium.specifiek } : {}),
            ...(criterium.ijkpunten ? { ijkpunten: criterium.ijkpunten } : {}),
          },
        ])
      ),
      profielen: RUBRIEK,
    },
    opdrachten: examen.map((taak, index) => ({
      nummer: index + 1,
      id: taak.id,
      soort: taak.type,
      titel: taak.titel,
      situatie: taak.situatie,
      opdracht: taak.opdracht,
      profiel: TYPES[taak.type].profiel,
      max_punten: maxPunten(taak),
      verwachte_structuur: structuurVan(taak),
      gevraagde_punten: taak.punten || [],
      velden:
        taak.type === "formulier"
          ? taak.velden.map((veld) => ({
              label: veld.label,
              waarde: antwoorden[taak.id][veld.label] || "",
            }))
          : null,
      metingen: metingen(taak),
      eisen_niet_gedaan: eisenVoor(taak).filter((_, i) => !eisen[taak.id][i]),
      eisen_gedaan: eisenVoor(taak).filter((_, i) => eisen[taak.id][i]),
      mijn_tekst: tekstVan(taak),
      scores: profielVoor(taak).criteria.map((id) => ({
        criterium: id,
        score: scores[taak.id][id] ?? 0,
        max: CRITERIA[id].max,
      })),
    })),
  };
}

function bouwLeeropdracht() {
  const data = leerOpdrachtData();
  const blok = (object) => "```json\n" + JSON.stringify(object, null, 2) + "\n```";
  return [
    LEER_KOP,
    "",
    "## My attempt",
    "",
    blok(data),
    "",
    "## My texts, with line breaks",
    "",
    data.teksten,
    "",
    "## Reminder",
    "",
    "Check the scores first, then the ranked fixes. Every Dutch sentence you give me must be correct A2 Dutch.",
  ].join("\n");
}

async function copyLeeropdracht() {
  await kopieerTekst(bouwLeeropdracht(), {
    status: "learn-status",
    manual: "learn-manual",
    veld: "learn-prompt",
    klaar: "Gekopieerd. Plak dit in je LLM voor uitleg, oefeningen en een weekplan.",
    mislukt: "Klembord niet beschikbaar. Kopieer de tekst hierboven handmatig.",
  });
}

/* ── AI: licentie of eigen sleutel ────────────────────────────────── */
/* Het transport staat in ../shared/ai.js. Hier alleen de bediening: welke
   route en de statusregel. Een eigen sleutel heeft geen limiet: de gebruiker
   betaalt DeepSeek zelf. */

const DS_KEY = "schrijven-a2-deepseek-key";

function dsStatus(extra = "") {
  const status = $("ds-status");

  if (AI.heeftTegoed()) {
    const { gebruikt, limiet } = AI.tegoed();
    const deel = limiet
      ? `licentie actief · tegoed: ${Math.max(0, limiet - gebruikt)} van ${limiet} deze maand`
      : "licentie actief";
    status.textContent = [deel, extra].filter(Boolean).join(" · ");
    return;
  }

  status.textContent = ["eigen DeepSeek-sleutel · geen limiet", extra]
    .filter(Boolean)
    .join(" · ");
}

async function dsNakijken() {
  const status = $("ds-status");
  const knop = $("btn-ds-score");
  const metTegoed = AI.heeftTegoed();
  const sleutel = $("ds-key").value.trim();

  if (!metTegoed && !sleutel) {
    status.textContent = "Vul een licentiesleutel of je eigen DeepSeek-sleutel in.";
    return;
  }

  knop.disabled = true;
  status.textContent = "Bezig met nakijken…";
  let melding = "";
  const controller = new AbortController();
  const stop = setTimeout(() => controller.abort(), 90000);

  try {
    const { tekst } = await AI.ask({
      mode: "schrijven",
      prompt: bouwLlmOpdracht(),
      signal: controller.signal,
    });

    // Zichtbaar maken wat de LLM terugstuurde, dan dezelfde import als bij plakken.
    $("llm-input").value = tekst;
    verwerkLlmScores();
  } catch (fout) {
    melding =
      fout.name === "AbortError"
        ? "Nakijken duurde langer dan 90 seconden."
        : fout.melding ||
          `Kon de AI niet bereiken (${fout.message}). Open de site via localhost; sommige browsers blokkeren dit vanaf een bestand.`;
  } finally {
    clearTimeout(stop);
    knop.disabled = false;
    dsStatus(melding);
  }
}

async function maakPlan() {
  const status = $("plan-status");
  const knop = $("btn-plan");
  const uitvoer = $("plan-out");
  const metTegoed = AI.heeftTegoed();
  const sleutel = $("ds-key").value.trim();

  if (!metTegoed && !sleutel) {
    status.textContent = "Vul een licentiesleutel of je eigen DeepSeek-sleutel in.";
    return;
  }

  knop.disabled = true;
  status.textContent = "Bezig met je plan…";
  const controller = new AbortController();
  const stop = setTimeout(() => controller.abort(), 120000);

  try {
    const data = leerOpdrachtData();
    const tekst = await AI.plan({
      examen: "Schrijven A2, 4 opdrachten, 37 punten",
      uitslag: `${data.mijn_score.totaal} van ${data.mijn_score.max} punten (${data.mijn_score.percentage}%), ${data.mijn_score.gehaald_volgens_vuistregel ? "gehaald" : "niet gehaald"} volgens de vuistregel`,
      data,
      signal: controller.signal,
    });
    uitvoer.textContent = tekst;
    uitvoer.classList.remove("hidden");
    status.textContent = "Klaar. Vijf dagen, vijftien minuten per dag.";
  } catch (fout) {
    status.textContent =
      fout.name === "AbortError"
        ? "Het plan duurde langer dan twee minuten. Probeer het nog eens."
        : fout.melding ||
          `Kon de AI niet bereiken (${fout.message}). Open de site via localhost; sommige browsers blokkeren dit vanaf een bestand.`;
  } finally {
    clearTimeout(stop);
    knop.disabled = false;
  }
}

/* ── Opstarten ────────────────────────────────────────────────────── */

$("btn-start").addEventListener("click", () => startExam(false));
$("btn-start-paper").addEventListener("click", startPapier);
$("btn-start-hard").addEventListener("click", () => startExam(true));
$("btn-retry").addEventListener("click", () => startExam(vasteModus));
$("btn-edit-scores").addEventListener("click", () => showScreen("check"));
$("btn-submit-top").addEventListener("click", submitWithConfirm);
$("btn-to-result").addEventListener("click", showResult);
$("btn-llm-copy").addEventListener("click", copyLlmOpdracht);
$("btn-ds-score").addEventListener("click", dsNakijken);
$("btn-learn-copy").addEventListener("click", copyLeeropdracht);
$("btn-plan").addEventListener("click", maakPlan);
$("btn-ds-forget").addEventListener("click", () => {
  localStorage.removeItem(DS_KEY);
  $("ds-key").value = "";
  $("ds-status").textContent = "Sleutel verwijderd uit deze browser.";
});
$("btn-llm-apply").addEventListener("click", verwerkLlmScores);
$("btn-download").addEventListener("click", downloadJson);
$("btn-copy").addEventListener("click", copyJson);

const dsKeyVeld = $("ds-key");
dsKeyVeld.value = localStorage.getItem(DS_KEY) || "";
dsKeyVeld.addEventListener("input", () => {
  const waarde = dsKeyVeld.value.trim();
  if (waarde) localStorage.setItem(DS_KEY, waarde);
  else localStorage.removeItem(DS_KEY);
});

const licVeld = $("lic-key");
licVeld.value = AI.licentie();
licVeld.addEventListener("input", () => {
  AI.bewaarLicentie(licVeld.value);
  dsStatus();
});
dsStatus();

$("bank-size").textContent = String(TAKEN.length);
$("hard-exam-name").textContent = VASTE_EXAMENS[0].naam;
$("type-list").innerHTML = Object.entries(TYPES)
  .map(([key, type]) => {
    const aantal = TAKEN.filter((taak) => taak.type === key).length;
    return `<li><span class="num">${aantal}</span>${esc(type.naam)}</li>`;
  })
  .join("");
