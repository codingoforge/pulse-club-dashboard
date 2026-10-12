# Pulse Club — by Codingo Forge

A responsive gym dashboard portfolio concept with a live Gemini integration.

## Run
Use Node.js 22 or later. No npm dependencies are needed.

Copy `.env.example` to `.env` and set your own `GEMINI_API_KEY` in that local file. Never commit it. Run `npm start` and open http://127.0.0.1:4175.

The server rereads `.env` per request. Refresh the page after adding your key. Model availability depends on your Gemini account; set `GEMINI_MODEL` to an enabled generateContent model if needed. API docs: https://ai.google.dev/api

## Included
- Overview with calculated sample metrics and revenue/attendance chart tabs.
- Member search and renewal/check-in filters.
- Check-in dialog with duplicate protection.
- Three classes with reversible sample reservations and capacity limits.
- Gemini assistant using the current dashboard snapshot for analysis and draft messages.
- Server-only API key, bounded requests, timeout handling, safe text rendering, and in-process request limits.

## Demo scope
All members and metrics are fictional. Changes last only for the page session. No payments, messages, actual memberships, or actual reservations are created. AI output can be incorrect and needs review. The browser sends only sample dashboard data and the entered question to the same-origin backend, which sends them to Gemini.

This is a portfolio prototype, not a production gym system. There is no account login or database. Before a public production deployment add authentication and shared persistent usage limits. Current in-memory limits reset on server restart and are per process. Keep the AI demo private until those controls are added.

## Hosting
Serve the frontend and Node server together; GitHub Pages alone cannot run the AI backend. Set `HOST=0.0.0.0` and the host-provided `PORT` for a Node hosting service. Configure `GEMINI_API_KEY` using the host's secret environment settings.

## Validation
Run `npm test`. Provider response tests use mocks. A live Gemini response must be verified separately with a configured key.
