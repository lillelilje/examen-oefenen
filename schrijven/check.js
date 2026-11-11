/*
 * Zelftest van de opdrachtenbank. Geen testframework nodig:
 *   node check.js
 */
const assert = require("node:assert/strict");
const {
  TYPES,
  CRITERIA,
  RUBRIEK,
  STRUCTUUR_EISEN,
  EXAM_BLUEPRINT,
  VASTE_EXAMENS,
  TAKEN,
  eisenVoor,
  profielVoor,
  scoresVoor,
  maxPunten,
} = require("./tasks.js");

const { size: EXAM_SIZE, composition: COMPOSITION, maxPoints: MAX_POINTS } = EXAM_BLUEPRINT;

const ids = new Set();
const titels = new Set();
const perType = {};
const toegestaneTypes = Object.keys(TYPES);

for (const taak of TAKEN) {
  assert.ok(!ids.has(taak.id), `Dubbele id: ${taak.id}`);
  ids.add(taak.id);

  assert.ok(!titels.has(taak.titel), `Dubbele titel: ${taak.titel}`);
  titels.add(taak.titel);

  assert.ok(toegestaneTypes.includes(taak.type), `Onbekend type bij ${taak.id}: ${taak.type}`);
  perType[taak.type] = (perType[taak.type] || 0) + 1;

  assert.ok(taak.titel.trim().length > 3, `Titel ontbreekt bij ${taak.id}`);
  assert.ok(taak.situatie.trim().length > 15, `Situatie te kort bij ${taak.id}`);
  assert.ok(taak.opdracht.trim().length > 10, `Opdracht te kort bij ${taak.id}`);

  if (taak.type === "formulier") {
    assert.ok(taak.velden.length >= 8, `Formulier ${taak.id} heeft te weinig velden`);
    for (const veld of taak.velden) {
      assert.ok(veld.label.trim(), `Veld zonder label in ${taak.id}`);
      assert.ok(["tekst", "lang", "keuze"].includes(veld.soort), `Onbekende veldsoort in ${taak.id}`);
      if (veld.soort === "keuze") {
        assert.ok(veld.opties.length >= 2, `Keuzeveld zonder opties in ${taak.id}`);
        assert.equal(new Set(veld.opties).size, veld.opties.length, `Dubbele opties in ${taak.id}`);
      }
    }
    assert.deepEqual(taak.punten, [], `Formulier ${taak.id} hoort geen punten te hebben`);
  } else {
    assert.ok(taak.punten.length >= 3, `${taak.id} heeft minstens 3 inhoudelijke eisen nodig`);
    for (const punt of taak.punten) {
      assert.ok(punt.trim().length > 8, `Eis te kort in ${taak.id}`);
    }
  }

  if (taak.type === "correspondentie") {
    for (const veld of ["aan", "onderwerp", "aanhef", "afsluiting"]) {
      assert.ok(taak.email[veld].trim(), `E-mailveld ${veld} ontbreekt in ${taak.id}`);
    }
    assert.match(taak.email.aan, /@/, `Ongeldig e-mailadres in ${taak.id}`);
  }

  if (taak.type === "bericht") {
    assert.ok(taak.aanhef.trim() && taak.afsluiting.trim(), `Aanhef of afsluiting ontbreekt in ${taak.id}`);
  }

  if (taak.type === "vrije_tekst") {
    assert.ok(taak.start.trim(), `Startzin ontbreekt in ${taak.id}`);
  }

  // De eisenlijst is wat de site als checklist toont.
  const eisen = eisenVoor(taak);
  assert.ok(eisen.length >= 3, `${taak.id} heeft te weinig eisen voor de checklist`);
  assert.equal(new Set(eisen).size, eisen.length, `Dubbele eis in ${taak.id}`);

  // Punten van het profiel moeten kloppen met de rubric.
  const profiel = profielVoor(taak);
  const som = profiel.criteria.reduce((totaal, id) => totaal + CRITERIA[id].max, 0);
  assert.equal(som, profiel.max, `Profiel ${profiel.naam} telt niet op tot zijn max`);
  assert.equal(maxPunten(taak), profiel.max, `maxPunten() klopt niet voor ${taak.id}`);
}

assert.equal(COMPOSITION.length, EXAM_SIZE, "De samenstelling moet het examen vullen");
assert.equal(new Set(COMPOSITION).size, COMPOSITION.length, "Dubbele soort in de samenstelling");

for (const type of COMPOSITION) {
  assert.ok(TYPES[type], `Samenstelling noemt onbekend type ${type}`);
  assert.ok((perType[type] || 0) >= 20, `Te weinig opdrachten van het type ${type} (minimaal 20)`);
  // vrije_tekst heeft één structurele eis; de inhoudelijke eisen staan in taak.punten.
  assert.ok(STRUCTUUR_EISEN[type].length >= 1, `Te weinig structuureisen voor ${type}`);
}

const examMax =
  COMPOSITION.filter((type) => TYPES[type].profiel === "formulier").length * RUBRIEK.formulier.max +
  COMPOSITION.filter((type) => TYPES[type].profiel === "tekst").length * RUBRIEK.tekst.max;
assert.equal(examMax, MAX_POINTS, "Examenscore komt niet overeen met de rubric");

for (const vast of VASTE_EXAMENS) {
  assert.ok(vast.naam.trim() && vast.uitleg.trim(), `Vast examen ${vast.id} mist naam of uitleg`);
  assert.deepEqual(
    vast.taken.map((taak) => taak.type),
    COMPOSITION,
    `Vast examen ${vast.id} volgt de samenstelling niet`
  );
  for (const taak of vast.taken) assert.ok(ids.has(taak.id), `Vast examen ${vast.id} gebruikt onbekende taak ${taak.id}`);
  const punten = vast.taken.reduce((som, taak) => som + maxPunten(taak), 0);
  assert.equal(punten, MAX_POINTS, `Vast examen ${vast.id} telt niet op tot ${MAX_POINTS} punten`);
}

assert.match(scoresVoor("spelling", { type: "formulier" })[1], /Persoonlijke gegevens/);
assert.doesNotMatch(scoresVoor("spelling", { type: "correspondentie" })[1], /Persoonlijke gegevens/);

assert.ok(EXAM_BLUEPRINT.durationSeconds === 40 * 60, "Het examen duurt 40 minuten");
assert.ok(
  EXAM_BLUEPRINT.passPercent > 0 && EXAM_BLUEPRINT.passPercent <= 100,
  "Ongeldige slaaggrens"
);

console.log(`OK — ${TAKEN.length} opdrachten, ${Object.keys(TYPES).length} soorten.`);
console.log(
  "Per soort: " +
    Object.entries(perType)
      .map(([type, aantal]) => `${TYPES[type].naam}: ${aantal}`)
      .join(" · ")
);
console.log(`Examen: ${EXAM_SIZE} opdrachten, ${MAX_POINTS} punten, ${EXAM_BLUEPRINT.durationSeconds / 60} minuten.`);
