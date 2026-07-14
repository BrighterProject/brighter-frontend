import { t, type Dictionary } from "intlayer";

const checkinLinkButtonContent = {
  key: "checkin-link-button",
  content: {
    button: t({ en: "Check-in link", bg: "Връзка за настаняване" }),
    copied: t({ en: "Copied", bg: "Копирано" }),
    copiedToast: t({
      en: "Check-in link copied to clipboard",
      bg: "Връзката за настаняване е копирана",
    }),
    unavailableToast: t({
      en: "Check-in link is not available for this booking yet",
      bg: "Връзката за настаняване все още не е налична за тази резервация",
    }),
  },
} satisfies Dictionary;

export default checkinLinkButtonContent;
