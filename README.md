# Flow Remote Ops — Personalized Delegation Roadmap Funnel

A standalone, single-page conversion funnel for **audit.flowremoteops.com**,
offering a free **Personalized Delegation Roadmap**. Built with plain HTML,
CSS, and vanilla JavaScript — no Python, no Flask, no React, no database.

This is a **completely separate project** from the main flowremoteops.com
website. It does not share code, forms, or the Google Sheets integration
with the main site. Nothing here touches that repo.

---

## 1. Strategy

### Target audience: B2B agencies & consultancies (2–20 people)

Evaluated against urgency, ease of reaching decision-makers, willingness to
pay, and fit with what Flow Remote Ops already does well:

| Segment | Urgency | Reach decision-makers | Willingness to pay | Fit today |
|---|---|---|---|---|
| **Agencies & consultancies** | High — client load arrives in bursts, admin/reporting piles up fast | High — owners active on LinkedIn, easy to DM directly | Medium-high — already budget for tools/contractors | Strong — matches existing outreach skillset and `/who-we-help/agencies` positioning |
| Service-based businesses | Medium | Medium | Medium | Moderate |
| Growing businesses, general | Medium | Low-medium (broad, hard to target) | Varies widely | Already the main site's audience |
| Founders needing admin/lead-research/follow-up | High | Medium | Medium | Strong but narrower |

Agencies win on three of four criteria and let the whole funnel speak to one
specific, recognizable pain instead of a generic "growing business" message.

### Headline options (used in the hero)

1. *"Stop Guessing What to Delegate."* (sub: "Get Your Personalized
   Delegation Roadmap") — **used on the page.** Names the real frustration
   (not knowing what to hand off) rather than a vague promise, and leads
   straight into the offer name.
2. *"Find the 3–5 Tasks You Should Hand Off This Month"* — more concrete,
   but reads more like a listicle headline than a B2B offer.
3. *"A Clear, Personalized Roadmap for What to Delegate Next"* — accurate
   but flatter, no tension in it.

Option 1 won: it states the problem in four words, and the sub-headline
immediately resolves it with the named deliverable.

### The offer: Personalized Delegation Roadmap

Upgraded from the generic "Free Remote Team Assessment" into a named,
specific deliverable. What the prospect actually receives (realistic for a
small team to prepare manually — no promise of an "extensive audit"):

1. Their main operational bottleneck, in plain language.
2. 3–5 specific tasks worth delegating (not a generic VA task list).
3. The right support category for each — executive & admin, bookkeeping,
   creative & content, or systems & automation.
4. A priority level per task: high / medium / low.
5. One practical first step they can take regardless of whether they hire.
6. The questions worth resolving before hiring anyone, in-house or remote.

Delivered as: a short written document, prepared after a form submission and
a short call — not an automated PDF, and not a "comprehensive audit." If
hiring isn't the right move yet, the roadmap says so directly.

### Lead scoring (manual, simple — run this when reviewing new submissions)

Score each submission 0–8 using what they wrote in the form:

| Signal | Points |
|---|---|
| Business type matches target profile (agency/consultancy/service business) | +2 |
| Stated challenge matches one of the four service categories | +2 |
| Selected a "Type of support needed" option (didn't leave it "Not sure yet") | +1 |
| Challenge description shows urgency ("behind," "overwhelmed," "falling apart") | +1 |
| Company website is live and looks like a real, active business | +2 |

**High (6–8):** follow up same day, propose a call directly.
**Medium (3–5):** follow up within 1–2 days, ask one clarifying question first.
**Low (0–2):** still reply (never silently discard a lead), but with the
confirmation email only — no hard push for a call yet.

This is a manual judgment aid, not an automatic filter — every submission
gets a reply either way.

---

## 2. Follow-up email templates

### 1. Confirmation (send immediately after every submission)

> **Subject:** Your Delegation Roadmap request — what happens next
>
> Hi {{first_name}},
>
> Thanks for requesting a Personalized Delegation Roadmap. I'll review what
> you shared about {{company_name}} and follow up within 1 business day —
> either with a time to talk, or a couple of clarifying questions first.
>
> Talk soon,
> {{sender_name}}, Flow Remote Ops

### 2. Helpful follow-up (1–2 days later, for Medium/High leads with no call booked)

> **Subject:** Re: your biggest challenge at {{company_name}}
>
> Hi {{first_name}},
>
> You mentioned {{their_stated_challenge}} — that's a common bottleneck for
> agencies around your size, and often has a faster fix than a full-time
> hire. I'd like to walk you through what we'd put in your roadmap: [booking
> link]. If timing's off, just reply and let me know.
>
> {{sender_name}}

### 3. Final check-in (about a week later, no pressure)

> **Subject:** Still happy to help whenever it's useful
>
> Hi {{first_name}},
>
> No worries if now isn't the right time — just didn't want this to fall
> through the cracks. If it opens up again, the roadmap offer still stands:
> [booking link].
>
> {{sender_name}}

## 3. Discovery call outline (for calls booked off the roadmap)

1. Their biggest operational challenge, in their own words (don't assume
   the form answer is the whole story — ask them to expand).
2. Which tasks are eating the most hours this month.
3. Current team size and how work is currently split.
4. What they've already tried (a VA, a part-time hire, nothing yet).
5. Which support category seems like the best fit, and why.
6. A clear next step: a specific role recommendation, or honestly, "this
   might be a process fix rather than a hire yet."

## 4. Measurement plan

Track, at minimum:

| Metric | How to track (free/low-cost) |
|---|---|
| Visitors | Plausible or Cloudflare Web Analytics (privacy-friendly, no cookie banner needed) — add the one-line script tag to `index.html`'s `<head>` once you pick one |
| CTA clicks | Same tool's event tracking, or a simple `gtag`/`plausible` event fired in `js/main.js`'s `openModal()` |
| Calculator interactions | An event fired in `setupTimeLeakCalculator()` when a row is added or `recalculate()` runs with a non-zero total |
| Form starts | An event on the first `input` inside `#assessment-form-el` |
| Successful submissions | An event in the `try` block after `response.ok` in `js/main.js` |
| Qualified leads (Medium/High score) | Manual tally from the lead-scoring table above, in whatever sheet/inbox receives submissions |
| Discovery calls booked | Your booking tool's own dashboard (Calendly/Google Calendar) |
| Proposals sent / clients acquired | Manual tracking — a simple spreadsheet row per lead is enough at this volume |

No tracking script is wired in yet — this is deliberately left to you to
choose and add, since it's a privacy/consent decision (cookie banners,
IP handling) that shouldn't be made silently in code.

**If visitors arrive but don't submit the form**, two experiments worth
running before touching the design again:
1. **Shorten the path** — test moving the modal-trigger CTA higher (right
   after the hero) against the current placement, and see if raw click
   rate on "Get Your Free Assessment" changes.
2. **Check calculator engagement** — if people use the calculator but still
   don't submit, the roadmap pitch after it may need to be more specific
   (e.g., naming the task categories they just entered) rather than generic.

---

## 5. Project structure

```
audit-flowremoteops/
├── index.html        the entire one-page funnel
├── css/
│   └── styles.css    all styling (dark navy / gold / light blue, matches main site)
├── js/
│   └── main.js        modal, form validation + submission, time-leak calculator, footer year
├── assets/            put your logo/favicon here (see "Assets" below)
└── README.md
```

## 6. Running it locally

No build step, no dependencies. Either:

- Double-click `index.html` to open it directly in a browser, or
- Serve it so relative paths behave exactly like production:
  ```
  cd audit-flowremoteops
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## 7. Assets — logo / favicon

`index.html` already references `assets/favicon.png` in two places (the
`<link rel="icon">` tag and an `<img class="logo-img">` in the header with
`onerror="this.remove()"`, so the page degrades cleanly to the text wordmark
if the file isn't there yet). To use your real logo:

1. Copy your actual `favicon.png` from the main site's `static/images/`
   into `audit-flowremoteops/assets/favicon.png`.
2. That's it — both the browser tab icon and the header logo pick it up
   automatically once the file exists at that path.

## 8. Form integration — required before launch

**The lead form does not send anywhere yet.** It has full client-side
validation and a honeypot spam field, but `js/main.js` has a deliberately
empty `FORM_ENDPOINT` constant — submitting right now shows the visitor an
honest message asking them to email you directly, rather than pretending
the submission was saved. Configure one of the following before real leads
can come through:

### Option A — Formspree (simplest, no backend)

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and copy its endpoint URL
   (looks like `https://formspree.io/f/xxxxxxxx`).
3. In `js/main.js`, set:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
   ```
4. Formspree's free tier includes spam filtering and email notifications
   per submission — no credentials are exposed in the frontend, since the
   endpoint is a public form URL by design, not a secret key.

### Option B — The shared "Flow Remote Ops CRM" Apps Script (current setup)

By request, this funnel's lead form is now wired to post into the **same**
shared Google Apps Script Web App ("Flow Remote Ops — All-forms webhook")
and the **same** "Flow Remote Ops CRM" Google Sheet that the main
flowremoteops.com site's forms already use — specifically its `"Leads"`
tab. `js/main.js` does **not** contain or modify that script; it only
sends data shaped to match it, exactly the way the main site's own lead
form already does.

The script's `doPost(e)` dispatches on a hidden `form_type` field and, for
`form_type: "lead"`, appends a row to the `"Leads"` tab in this column
order:

```
Timestamp | Name | Email | Company | Website | Business Description |
Type of Support | Headcount | Engagement | Company Size | Message |
Newsletter | Stage
```

This funnel's short form (name, work email, company website, biggest
operational challenge, optional support type) doesn't collect a separate
company name, headcount, engagement, company size, or a newsletter
opt-in — those columns are intentionally left blank for rows from this
funnel rather than guessed. The "biggest operational challenge" answer is
sent as `message`, so it lands in the `Message` column where it's
actually readable.

**To turn this on:**

1. Open the CRM spreadsheet → **Extensions → Apps Script → Deploy → Manage
   deployments**, and copy the **Web app URL** (ends in `/exec`). The
   spreadsheet's own `.../edit?...` link is *not* this URL — if the Web
   app hasn't been deployed yet, use **New deployment → type: Web app →
   Execute as: Me → Who has access: Anyone → Deploy**, then copy that URL.
2. In `js/main.js`, set:
   ```js
   const FORM_ENDPOINT = "https://script.google.com/macros/s/XXXXXXX/exec";
   ```

**Important technical note — why the request is sent the way it is:**
Apps Script's `doPost(e)` reads submitted fields from `e.parameter`, which
is only populated for a form-encoded (or multipart) POST body — not a raw
JSON body. So `js/main.js` sends the payload as `URLSearchParams`, not
`JSON.stringify`. It also sends the request with `mode: "no-cors"`,
because Apps Script Web App responses don't carry an
`Access-Control-Allow-Origin` header, so a normal cross-origin `fetch`
would have its response blocked by the browser even on a successful
write. `no-cors` avoids that false failure, at the honest cost of not
being able to read back a real success/error status from Google — this
is the standard, documented trade-off for posting to an Apps Script Web
App directly from a static site with no backend of its own. The code
still treats a genuine network-level failure (offline, blocked,
unreachable) as an error and shows the fallback-email message in that
case; it just can't distinguish "Google rejected it" from "Google
accepted it" the way a normal CORS-enabled API would.

## 9. Deploying to audit.flowremoteops.com

This is a static site — any static host works. Two simple, low-cost options.
**Assume none of this is configured yet** — verify each step rather than
skipping ahead.

### Cloudflare Pages (recommended — same provider as your DNS)

1. Push this folder to its own GitHub repo (separate from the main site's repo).
2. In the Cloudflare dashboard → Pages → Create a project → connect that repo.
3. Build settings: none needed (no build command, output directory = `/`).
4. After the first deploy, go to the Pages project's **Custom domains** tab
   and add `audit.flowremoteops.com`. Cloudflare will offer to create the
   DNS record automatically since the zone is already on Cloudflare.

### Netlify / Vercel (equally simple, if you'd rather not add another Cloudflare product)

1. Drag-and-drop the folder (or connect the repo) into Netlify or Vercel.
2. Add `audit.flowremoteops.com` as a custom domain in the project settings.
3. Add the CNAME record it gives you in Cloudflare DNS (see below).

### DNS configuration (do this regardless of host)

In the Cloudflare DNS settings for `flowremoteops.com` (the same zone your
main site already uses), add:

```
Type:   CNAME
Name:   audit
Target: <the hostname your chosen host gives you, e.g. your-project.pages.dev>
Proxy status: Proxied (orange cloud) — recommended for Cloudflare Pages
```

This is an **additive** DNS record — it does not touch the existing
records pointing the root domain or `www` at Railway.

## 10. Testing checklist before launch

- [ ] Test at ~1366px (desktop), ~768px (tablet), and ~390px (mobile) — no horizontal scroll at any width
- [ ] Tab through the page with keyboard only — focus states visible on links, buttons, and form fields
- [ ] Click any "Get My Free Delegation Roadmap" button — modal fades in, background doesn't scroll
- [ ] Press `Escape` while the modal is open — it closes
- [ ] Click the dimmed backdrop (not the dialog) — it closes
- [ ] Click the × button — it closes, and focus returns to the button you opened it from
- [ ] Submit the form with empty fields — inline errors appear, no page reload
- [ ] Submit with an invalid email — email-specific error appears
- [ ] Submit with all fields valid and `FORM_ENDPOINT` configured — confirm the row/notification actually arrives wherever you pointed it
- [ ] Time-leak calculator: add a few rows, enter hours, confirm weekly/monthly totals update live; remove a row; hit Reset
- [ ] FAQ `<details>` items expand/collapse and are reachable by keyboard
- [ ] Favicon and header logo show your real brand asset once `assets/favicon.png` exists

## 11. What's still needed before this can accept real leads

1. Your real logo/favicon file, dropped into `assets/favicon.png`.
2. A configured `FORM_ENDPOINT` in `js/main.js` (Formspree or your own
   Apps Script — see Section 8).
3. The `audit` CNAME record in Cloudflare DNS, plus the host connected to it.
4. A decision on where follow-up happens from (which inbox monitors new
   submissions) — this project only captures the lead; it doesn't send any
   follow-up email automatically. Use the templates in Section 2 manually,
   or wire them into whatever email tool you already use.
5. An analytics tool, if you want the measurement plan in Section 4 — none
   is installed by default.
6. The real hero photograph (Section 12's "Image1"), once it's identified —
   the hero currently shows an abstract placeholder graphic, not a photo.
7. Manual verification of the Meta Pixel in Meta Events Manager (Section 12)
   — it has not been tested against a live ad account from this environment.

## 12. Premium redesign pass — what changed, and what's unverified

This section documents the redesign done against the "Premium Flow Remote
Ops Funnel Redesign" brief.

**Files changed:** `index.html`, `css/styles.css`, `js/main.js`.

**Visual direction:** switched from the earlier dark/neon/glassmorphism
treatment to the brief's premium B2B direction — a dark navy-to-blue
gradient hero (with a contained, low-opacity abstract ribbon shape, not
repeated elsewhere on the page) bookended by a matching dark final-CTA and
footer, with all content sections (Problem, Solution, Roadmap, Calculator,
How It Works, Who It's For, FAQ) now warm-white/soft-gray with restrained
blue accents and small, muted gold accents. All continuous "neon pulse"
animations and the glass-blurred modal were removed; the only animation
left is a single, non-repeating fade/lift on load and on scroll, and it's
already disabled under `prefers-reduced-motion`.

**Hero visual — "Image1" not identified:** the brief refers to a prepared
photo named "Image1" for the hero. I could not find a file matching that
name — your uploads contain roughly 90 unlabeled screenshots/PNGs from
earlier in this project, and I'm not able to guess which one you mean among
that many. Rather than fabricate or mislabel a stock photo as a "realistic
business-owner/workspace photograph," the hero currently shows a plain
abstract geometric graphic (three overlapping translucent panels — no fake
UI, no invented data) with a small caption noting it's a placeholder. Send
me the exact file (or point me to it) and I'll drop it in.

**"Image2" (roadmap preview) and "Image3" (How It Works):** same issue —
not identified among the uploads. The roadmap preview section is built
directly in HTML/CSS instead (a sample "Illustrative example" card), which
sidesteps the brief's own concern about embedded text being illegible in an
image. How It Works currently has no image; if Image3 turns out to fit
there once identified, it can be added as a supporting visual.

**Fake dashboard removed:** the previous hero visual was a mocked "Remote
Ops Overview" panel with invented task rows and status pills. The brief
explicitly rules out fake dashboards/metrics, so it's been replaced with
the abstract graphic described above.

**Copy:** hero headline/subcopy/reassurance, the primary CTA ("Get My Free
Delegation Roadmap," now consistent everywhere it appears), the secondary
CTA ("See How It Works," a plain text link in the hero so it doesn't
compete with the primary button), the final CTA, and the FAQ now match the
brief's exact wording and the 6-question list. The support-type dropdown
and the FAQ's category list were both updated to the brief's 6 official
categories (Executive & Administrative, Finance & Bookkeeping, Creative &
Content, Systems & Automation, Lead Generation & Sales Support, Customer
Support & Other Operations), replacing the earlier ad-hoc list from a prior
session.

**"Book a Call":** demoted from a full button competing with the primary
CTA (which the brief says to avoid above the fold) to a small text link
near the final CTA only. It still uses the `CALENDLY_URL` constant in
`js/main.js`, already configured with your Google Calendar booking link
from earlier in this project.

**Meta Pixel (ID `1397542595919906`):** a single base snippet was added to
`index.html`'s `<head>` — confirmed there was no prior Pixel code anywhere
in this project, so this is not a duplicate. `PageView` fires on load as
part of that base snippet. `Lead` fires once, from `js/main.js`, only
inside the form's success branch (never on CTA click, modal open, or a
failed/validation-blocked attempt) — see the comment directly above
`fbq('track', 'Lead')` in that file for the exact condition.
**Unverified limitation, stated plainly:** the CRM webhook is posted to
with `mode: "no-cors"` (required for a static page talking to this Apps
Script Web App — see Section 8), which means the browser cannot read back
whether Google actually accepted the row. "Lead" fires when the request
left the browser without a network-level error — the closest thing to
"confirmed success" this integration can offer without a real backend
in front of it, not a guarantee the CRM row was written. I have not tested
this against Meta Events Manager or a live ad account (no browser or Meta
credentials available in this environment) — please verify there manually
before relying on reported Lead counts, and cross-check a few against
actual new rows in the CRM sheet.

**Duplicate-submission guard:** the submit handler now has an explicit
`isSubmitting` flag (in addition to disabling the submit button during the
request) to block a double-click or double-Enter from firing two
submissions — and, by extension, two Lead events — for one actual
form fill.

**Tests actually run** (no browser available in this environment, so
nothing below is a visual/interactive confirmation):
- `node --check js/main.js` — passes.
- HTML tag-balance check (section/div/svg/button/select/etc.) — balanced.
- Local HTTP smoke test on all three files — all return 200.
- Grep confirmed exactly one Meta Pixel base snippet (no duplicates) and
  no leftover references to any removed classes (`bg-wave`, `glow-orb`,
  `dashboard-mock`, the old neon-pulse keyframes).

**Tests NOT run, and why:** actual rendering at 1366px/768px/390px, the
modal's open/close animation, keyboard-only navigation, clicking through
the real form, and the Meta Pixel firing in Events Manager all require a
real browser and/or live ad-account access, neither of which this
environment has. Please run through Section 10's testing checklist
yourself after dropping these files in, and treat the Pixel as unverified
until you've confirmed a test `Lead` event in Events Manager.