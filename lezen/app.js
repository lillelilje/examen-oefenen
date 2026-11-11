/* Lezen A2 ExamenSimulatie: vanilla JS, geen dependencies. */

const {
  size: EXAM_SIZE,
  durationSeconds: DURATION_SECONDS,
  passScore: PASS_SCORE,
} = EXAM_BLUEPRINT;

const $ = (id) => document.getElementById(id);

const screens = {
  start: $("screen-start"),
  exam: $("screen-exam"),
  result: $("screen-result"),
};

const els = {
  timer: $("timer"),
  answeredCount: $("answered-count"),
  progressFill: $("progress-fill"),
  textMeta: $("text-meta"),
  textSituation: $("text-situation"),
  textTitle: $("text-title"),
  textBody: $("text-body"),
  questions: $("questions"),
  prev: $("btn-prev"),
  next: $("btn-next"),
  counter: $("text-counter"),
  navigator: $("navigator"),
  verdict: $("verdict"),
  score: $("score"),
  resultLine: $("result-line"),
  resultStats: $("result-stats"),
  textStats: $("text-stats"),
  reviewList: $("review-list"),
  onlyWrong: $("only-wrong"),
};

let examen = null;
let teksten = [];
let antwoorden = {};
let vraagnummers = {};
let huidige = 0;
let remaining = DURATION_SECONDS;
let endAt = 0;
let timerId = null;
let finished = false;
let results = [];

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/* ── Examen samenstellen ──────────────────────────────────────────── */

function pickExam() {
  return EXAMENS[Math.floor(Math.random() * EXAMENS.length)];
}

function buildExam(bron) {
  return {
    ...bron,
    teksten: bron.teksten.map((tekst) => ({
      ...tekst,
      vragen: tekst.vragen.map((vraag) => {
        const opties = vraag.opties.map((tekst2, index) => ({
          tekst: tekst2,
          juist: index === vraag.juist,
        }));
        return { ...vraag, opties: shuffle(opties) };
      }),
    })),
  };
}

function startExam() {
  clearInterval(timerId);
  examen = buildExam(pickExam());
  teksten = examen.teksten;
  antwoorden = {};
  vraagnummers = {};
  let nummer = 0;
  teksten.forEach((tekst) => {
    tekst.vragen.forEach((vraag) => {
      nummer += 1;
      vraagnummers[vraag.id] = nummer;
      antwoorden[vraag.id] = null;
    });
  });

  huidige = 0;
  remaining = DURATION_SECONDS;
  finished = false;
  results = [];
  els.onlyWrong.checked = false;
  els.timer.classList.remove("danger");
  els.timer.textContent = formatTime(remaining);
  endAt = Date.now() + DURATION_SECONDS * 1000;

  showScreen("exam");
  renderText();
  renderNavigator();
  updateProgress();
  timerId = setInterval(tick, 250);
}

function tick() {
  remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  els.timer.textContent = formatTime(remaining);
  els.timer.classList.toggle("danger", remaining <= 300);
  if (remaining <= 0) finish(true);
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

/* ── Tekst en vragen renderen ─────────────────────────────────────── */

function renderBody(blokken) {
  return blokken
    .map((blok) => {
      if (typeof blok === "string") return `<p>${esc(blok)}</p>`;
      const { kop, rijen } = blok.tabel;
      return `
        <table class="text-table">
          <thead><tr>${kop.map((cel) => `<th>${esc(cel)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rijen
              .map(
                (rij) =>
                  `<tr>${rij.map((cel) => `<td>${esc(cel)}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>`;
    })
    .join("");
}

function renderText() {
  const tekst = teksten[huidige];
  const aantal = tekst.vragen.length;

  els.textMeta.textContent = `${TEKSTSOORTEN[tekst.soort]} · ${aantal} ${aantal === 1 ? "vraag" : "vragen"}`;
  els.textSituation.textContent = tekst.situatie;
  els.textTitle.textContent = tekst.titel;
  els.textBody.innerHTML = renderBody(tekst.body);

  els.questions.innerHTML = tekst.vragen
    .map((vraag) => {
      const nummer = vraagnummers[vraag.id];
      return `
        <article class="question-block">
          <h3><span class="q-num">Vraag ${nummer}</span>${esc(vraag.vraag)}</h3>
          <div class="options">
            ${vraag.opties
              .map((optie, index) => {
                const gekozen = antwoorden[vraag.id] === index;
                return `
                  <button class="option${gekozen ? " selected" : ""}" type="button"
                    data-vraag="${esc(vraag.id)}" data-opt="${index}"
                    aria-pressed="${gekozen}">
                    <span class="option-letter">${"ABC"[index]}</span>
                    <span class="option-text">${esc(optie.tekst)}</span>
                  </button>`;
              })
              .join("")}
          </div>
        </article>`;
    })
    .join("");

  els.counter.textContent = `Tekst ${huidige + 1} van ${teksten.length}`;
  els.prev.disabled = huidige === 0;
  els.next.textContent = huidige === teksten.length - 1 ? "Inleveren" : "Volgende tekst →";
}

function renderNavigator() {
  els.navigator.innerHTML = teksten
    .map((tekst, index) => {
      const klaar = tekst.vragen.every((vraag) => antwoorden[vraag.id] !== null);
      const classes = ["nav-dot"];
      if (klaar) classes.push("answered");
      if (index === huidige) classes.push("current");
      return `<button class="${classes.join(" ")}" type="button" data-tekst="${index}"
        aria-label="Tekst ${index + 1}">${index + 1}</button>`;
    })
    .join("");
}

function aantalBeantwoord() {
  return Object.values(antwoorden).filter((antwoord) => antwoord !== null).length;
}

function updateProgress() {
  const beantwoord = aantalBeantwoord();
  const totaal = Object.keys(antwoorden).length;
  els.answeredCount.textContent = String(beantwoord);
  els.progressFill.style.width = `${(beantwoord / totaal) * 100}%`;
}

function goTo(index) {
  if (index < 0 || index >= teksten.length) return;
  huidige = index;
  renderText();
  renderNavigator();
  document.querySelector(".exam-shell").scrollIntoView({ block: "start" });
}

/* ── Antwoorden ───────────────────────────────────────────────────── */

els.questions.addEventListener("click", (event) => {
  const knop = event.target.closest("button[data-opt]");
  if (!knop) return;
  const vraagId = knop.dataset.vraag;
  const index = Number(knop.dataset.opt);
  antwoorden[vraagId] = antwoorden[vraagId] === index ? null : index;
  knop.closest(".options")
    .querySelectorAll("button[data-opt]")
    .forEach((element) => {
      const gekozen = Number(element.dataset.opt) === antwoorden[vraagId];
      element.classList.toggle("selected", gekozen);
      element.setAttribute("aria-pressed", String(gekozen));
    });
  updateProgress();
  renderNavigator();
});

els.navigator.addEventListener("click", (event) => {
  const knop = event.target.closest("button[data-tekst]");
  if (knop) goTo(Number(knop.dataset.tekst));
});

els.prev.addEventListener("click", () => goTo(huidige - 1));
els.next.addEventListener("click", () => {
  if (huidige === teksten.length - 1) submitWithConfirm();
  else goTo(huidige + 1);
});
$("btn-submit-top").addEventListener("click", submitWithConfirm);
els.onlyWrong.addEventListener("change", renderReview);

function submitWithConfirm() {
  const open = Object.values(antwoorden).filter((antwoord) => antwoord === null).length;
  if (
    open > 0 &&
    !window.confirm(
      `Je hebt ${open} ${open === 1 ? "vraag" : "vragen"} niet beantwoord. Wil je toch inleveren?`
    )
  ) {
    return;
  }
  finish(false);
}

function finish(auto = false) {
  if (finished) return;
  finished = true;
  clearInterval(timerId);

  const tijdGebruikt = DURATION_SECONDS - remaining;
  results = [];
  teksten.forEach((tekst, tekstIndex) => {
    tekst.vragen.forEach((vraag) => {
      const gekozen = antwoorden[vraag.id];
      results.push({
        vraag,
        tekstIndex,
        tekstTitel: tekst.titel,
        soort: tekst.soort,
        gekozen,
        correct: gekozen !== null && vraag.opties[gekozen].juist,
      });
    });
  });

  const score = results.filter((result) => result.correct).length;
  const onbeantwoord = results.filter((result) => result.gekozen === null).length;
  renderResult(score, onbeantwoord, tijdGebruikt, auto);
  showScreen("result");
}

/* ── Resultaat ────────────────────────────────────────────────────── */

function renderResult(score, onbeantwoord, tijdGebruikt, auto) {
  const gehaald = score >= PASS_SCORE;
  const marge = score - PASS_SCORE;

  els.verdict.textContent = gehaald ? "GEHAALD" : "GEZAKT";
  els.verdict.className = `verdict ${gehaald ? "pass" : "fail"}`;
  els.score.textContent = `${score} / ${EXAM_SIZE}`;
  els.score.className = `score ${gehaald ? "pass" : "fail"}`;

  const tijdNoot = auto
    ? "De tijd is om. Het examen is automatisch ingeleverd."
    : `Tijd gebruikt: ${formatTime(tijdGebruikt)}.`;
  const margeNoot = gehaald
    ? marge === 0
      ? "Je zat precies op de grens. Dat is geen comfortabele marge."
      : `Je had ${marge} ${marge === 1 ? "vraag" : "vragen"} marge.`
    : `Je had ${Math.abs(marge)} ${Math.abs(marge) === 1 ? "vraag" : "vragen"} meer goed nodig.`;
  const openNoot =
    onbeantwoord > 0
      ? ` Je liet ${onbeantwoord} ${onbeantwoord === 1 ? "vraag" : "vragen"} onbeantwoord.`
      : "";

  els.resultLine.textContent = `${margeNoot}${openNoot} ${tijdNoot}`;

  els.resultStats.innerHTML = `
    <div class="stat"><span class="stat-label">Score</span><strong>${score}/${EXAM_SIZE}</strong></div>
    <div class="stat"><span class="stat-label">Slaaggrens</span><strong>${PASS_SCORE}/${EXAM_SIZE}</strong></div>
    <div class="stat"><span class="stat-label">Tijd</span><strong>${formatTime(tijdGebruikt)}</strong></div>
    <div class="stat"><span class="stat-label">Onbeantwoord</span><strong>${onbeantwoord}</strong></div>`;

  renderTextStats();
  els.onlyWrong.checked = false;
  renderReview();
}

function renderTextStats() {
  const rows = teksten
    .map((tekst, index) => {
      const items = results.filter((result) => result.tekstIndex === index);
      const goed = items.filter((result) => result.correct).length;
      return {
        index,
        titel: tekst.titel,
        soort: TEKSTSOORTEN[tekst.soort],
        totaal: items.length,
        goed,
        ratio: items.length ? goed / items.length : 1,
      };
    })
    .sort((a, b) => a.ratio - b.ratio);

  els.textStats.innerHTML = rows
    .map((row) => {
      const percent = Math.round(row.ratio * 100);
      const toon = percent < 50 ? "low" : percent < 75 ? "mid" : "high";
      return `
        <div class="theme-row">
          <div class="theme-row-head">
            <span>Tekst ${row.index + 1} · ${esc(row.titel)} <em>(${esc(row.soort)})</em></span>
            <strong>${row.goed}/${row.totaal}</strong>
          </div>
          <div class="bar"><div class="bar-fill ${toon}" style="width:${percent}%"></div></div>
        </div>`;
    })
    .join("");
}

function renderReview() {
  const alleenFouten = els.onlyWrong.checked;
  const kaarten = results
    .map((result) => {
      if (alleenFouten && result.correct) return "";
      const { vraag } = result;
      const gekozenTekst =
        result.gekozen === null
          ? "Niet beantwoord"
          : vraag.opties[result.gekozen].tekst;
      const juisteTekst = vraag.opties.find((optie) => optie.juist).tekst;

      return `
        <article class="review-card ${result.correct ? "ok" : "bad"}">
          <div class="review-top">
            <span class="review-num">Vraag ${vraagnummers[vraag.id]}</span>
            <span class="theme-chip">Tekst ${result.tekstIndex + 1} · ${esc(result.soort)}</span>
            <span class="badge ${result.correct ? "ok" : "bad"}">${result.correct ? "Goed" : "Fout"}</span>
          </div>
          <h3>${esc(vraag.vraag)}</h3>
          <p class="answer-line"><span>Jouw antwoord:</span> ${esc(gekozenTekst)}</p>
          ${result.correct ? "" : `<p class="answer-line correct"><span>Juiste antwoord:</span> ${esc(juisteTekst)}</p>`}
          <p class="why">${esc(vraag.uitleg)}</p>
        </article>`;
    })
    .join("");

  els.reviewList.innerHTML =
    kaarten || `<p class="empty">Geen fouten in deze selectie. Netjes.</p>`;
}

function planData() {
  const goed = results.filter((result) => result.correct).length;
  return {
    examen: `Lezen A2, ${results.length} vragen over ${teksten.length} teksten, ${DURATION_SECONDS / 60} minuten`,
    uitslag: `${goed} van ${results.length} goed, slaaggrens ${PASS_SCORE}`,
    data: {
      teksten: teksten.map((tekst, index) => {
        const items = results.filter((result) => result.tekstIndex === index);
        return {
          tekst: tekst.titel,
          soort: TEKSTSOORTEN[tekst.soort],
          goed: items.filter((result) => result.correct).length,
          totaal: items.length,
        };
      }),
      fouten: results
        .filter((result) => !result.correct)
        .map((result) => ({
          tekst: result.tekstTitel,
          soort: TEKSTSOORTEN[result.soort],
          vraag: result.vraag.vraag,
          jouw_antwoord:
            result.gekozen === null
              ? "niet beantwoord"
              : result.vraag.opties[result.gekozen].tekst,
          juiste_antwoord: result.vraag.opties.find((optie) => optie.juist).tekst,
          uitleg: result.vraag.uitleg,
        })),
    },
  };
}

/* ── Extra hulp: 5-daags plan ─────────────────────────────────────── */

async function maakPlan() {
  const status = $("plan-status");
  const knop = $("btn-plan");
  const uitvoer = $("plan-out");
  const { examen: naam, uitslag, data } = planData();

  knop.disabled = true;
  status.textContent = "Bezig met je plan…";
  const controller = new AbortController();
  const stop = setTimeout(() => controller.abort(), 120000);

  try {
    const tekst = await AI.plan({ examen: naam, uitslag, data, signal: controller.signal });
    uitvoer.textContent = tekst;
    uitvoer.classList.remove("hidden");
    status.textContent = "Klaar. Vijf dagen, vijftien minuten per dag.";
  } catch (fout) {
    status.textContent =
      fout.name === "AbortError"
        ? "Het plan duurde langer dan twee minuten. Probeer het nog eens."
        : fout.melding || `Kon de AI niet bereiken (${fout.message}).`;
  } finally {
    clearTimeout(stop);
    knop.disabled = false;
  }
}

const licVeld = $("lic-key");
licVeld.value = AI.licentie();
licVeld.addEventListener("input", () => AI.bewaarLicentie(licVeld.value));
$("btn-plan").addEventListener("click", maakPlan);

/* ── Opstarten ────────────────────────────────────────────────────── */

$("btn-start").addEventListener("click", startExam);
$("btn-retry").addEventListener("click", startExam);

$("text-count").textContent = String(EXAMENS[0].teksten.length);
$("soort-list").innerHTML = Object.entries(TEKSTSOORTEN)
  .map(([soort, naam]) => {
    const aantal = EXAMENS.reduce(
      (som, exam) => som + exam.teksten.filter((tekst) => tekst.soort === soort).length,
      0
    );
    return `<li><span class="num">${aantal}</span>${esc(naam)}</li>`;
  })
  .join("");
