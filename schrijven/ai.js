/* Generated from shared/ai.js: edit it there and run shared/build.sh */
/* shared/ai.js: de enige plek die een AI aanroept.
   Twee routes, dezelfde vorm terug ({ tekst }):
     1. licentiesleutel → onze Worker (worker/): nakijktegoed, limieten en
        modelkeuze staan aan de serverkant. Zet hieronder de Worker-URL.
     2. eigen DeepSeek-sleutel → rechtstreeks naar api.deepseek.com, gratis.
   De app bouwt de opdracht zelf; dit bestand doet alleen het transport. */

window.AI = (() => {
  // Zet hier de URL uit `wrangler deploy`. Leeg = tegoed-route staat uit.
  const WORKER = "https://examen-ai.nlexamen-ai.workers.dev";

  const KEY_LIC = "examen-licentie";
  const KEY_DS = "schrijven-a2-deepseek-key";
  const KEY_TEGOED = "examen-tegoed";
  const DS_URL = "https://api.deepseek.com/chat/completions";
  const DS_MODEL = "deepseek-chat";

  /* Moet gelijk blijven aan SYSTEM in worker/src/index.js. */
  const SYSTEM = {
    schrijven:
      "You are a certified rater for Dutch A2 writing exams. Reply with one JSON object only, no markdown.",
    spreken:
      "You are a certified rater for Dutch A2 speaking exams. Reply with one JSON object only, no markdown.",
    plan:
      "You are a Dutch tutor for the inburgeringsexamen A2. Reply in plain text, no JSON: five days, fifteen minutes each, exercises with the answers at the very end.",
  };

  const lees = (naam) => (localStorage.getItem(naam) || "").trim();
  const faal = (melding) => Object.assign(new Error(melding), { melding });

  const licentie = () => lees(KEY_LIC);
  const heeftTegoed = () => Boolean(WORKER && licentie());

  function bewaarLicentie(waarde) {
    const schoon = String(waarde || "").trim();
    if (schoon) localStorage.setItem(KEY_LIC, schoon);
    else localStorage.removeItem(KEY_LIC);
  }

  /* Laatst bekende tegoed, zodat de UI het ook na een herlaadbeurt kan tonen. */
  function tegoed() {
    try {
      const opgeslagen = JSON.parse(localStorage.getItem(KEY_TEGOED) || "null");
      return opgeslagen && Number.isFinite(opgeslagen.limiet) ? opgeslagen : { gebruikt: 0, limiet: 0 };
    } catch {
      return { gebruikt: 0, limiet: 0 };
    }
  }

  function bewaarTegoed(gebruikt, limiet) {
    const stand = { gebruikt: Number(gebruikt) || 0, limiet: Number(limiet) || 0 };
    if (stand.limiet) localStorage.setItem(KEY_TEGOED, JSON.stringify(stand));
  }

  /* Eén opdracht voor alle drie de onderdelen: het examen, de uitslag, en de
     data die de app al heeft over wat er fout ging. */
  function planPrompt({ examen, uitslag, data }) {
    return [
      "You are my Dutch tutor. I am preparing for the inburgeringsexamen A2 and I want to pass.",
      "",
      `Exam: ${examen}. My result: ${uitslag}.`,
      "",
      "Below is the JSON of my attempt: my answers, what was wrong, and the official rubric.",
      "",
      "## What to produce",
      "A plan for 5 days, 15 minutes per day. No grading, no praise, no JSON, no summary of what I already know.",
      "",
      "For every day:",
      "1. one line in Dutch: what I practise that day",
      "2. the exercise itself, in Dutch, at A2 level, built from mistakes I actually made",
      "3. which of my own answers or sentences I rewrite that day, quoted, then corrected",
      "Put all answers together at the very end under `## Antwoorden`, so I cannot read them by accident.",
      "",
      "Order the days by payoff: day 1 is the change that earns me the most points next attempt.",
      "Use only mistakes from the JSON. If I did not miss something, do not practise it.",
      "Scores at `mijn_score.a2_baseline` are normal for A2, not mistakes. Do not spend a day on them unless the text is wrong.",
      "End with at most 5 rules to remember.",
      "",
      "## Constraints",
      "- A2 only. Short sentences, about 8 words, one idea per sentence. No B1 grammar, no stacking subordinate clauses.",
      "- The aanhef and the afsluiting are already in the answer box; I only add my name. No introduction, no filler: the first sentence answers the first bullet point.",
      "- Every corrected sentence must be at most as long as what I wrote. Simpler is better; a word I cannot spell is a word I should not use.",
      "- Explain in English. Every Dutch example must be correct Dutch.",
      "- Be concrete: quote my text, then the fix.",
      "- Do not invent exam questions.",
      "",
      ...(data.teksten
        ? ["## My texts, with line breaks", "", data.teksten, ""]
        : []),
      "## My attempt",
      "```json",
      JSON.stringify(data, null, 2),
      "```",
    ].join("\n");
  }

  async function plan({ examen, uitslag, data, signal }) {
    const { tekst } = await ask({
      mode: "plan",
      prompt: planPrompt({ examen, uitslag, data }),
      signal,
    });
    return tekst;
  }

  async function ask({ mode = "schrijven", prompt, audio, format, signal }) {
    if (heeftTegoed()) return viaWorker({ mode, prompt, audio, format, signal });
    const sleutel = lees(KEY_DS);
    if (!sleutel) {
      throw faal(
        licentie()
          ? "De tegoed-route staat nog uit: zet de Worker-URL in shared/ai.js."
          : "Vul een licentiesleutel of je eigen DeepSeek-sleutel in."
      );
    }
    return viaDeepSeek({ mode, prompt, sleutel, signal });
  }

  async function viaDeepSeek({ mode, prompt, sleutel, signal }) {
    const antwoord = await fetch(DS_URL, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sleutel}` },
      body: JSON.stringify({
        model: DS_MODEL,
        temperature: 0,
        max_tokens: mode === "plan" ? 3000 : 2000,
        ...(mode === "schrijven" ? { response_format: { type: "json_object" } } : {}),
        messages: [
          { role: "system", content: SYSTEM[mode] },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!antwoord.ok) throw faal(deepseekMelding(antwoord.status));

    const data = await antwoord.json().catch(() => null);
    const tekst = data?.choices?.[0]?.message?.content || "";
    if (!tekst.trim()) throw faal("DeepSeek gaf een leeg antwoord.");
    return { tekst };
  }

  function deepseekMelding(status) {
    if (status === 401) return "DeepSeek: sleutel ongeldig.";
    if (status === 402) return "DeepSeek: geen saldo op deze sleutel.";
    if (status === 429) return "DeepSeek: te veel aanvragen. Wacht even.";
    return `DeepSeek-fout ${status}.`;
  }

  async function viaWorker({ mode, prompt, audio, format = "webm", signal }) {
    const antwoord = await fetch(WORKER, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license: licentie(), mode, prompt, audio, format }),
    });

    const data = await antwoord.json().catch(() => ({}));
    if (data?.limit) bewaarTegoed(data.used, data.limit);

    if (!antwoord.ok) throw faal(workerMelding(antwoord.status, data));
    if (!String(data?.text || "").trim()) throw faal("Nakijken gaf een leeg antwoord.");
    return { tekst: data.text };
  }

  function workerMelding(status, data) {
    if (data?.error === "license") return "Licentie ongeldig of verlopen. Koop een nieuwe of gebruik je eigen sleutel.";
    if (data?.error === "quota") return `Nakijktegoed op: ${data.used} van ${data.limit} deze maand.`;
    if (data?.error === "rate") return "Te veel aanvragen kort na elkaar. Wacht een minuut.";
    if (data?.error === "input") return "De aanvraag is te groot. Kort je antwoord of je opname in.";
    if (data?.error === "config") return "De nakijkdienst is nog niet ingesteld (OPENROUTER_KEY ontbreekt).";
    if (data?.error === "credit") return "De nakijkdienst heeft even geen tegoed. Probeer het later of gebruik je eigen sleutel.";
    if (data?.error === "busy") return "Het nakijken is even te druk. Probeer het over een minuut.";
    if (status === 402) return "Licentie ongeldig of verlopen.";
    if (status === 429) return "Te veel aanvragen. Wacht even.";
    return `Nakijken mislukte (${status}).`;
  }

  return { ask, plan, licentie, bewaarLicentie, heeftTegoed, tegoed };
})();
