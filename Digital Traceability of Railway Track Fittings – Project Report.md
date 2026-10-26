# Digital Traceability of Railway Track Fittings Using AI and Laser QR Marking

Oct 26, 2026 · @Tejal

Smart India Hackathon 2025, problem statement 25021 (Hardware, Transportation & Logistics). Items in \[brackets\] need your own measurements or details; none of them has been invented. Figures taken from the idea deck are labeled as reported by the deck.

## 1. Problem Definition

Assigned problem (SIH 2025, problem statement 25021): develop a unified system for laser-based QR code marking on railway track fittings, so that elastic rail clips, rail pads, liners and sleepers can be identified by mobile scan and linked to the User Depot Module (UDM) and the Track Management System (TMS). AI should extract each fitting's details, including inspections from manufacture and supply to in-service performance, and flag exceptions for quality monitoring.

We interpret this as follows:

- Give every fitting a permanent, unique identity by laser-engraving a QR code on it, in a place and manner that does not weaken the part.
- Keep the code readable through coating, corrosion, dirt and vibration, and recover it when it is damaged.
- Let an inspector scan a fitting on track and see its part type, lot, vendor, manufacture date, warranty status and inspection history.
- Use AI to summarise a part's history and flag exceptions, such as repeated failed inspections or a failing lot.
- Build a hardware prototype of the marking step and a software prototype of the scan-and-inspect app, and state clearly what has and has not been tested.

Why this is needed: the deck reports that Indian Railways buys about 10 crore elastic rail clips, 5 crore liners and 8.5 crore pads each year, with no system that tracks them by vendor, lot, warranty or inspection history. Without an identity on the part, a faulty fitting cannot be traced back to its lot or vendor, and warranty claims depend on paperwork. The deck links hard-to-monitor fittings to safety risk and cites over 1,650 train accident deaths since 2004. That figure is the total for accidents, not deaths caused by fittings, so it describes the size of the safety problem and not the benefit of this system.

## 2. Data Sources and Assumptions

This project has no public dataset to calibrate from. Its inputs are figures from the problem statement, the idea deck, railway standards and supplier references. Each is tagged by how far it can be trusted: **Reported** means stated in the deck without a source, **Standard** means taken from a named specification, and **To measure** means the project must test it itself.

| Parameter | Value | Source | Status |
| --- | --- | --- | --- |
| Annual procurement | \~10 crore clips, 5 crore liners, 8.5 crore pads | Idea deck | Reported |
| Accident deaths since 2004 | Over 1,650 | Idea deck | Reported; not attributable to fittings |
| Laser type | Fiber laser for metals; CO2 or UV for pads, liners, sleepers | Idea deck, supplier pages | Reported |
| Laser power | 20–50 W | Idea deck | Reported |
| Mark type and depth | Shallow anneal, about 10–50 µm | Idea deck | To measure |
| Safe if | Placed in a low-stress area and validated | Idea deck | To measure (fatigue test) |
| Protective coating | Bituminous black, two coats of 100 µm each, 1 year of protection | IS:9862, as cited in the deck | Standard |
| Readability after corrosion | About 2 mm of corrosion | Idea deck | To measure |
| Code format | \[QR payload fields used by the prototype\] | Ministry of Railways lifetime ID code specification | To align |
| Warranty period (sample data) | 365 days | Prototype screen | Sample data |

Assumptions made by this report:

- The prototype app runs on sample records, not live UDM or TMS data.
- The marked sample is a steel cylinder, not an elastic rail clip.
- Throughput and cost figures in section 7 use assumed cycle times, labeled as such.

Limitations: the deck's impact figures (15–20% fewer defects, 10–25% lower inventory cost, 50% less inspection time) have no source or pilot behind them, so this report does not rely on them. The purpose of this report is to document the design and the evidence available, not to forecast savings.

## 3. System Model

### 3.1 Architecture

&#91;embedded content: system architecture · 3 layers, 1 planned link\]

The part is marked and coated at the factory, fitted on track, scanned on an inspector's phone, looked up in the cloud and summarised by the AI. The link to the UDM and TMS portals is planned; the prototype runs on sample records.

### 3.2 Part lifecycle

A fitting moves through these states: Manufactured, Marked, Coated, Dispatched, Fitted, Inspected (passed or failed) and Replaced. A fitted part can be inspected many times; a failed inspection leads to replacement. Because the identity is on the part itself, the history follows it across every state.

### 3.3 Part data model

| Field | Example in the prototype | Expected source | Status |
| --- | --- | --- | --- |
| Part ID (QR payload) | TR-10001 | Marking station | \[payload format to confirm\] |
| Part type | Rail pad | UDM | Sample data |
| Vendor | Smith PLC | UDM | Sample data |
| Lot number | LOT-1005 | UDM | Sample data |
| Manufacture date | Feb 1, 2025 | UDM | Sample data |
| Warranty period, expiry, time left | 365 days; derived | UDM | Sample data |
| TMS reference | Present on the screen | TMS | Sample data |
| Inspection records | Dates, result, notes, photo | App | Entered in the app |
| AI inspection analysis | Written summary of failed inspections | Genkit and Gemini | Generated text |

### 3.4 Exception rules

The deck says the AI should flag exceptions. The rules below define what an exception means, so each can be tested.

| Rule | Trigger | Why it matters | Status |
| --- | --- | --- | --- |
| Repeated failure | A part fails inspection twice or more | Replace it; the prototype's summary describes two failed inspections | \[confirm the rule exists in code\] |
| Failed inside warranty | A part fails before its warranty expires | The vendor owes a claim | Proposed |
| Lot cluster | Several parts from one lot fail | The whole lot may be defective | Proposed |
| Unreadable or unknown code | A scan fails or matches no record | Possible damage, wrong part or fake | Proposed |

### 3.5 Cost of a lookup

If records are keyed by part ID \[confirm\], an inspection lookup is one keyed read, so its cost does not grow with the number of parts in the system. The cost that scales with volume is marking time per part, analysed in section 7.

## 4. Marking Line Implementation

### 4.1 Process

The deck describes a bulk manufacturing and inspection process. Steps 1 to 6 happen at the factory and steps 7 to 9 in the field.

1. Receive the finished clips and feed them to the laser station.
2. Position each part against a PLC-controlled jig fixture so it sits at the same reference point every time. The 3-2-1 principle does this: three contacts fix the base plane, two fix a second plane and one stops the last movement, which removes all six degrees of freedom.
3. Check position and defects with an area-scan industrial camera.
4. Engrave the QR code with the fiber laser, in a low-stress area of the part.
5. Apply the protective coating after engraving.
6. Dispatch in batches and fit on track.
7. At inspection, scan the QR code of any faulty part.
8. Fetch the part's type, lot, vendor, manufacture date and warranty status from the UDM and TMS portals.
9. Replace the faulty part, with its details already known.

### 4.2 Equipment and evidence

| Item | Deck specification | Evidence so far |
| --- | --- | --- |
| Laser | Fiber laser, 20–50 W, for metals; CO2 or UV for pads, liners and sleepers | Marking head photographed on site; QR marked on a steel cylinder |
| Handling | Conveyor for throughput | Described only |
| Positioning | PLC and jig fixture set the position to (0,0) | Described only |
| Vision | Area-scan camera for position and defect checks | Described only |
| Coating | Bituminous black coating, two coats of 100 µm each | Described only; not shown on a marked sample |

### 4.3 What the line still needs

- **Unique ID before marking.** The laser job must receive a unique part ID from the data service for each part, and that ID must be registered before the part leaves the factory. Otherwise two parts can carry the same code, or a code can point at no record.
- **Read-back after coating.** The deck coats the part after engraving and shows no read check afterwards. Add a scan station after coating that rejects any part whose code does not decode to the expected ID. This also gives the project its first read-rate data.
- **Reject path.** Parts that fail the check should be re-marked or scrapped, with the decision logged.

## 5. Software Implementation and Choice of Technology

### 5.1 What is built

The repository ([Rails\_n\_Tales](https://github.com/tejal0416/Rails_n_Tales)) holds a Next.js web app. Its [package.json](https://github.com/tejal0416/Rails_n_Tales/blob/main/package.json) shows the following.

| Layer | Technology | Role |
| --- | --- | --- |
| App | Next.js 15, React 18, TypeScript | Pages, server code and routing |
| Interface | Tailwind, Radix UI (shadcn/ui), recharts | Components and monitoring charts |
| Field use | `next-pwa`, `html5-qrcode` | Installable app and a camera QR scanner |
| Forms | `react-hook-form`, `zod` | Input and validation |
| Backend | Firebase 11, Firebase App Hosting | Authentication, data and hosting |
| AI | Genkit with the Google AI plugin (Gemini) | Inspection analysis |

The deck planned C++ with OpenCV, Node.js, React and a cloud database. The built system differs: it has no OpenCV and uses Firebase in place of a custom Node backend. Image-based recovery of damaged codes is therefore planned, not built.

### 5.2 Choice of marking method

| Method | Strengths | Weaknesses | Fit |
| --- | --- | --- | --- |
| Laser etching or annealing (chosen) | High precision and a permanent, high-contrast mark; codes survive harsh rail environments; named as a marking method in the Ministry of Railways specification | Alters the surface, so its effect on a stressed spring-steel clip must be tested | Best fit |
| Dot peen | Deep marks that survive painting or galvanizing | Mechanical impact and deeper marks raise the stress-concentration question further | Possible for non-critical parts |
| Printed labels or paint | Cheap and fast | Not permanent; wears off and can be removed or swapped | Poor fit |

Sources: [Gravotech](https://www.gravotech.us/applications/railroad-markings-and-traceability), [Trotec](https://www.troteclaser.com/en/resources/blog/laser-marking-ensures-compliance-in-the-rail-industry), and the [Ministry of Railways specification](https://rcf.indianrailways.gov.in/uploads/MDTS%2049398%20Rev%200%20Issued%20%20DPM.pdf) (table of contents only).

### 5.3 Choice of software stack

| Choice | Why it fits | Alternative |
| --- | --- | --- |
| Installable web app (PWA) with a camera scanner | Runs in a phone browser with no app-store install, and can cache data for patchy track-side coverage \[offline behavior to test\] | A native Android app |
| Firebase | Managed authentication, data and hosting, so a small team can ship quickly with role-based access | A custom Node.js backend (the deck's plan), or Supabase as in BeTrade |
| Genkit with Gemini | A structured way to call a language model from server code | A rule-based summary, which is cheaper and fully predictable |

The rationale above is the reasoning for each choice; edit it to match your own reasons.

### 5.4 Requirements for the AI step

A language model can invent facts, so the inspection analysis needs guardrails:

- Give the model only the structured record of the scanned part, and instruct it to state nothing that is not in that record.
- Show the underlying facts (dates, results, warranty) beside the generated text, so the inspector never relies on the text alone.
- Keep the model's API key on the server side only.
- Compare each generated summary against its record in tests (section 6).

## 6. Verification of Correctness

No automated tests were visible in the repository, so this section sets out the checks to run and the result to record for each. A claim is only as strong as the check behind it.

| Check | Method | Pass criterion | Result |
| --- | --- | --- | --- |
| Code round trip | Encode a payload, laser-mark it, scan it with \[N\] devices, compare the decoded payload with the original | Decoded payload identical in every scan | \[x of N\] |
| ID uniqueness | Query the part registry for duplicate IDs | Zero duplicates | \[result\] |
| Lookup correctness | Scan each of \[N\] sample parts and compare the returned record with the registry | Every scan returns its own record | \[x of N\] |
| Exception rules | Unit tests with seeded records, one set per rule in section 3.4 | Expected flags raised and no others | \[x of N\] |
| AI grounding | For \[N\] records, check that every date, result and count in the summary appears in the record | No invented facts | \[x of N\] |
| Access control | Try reading and writing as an inspector, as another role and unauthenticated | Only permitted actions succeed | \[result\] |
| Offline use | Scan with the network off, then restore it | Report is queued and sent without loss | \[result\] |
| Repeatability | Run the same record through the rules twice | Identical flags both times | \[result\] |

The exception rules are deterministic, so they can be tested exactly. The AI text can differ between runs, so only the facts inside it are checked, not its wording.

## 7. Evaluation

### 7.1 Experimental setup

| Item | Value |
| --- | --- |
| Laser | \[make and model\], fiber, \[power\] W, \[speed\], \[frequency\] |
| Sample parts | \[N\] \[steel cylinders / clips / pads\] |
| Code | QR, \[module size\], \[payload length\], \[error-correction level\] |
| Coating | \[product\], \[N\] coats of \[thickness\] µm |
| Scanning devices | \[phone models and camera resolution\] |
| Repetitions | \[N\] scans per sample and condition; report the median and the worst case |
| Metrics | Read rate (decoded on first scan), time to decode, print-quality grade |

Print quality of a laser-marked code should be graded to ISO/IEC TR 29158, as described in [Trotec's guide to reading laser markings](https://www.troteclaser.com/en/resources/blog/reading-laser-markings-efficient-traceability-with-reading-devices), so results can be compared with other systems.

### 7.2 Readability under field conditions

This is the central test: the deck claims the code stays readable after coating and about 2 mm of corrosion, and nothing yet proves it.

| Condition | Samples | Read rate | Grade | Notes |
| --- | --- | --- | --- | --- |
| As engraved | \[N\] | \[%\] | \[A–F\] |  |
| After coating | \[N\] | \[%\] | \[A–F\] | Contrast of black coat over a dark mark |
| After corrosion test (\[method, duration\]) | \[N\] | \[%\] | \[A–F\] |  |
| After dirt, grease or ballast dust | \[N\] | \[%\] | \[A–F\] |  |
| Low light | \[N\] | \[%\] | \[A–F\] |  |
| Angled or curved surface (\[angle\]) | \[N\] | \[%\] | \[A–F\] |  |

### 7.3 Throughput and number of stations

The deck says about 10 crore clips are bought a year but gives no cycle time. The number of marking stations needed is:

**stations = (N × t) ÷ (T × u)**

where N is parts per year, t is seconds per part, T is seconds in a year (31,536,000) and u is the share of time a station is working. With N = 100,000,000 and assumed cycle times:

| Seconds per part (assumed) | Stations at 100% use | Stations at 60% use |
| --- | --- | --- |
| 2 | 6.3 | 10.6 |
| 5 | 15.9 | 26.4 |
| 10 | 31.7 | 52.8 |

Two points follow. First, the cycle time is set by handling, positioning and verification as much as by the laser, so it must be measured on the real line \[measured t\]. Second, the figure is a national annual total spread across many vendors, so each vendor needs only a few stations, which supports the deck's point that vendors may resist buying lasers.

### 7.4 Software responsiveness

| Metric | Target | Measured |
| --- | --- | --- |
| Scan to decoded ID | \[target\] | \[median, worst\] |
| Decoded ID to report on screen | \[target\] | \[median, worst\] |
| AI summary response | \[target\] | \[median, worst\] |
| First load on a mobile connection | \[target\] | \[median, worst\] |

## 8. Effect of Design Parameters

The marking process has several settings, and each trades readability against cost or risk. The expected direction in the table is a hypothesis to test, not a result.

| Parameter | Deck value | Expected direction (to test) | Experiment |
| --- | --- | --- | --- |
| Laser power | 20–50 W | More power gives a deeper, higher-contrast mark but a larger heat-affected zone | Mark \[N\] samples at \[3 or more\] power levels; record contrast grade and time |
| Mark depth | About 10–50 µm | Deeper marks last longer under corrosion but raise fatigue risk | Measure depth; run the same readability test on each depth |
| Marking speed | \[not stated\] | Faster marking shortens cycle time but can lower contrast | Mark at \[speeds\]; record read rate and time per part |
| Code size and module size | \[not stated\] | Larger modules read more reliably on rough or curved surfaces but need more flat area | Mark at \[sizes\]; record read rate and the smallest readable size |
| Code location | Low-stress area | A flat, protected area reads best and carries the least stress | Compare \[locations\] on a real clip |
| Coating thickness | 2 × 100 µm | Thicker coating protects longer but can hide the mark | Read after \[1, 2, 3\] coats |
| Coating colour and finish | Black bituminous | A dark coat over a dark mark lowers contrast | Compare against a lighter or clear finish if the standard permits |
| Scan angle and light | \[not stated\] | Steep angles and low light lower read rate | Scan at \[angles\] and \[light levels\] |

### Study design

1. Change one parameter at a time and keep the others at a stated baseline.
2. Use at least \[N\] samples per setting and the same scanning devices throughout.
3. Record read rate, print-quality grade and time per part for every setting.
4. Choose the setting that meets the read-rate target with the least depth and time.
5. Run a fatigue test on parts marked at the chosen setting, against the railway's clip specification \[confirm which\], before any claim that the mark is safe.

The last step is the gate for the whole project. A readable mark that weakens the clip is not an acceptable result.

## 9. Bottleneck and Risk Analysis

| Risk or bottleneck | Why it matters | Mitigation |
| --- | --- | --- |
| Fatigue from the mark | Clips are highly stressed spring steel; a surface mark can start a crack | Mark in a low-stress area at the shallowest depth that reads; run fatigue tests (section 8) |
| Readability after coating and corrosion | The coating goes on after engraving and may hide the mark | Read-back station after coating; test at several coat counts and finishes |
| Damaged or worn codes | Field scans will meet scratches, dirt and corrosion | Choose a higher QR error-correction level, which recovers more damage at the cost of a larger code; add image-based recovery later |
| Small, curved marking area | A clip offers little flat surface | Test code sizes and locations on real clips |
| Cycle time and throughput | Handling and verification can outweigh laser time | Measure t on the real line; size stations with the formula in section 7.3 |
| No proven UDM and TMS access | The whole value depends on pulling live part data | Seek API or export access from the railway; keep an import path as a fallback |
| Unique ID integrity | Duplicate or unregistered IDs break traceability | Issue IDs from one service and register them before marking |
| Poor coverage on track | Inspectors may have no signal | Cache data on the device and queue reports \[test\] |
| AI inventing facts | A wrong summary can mislead an inspector | Ground the model in the record and show the facts beside the text |
| Secrets and access | The AI needs an API key; inspection data needs role control | Keep keys on the server, use Firebase security rules, and check the repository history for leaked keys |
| Vendor adoption and cost | The deck notes most vendors make one or two part types and will not all buy lasers | Consider shared marking depots or zone-level stations, and start with a pilot |

One risk is already visible in the evidence: the hardware has marked a steel cylinder, not a clip, and no read-rate or fatigue data exists yet. Until those two are measured, every impact figure in the deck is an assumption.

The deck cites research on restoring damaged QR codes with a lightweight deep-learning model ([paper](https://www.scitepress.org/Papers/2025/132872/132872.pdf)). It is the natural starting point for the damaged-code recovery that this report lists as future work.

## 10. Conclusion and Future Work

We designed a traceability system for Indian Railways track fittings in which a laser-engraved QR code gives each part a permanent identity, an inspector's phone reads it, and a cloud service with an AI summary presents the part's history and flags exceptions. The evidence so far is a laser-marked QR code on a steel sample, an inspection app prototype built with Next.js, Firebase and Genkit, and site photographs from the team's visits. It does not yet include clip-specific marking, read-rate or fatigue data, live UDM and TMS access or damaged-code recovery, so the deck's impact figures remain assumptions.

Future work, in order of importance:

1. Mark real elastic rail clips and run the fatigue test on the chosen settings.
2. Run the readability study in section 7.2 and report read rates and print-quality grades.
3. Add a unique-ID service and a read-back station after coating.
4. Obtain UDM and TMS access, or an agreed data export, and replace the sample records.
5. Align the code payload with the Ministry of Railways lifetime ID specification.
6. Build damaged-code recovery with computer vision, starting from the research cited in the deck.
7. Extend marking to pads, liners and sleepers with CO2 or UV lasers, and test each.
8. Add automated tests and a build pipeline for the software, then run a depot pilot with agreed measures of success.

## References

- Smart India Hackathon 2025, problem statement 25021, and the team's idea-submission deck (Team Andaaz, Team ID 82773).
- Ministry of Railways, [Technical requirements for generation of lifetime ID code and marking the code on component](https://rcf.indianrailways.gov.in/uploads/MDTS%2049398%20Rev%200%20Issued%20%20DPM.pdf) (table of contents only was read).
- [Rails\_n\_Tales repository](https://github.com/tejal0416/Rails_n_Tales) and its [package.json](https://github.com/tejal0416/Rails_n_Tales/blob/main/package.json).
- Trotec, [Reading laser markings](https://www.troteclaser.com/en/resources/blog/reading-laser-markings-efficient-traceability-with-reading-devices) and [Laser marking ensures compliance in the rail industry](https://www.troteclaser.com/en/resources/blog/laser-marking-ensures-compliance-in-the-rail-industry).
- Gravotech, [Railroad markings and traceability](https://www.gravotech.us/applications/railroad-markings-and-traceability).
- LSRPF, [Laser etched versus engraved](https://www.lsrpf.com/blog/what-is-the-difference-between-laser-etched-and-engraved), and Acctek, [CO2 laser marking machine](https://www.acctekgroup.com/laser-marking-machine/co2-laser-marking-machine/), as cited in the deck.
- SCITEPRESS (2025), [QR code recognition using a lightweight deep-learning model to restore damaged codes](https://www.scitepress.org/Papers/2025/132872/132872.pdf), as cited in the deck.
- IS:9862 (bituminous black paint for track fittings), as cited in the deck from ner.indianrailways.gov.in.
- ISO/IEC TR 29158 (direct part mark quality), as referenced by Trotec.
- Case study of the Chandigarh–Dibrugarh Express accident, and the IRICEN digital model room, as cited in the deck.

## Appendix A: Build and Run Instructions

Commands come from the scripts in `package.json`.

```bash
npm install
npm run dev          # development server on port 9002
npm run genkit:dev   # Genkit developer UI for the AI flows
npm run typecheck
npm run lint
npm run build
npm start
```

- Node.js version: \[confirm\].
- Environment variables: the Gemini API key \[variable name\] and the Firebase configuration \[variable names\]. Store values in a local env file that is not committed.
- Deployment: Firebase App Hosting, configured by `apphosting.yaml` and `.firebaserc`.

## Appendix B: Key Source Listing

Paste here the function that looks up a part by its scanned ID and the function that applies the exception rules, with their file paths in `src` \[paths\]. The `src` folder could not be read while preparing this report, so no code is shown.
