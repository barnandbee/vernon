# Vernon — App Overview

Vernon is a career-coaching web platform that blends a human coach, a library of curated
resources, guided self-reflection, and an AI "thinking partner" into one product. This
document describes what's built so far, how it's organised, and the functionality planned
next.

## Status

Vernon is currently a **front-end prototype / demo**, not a production system:

- **Stack:** Next.js 16.2.7 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4, `lucide-react` icons, `jspdf` for PDF export.
- **No real backend.** Every feature is backed by mock data (static arrays in `src/lib` and `src/app/(dashboard)/dashboard/coachData.ts` / `journeyData.ts`) persisted client-side only, via `localStorage`/`sessionStorage`. This gives the demo persistence across reloads in one browser, but nothing is shared across devices, users, or sessions in reality.
- **Deployment:** runs locally (`npm run dev`) or as a static export to GitHub Pages at `https://barnandbee.github.io/vernon/` (`GITHUB_PAGES=true npm run build`); also deployable as a normal Next.js app (e.g. Vercel).
- **Four account types** (member, coach, organisation staff, platform admin) are simulated end-to-end via seeded demo accounts rather than real sign-up/auth.

## Accessing the demo

The whole site sits behind a site-wide passcode gate (`SiteGate`, separate from login), then a login screen with four seeded accounts, one per persona:

| Persona | Account type | Email | Password | Demo identity |
|---|---|---|---|---|
| Member / coachee | `member` | demo@vernon.app | XXXXX | Jamie Rivera |
| Organisation staff | `org_staff` | org@vernon.app | XXXXX | Priya Anand · Lighthouse Partners |
| Coach | `coach` | coach@vernon.app | XXXXX | Sarah Mitchell |
| Platform admin | `platform_admin` | admin@vernon.app | XXXXX | Jordan Blake · Super Admin |

## Account types and navigation

Navigation is role-based — each account type sees a different sidebar/mobile-nav, and the dashboard layout redirects any attempt to visit a route outside that role's allowed set.

| Member | Coach | Organisation staff | Platform admin |
|---|---|---|---|
| Home | Coach Home | Organisation Dashboard | Admin Home |
| My Journey | My Clients | Reports | Users |
| Coaching Calendar | Schedule | Profile | Organisations |
| Learning | Resource Finder | | Resources |
| Resources | CPD & Training | | Report Fields |
| Practice | Profile | | Permissions |
| Reflections | | | Profile |
| Community | | | |
| Career Chat | | | |
| Profile | | | |

Organisation staff intentionally have the smallest surface area: an aggregate dashboard, a standalone reports view, and their own profile, with no visibility into any individual member's content.

## Feature tour

### Member experience

- **Home** — time-of-day greeting, overall journey progress, a coach-update notice, quick links into every section, upcoming sessions, and recommended reading.
- **My Journey** — the coaching hub: guided reflection prompts, notes from past/upcoming coaching sessions, an editable action plan (todo/in‑progress/done), quick-win tasks, longer-term goals with progress bars, free-exploration suggestions, and a way to send notes directly to your coach ahead of a session.
- **Coaching Calendar** — calendar and list views of booked sessions (status: confirmed/pending/completed) and available slots to book.
- **Learning** — three tracks (Career Exploration, Career Application, Career Movement) of structured modules, plus hands-on activities: a Job Ad Reviewer, a Book-Jacket Bio Writer, a Career Profile Builder (feeds the AI resource engine, see below), and a Quick Skill Snapshot.
- **Resources** (`/dashboard/articles`) — the personalised resource library: every article/video/podcast/toolkit is annotated with an AI-style insight explaining *why* it's relevant to you, plus a curated "something a bit different" exploration set, bookmarking, and thumbs up/down feedback.
- **Practice** — a five-dimension self-assessment (comfort with uncertainty, openness to feedback, etc.) that generates targeted suggestions for real-world action.
- **Reflections** — a daily reflection prompt plus a categorised prompt library (Purpose, Values, Strengths, Goals, Coaching Follow-up), with streak and history tracking.
- **Community** — a peer circle, an opt-in activity feed of milestones, and a weekly group prompt members can choose to publish or keep private.
- **Career Chat** — a conversational "Vernon AI" assistant with starter prompts and demo replies tuned to common situations (making a plan, feeling stuck, etc.). Currently scripted/keyword-matched rather than a live model — see Roadmap.
- **Profile** — account details, AI/communication preference toggles, an Awards & Activity panel (streaks, badges, stats), and the member's own **Vernon Insights** diagnostic report (see below).

### Coach experience

- **Coach Home** — KPI cards (active clients, sessions this month, action items completed, average progress), upcoming appointments, and a "clients needing attention" panel that surfaces anyone without a booked next session or flagged as needing a nudge.
- **My Clients** — per-client workspace: profile and tags, a **Vernon Insights** summary card (top values, sector interest, readiness, coaching focus), editable coach notes, notes shared by the client, AI-generated notes from session transcripts (each a quote plus a suggested action that can be pushed to the action plan with one click), and the shared, editable action plan itself.
- **Schedule** — calendar/list views of booked appointments plus a form to publish new availability slots.
- **Resource Finder** — natural-language search over the resource library ("a client preparing to negotiate…") and a workflow to assign resources directly to a named client.
- **CPD & Training** — a continuing-professional-development tracker: hours logged vs. target, and a library of accreditation/training items with status (not started / in progress / completed).

### Organisation staff experience

- **Organisation Dashboard** — anonymised, org-wide metrics only: active vs. invited members, weekly engagement (with trend), total reflections logged, sessions completed, a journey-stage breakdown (e.g. "building momentum," "nearing goals"), a feature-adoption heatmap, a sample member activity table, and a "Download PDF Report" export. A persistent privacy note (`OrgPrivacyNote`) makes clear that reflection content, chat conversations, and coaching notes are never visible at the org level — only aggregate participation.
- **Reports** — the same org-wide metric cards as the dashboard, on their own page, filtered to whatever the platform admin has currently enabled (see Report Fields below).

### Platform admin experience

- **Admin Home** — stat cards (platform users, organisations, library resources, enabled report fields), "recently added" panels for users and organisations, and quick-access tiles into each admin tool below.
- **Users** — add, edit, and delete platform users (name, email, role/title, account type, status) — the same roster that backs every login across all four personas.
- **Organisations** — add, edit, and delete organisations (name, primary contact, plan, member count), the records that populate the org-staff dashboard and admin stat cards.
- **Resources** — add, edit, and delete entries in the shared resource library (title, summary, category, author, date) that members see in Resources and coaches see in Resource Finder, with changes reflected immediately.
- **Report Fields** — rename, redescribe, regroup, or enable/disable any metric card shown on the organisation dashboard and org-staff Reports page. Only the field's visibility and copy are admin-editable; the underlying numbers stay static demo data, and changes propagate live to every org_staff session.
- **Permissions** — the fixed four-tier model (Super Admin, Admin, Editor, Viewer) below, shown as a capability matrix, plus a per-admin dropdown (Super Admin only) to reassign another admin's level.

All five admin tools share the same pattern: every page computes whether the signed-in admin's level grants the matching capability and, if not, hides its add/edit/delete controls and shows a read-only warning banner instead — enforced both in the UI and again inside each mutating handler, not just by hiding buttons.

## Cross-cutting systems

### Vernon Insights diagnostic

A 5-question diagnostic — top 3 work values, sector interest, readiness to make a move, experience level, and how you want to navigate coaching (advancing, career change, leadership, negotiation, personal development, returning) — that:

- Member demo accounts are prompted to complete on every login (designed for repeatable demoing rather than a real "once ever" gate).
- Generates a plain-language summary ("Most motivated by impact and growth, with an interest in technology…") shown in full on the member's own Profile page, with the ability to retake it any time.
- Feeds the resource-personalisation engine (ranked values and coaching focus are matched against resource tags/categories) as a secondary signal alongside the user's career profile.
- Surfaces as a condensed summary card on the coach's My Clients view, giving coaches a top-level read on a client's motivations and stage without re-asking the questions themselves.

### AI resource personalisation engine

`resourceInsights.ts` matches a member's career-profile skills and Vernon Insights answers against each resource's category/tags to (a) write a short, personalised "why this matters to you" narrative for every resource, and (b) generate a small set of deliberately low-overlap "exploration" picks. Combined with bookmarking and thumbs up/down feedback, this is the closest thing in the app today to a recommendation system — currently rule-based (keyword/tag overlap), not model-driven.

### Trust and transparency

- `SourceBadge` distinguishes content that comes from a human coach vs. from Vernon AI, used throughout action plans, reflections, and learning prompts.
- Preference toggles (per member, per coach, and org-wide) let AI transcript recording, AI suggestions, and AI recommendations be switched off independently at each level.
- `OrgPrivacyNote` repeats, wherever member data feeds the org dashboard, exactly what is and isn't shared upward.

## Architecture notes

- **Routing:** Next.js App Router with two route groups — `(auth)` for the login page, `(dashboard)` for everything behind it. `(dashboard)/layout.tsx` is the single shared shell: it enforces the auth redirect, the per-role route allow-list, and the one-per-login Vernon Insights diagnostic trigger.
- **"Fake backend" convention:** every stateful feature lives in a small `src/lib` module exposing `get*`/`set*`/`save*` functions over `localStorage`/`sessionStorage`, with SSR-safe `typeof window === 'undefined'` guards. This keeps page components simple and makes it straightforward to swap in a real API later without changing call sites much.
- **Styling:** Tailwind v4 plus CSS custom properties (`--primary`, `--surface`, `--text-muted`, etc.) for theming; the Playwrite GB S Guides Google Font is used for the "Vernon" wordmark and page headers, Geist for body text.

## Roadmap / suggested next steps

The app is intentionally a clickable, end-to-end prototype. The most natural next steps, in roughly the order they'd unlock real-world use:

1. **Real backend and persistence.** Replace the localStorage-backed mock modules with an actual database and API so data survives across devices and supports many real organisations, coaches, and members concurrently.
2. **Real authentication.** Replace the four seeded demo accounts and shared site passcode with real sign-up/login (email+password or SSO), per-organisation tenancy, and a member invite flow — the org dashboard already implies invites exist ("86 active of 120 invited").
3. **A genuine LLM-backed Career Chat.** Today's chat matches keywords to canned replies; swapping in a real model would let it have grounded, multi-turn coaching conversations — this was raised and intentionally deferred during development, but is the most visible "fake AI" in the app today.
4. **Fuller use of the Vernon Insights diagnostic.** Sector preference, readiness, and experience level are captured but not yet wired into resource matching, because the resource library has no sector/seniority tags yet. Tagging the library and extending `resourceInsights.ts` would let recommendations use the whole diagnostic, not just values and coaching focus.
5. **Real scheduling.** Coaching Calendar and Schedule currently read/write static mock appointments; real coach availability, conflict handling, calendar sync (Google/Outlook), and video-call links (Zoom/Meet) would make booking actually work.
6. **Notifications and email.** A "weekly newsletter" preference already exists in the UI, but nothing sends it — session reminders, coach replies, and digest emails are a natural next step.
7. **Coach matching.** Members are currently pre-assigned to a single coach in mock data; a real platform would need a matching or marketplace flow (using Vernon Insights, sector, and availability) to pair new members with a coach.
8. **Billing and plans.** No subscription or payment flow exists yet; required before this could run as a real B2B (organisation-seat) or B2C (member-subscription) product.
9. **Native mobile apps.** Currently a responsive web app only; the mobile nav exists but there's no packaged iOS/Android app.
