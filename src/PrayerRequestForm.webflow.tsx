import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { PrayerRequestForm } from "./PrayerRequestForm";

export default declareComponent(PrayerRequestForm, {
  name: "Prayer Request Form",
  description:
    "Prayer request form with country, language, and prayer text fields. Includes consent checkbox and character limit.",
  group: "Brother Hyeok",
  options: {
    ssr: false,
  },
  props: {
    headingText: props.Text({
      name: "Heading Text",
      defaultValue: "Prayer Request",
    }),
    imageUrl: props.Text({
      name: "Image URL",
      defaultValue: "",
    }),
    descriptionLine1: props.Text({
      name: "Description Line 1",
      defaultValue:
        "Your precious prayer request will be delivered to Man of God Hyeok Park through our staff. Please understand that individual replies will not be provided.",
    }),
    descriptionLine2: props.Text({
      name: "Description Line 2",
      defaultValue:
        "After requesting intercessory prayer, we encourage you not to lose your faith toward the Almighty God and to continue trusting Him.",
    }),
    emailPlaceholder: props.Text({
      name: "Email Placeholder",
      defaultValue: "name@email.com",
    }),
    prayerRequestPlaceholder: props.Text({
      name: "Prayer Request Placeholder",
      defaultValue: "Type your prayer request",
    }),
    prayerRequestMaxLength: props.Number({
      name: "Prayer Request Max Length",
      defaultValue: 300,
    }),
    consentLabel: props.Text({
      name: "Consent Checkbox Label",
      defaultValue:
        "I agree to join Brother Hyeok Ministries\u2019 newsletter and receive communications from the ministry.",
    }),
    buttonLabel: props.Text({
      name: "Button Label",
      defaultValue: "Send",
    }),
    buttonSubmittingLabel: props.Text({
      name: "Button Submitting Label",
      defaultValue: "Sending...",
    }),
    successMessage: props.Text({
      name: "Success Message",
      defaultValue: "Your prayer request has been received. We will be praying for you.",
    }),
    errorMessage: props.Text({
      name: "Error Message",
      defaultValue: "We couldn\u2019t submit your prayer request right now. Please try again in a moment.",
    }),
    enableSplitLineAnimation: props.Boolean({
      name: "Enable Split Line Animation",
      defaultValue: true,
    }),
  },
});
