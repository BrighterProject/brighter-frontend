import { useIntlayer } from "react-intlayer";
import { LegalPageLayout } from "./legal-page-layout";

export function PrivacyPolicy() {
  const content = useIntlayer("privacy-policy");

  return (
    <LegalPageLayout
      title={content.title}
      updated={content.updated}
      intro={content.intro}
      sections={content.sections}
    />
  );
}
