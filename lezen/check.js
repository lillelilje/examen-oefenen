/*
 * Zelftest van de leesexamens. Geen testframework nodig:
 *   node check.js
 */
const assert = require("node:assert/strict");
const {
  TEKSTSOORTEN,
  EXAM_BLUEPRINT,
  EXAMENS,
  aantalVragen,
} = require("./questions.js");

const {
  size: EXAM_SIZE,
  passScore: PASS_SCORE,
  durationSeconds,
  tekstenPerExamen: [MIN_TEKSTEN, MAX_TEKSTEN],
} = EXAM_BLUEPRINT;
const soorten = Object.keys(TEKSTSOORTEN);
const examIds = new Set();

assert.ok(EXAMENS.length > 0, "Er is geen enkel examen");
assert.ok(durationSeconds === 65 * 60, "Het examen duurt 65 minuten");
assert.ok(PASS_SCORE > 0 && PASS_SCORE < EXAM_SIZE, "Ongeldige slaaggrens");

for (const examen of EXAMENS) {
  assert.ok(/^[a-z0-9-]+$/.test(examen.id), `Ongeldig examen-id: ${examen.id}`);
  assert.ok(!examIds.has(examen.id), `Dubbel examen-id: ${examen.id}`);
  examIds.add(examen.id);
  assert.ok(examen.naam.trim().length > 3, `Examen ${examen.id} mist een naam`);
  assert.ok(examen.uitleg.trim().length > 20, `Examen ${examen.id} mist uitleg`);

  assert.equal(aantalVragen(examen), EXAM_SIZE, `${examen.id} heeft geen ${EXAM_SIZE} vragen`);
  const aantalTeksten = examen.teksten.length;
  assert.ok(
    aantalTeksten >= MIN_TEKSTEN && aantalTeksten <= MAX_TEKSTEN,
    `${examen.id} heeft ${aantalTeksten} teksten; het echte examen heeft er ${MIN_TEKSTEN} of ${MAX_TEKSTEN}`
  );

  const tekstIds = new Set();
  const vraagIds = new Set();
  const vraagteksten = new Set();
  const soortenInExamen = new Set();

  for (const tekst of examen.teksten) {
    assert.ok(/^[a-z0-9-]+$/.test(tekst.id), `Ongeldig tekst-id: ${tekst.id}`);
    assert.ok(!tekstIds.has(tekst.id), `Dubbel tekst-id: ${tekst.id}`);
    tekstIds.add(tekst.id);

    assert.ok(soorten.includes(tekst.soort), `Onbekende soort bij ${tekst.id}: ${tekst.soort}`);
    soortenInExamen.add(tekst.soort);
    assert.ok(tekst.titel.trim().length > 3, `Titel ontbreekt bij ${tekst.id}`);
    assert.ok(tekst.situatie.trim().length > 15, `Situatie te kort bij ${tekst.id}`);
    assert.ok(Array.isArray(tekst.body) && tekst.body.length > 0, `Tekst ${tekst.id} is leeg`);

    for (const blok of tekst.body) {
      if (typeof blok === "string") {
        assert.ok(blok.trim().length > 0, `Leeg tekstblok in ${tekst.id}`);
        continue;
      }
      assert.ok(blok.tabel, `Onbekend tekstblok in ${tekst.id}`);
      const { kop, rijen } = blok.tabel;
      assert.ok(kop.length >= 2, `Tabel ${tekst.id} heeft te weinig kolommen`);
      assert.ok(rijen.length >= 2, `Tabel ${tekst.id} heeft te weinig rijen`);
      for (const rij of rijen) {
        assert.equal(rij.length, kop.length, `Tabelrij in ${tekst.id} heeft een andere lengte`);
      }
    }

    assert.ok(
      tekst.vragen.length >= 2 && tekst.vragen.length <= 4,
      `Tekst ${tekst.id} heeft ${tekst.vragen.length} vragen; het echte examen heeft er 2 tot 4`
    );

    for (const vraag of tekst.vragen) {
      assert.ok(/^[a-z0-9-]+$/.test(vraag.id), `Ongeldig vraag-id: ${vraag.id}`);
      assert.ok(!vraagIds.has(vraag.id), `Dubbel vraag-id: ${vraag.id}`);
      vraagIds.add(vraag.id);

      assert.ok(vraag.vraag.trim().length > 10, `Vraag ${vraag.id} is te kort`);
      assert.ok(!vraagteksten.has(vraag.vraag), `Dubbele vraagtekst: ${vraag.vraag}`);
      vraagteksten.add(vraag.vraag);

      assert.equal(vraag.opties.length, 3, `Vraag ${vraag.id} heeft geen drie antwoorden`);
      for (const optie of vraag.opties) {
        assert.ok(optie.trim().length > 0, `Leeg antwoord in ${vraag.id}`);
      }
      assert.equal(new Set(vraag.opties).size, 3, `Dubbele antwoorden in ${vraag.id}`);
      assert.ok(
        Number.isInteger(vraag.juist) && vraag.juist >= 0 && vraag.juist < 3,
        `Vraag ${vraag.id} heeft geen geldig juist antwoord`
      );
      assert.ok(vraag.uitleg.trim().length > 20, `Uitleg ontbreekt bij ${vraag.id}`);
    }
  }

  assert.ok(soortenInExamen.size >= 6, `${examen.id} gebruikt te weinig verschillende tekstsoorten`);
}

console.log(`OK — ${EXAMENS.length} examen(s), ${EXAMENS[0].teksten.length} teksten, ${EXAM_SIZE} vragen.`);
for (const examen of EXAMENS) {
  const perSoort = {};
  for (const tekst of examen.teksten) perSoort[tekst.soort] = (perSoort[tekst.soort] || 0) + 1;
  console.log(
    `${examen.naam}: ${examen.teksten.length} teksten · ` +
      Object.entries(perSoort)
        .map(([soort, aantal]) => `${TEKSTSOORTEN[soort]} ${aantal}`)
        .join(" · ")
  );
}
console.log(`Slaaggrens: ${PASS_SCORE}/${EXAM_SIZE} · ${durationSeconds / 60} minuten.`);
