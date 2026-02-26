# Epilepsy Prediction Tools

Clinical prediction calculators for epilepsy management, developed at **UMC Utrecht** in collaboration with international partners. The tools provide individualized probability estimates to support clinical decision-making in epilepsy onset, AED withdrawal, epilepsy surgery, and juvenile myoclonic epilepsy (JME).

**Live site:** https://wmotte.github.io/epilepsypredictiontools/

---

## Calculators

### Epilepsy Onset

| Calculator | Method | Reference |
|---|---|---|
| [First Consultation (FSC)](https://wmotte.github.io/epilepsypredictiontools/first-consultation.html) | Logistic regression | van Diessen et al., *Pediatrics* 2018 |

Estimates the probability of an epilepsy diagnosis after one or more paroxysmal events at first consultation, based on 11 clinical and EEG parameters. Developed and validated at UMC Utrecht and the Martini Hospital Groningen.

---

### AED Withdrawal

| Calculator | Method | Reference |
|---|---|---|
| [AED Withdrawal Risk](https://wmotte.github.io/epilepsypredictiontools/aed-withdrawal.html) | Nomogram | Lamberink et al., *Lancet Neurology* 2017 |

Predicts 2-year and 5-year seizure recurrence risk and long-term seizure freedom for patients with epilepsy in remission who are considering AED withdrawal. Based on an individual participant data meta-analysis of ten populations (children and adults). Does **not** apply to patients who became seizure-free through epilepsy surgery.

---

### Epilepsy Surgery

| Calculator | Method | Reference |
|---|---|---|
| [TTS Postoperative Withdrawal Risk](https://wmotte.github.io/epilepsypredictiontools/tts-withdrawal.html) | Nomogram (3 models) | Lamberink et al., *Epilepsia* 2018 |
| [IQ ≥ 85 After Surgery](https://wmotte.github.io/epilepsypredictiontools/iq85.html) | Lookup table | Cloppenborg et al., *Neurology* 2022 |
| [IQ ≥ 70 After Surgery](https://wmotte.github.io/epilepsypredictiontools/iq70.html) | Lookup table | Cloppenborg et al., *Neurology* 2022 |
| [DQ ≥ 50 After Surgery](https://wmotte.github.io/epilepsypredictiontools/dq50.html) | Lookup table | Cloppenborg et al., *Neurology* 2022 |

**TTS:** Predicts seizure recurrence and long-term outcome after AED withdrawal in children following epilepsy surgery (TimeToStop study, 766 children, 15 centres, 8 European countries). Three models: 2-year/5-year recurrence, long-term freedom, and cure probability.

**IQ/DQ:** Predicts post-operative cognitive outcome two years after pediatric epilepsy surgery, using pre-surgical IQ or DQ as the primary predictor. Collaborative study between Universitätsklinik OWL and UMC Utrecht.

---

### Juvenile Myoclonic Epilepsy (JME)

| Calculator | Method | Reference |
|---|---|---|
| [JME AED Withdrawal](https://wmotte.github.io/epilepsypredictiontools/jme-withdrawal.html) | Lookup table | Stevelink et al., *eClinicalMedicine* 2022 |
| [JME Drug Resistance](https://wmotte.github.io/epilepsypredictiontools/jme-resistance.html) | Lookup table | Stevelink et al., *eClinicalMedicine* 2022 |

Both calculators are based on an individual participant data meta-analysis (Stevelink et al. 2022) identifying predictors of JME treatment outcomes across multiple international cohorts.

**JME Withdrawal:** Predicts 2-year and 5-year seizure recurrence probability after ASM withdrawal in JME patients who are currently seizure-free. Inputs: age at withdrawal (years), seizure-free interval (years), number of ASMs.

**JME Drug Resistance:** Predicts the probability of drug-resistant JME (defined as failure of two adequate ASM trials) from 9 clinical variables, covering 1024 possible combinations.

---

## References

1. **van Diessen E**, Lamberink HJ, Otte WM, Doornebal N, Brouwer OF, Jansen FE, Braun KPJ. A Prediction Model to Determine Childhood Epilepsy After 1 or More Paroxysmal Events. *Pediatrics* 2018; 142(6):e20180931. DOI: [10.1542/peds.2018-0931](https://doi.org/10.1542/peds.2018-0931)

2. **Lamberink HJ**, Otte WM, Geerts AT, Pavlovic M, Ramos-Lizana J, Marson AG, Overweg J, Sauma L, Specchio LM, Tennison M, Cardoso TMO, Shinnar S, Schmidt D, Geleijns K, Braun KPJ. Individualised prediction model of seizure recurrence and long-term outcomes after withdrawal of antiepileptic drugs in seizure-free patients – a systematic review and individual participant data meta-analysis. *Lancet Neurology* 2017; 16(7):523–531. DOI: [10.1016/S1474-4422(17)30114-X](https://doi.org/10.1016/S1474-4422(17)30114-X)

3. **Lamberink HJ**, Boshuisen K, Otte WM, Geleijns K, Braun KPJ, on behalf of the TimeToStop Study Group. Individualized prediction of seizure relapse and outcomes following antiepileptic drug withdrawal after pediatric epilepsy surgery. *Epilepsia* 2018. DOI: [10.1111/epi.14020](https://doi.org/10.1111/epi.14020)

4. **Cloppenborg T**, van Schooneveld MMJ, Hagemann A, Hopf JL, Kalbhenn T, Otte WM, Polster T, Bien CG, Braun KPJ. Development and validation of prediction models for developmental and intellectual outcome following pediatric epilepsy surgery. *Neurology* 2022; 98:e225–e235. DOI: [10.1212/WNL.0000000000013065](https://doi.org/10.1212/WNL.0000000000013065)

5. **Stevelink R**, Otte WM, et al. Individualised prediction of drug resistance and seizure recurrence after medication withdrawal in people with juvenile myoclonic epilepsy: a systematic review and individual participant data meta-analysis. *eClinicalMedicine* 2022; 53:101732. DOI: [10.1016/j.eclinm.2022.101732](https://doi.org/10.1016/j.eclinm.2022.101732)

---

## Repository Structure

```
docs/                          # Static site (served via GitHub Pages)
├── index.html                 # Landing page with 8 calculator cards
├── aed-withdrawal.html        # AED Withdrawal Risk
├── tts-withdrawal.html        # TTS Postoperative Withdrawal Risk
├── first-consultation.html    # First Consultation (FSC)
├── iq85.html                  # IQ > 85 After Surgery
├── iq70.html                  # IQ > 70 After Surgery
├── dq50.html                  # DQ > 50 After Surgery
├── jme-withdrawal.html        # JME AED Withdrawal
├── jme-resistance.html        # JME Drug Resistance
├── css/
│   └── style.css              # UMC Utrecht house style
└── js/
    ├── ui.js                  # Shared UI logic (modal, result display)
    ├── aed-calc.js            # AED nomogram calculations
    ├── tts-calc.js            # TTS nomogram calculations (3 models)
    ├── fsc-calc.js            # FSC logistic regression
    ├── iq85-calc.js           # IQ > 85 lookup table (400 rows)
    ├── iq70-calc.js           # IQ > 70 lookup table (200 rows)
    ├── dq50-calc.js           # DQ > 50 lookup table (160 rows)
    ├── jme-withdrawal-calc.js # JME withdrawal lookup (20,400 rows, 2y+5y)
    └── jme-resistance-calc.js # JME drug resistance lookup (1024 rows)

EpilepsyPredictionTools/       # Original PHP/CouchCMS source (archived)
├── www/                       # Original website PHP source
├── IQ_php_calculator/         # IQ/DQ calculator PHP source and lookup CSVs
└── JME_calculator/            # JME calculator PHP source and lookup CSVs
```

---

## Technical Implementation

The site is fully static — no server, database, or build step required. It runs directly from `file://` or any static host.

- **No dependencies:** Pure vanilla JavaScript (ES5), no frameworks or jQuery
- **Nomogram calculators** (AED, TTS): Risk tables encoded as JavaScript arrays; scores are summed from per-variable point tables and used as direct array indices
- **Logistic regression** (FSC): Coefficients applied directly in JS with `Math.exp()`
- **Lookup table calculators** (IQ, DQ, JME): Source CSV data embedded in JS as either `Map` objects (keyed by variable combination) or compact flat integer arrays with a direct index formula, depending on table size
- **JME Withdrawal** uses a flat array of 20,400 integer values (probabilities × 10,000) indexed by `(asm−1)×5100 + sf×100 + (age−1)`, providing real individualized 2-year and 5-year recurrence probabilities from the Stevelink 2022 model

---

## Deployment

The site is deployed to GitHub Pages from the `docs/` folder:

1. In the repository **Settings → Pages**, set source to **Deploy from a branch**, branch `main`, folder `/docs`
2. The site will be available at `https://wmotte.github.io/epilepsypredictiontools/`

To run locally, open `docs/index.html` directly in a browser — no web server needed.

---

## Disclaimer

These tools are intended for **research and educational purposes only**. They are not certified medical devices. Clinical decisions must always be made using professional judgment and in consideration of the individual patient's circumstances. The tools do not replace consultation with a qualified healthcare professional.

&copy; UMC Utrecht
