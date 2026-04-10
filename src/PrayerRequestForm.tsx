import * as React from "react";
import { useState, useEffect } from "react";
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

const SUCCESS_MESSAGES: Record<string, [string, string]> = {
  en: [
    "Your intercessory prayer request has been successfully submitted.",
    "Our staff will deliver it to the man of God, Hyeok Park.",
  ],
  ko: [
    "귀하의 중보기도 요청이 성공적으로 제출되었습니다.",
    "담당 스텝이 이를 하나님의 사람 박혁 전도자에게 전달드릴 예정입니다.",
  ],
  es: [
    "Su solicitud de oración de intercesión ha sido enviada con éxito.",
    "Nuestro equipo la entregará al hombre de Dios, Hyeok Park.",
  ],
  pt: [
    "Seu pedido de oração de intercessão foi enviado com sucesso.",
    "Nossa equipe o entregará ao homem de Deus, Hyeok Park.",
  ],
  ja: [
    "あなたのとりなしの祈りのリクエストは正常に送信されました。",
    "担当スタッフが神の人ヒョク・パークにお伝えいたします。",
  ],
};

type TranslationStrings = {
  nameLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  countryLabel: string;
  languageLabel: string;
  prayerRequestLabel: string;
  prayerRequestPlaceholder: string;
  buttonLabel: string;
  buttonSubmittingLabel: string;
  validationEmailRequired: string;
  validationEmailInvalid: string;
  validationPrayerRequired: string;
  validationPrayerTooLong: (max: number) => string;
  validationConsentRequired: string;
  successViewText: string;
  consentLabel: string;
  descriptionLine1: string;
  descriptionLine2: string;
  descriptionLine3: string;
  headingText: string;
};

const TRANSLATIONS: Record<string, TranslationStrings> = {
  en: {
    nameLabel: "Name",
    emailLabel: "Email",
    emailPlaceholder: "name@email.com",
    countryLabel: "Where are you from?",
    languageLabel: "Preferred Language",
    prayerRequestLabel: "Prayer Request",
    prayerRequestPlaceholder: "Type your prayer request",
    buttonLabel: "Submit",
    buttonSubmittingLabel: "Submitting...",
    validationEmailRequired: "Please enter your email address.",
    validationEmailInvalid: "Please use a valid email address.",
    validationPrayerRequired: "Please enter your prayer request.",
    validationPrayerTooLong: (max: number) => `Prayer request must be ${max} characters or less.`,
    validationConsentRequired: "Please check the consent box before submitting.",
    successViewText: "Thank you! Your prayer request has been received.",
    consentLabel: "I agree to subscribe to Brother Hyeok Ministries\u2019 newsletter and receive ministry updates.",
    descriptionLine1: "Your precious prayer request will be delivered to Man of God Hyeok Park through our staff.",
    descriptionLine2: "Please understand that individual replies will not be provided.",
    descriptionLine3: "After requesting intercessory prayer, we encourage you not to lose your faith toward the Almighty God and to continue trusting Him.",
    headingText: "Prayer Request",
  },
  es: {
    nameLabel: "Nombre",
    emailLabel: "Correo electr\u00f3nico",
    emailPlaceholder: "nombre@correo.com",
    countryLabel: "\u00bfDe d\u00f3nde eres?",
    languageLabel: "Idioma preferido",
    prayerRequestLabel: "Petici\u00f3n de oraci\u00f3n",
    prayerRequestPlaceholder: "Escribe tu petici\u00f3n de oraci\u00f3n",
    buttonLabel: "Enviar",
    buttonSubmittingLabel: "Enviando...",
    validationEmailRequired: "Por favor, ingresa tu direcci\u00f3n de correo electr\u00f3nico.",
    validationEmailInvalid: "Por favor, usa una direcci\u00f3n de correo electr\u00f3nico v\u00e1lida.",
    validationPrayerRequired: "Por favor, ingresa tu petici\u00f3n de oraci\u00f3n.",
    validationPrayerTooLong: (max: number) => `La petici\u00f3n de oraci\u00f3n debe tener ${max} caracteres o menos.`,
    validationConsentRequired: "Por favor, marque la casilla de consentimiento antes de enviar.",
    successViewText: "\u00a1Gracias! Tu petici\u00f3n de oraci\u00f3n ha sido recibida.",
    consentLabel: "Acepto suscribirme al boletín de Brother Hyeok Ministries y recibir noticias del ministerio.",
    descriptionLine1: "Tu valiosa petición de oración será entregada al Hombre de Dios Hyeok Park a través de nuestro equipo.",
    descriptionLine2: "Por favor, comprende que no se proporcionarán respuestas individuales.",
    descriptionLine3: "Después de solicitar oración de intercesión, te animamos a no perder tu fe hacia el Dios Todopoderoso y a seguir confiando en Él.",
    headingText: "Petici\u00f3n de oraci\u00f3n",
  },
  ko: {
    nameLabel: "성함",
    emailLabel: "이메일",
    emailPlaceholder: "name@email.com",
    countryLabel: "국가를 선택해주세요.",
    languageLabel: "선호하는 언어를 선택해주세요.",
    prayerRequestLabel: "중보기도 요청",
    prayerRequestPlaceholder: "중보기도 제목을 입력해 주세요.",
    buttonLabel: "제출하기",
    buttonSubmittingLabel: "제출 중...",
    validationEmailRequired: "\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
    validationEmailInvalid: "\uc720\ud6a8\ud55c \uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc0ac\uc6a9\ud574 \uc8fc\uc138\uc694.",
    validationPrayerRequired: "\uae30\ub3c4 \uc694\uccad\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
    validationPrayerTooLong: (max: number) => `\uae30\ub3c4 \uc694\uccad\uc740 ${max}\uc790 \uc774\ud558\uc5ec\uc57c \ud569\ub2c8\ub2e4.`,
    validationConsentRequired: "제출하기 전에 동의 체크박스를 선택해 주세요.",
    successViewText: "\uac10\uc0ac\ud569\ub2c8\ub2e4! \uae30\ub3c4 \uc694\uccad\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
    consentLabel: "브라더혁 미니스트리의 뉴스레터 구독 및 사역 소식 수신에 동의합니다.",
    descriptionLine1: "귀하의 소중한 중보기도 제목은 저희 스태프를 통해 하나님의 사람 박혁 전도자에게 전달됩니다.",
    descriptionLine2: "개별적인 회신을 드리지 않는 점 양해해 주시기 바랍니다.",
    descriptionLine3: "중보기도를 요청하신 이후에도 전능하신 하나님을 향한 믿음을 잃지 마시고 계속해서 그분을 신뢰하시기를 권면드립니다.",
    headingText: "중보기도 요청",
  },
  ja: {
    nameLabel: "\u304a\u540d\u524d",
    emailLabel: "\u30e1\u30fc\u30eb",
    emailPlaceholder: "name@email.com",
    countryLabel: "\u3054\u51fa\u8eab\u306f\u3069\u3061\u3089\u3067\u3059\u304b\uff1f",
    languageLabel: "\u5e0c\u671b\u8a00\u8a9e",
    prayerRequestLabel: "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8",
    prayerRequestPlaceholder: "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
    buttonLabel: "送信する",
    buttonSubmittingLabel: "送信中...",
    validationEmailRequired: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationEmailInvalid: "\u6709\u52b9\u306a\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u4f7f\u7528\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationPrayerRequired: "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationPrayerTooLong: (max: number) => `\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u306f${max}\u6587\u5b57\u4ee5\u5185\u3067\u304a\u9858\u3044\u3057\u307e\u3059\u3002`,
    validationConsentRequired: "送信する前に同意チェックボックスにチェックを入れてください。",
    successViewText: "\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\uff01\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u53d7\u3051\u4ed8\u3051\u307e\u3057\u305f\u3002",
    consentLabel: "ブラザー・ヒョク・ミニストリーズのニュースレターを購読し、ミニストリーのお知らせを受け取ることに同意します。",
    descriptionLine1: "大切な祈りのリクエストは、担当スタッフを通じて神の人ヒョク・パークにお届けいたします。",
    descriptionLine2: "個別のお返事はいたしかねますので、ご了承ください。",
    descriptionLine3: "執り成しの祈りをお願いした後も、全能の神への信仰を失わず、神を信頼し続けてください。",
    headingText: "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8",
  },
  pt: {
    nameLabel: "Nome",
    emailLabel: "E-mail",
    emailPlaceholder: "nome@email.com",
    countryLabel: "De onde voc\u00ea \u00e9?",
    languageLabel: "Idioma preferido",
    prayerRequestLabel: "Pedido de ora\u00e7\u00e3o",
    prayerRequestPlaceholder: "Digite seu pedido de ora\u00e7\u00e3o",
    buttonLabel: "Enviar",
    buttonSubmittingLabel: "Enviando...",
    validationEmailRequired: "Por favor, insira seu endere\u00e7o de e-mail.",
    validationEmailInvalid: "Por favor, use um endere\u00e7o de e-mail v\u00e1lido.",
    validationPrayerRequired: "Por favor, insira seu pedido de ora\u00e7\u00e3o.",
    validationPrayerTooLong: (max: number) => `O pedido de ora\u00e7\u00e3o deve ter ${max} caracteres ou menos.`,
    validationConsentRequired: "Por favor, marque a caixa de consentimento antes de enviar.",
    successViewText: "Obrigado! Seu pedido de ora\u00e7\u00e3o foi recebido.",
    consentLabel: "Concordo em me inscrever na newsletter do Brother Hyeok Ministries e receber atualizações do ministério.",
    descriptionLine1: "Seu precioso pedido de oração será entregue ao Homem de Deus Hyeok Park por meio de nossa equipe.",
    descriptionLine2: "Por favor, compreenda que respostas individuais não serão fornecidas.",
    descriptionLine3: "Após solicitar oração de intercessão, encorajamos você a não perder sua fé no Deus Todo-Poderoso e a continuar confiando Nele.",
    headingText: "Pedido de ora\u00e7\u00e3o",
  },
};

function resolveLocale(lang: string, pathname: string): string {
  // Check URL subdirectory first (Webflow uses /kr/, /jp/, /es/, /pt-br/)
  const pathSegments = pathname.toLowerCase().split("/").filter(Boolean);
  const firstSegment = pathSegments[0] || "";

  if (firstSegment === "kr" || firstSegment === "ko") return "ko";
  if (firstSegment === "jp" || firstSegment === "ja") return "ja";
  if (firstSegment === "es") return "es";
  if (firstSegment === "pt-br" || firstSegment === "pt") return "pt";
  if (firstSegment === "en-us" || firstSegment === "en") return "en";

  // Fallback to html lang attribute
  const normalized = lang.toLowerCase();
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("pt")) return "pt";
  return "en";
}

function usePageLocale(): string {
  const [locale, setLocale] = useState(() => {
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      return resolveLocale(document.documentElement.lang || "en", window.location.pathname);
    }
    return "en";
  });

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    setLocale(resolveLocale(document.documentElement.lang || "en", window.location.pathname));

    // Watch for lang attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "lang") {
          setLocale(resolveLocale(document.documentElement.lang || "en", window.location.pathname));
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return locale;
}

function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function PrayerRequestForm({
  headingText = "Prayer Request",
  image,
  descriptionLine1 = "Your precious prayer request will be delivered to Man of God Hyeok Park through our staff.",
  descriptionLine2 = "Please understand that individual replies will not be provided.",
  descriptionLine3 = "After requesting intercessory prayer, we encourage you not to lose your faith toward the Almighty God and to continue trusting Him.",
  emailPlaceholder = "name@email.com",
  prayerRequestPlaceholder = "Type your prayer request",
  prayerRequestMaxLength = 300,
  consentLabel = "I agree to subscribe to Brother Hyeok Ministries\u2019 newsletter and receive ministry updates.",
  buttonLabel = "Submit",
  buttonSubmittingLabel = "Submitting...",
  successMessage = "Your prayer request has been received. We will be praying for you.",
  errorMessage = "We couldn\u2019t submit your prayer request right now. Please try again in a moment.",
}: PrayerRequestFormProps) {
  const locale = usePageLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isEnglish = locale === "en";

  const resolvedHeading = t.headingText;
  const resolvedDescLine1 = t.descriptionLine1;
  const resolvedDescLine2 = t.descriptionLine2;
  const resolvedDescLine3 = t.descriptionLine3;
  const resolvedEmailPlaceholder = t.emailPlaceholder;
  const resolvedPrayerPlaceholder = t.prayerRequestPlaceholder;
  const resolvedConsentLabel = t.consentLabel;
  const resolvedButtonLabel = t.buttonLabel;
  const resolvedButtonSubmittingLabel = t.buttonSubmittingLabel;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const localeToLanguageCode: Record<string, string> = {
    en: "en-us",
    ko: "ko-kr",
    ja: "ja-jp",
    es: "es",
    pt: "pt-br",
  };
  const [language, setLanguage] = useState(localeToLanguageCode[locale] || "en-us");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | [string, string]>("");

  // Auto-detect user's country via IP geolocation
  useEffect(() => {
    if (country) return;
    fetch("https://api.country.is/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country) {
          const match = COUNTRIES.find((c) => c.code === data.country);
          setCountry(match ? match.code : "OTHER");
        }
      })
      .catch(() => {});
  }, []);

  const selectedCountry = COUNTRIES.find((c) => c.code === country) || null;
  const selectedLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const charsUsed = prayerRequest.length;

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
      setStatusMessage(t.validationEmailRequired);
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setSubmitState("error");
      setStatusMessage(t.validationEmailInvalid);
      return;
    }

    if (!trimmedPrayer) {
      setSubmitState("error");
      setStatusMessage(t.validationPrayerRequired);
      return;
    }

    if (trimmedPrayer.length > prayerRequestMaxLength) {
      setSubmitState("error");
      setStatusMessage(t.validationPrayerTooLong(prayerRequestMaxLength));
      return;
    }

    if (!agreed) {
      setSubmitState("error");
      setStatusMessage(t.validationConsentRequired);
      return;
    }

    setSubmitState("submitting");
    setStatusMessage("");

    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        country,
        language,
        prayerRequest: trimmedPrayer,
        agreedToNewsletter: agreed,
      };

      const res = await fetch(
        "https://brother-hyeok-prayer-requests.vercel.app/api/prayer-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitState("success");
      setStatusMessage(SUCCESS_MESSAGES[locale] || SUCCESS_MESSAGES["en"]);
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
          border-radius: 10px;
          object-fit: cover;
          aspect-ratio: 16 / 10;
          filter: grayscale(100%);
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
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: inherit;
          font-size: clamp(1rem, ((1 - ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min)) * var(--screen-size--min))) * 1rem + ((1.125 - 1) / (var(--screen-size--max) - var(--screen-size--min))) * 100vw), 1.125rem);
          padding: 8px 0 14px;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s ease;
          line-height: 1.5;
        }
        .pr-textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .pr-textarea:focus {
          border-bottom-color: rgba(255, 255, 255, 0.5);
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
          margin-top: -20px;
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
          margin-top: -16px;
          padding: 0 7px;
          border: 1px solid #ffffff;
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
            <h2 className={joinClasses("pr-heading", "heading-style-h1")}>
              {resolvedHeading}
            </h2>

            {image?.src ? (
              <img className="pr-image" src={image.src} alt={image.alt || "Prayer"} />
            ) : null}

            <p className={joinClasses("pr-description", "text-size-regular")}>
              {resolvedDescLine1}
            </p>
            <p className={joinClasses("pr-description", "text-size-regular")} style={{ marginTop: "12px" }}>
              {resolvedDescLine2}
            </p>
            <p className={joinClasses("pr-description", "text-size-regular")} style={{ marginTop: "12px" }}>
              {resolvedDescLine3}
            </p>
          </div>

          <div className="pr-panel">
            {submitState === "success" ? (
              <div className="pr-success-view">
                {Array.isArray(statusMessage) ? (
                  <>
                    <p>{statusMessage[0]}</p>
                    <p style={{ marginTop: "12px" }}>{statusMessage[1]}</p>
                  </>
                ) : (
                  <p>{statusMessage || t.successViewText}</p>
                )}
              </div>
            ) : (
              <form
                className={joinClasses("pr-form", "prayer_form-fields-wrapper")}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="pr-field-group">
                  <label className="pr-label">{t.nameLabel}</label>
                  <input
                    aria-label={t.nameLabel}
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
                  <label className="pr-label">{t.emailLabel}</label>
                  <input
                    aria-label={t.emailLabel}
                    autoComplete="email"
                    className="pr-input"
                    inputMode="email"
                    name="email"
                    onChange={(event) => {
                      clearFeedback();
                      setEmail(event.target.value);
                    }}
                    placeholder={resolvedEmailPlaceholder}
                    required
                    type="email"
                    value={email}
                  />
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">{t.countryLabel}</label>
                  <div className="pr-select-wrapper">
                    <div className="pr-country-display">
                      <span className="pr-country-flag">{selectedCountry ? selectedCountry.flag : "🌍"}</span>
                      <span className="pr-country-name">{selectedCountry ? selectedCountry.name : t.countryLabel}</span>
                    </div>
                    <select
                      aria-label={t.countryLabel}
                      className="pr-country-select"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                    >
                      <option value="" disabled>{t.countryLabel}</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pr-field-group">
                  <label className="pr-label">{t.languageLabel}</label>
                  <div className="pr-select-wrapper">
                    <div className="pr-language-display">{selectedLanguage.name}</div>
                    <select
                      aria-label={t.languageLabel}
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
                  <label className="pr-label">{t.prayerRequestLabel}</label>
                  <textarea
                    aria-label={t.prayerRequestLabel}
                    className="pr-textarea"
                    maxLength={prayerRequestMaxLength}
                    name="prayerRequest"
                    onChange={(event) => {
                      clearFeedback();
                      setPrayerRequest(event.target.value);
                    }}
                    placeholder={resolvedPrayerPlaceholder}
                    value={prayerRequest}
                  />
                  <div
                    className={joinClasses(
                      "pr-char-count",
                      charsUsed >= prayerRequestMaxLength - 30 && "pr-char-warning",
                    )}
                  >
                    {charsUsed} / {prayerRequestMaxLength}
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
                  <span className="pr-consent-text">{resolvedConsentLabel}</span>
                </label>

                <button
                  className={joinClasses("pr-submit", "submit_button")}
                  disabled={submitState === "submitting"}
                  type="submit"
                >
                  {submitState === "submitting" ? resolvedButtonSubmittingLabel : resolvedButtonLabel}
                </button>

                <p
                  aria-live="polite"
                  className={`pr-status ${submitState === "error" ? "error" : ""}`}
                >
                  {submitState === "error" && typeof statusMessage === "string" ? statusMessage : ""}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
