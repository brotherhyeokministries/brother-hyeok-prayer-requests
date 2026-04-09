export type SubmitState = "idle" | "submitting" | "success" | "error";

export interface PrayerRequestFormProps {
  headingText?: string;
  image?: { src: string; alt?: string };
  descriptionLine1?: string;
  descriptionLine2?: string;
  descriptionLine3?: string;
  emailPlaceholder?: string;
  prayerRequestPlaceholder?: string;
  prayerRequestMaxLength?: number;
  consentLabel?: string;
  buttonLabel?: string;
  buttonSubmittingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}
