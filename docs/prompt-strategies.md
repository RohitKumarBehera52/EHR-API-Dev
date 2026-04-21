# Prompt Strategies Log

## Function-level vs folder-level

- Function-level prompts keep the request precise. For this repo, that usually means asking about a single file or function such as `src/services/patients.service.js`, `src/services/auth.service.js`, or `frontend/app.js` when you want Codex to explain one flow clearly.
- Folder-level prompts cover a broader extension of the app, such as `src/routes/`, `src/services/`, `tests/`, or `frontend/`, so Codex can connect route contracts, business logic, UI behavior, and QA coverage in one pass.
- Track confidence based on scope. Function-level prompts are usually stronger for targeted fixes like auth errors or token exposure, while folder-level prompts are better for cross-cutting tasks like creating testing docs, architecture notes, or repo-level guidance.

## API and architecture prompts

- Log every prompt that asks Codex to explain, audit, or transform the API flow, authentication chain, or patient summary aggregation path.
- Note what context you gave Codex, such as:
  - `src/routes/index.js`
  - `src/services/patients.service.js`
  - `src/services/auth.service.js`
  - `docs/architecture-flow.md`
  - `SRS_EHR_API.md`
- Include follow-up prompts used to refine the result, for example:
  - "Summarize how JWT authentication works in this repo."
  - "Describe how patient summary data is aggregated from the JSON files."
  - "Turn the route-to-service flow into an architecture diagram."

## Frontend and security prompts

- Record prompts that focus on UI behavior, state flow, or frontend security expectations.
- Separate creative or visual prompts from behavior prompts. For example:
  - Visual direction: "Update the UI CSS to look modern while keeping the current layout."
  - Security direction: "Remove the JWT token exposure from the UI and keep the token in memory only."
- Note whether the prompt targeted one frontend file like `frontend/styles.css` or the whole `frontend/` folder.

## Testing prompts

- Record prompts that generate test cases, testing prompts, or regression guidance for the EHR MVP.
- Pair prompts with the scope they target:
  - backend auth
  - protected route enforcement
  - summary payload coverage
  - frontend summary rendering
  - smoke and acceptance coverage
- Useful examples for this repo:
  - "Write QA test cases for login, health check, and patient summary retrieval."
  - "Create testing prompts for JWT protection and frontend summary rendering."
  - "Map regression coverage to the hidden-token UI requirement."

## Codex skill and agent prompts

- Record prompts that ask Codex to create or refine repo-local guidance under `.codex/skills/` and `.codex/agents/`.
- Note whether the task was:
  - project-wide maintenance guidance
  - testing-specific guidance
  - thread-like or workstream-specific guidance
- Example prompts:
  - "Create a repo-local skill for EHR API testing."
  - "Create an agent focused on QA and regression coverage."
  - "Update the skill so it points to the correct tests and seeded credentials."

## Prompt log

- Chronicle each prompt iteration, the inputs provided, and how long the response stayed aligned before clarification was needed.
- Useful items to record for each pass:
  - prompt text
  - files or folders provided
  - whether the prompt was function-level or folder-level
  - whether Codex stayed aligned with the implemented MVP scope
  - what follow-up prompt corrected or improved the result
- For this repo, note especially when broad prompts drift into future EHR features that are not yet implemented, such as scheduling UI, billing, uploads, or full RBAC. Those are signs that a narrower or more implementation-grounded prompt would work better next time.

## What to try next

- Compare function-level prompts for `src/services/patients.service.js` against folder-level prompts over `src/services/` to see which better captures summary logic without extra assumptions.
- Test whether pairing `SRS_EHR_API.md` with `README.md` improves requirements-aligned documentation prompts.
- Try a two-step pattern for larger tasks:
  - first ask Codex to identify the exact implemented scope from source files
  - then ask for the final artifact such as tests, docs, diagrams, or UI changes
- Keep a note of which prompt style best supports future updates to:
  - architecture docs
  - testing docs
  - frontend security behavior
  - repo-local Codex skills and agents
