# Flowbot — ManyChat-inspired messaging workspace

A modular starter project for a customer messaging and automation platform. It is inspired by common ManyChat-style workflows; it is not a complete feature-for-feature replacement yet.

## Current project structure

- `frontend/src/App.jsx` — app shell, responsive navigation and page routing.
- `frontend/src/components/` — independently maintained UI modules (overview, automation, contacts, inbox, broadcasts, settings, channel setup and flow builder).
- `frontend/src/auth/googleLogin.js` — Google OAuth redirect helper.
- `frontend/src/auth/facebookLogin.js` — Facebook OAuth redirect helper.
- `backend/src/controllers/` — API controller modules.
- `backend/src/routes/` — API route modules.
- `backend/src/services/` — external channel integrations.
- `database/schema.sql` — database schema.

## Run in GitHub Codespaces

Terminal 1:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev -- --host 0.0.0.0
```

Open the forwarded Vite port shown by Codespaces. Configure backend database and provider credentials in `backend/.env`; configure OAuth client IDs in `frontend/.env`.

## Important security notes

- Demo login and demo records are for UI testing only, not production authentication or real message delivery.
- OAuth should be completed and verified by the backend using authorization-code flow, state/CSRF protection, and secure sessions before production use. Do not treat a client-side token or demo token as proof of identity.
- Never commit `.env` files or provider secrets. Keep secrets on the backend, not in `VITE_*` variables.
- Channel connection cards are UI placeholders until the corresponding provider OAuth/webhook setup is completed and tested.

## Current milestone

This update adds a responsive SaaS-style workspace shell, navigation for overview/live chat/contacts/automations/flow builder/broadcasts/channels/settings, a starter flow canvas preview, and separate Google/Facebook OAuth redirect helpers. ManyChat's full feature set is large; implement and verify each integration incrementally rather than claiming every feature is already functional.
