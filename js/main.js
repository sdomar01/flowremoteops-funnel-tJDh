/* ============================================
   Flow Remote Ops — Free Assessment funnel
   Vanilla JS: footer year, modal open/close, form validation, submission.
   ============================================ */

// --------------------------------------------------------
// CONFIGURE THIS before the form can accept real submissions.
//
// By request, this form now posts into the SAME shared "Flow Remote
// Ops -- All-forms webhook" Apps Script Web App used by the main
// flowremoteops.com site (the one that already has a "Leads" tab with
// Name/Email/Company/Website/Business Description/Type of
// Support/Headcount/Engagement/Company Size/Message/Newsletter/Stage
// columns, keyed off a hidden "form_type" field). This file does NOT
// modify that script or that sheet in any way -- it only sends data
// shaped to match it, the same way the main site's own lead form does.
//
// IMPORTANT: the Google Sheet *edit* link
// (docs.google.com/spreadsheets/d/.../edit) is NOT the endpoint --
// paste the deployed Web App URL instead (ends in "/exec"). Get it
// from: open the sheet -> Extensions -> Apps Script -> Deploy ->
// Manage deployments -> copy the "Web app" URL. If it isn't deployed
// yet, "New deployment" -> type: Web app -> Execute as: Me -> Who has
// access: Anyone -> Deploy, then copy that URL.
//
// Leaving this empty is intentional until it's configured -- the
// form will clearly tell visitors to email you instead of silently
// pretending the submission went through.
// --------------------------------------------------------
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbw7BD21gSCU8wl-TGq9xwhypkbWT_OEveuaaWtQbgutEyQuac8DiUwqMB2vaCNF8vxC/exec";
const FALLBACK_EMAIL = "info@flowremoteops.com";

// --------------------------------------------------------
// CONFIGURE THIS to turn on the "Book a Call" buttons.
//
// Paste your Calendly (or other scheduling-tool) booking page URL here,
// e.g. "https://calendly.com/your-handle/intro-call". Every element with
// the class "js-calendly-link" (the hero and final-CTA "Book a Call"
// buttons) will open it in a new tab.
//
// Leaving this empty is intentional until it's configured -- the
// buttons stay visible but won't navigate anywhere broken; they just
// quietly do nothing on click instead of pretending to work.
// --------------------------------------------------------
const CALENDLY_URL = "https://calendar.app.google/FzLaXXFpCRm2MoXD7";


document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setupAssessmentModal();
  setupAssessmentForm();
  setupTimeLeakCalculator();
  setupScrollReveal();
  setupCalendlyLinks();
});

/* --------------------------------------------------------
   "Book a Call" buttons: point them at CALENDLY_URL once it's set.
   Until then, they stay visible but the click is safely swallowed
   instead of following the placeholder "#" href.
   -------------------------------------------------------- */
function setupCalendlyLinks() {
  const links = document.querySelectorAll(".js-calendly-link");
  if (!links.length) return;

  links.forEach((link) => {
    if (CALENDLY_URL) {
      link.href = CALENDLY_URL;
      link.target = "_blank";
      link.rel = "noopener";
      link.removeAttribute("title");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.title = "Scheduling link coming soon";
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  });
}

/* --------------------------------------------------------
   Scroll-reveal: fades/lifts section headings and cards in as they
   enter the viewport. Pure opacity/transform via CSS -- this just
   toggles the class. Respects prefers-reduced-motion automatically,
   since the global reduced-motion rule in styles.css already zeroes
   out transition/animation durations site-wide.
   -------------------------------------------------------- */
function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    // No IntersectionObserver support -- just show everything rather
    // than leaving content permanently invisible.
    targets.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------
   Assessment modal: opened by any "Get My Free Delegation Roadmap"
   trigger (hero, header, final CTA all link to "#assessment-form").
   Closes via the × button, Escape, or a click on the overlay itself
   (not on the dialog). Locks background scroll without shifting
   layout, and returns focus to whichever button opened it.
   -------------------------------------------------------- */
function setupAssessmentModal() {
  const overlay = document.getElementById("assessment-modal-overlay");
  const dialog = document.getElementById("assessment-form");
  const closeBtn = document.getElementById("assessment-modal-close");
  if (!overlay || !dialog || !closeBtn) return;

  const triggers = document.querySelectorAll('a[href="#assessment-form"]');
  let lastFocusedTrigger = null;
  let isOpen = false;

  function openModal(trigger) {
    if (isOpen) return;
    isOpen = true;
    lastFocusedTrigger = trigger || document.activeElement;

    // Lock background scroll without causing a layout shift from the
    // disappearing scrollbar.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + "px";
    }
    document.body.classList.add("modal-open");

    overlay.hidden = false;
    // Next frame, so the "hidden -> visible" change and the opacity/
    // transform transition don't collapse into a single instant jump.
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
    });

    const firstField = dialog.querySelector("#af-name");
    if (firstField) {
      window.setTimeout(() => firstField.focus(), 50);
    }

    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;

    overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
    document.removeEventListener("keydown", onKeydown);

    // Wait for the fade/scale-out transition to finish before actually
    // hiding the element, so the close reads as an animation rather
    // than a jump cut. Matches the CSS transition duration.
    window.setTimeout(() => {
      if (!isOpen) {
        overlay.hidden = true;
        // Put the form back to its default view so a returning visitor
        // who already submitted once sees a fresh form next time,
        // instead of reopening straight into the old success panel.
        resetAssessmentFormView();
      }
    }, 300);

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(trigger);
    });
  });

  closeBtn.addEventListener("click", () => closeModal());

  // Close on a click that lands on the overlay itself, not inside the
  // dialog -- i.e. clicking the dimmed backdrop.
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // The success panel's own "Close" button (shown after a submission)
  // closes the modal the same way the × button does.
  const successCloseBtn = document.getElementById("form-success-close");
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => closeModal());
  }
}

/* Shared by the modal close handler and the form-submit handler so both
   can put the assessment form back to its default (non-success) view. */
function resetAssessmentFormView() {
  const form = document.getElementById("assessment-form-el");
  const successPanel = document.getElementById("form-success");
  if (form) {
    form.hidden = false;
    form.reset();
    const supportOtherInput = form.querySelector("#af-support-other");
    if (supportOtherInput) supportOtherInput.hidden = true;
  }
  if (successPanel) successPanel.hidden = true;
}

function setupAssessmentForm() {
  const form = document.getElementById("assessment-form-el");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = form.querySelector(".assessment-form-submit");
  const btnLabel = submitBtn.querySelector(".btn-label");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  const fields = {
    name: { input: form.querySelector("#af-name"), error: form.querySelector("#af-name-error") },
    email: { input: form.querySelector("#af-email"), error: form.querySelector("#af-email-error") },
    website: { input: form.querySelector("#af-website"), error: form.querySelector("#af-website-error") },
    challenge: { input: form.querySelector("#af-challenge"), error: form.querySelector("#af-challenge-error") },
  };

  // "Other (please specify)" in the support-type dropdown reveals a
  // plain text field so the visitor can type their own answer instead
  // of being stuck picking the closest-sounding category.
  const supportSelect = form.querySelector("#af-support");
  const supportOther = {
    input: form.querySelector("#af-support-other"),
    error: form.querySelector("#af-support-other-error"),
  };

  function syncSupportOtherVisibility() {
    const isOther = supportSelect && supportSelect.value === "other";
    supportOther.input.hidden = !isOther;
    if (!isOther) {
      supportOther.input.value = "";
      setFieldError(supportOther, "");
    }
  }

  if (supportSelect) {
    supportSelect.addEventListener("change", syncSupportOtherVisibility);
    syncSupportOtherVisibility();
  }

  function setFieldError(field, message) {
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    field.error.textContent = message || "";
  }

  function validate() {
    let isValid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError(fields.name, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError(fields.name, "");
    }

    const emailVal = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setFieldError(fields.email, "Please enter your work email.");
      isValid = false;
    } else if (!emailPattern.test(emailVal)) {
      setFieldError(fields.email, "That email doesn't look right.");
      isValid = false;
    } else {
      setFieldError(fields.email, "");
    }

    if (!fields.website.input.value.trim()) {
      setFieldError(fields.website, "Please enter your company website.");
      isValid = false;
    } else {
      setFieldError(fields.website, "");
    }

    if (!fields.challenge.input.value.trim()) {
      setFieldError(fields.challenge, "Let us know your biggest operational challenge.");
      isValid = false;
    } else {
      setFieldError(fields.challenge, "");
    }

    if (supportSelect && supportSelect.value === "other" && !supportOther.input.value.trim()) {
      setFieldError(supportOther, "Please tell us what kind of support you need.");
      isValid = false;
    } else {
      setFieldError(supportOther, "");
    }

    return isValid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnSpinner.hidden = !isLoading;
    btnLabel.textContent = isLoading ? "Sending..." : "Get My Free Delegation Roadmap";
  }

  function setStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (kind) statusEl.classList.add(kind === "success" ? "is-success" : "is-error");
  }

  // Extra guard against accidental duplicate submissions (double-click,
  // double Enter) beyond the submit button's own disabled state during
  // the request -- this flag blocks re-entry synchronously, before the
  // button's disabled attribute would even take effect.
  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setStatus("", null);

    // Honeypot: if this hidden field has a value, it was filled by a bot.
    // Silently drop (not a real submission), but don't show an error that
    // would tip off the bot -- just stop here.
    const honeypot = form.querySelector("#af-company-hp");
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    if (!validate()) {
      setStatus("Please fix the fields highlighted above.", "error");
      return;
    }

    // If "Other" was picked, send what the visitor actually typed
    // instead of the literal word "other".
    const supportTypeValue =
      supportSelect && supportSelect.value === "other"
        ? supportOther.input.value.trim()
        : supportSelect
        ? supportSelect.value
        : "";

    // Shaped to match the shared "All-forms webhook" Apps Script's
    // doPost(e) for form_type "lead" -- it appends to the "Leads" tab
    // in this order: Name, Email, Company, Website, Business
    // Description, Type of Support, Headcount, Engagement, Company
    // Size, Message, Newsletter, Stage. This funnel's short form
    // doesn't ask for company name, headcount, engagement, company
    // size, or a newsletter opt-in, so those columns are intentionally
    // left blank rather than guessed -- and the "biggest operational
    // challenge" answer goes into the Message column, where a human
    // reviewing the sheet will actually read it.
    const payload = {
      form_type: "lead",
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      website: fields.website.input.value.trim(),
      message: fields.challenge.input.value.trim(),
      support_type: supportTypeValue,
      source: form.querySelector('input[name="source"]').value,
      submitted_at: new Date().toISOString(),
    };

    if (!FORM_ENDPOINT) {
      // Not configured yet -- tell the visitor honestly rather than
      // pretending this was saved anywhere.
      console.error(
        "[assessment-form] FORM_ENDPOINT is not set in js/main.js -- " +
        "this submission was NOT sent anywhere. See README.md."
      );
      setStatus(
        `This form isn't fully connected yet. Please email us directly at ${FALLBACK_EMAIL} and we'll follow up right away.`,
        "error"
      );
      return;
    }
        // Open the booking tab NOW, while we still have the user's click
    // permission. We point it at the booking page after the submit succeeds.
    let bookingWin = null;
    if (CALENDLY_URL) {
      bookingWin = window.open("about:blank", "_blank");
      if (bookingWin) bookingWin.opener = null;
    }

    isSubmitting = true;

    isSubmitting = true;
    setLoading(true);
    try {
      // The Apps Script's doPost(e) reads e.parameter, which only gets
      // populated for a form-encoded (or multipart) body -- NOT a raw
      // JSON body. So this sends URLSearchParams, not JSON.stringify.
      //
      // It also uses mode: "no-cors". Apps Script Web App responses
      // don't carry an Access-Control-Allow-Origin header, so a normal
      // cross-origin fetch would have its response blocked by the
      // browser even when the row was written successfully. "no-cors"
      // avoids that false failure, at the honest cost of not being
      // able to read back a real success/error status from Google --
      // this is the standard, documented trade-off for posting to an
      // Apps Script Web App straight from a static site with no
      // backend of its own. A thrown error here still means a genuine
      // network-level failure (offline, blocked, unreachable).
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload),
      });

      // Meta Pixel "Lead" event -- fired here, and only here, so it
      // represents a submission that was actually dispatched, never a
      // button click, a form open, or a failed attempt (those are all
      // handled in the branches below/the catch block, none of which
      // call fbq). HONEST LIMITATION: because the request above uses
      // mode: "no-cors" (required for posting to this Apps Script Web
      // App from a static page -- see the comment above), the browser
      // cannot read back whether Google actually accepted the row.
      // "Lead" fires when the request left the browser without a
      // network-level error, which is the closest thing to a
      // confirmed success this integration can offer without a real
      // backend in front of it. This should be cross-checked in Meta
      // Events Manager against actual CRM rows before trusting pixel
      // Lead counts as ground truth.
      if (typeof fbq === "function") {
        fbq("track", "Lead");
      }
      
            if (CALENDLY_URL) {
        if (bookingWin) {
          bookingWin.location.href = CALENDLY_URL;
        } else {
          // Popup was blocked: show a button the visitor can click instead.
          const panel = document.getElementById("form-success");
          if (panel && !document.getElementById("form-success-booking")) {
            const a = document.createElement("a");
            a.id = "form-success-booking";
            a.className = "btn btn-primary";
            a.href = CALENDLY_URL;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = "Book Your Call";
            panel.appendChild(a);
          }
        }
      }

      form.hidden = true;
      const successPanel = document.getElementById("form-success");
      if (successPanel) {
        successPanel.hidden = false;
        // Move focus into the success panel so screen-reader users and
        // keyboard users land on the "Go to Main Website" / "Close"
        // choice instead of being left on a now-hidden form.
        successPanel.focus();
      } else {
        // Fallback in case the success panel markup isn't present.
        setStatus(
          "Thanks — we've got it. Someone from Flow Remote Ops will follow up shortly to prepare your roadmap.",
          "success"
        );
      }
    } catch (err) {
      if (bookingWin) bookingWin.close();
      console.error("[assessment-form] submission error:", err);
      setStatus(
        `Something went wrong sending this. Please email us directly at ${FALLBACK_EMAIL} so we don't miss your request.`,
        "error"
      );
    } finally {
      setLoading(false);
      isSubmitting = false;
    }
  });
}

/* --------------------------------------------------------
   Time-Leak Calculator: purely client-side, uses only what the
   visitor types in. No invented hourly rates, savings, or ROI --
   just a transparent weekly -> monthly projection of hours entered.
   -------------------------------------------------------- */
function setupTimeLeakCalculator() {
  const rowsContainer = document.getElementById("calc-rows");
  const addRowBtn = document.getElementById("calc-add-row");
  const resetBtn = document.getElementById("calc-reset");
  const weeklyTotalEl = document.getElementById("calc-weekly-total");
  const monthlyTotalEl = document.getElementById("calc-monthly-total");
  if (!rowsContainer || !addRowBtn || !resetBtn || !weeklyTotalEl || !monthlyTotalEl) return;

  const WEEKS_PER_MONTH = 4.33; // average weeks/month -- stated plainly in the UI, not hidden
  let rowCount = 0;

  function createRow() {
    rowCount += 1;
    const rowId = `calc-row-${rowCount}`;
    const row = document.createElement("div");
    row.className = "calc-row";
    row.id = rowId;
    row.innerHTML = `
      <input type="text" name="task-name" placeholder="e.g. Inbox &amp; scheduling" aria-label="Task name">
      <input type="number" name="task-hours" min="0" step="0.5" placeholder="0" aria-label="Hours per week" inputmode="decimal">
      <input type="number" name="task-people" min="1" step="1" placeholder="1" aria-label="Number of people doing this task" inputmode="numeric">
      <button type="button" class="calc-row-remove" aria-label="Remove this task row">
        <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    `;

    row.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", recalculate);
    });
    row.querySelector(".calc-row-remove").addEventListener("click", () => {
      row.remove();
      // Always leave at least one row so the calculator never looks broken/empty.
      if (!rowsContainer.querySelector(".calc-row")) {
        rowsContainer.appendChild(createRow());
      }
      recalculate();
    });

    return row;
  }

  function recalculate() {
    let weeklyTotal = 0;
    rowsContainer.querySelectorAll(".calc-row").forEach((row) => {
      const hours = parseFloat(row.querySelector('input[name="task-hours"]').value) || 0;
      const peopleRaw = row.querySelector('input[name="task-people"]').value;
      const people = peopleRaw ? (parseFloat(peopleRaw) || 1) : 1;
      if (hours > 0) {
        weeklyTotal += hours * people;
      }
    });

    const monthlyTotal = weeklyTotal * WEEKS_PER_MONTH;
    weeklyTotalEl.textContent = `${formatHours(weeklyTotal)} hrs`;
    monthlyTotalEl.textContent = `${formatHours(monthlyTotal)} hrs`;
  }

  function formatHours(value) {
    // Show whole numbers cleanly, one decimal otherwise.
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  addRowBtn.addEventListener("click", () => {
    rowsContainer.appendChild(createRow());
  });

  resetBtn.addEventListener("click", () => {
    rowsContainer.innerHTML = "";
    rowsContainer.appendChild(createRow());
    recalculate();
  });

  // Start with one empty row.
  rowsContainer.appendChild(createRow());
  recalculate();
}