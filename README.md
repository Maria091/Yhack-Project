# CivicLink — Community Resource Matcher

**A hackathon-style civic technology concept**, built as an interactive, mobile-friendly website. It matches people to *fictional demo* food, housing, health, transportation and learning resources through explainable, deterministic matching criteria.

**Important:** These resources are made up for software demonstration. They are **not** real providers, and this site must **not** be used to seek emergency help, medical care, housing or other real-world services. This is not an official YHack competition submission or award claim.

## Features

- Filter by resource type, city, audience and urgency.
- Transparent ranking: matches explain exactly why a resource appears.
- Show availability labels (open, limited, waitlist) and sample program details.
- Privacy-respecting: no account, location permissions, network calls, analytics or data collection.
- Accessible forms, readable cards and responsive design.
- Test-driven matching rules and GitHub Actions CI.

## Run the site locally

```bash
python -m http.server 8000
```

Open http://localhost:8000. No package installation required for the website. For automated tests, install Node.js 20+ and run `npm test`.

## Publish to GitHub Pages

Repository **Settings → Pages → Deploy from a branch → main / (root)**. Pages hosting must be enabled by the owner.

## Architecture

- `src/data.js` — clearly synthetic sample resource directory.
- `src/matcher.js` — pure deterministic filtering, scoring and explainable reasons.
- `src/app.js` — accessible browser UI and DOM rendering.
- `tests/` — independent unit tests run by GitHub Actions.

### Example scoring

Resources must pass the selected category, supported city (including remote) and audience criteria. The ranking rewards exact category and city matches, currently available listings and urgency-compatible availability. Waitlists receive a penalty. Scores are illustrative heuristics, not AI predictions, fair eligibility determinations or measures of provider quality.

## Future features

A real product would require verified provider data, consent-centered workflows, multilingual content, accessible support routes, security review, data freshness controls and continuous community-partner validation. No real provider integrations are included.
