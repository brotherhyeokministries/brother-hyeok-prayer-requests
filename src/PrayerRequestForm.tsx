import * as React from "react";
import { useState, useEffect, useRef } from "react";
import type { PrayerRequestFormProps, SubmitState } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COUNTRIES = [
  { code: "PH", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "US", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "KR", name: "South Korea", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "JP", name: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "CA", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "GB", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "AU", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "SG", name: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "MY", name: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "ID", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "IN", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "BR", name: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MX", name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "DE", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "OTHER", name: "Other", flag: "\u{1F30D}" },
];

const LANGUAGES = [
  { code: "en-us", name: "English" },
  { code: "es", name: "Espa\u00f1ol" },
  { code: "ko-kr", name: "\ud55c\uad6d\uc5b4" },
  { code: "ja-jp", name: "\u65e5\u672c\u8a9e" },
  { code: "pt-br", name: "Portugu\u00eas" },
];

function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function PrayerRequestForm({
  headingText = "Prayer Request",
  imageUrl = "",
  descriptionLine1 = "Your precious prayer request will be delivered to Man of God Hyeok Park through our staff. Please understand that individual replies will not be provided.",
  descriptionLine2 = "After requesting intercessory prayer, we encourage you not to lose your faith toward the Almighty God and to continue trusting Him.",
  emailPlaceholder = "name@email.com",
  prayerRequestPlaceholder = "Type your prayer request",
  prayerRequestMaxLength = 300,
  consentLabel = "I agree to join Brother Hyeok Ministries\u2019 newsletter and receive communications from the ministry.",
  buttonLabel = "Send",
  buttonSubmittingLabel = "Sending...",
  successMessage = "Your prayer request has been received. We will be praying for you.",
  errorMessage = "We couldn\u2019t submit your prayer request right now. Please try again in a moment.",
  enableSplitLineAnimation = true,
}: PrayerRequestFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("PH");
  const [language, setLanguage] = useState("en-us");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [headingInView, setHeadingInView] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!enableSplitLineAnimation || !headingRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeadingInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, [enableSplitLineAnimation]);

  const selectedCountry = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];
  const selectedLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const charsRemaining = prayerRequestMaxLength - prayerRequest.length;

  const clearFeedback = () => {
    if (submitState !== "idle") {
      setSubmitState("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPrayer = prayerRequest.trim();

    if (!trimmedEmail) {
      setSubmitState("error");
      setStatusMessage("Please enter your email address.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setSubmitState("error");
      setStatusMessage("Please use a valid email address.");
      return;
    }

    if (!trimmedPrayer) {
      setSubmitState("error");
      setStatusMessage("Please enter your prayer request.");
      return;
    }

    if (trimmedPrayer.length > prayerRequestMaxLength) {
      setSubmitState("error");
      setStatusMessage(`Prayer request must be ${prayerRequestMaxLength} characters or less.`);
      return;
    }

    if (!agreed) {
      setSubmitState("error");
      setStatusMessage("Please agree to the terms before submitting.");
      return;
    }

    setSubmitState("submitting");
    setStatusMessage("");

    try {
      // Placeholder: you will connect this to Airtable later
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        country,
        language,
        prayerRequest: trimmedPrayer,
        agreedToNewsletter: agreed,
        submittedAt: new Date().toISOString(),
      };

      // TODO: Replace with your Airtable API call
      console.log("Prayer request payload:", payload);

      // Simulate success for now
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitState("success");
      setStatusMessage(successMessage);
      setName("");
      setEmail("");
      setPrayerRequest("");
      setAgreed(false);
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(error instanceof Error ? error.message : errorMessage);
    }
  };

  return (
    <div className="pr-root">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splitLineIn {
          from { opacity: 0; transform: translateY(80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pr-split-hidden {
          opacity: 0;
          transform: translateY(80px);
        }
        .pr-split-animate {
          animation: splitLineIn 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.6s forwards;
        }
        .pr-root {
          width: 100%;
          color: #ffffff;
          font-family: Suisseintl, Arial, sans-serif;
          --screen-size--max: 90;
          --screen-size--min: 20;
        }
        .pr-shell {
          background: transparent;
          background-color: transparent;
          padding: 0;
        }
        .pr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 43px;
          width: 100%;
          align-items: start;
        }
        .pr-copy {
          display: block;
          width: 100%;
          min-width: 0;
          position: sticky;
          top: 86px;
        }
        .pr-panel {
          display: block;
          width: 100%;
          min-width: 0;
          padding: 0;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.12s;
        }
        .pr-heading {
          display: block;
          width: 100%;
          margin: 0;
          font-size: clamp(2.5rem, calc(1.7857142857rem + 3.5714285714vw), 5rem);
          font-weight: 500;
          line-height: 1.2;
        }
        .pr-image {
          width: 100%;
          margin-top: 32px;
          border-radius: 0;
          object-fit: cover;
          aspect-ratio: 16 / 10;
        }
        .pr-description {
          margin: 32px 0 0;
          color: #ffffff;
          font-size: clamp(1rem, ((1 - ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 1.125rem);
          line-height: 1.5;
          font-weight: 400;
          white-space: pre-line;
        }
        .pr-form {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .pr-field-group {
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        .pr-label {
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #929292;
          margin-bottom: 8px;
        }
        .pr-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: inherit;
          font-size: clamp(1.75 * 1rem, ((1.75 - ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 2 * 1rem);
          padding: 8px 0 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .pr-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .pr-input:focus {
          border-bottom-color: rgba(255, 255, 255, 0.5);
        }
        .pr-input:-webkit-autofill,
        .pr-input:-webkit-autofill:hover,
        .pr-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          -webkit-text-fill-color: #ffffff;
          background-color: transparent !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .pr-select-wrapper {
          position: relative;
        }
        .pr-country-display {
          font-size: clamp(1.75 * 1rem, ((1.75 - ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 2 * 1rem);
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          cursor: pointer;
        }
        .pr-country-flag {
          font-size: 24px;
          line-height: 1;
        }
        .pr-country-name {
          font-size: clamp(1.75 * 1rem, ((1.75 - ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 2 * 1rem);
          font-weight: 400;
        }
        .pr-country-select {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          font-size: 16px;
        }
        .pr-language-display {
          font-size: clamp(1.75 * 1rem, ((1.75 - ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((2 - 1.75) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 2 * 1rem);
          font-weight: 400;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          cursor: pointer;
        }
        .pr-language-select {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          font-size: 16px;
        }
        .pr-select option {
          background: #1a1a1a;
          color: #ffffff;
        }
        .pr-textarea {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: inherit;
          font-size: clamp(1rem, ((1 - ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 1.125rem);
          padding: 14px;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s ease;
          line-height: 1.5;
        }
        .pr-textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .pr-textarea:focus {
          border-color: rgba(255, 255, 255, 0.5);
        }
        .pr-char-count {
          margin-top: 6px;
          font-size: 0.75rem;
          color: #929292;
          text-align: right;
        }
        .pr-char-count.pr-char-warning {
          color: #ffb4b4;
        }
        .pr-consent-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .pr-checkbox {
          width: 18px;
          height: 18px;
          min-width: 18px;
          margin-top: 2px;
          accent-color: #ffffff;
          cursor: pointer;
        }
        .pr-consent-text {
          font-size: clamp(0.875rem, calc(0.8392857143rem + 0.1785714286vw), 1rem);
          line-height: 1.65;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          user-select: none;
        }
        .pr-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          min-width: 120px;
          height: 48px;
          margin-top: 20px;
          padding: 0 7px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          background: #ffffff;
          color: #000000;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }
        .pr-submit:hover {
          background: rgba(255, 255, 255, 0.92);
          border-color: #ffffff;
          transform: translateY(-1px);
        }
        .pr-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .pr-status {
          min-height: 20px;
          margin: 12px 0 0;
          font-size: 13px;
          line-height: 1.5;
        }
        .pr-status.error {
          color: #ffb4b4;
        }
        .pr-status.success {
          color: #c9f3be;
        }
        .pr-success-view {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
        }
        .pr-success-view p {
          margin: 0;
          color: #ffffff;
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
        }
        @media (max-width: 991px) {
          .pr-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
        @media (max-width: 767px) {
          .pr-shell {
            padding: 0;
          }
          .pr-heading {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <section className={joinClasses("pr-shell", "dark-theme")}>
        <div className="pr-grid">
          <div className="pr-copy">
            <h2
              ref={headingRef}
              className={joinClasses(
                "pr-heading",
                "heading-style-h1",
                enableSplitLineAnimation && "pr-split-hidden",
                enableSplitLineAnimation && headingInView && "pr-split-animate",
                enableSplitLineAnimation && "split-line",
              )}
            >
              {headingText}
            </h2>

            {imageUrl ? (
              <img className="pr-image" src={imageUrl} alt="Prayer" />
            ) : (
              <div
                className="pr-image"
                style={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#929292",
                  fontSize: "14px",
                }}
              >
                Set image URL in component settings
              </div>
            )}

            <p className={joinClasses("pr-description", "text-size-regular")}>
              {descriptionLine1}
            </p>
            <p className={joinClasses("pr-description", "text-size-regular")} style={{ marginTop: "12px" }}>
              {descriptionLine2}
            </p>
          </div>

          <div className="pr-panel">
            {submitState === "success" ? (
              <div className="pr-success-view">
                <p>{statusMessage || successMessage}</p>
              </div>
            ) : (
              <form
                className={joinClasses("pr-form", "prayer_form-fields-wrapper")}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="pr-field-group">
                  <label className="pr-label">Name</label>
                  <input
                    aria-label="Name"
                    autoComplete="name"
                    className="pr-input"
                    name="name"
                    onChange={(event) => {
                      clearFeedback();
                      setName(event.target.value);
                    }}
                    type="text"
                    value={name}
                  />
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">Email</label>
                  <input
                    aria-label="Email"
                    autoComplete="email"
                    className="pr-input"
                    inputMode="email"
                    name="email"
                    onChange={(event) => {
                      clearFeedback();
                      setEmail(event.target.value);
                    }}
                    placeholder={emailPlaceholder}
                    required
                    type="email"
                    value={email}
                  />
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">Where are you from?</label>
                  <div className="pr-select-wrapper">
                    <div className="pr-country-display">
                      <span className="pr-country-flag">{selectedCountry.flag}</span>
                      <span className="pr-country-name">{selectedCountry.name}</span>
                    </div>
                    <select
                      aria-label="Where are you from?"
                      className="pr-country-select"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">Preferred Language</label>
                  <div className="pr-select-wrapper">
                    <div className="pr-language-display">{selectedLanguage.name}</div>
                    <select
                      aria-label="Preferred Language"
                      className="pr-language-select"
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">Prayer Request</label>
                  <textarea
                    aria-label="Prayer Request"
                    className="pr-textarea"
                    maxLength={prayerRequestMaxLength}
                    name="prayerRequest"
                    onChange={(event) => {
                      clearFeedback();
                      setPrayerRequest(event.target.value);
                    }}
                    placeholder={prayerRequestPlaceholder}
                    value={prayerRequest}
                  />
                  <div
                    className={joinClasses(
                      "pr-char-count",
                      charsRemaining <= 30 && "pr-char-warning",
                    )}
                  >
                    {charsRemaining} / {prayerRequestMaxLength}
                  </div>
                </div>

                <label className="pr-consent-row">
                  <input
                    type="checkbox"
                    className="pr-checkbox"
                    checked={agreed}
                    onChange={(event) => {
                      clearFeedback();
                      setAgreed(event.target.checked);
                    }}
                  />
                  <span className="pr-consent-text">{consentLabel}</span>
                </label>

                <button
                  className={joinClasses("pr-submit", "submit_button")}
                  disabled={submitState === "submitting" || !agreed}
                  type="submit"
                >
                  {submitState === "submitting" ? buttonSubmittingLabel : buttonLabel}
                </button>

                <p
                  aria-live="polite"
                  className={`pr-status ${submitState === "error" ? "error" : ""}`}
                >
                  {submitState === "error" ? statusMessage : ""}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
