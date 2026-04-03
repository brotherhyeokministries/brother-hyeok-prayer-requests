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

const SUCCESS_MESSAGES: Record<string, string> = {
  "en-us": "Your prayer request has been successfully submitted. Our team will deliver it to the Man of God, Hyeok. And he will pray for you.",
  "ko-kr": "\uae30\ub3c4 \uc694\uccad\uc774 \uc131\uacf5\uc801\uc73c\ub85c \uc81c\ucd9c\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ub2f4\ub2f9 \uc2a4\ud0ed\uc774 \uc774\ub97c \ud558\ub098\ub2d8\uc758 \uc0ac\ub78c \ubc15\ud600 \uc804\ub3c4\uc790\uc5d0\uac8c \uc804\ub2ec\ud558\uba70, \ubc15\ud600 \uc804\ub3c4\uc790\uac00 \ub2f9\uc2e0\uc744 \uc704\ud574 \uc911\ubcf4\uae30\ub3c4\ud560 \uac83\uc785\ub2c8\ub2e4.",
  "es": "Su petici\u00f3n de oraci\u00f3n ha sido enviada con \u00e9xito. Nuestro equipo la entregar\u00e1 al hombre de Dios, Hyeok, quien estar\u00e1 orando por usted.",
  "pt-br": "Seu pedido de ora\u00e7\u00e3o foi enviado com sucesso. Nossa equipe o entregar\u00e1 ao homem de Deus, Hyeok, que estar\u00e1 orando por voc\u00ea.",
  "ja-jp": "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u304c\u6b63\u5e38\u306b\u9001\u4fe1\u3055\u308c\u307e\u3057\u305f\u3002\u62c5\u5f53\u30b9\u30bf\u30c3\u30d5\u304c\u3053\u308c\u3092\u795e\u306e\u4eba\u30d2\u30e7\u30af\u30fb\u30d1\u30fc\u30af\u306b\u304a\u5c4a\u3051\u3057\u3001\u30d2\u30e7\u30af\u30fb\u30d1\u30fc\u30af\u304c\u3042\u306a\u305f\u306e\u305f\u3081\u306b\u57f7\u308a\u6210\u3057\u306e\u7948\u308a\u3092\u3044\u305f\u3057\u307e\u3059\u3002",
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
    buttonLabel: "Send",
    buttonSubmittingLabel: "Sending...",
    validationEmailRequired: "Please enter your email address.",
    validationEmailInvalid: "Please use a valid email address.",
    validationPrayerRequired: "Please enter your prayer request.",
    validationPrayerTooLong: (max: number) => `Prayer request must be ${max} characters or less.`,
    validationConsentRequired: "Please agree to the terms before submitting.",
    successViewText: "Thank you! Your prayer request has been received.",
    consentLabel: "I agree to join Brother Hyeok Ministries\u2019 newsletter and receive communications from the ministry.",
    descriptionLine1: "Your precious prayer request will be delivered to Man of God Hyeok Park through our staff.\nPlease understand that individual replies will not be provided.",
    descriptionLine2: "After requesting intercessory prayer, we encourage you not to lose your faith toward the Almighty God and to continue trusting Him.",
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
    validationConsentRequired: "Por favor, acepta los t\u00e9rminos antes de enviar.",
    successViewText: "\u00a1Gracias! Tu petici\u00f3n de oraci\u00f3n ha sido recibida.",
    consentLabel: "Acepto unirme al bolet\u00edn informativo de Brother Hyeok Ministries y recibir comunicaciones del ministerio.",
    descriptionLine1: "Tu valiosa petici\u00f3n de oraci\u00f3n ser\u00e1 entregada al Hombre de Dios Hyeok Park a trav\u00e9s de nuestro equipo.\nPor favor, comprende que no se proporcionar\u00e1n respuestas individuales.",
    descriptionLine2: "Despu\u00e9s de solicitar oraci\u00f3n de intercesi\u00f3n, te animamos a no perder tu fe hacia el Dios Todopoderoso y a seguir confiando en \u00c9l.",
    headingText: "Petici\u00f3n de oraci\u00f3n",
  },
  ko: {
    nameLabel: "\uc774\ub984",
    emailLabel: "\uc774\uba54\uc77c",
    emailPlaceholder: "name@email.com",
    countryLabel: "\uc5b4\ub514\uc5d0\uc11c \uc624\uc168\ub098\uc694?",
    languageLabel: "\uc120\ud638 \uc5b8\uc5b4",
    prayerRequestLabel: "중보기도 요청",
    prayerRequestPlaceholder: "중보기도 제목을 입력해 주세요",
    buttonLabel: "\ubcf4\ub0b4\uae30",
    buttonSubmittingLabel: "\ubcf4\ub0b4\ub294 \uc911...",
    validationEmailRequired: "\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
    validationEmailInvalid: "\uc720\ud6a8\ud55c \uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc0ac\uc6a9\ud574 \uc8fc\uc138\uc694.",
    validationPrayerRequired: "\uae30\ub3c4 \uc694\uccad\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
    validationPrayerTooLong: (max: number) => `\uae30\ub3c4 \uc694\uccad\uc740 ${max}\uc790 \uc774\ud558\uc5ec\uc57c \ud569\ub2c8\ub2e4.`,
    validationConsentRequired: "\uc81c\ucd9c\ud558\uae30 \uc804\uc5d0 \uc57d\uad00\uc5d0 \ub3d9\uc758\ud574 \uc8fc\uc138\uc694.",
    successViewText: "\uac10\uc0ac\ud569\ub2c8\ub2e4! \uae30\ub3c4 \uc694\uccad\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
    consentLabel: "브라더혁 미니스트리 뉴스레터에 가입하고 사역으로부터 소식을 받는 것에 동의합니다.",
    descriptionLine1: "\uadc0\ud55c \uae30\ub3c4 \uc694\uccad\uc740 \ub2f4\ub2f9 \uc2a4\ud0ed\uc744 \ud1b5\ud574 \ud558\ub098\ub2d8\uc758 \uc0ac\ub78c \ubc15\ud600 \uc804\ub3c4\uc790\uc5d0\uac8c \uc804\ub2ec\ub429\ub2c8\ub2e4.\n\uac1c\ubcc4 \ub2f5\ubcc0\uc740 \uc81c\uacf5\ub418\uc9c0 \uc54a\ub294 \uc810 \uc591\ud574 \ubd80\ud0c1\ub4dc\ub9bd\ub2c8\ub2e4.",
    descriptionLine2: "\uc911\ubcf4\uae30\ub3c4\ub97c \uc694\uccad\ud558\uc2e0 \ud6c4, \uc804\ub2a5\ud558\uc2e0 \ud558\ub098\ub2d8\uc744 \ud5a5\ud55c \ubbff\uc74c\uc744 \uc783\uc9c0 \ub9c8\uc2dc\uace0 \uacc4\uc18d\ud574\uc11c \uadf8\ubd84\uc744 \uc2e0\ub8b0\ud558\uc2dc\uae30\ub97c \uad8c\uba74\ud569\ub2c8\ub2e4.",
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
    buttonLabel: "\u9001\u4fe1",
    buttonSubmittingLabel: "\u9001\u4fe1\u4e2d...",
    validationEmailRequired: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationEmailInvalid: "\u6709\u52b9\u306a\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u4f7f\u7528\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationPrayerRequired: "\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    validationPrayerTooLong: (max: number) => `\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u306f${max}\u6587\u5b57\u4ee5\u5185\u3067\u304a\u9858\u3044\u3057\u307e\u3059\u3002`,
    validationConsentRequired: "\u9001\u4fe1\u524d\u306b\u5229\u7528\u898f\u7d04\u306b\u540c\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    successViewText: "\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\uff01\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u53d7\u3051\u4ed8\u3051\u307e\u3057\u305f\u3002",
    consentLabel: "Brother Hyeok Ministries\u306e\u30cb\u30e5\u30fc\u30b9\u30ec\u30bf\u30fc\u306b\u767b\u9332\u3057\u3001\u30df\u30cb\u30b9\u30c8\u30ea\u30fc\u304b\u3089\u306e\u304a\u77e5\u3089\u305b\u3092\u53d7\u3051\u53d6\u308b\u3053\u3068\u306b\u540c\u610f\u3057\u307e\u3059\u3002",
    descriptionLine1: "\u5927\u5207\u306a\u7948\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u306f\u3001\u62c5\u5f53\u30b9\u30bf\u30c3\u30d5\u3092\u901a\u3058\u3066\u795e\u306e\u4eba\u30d2\u30e7\u30af\u30fb\u30d1\u30fc\u30af\u306b\u304a\u5c4a\u3051\u3044\u305f\u3057\u307e\u3059\u3002\n\u500b\u5225\u306e\u304a\u8fd4\u4e8b\u306f\u3044\u305f\u3057\u304b\u306d\u307e\u3059\u306e\u3067\u3001\u3054\u4e86\u627f\u304f\u3060\u3055\u3044\u3002",
    descriptionLine2: "\u57f7\u308a\u6210\u3057\u306e\u7948\u308a\u3092\u304a\u9858\u3044\u3057\u305f\u5f8c\u3082\u3001\u5168\u80fd\u306e\u795e\u3078\u306e\u4fe1\u4ef0\u3092\u5931\u308f\u305a\u3001\u795e\u3092\u4fe1\u983c\u3057\u7d9a\u3051\u3066\u304f\u3060\u3055\u3044\u3002",
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
    validationConsentRequired: "Por favor, aceite os termos antes de enviar.",
    successViewText: "Obrigado! Seu pedido de ora\u00e7\u00e3o foi recebido.",
    consentLabel: "Concordo em participar da newsletter do Brother Hyeok Ministries e receber comunica\u00e7\u00f5es do minist\u00e9rio.",
    descriptionLine1: "Seu precioso pedido de ora\u00e7\u00e3o ser\u00e1 entregue ao Homem de Deus Hyeok Park por meio de nossa equipe.\nPor favor, compreenda que respostas individuais n\u00e3o ser\u00e3o fornecidas.",
    descriptionLine2: "Ap\u00f3s solicitar ora\u00e7\u00e3o de intercess\u00e3o, encorajamos voc\u00ea a n\u00e3o perder sua f\u00e9 no Deus Todo-Poderoso e a continuar confiando Nele.",
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
}: PrayerRequestFormProps) {
  const locale = usePageLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isEnglish = locale === "en";

  const resolvedHeading = isEnglish ? headingText : t.headingText;
  const resolvedDescLine1 = isEnglish ? descriptionLine1 : t.descriptionLine1;
  const resolvedDescLine2 = isEnglish ? descriptionLine2 : t.descriptionLine2;
  const resolvedEmailPlaceholder = isEnglish ? emailPlaceholder : t.emailPlaceholder;
  const resolvedPrayerPlaceholder = isEnglish ? prayerRequestPlaceholder : t.prayerRequestPlaceholder;
  const resolvedConsentLabel = isEnglish ? consentLabel : t.consentLabel;
  const resolvedButtonLabel = isEnglish ? buttonLabel : t.buttonLabel;
  const resolvedButtonSubmittingLabel = isEnglish ? buttonSubmittingLabel : t.buttonSubmittingLabel;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("PH");
  const [language, setLanguage] = useState("en-us");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedCountry = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];
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
      setStatusMessage(SUCCESS_MESSAGES[language] || SUCCESS_MESSAGES["en-us"]);
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
          </div>

          <div className="pr-panel">
            {submitState === "success" ? (
              <div className="pr-success-view">
                <p>{statusMessage || (isEnglish ? successMessage : t.successViewText)}</p>
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
                      <span className="pr-country-flag">{selectedCountry.flag}</span>
                      <span className="pr-country-name">{selectedCountry.name}</span>
                    </div>
                    <select
                      aria-label={t.countryLabel}
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
