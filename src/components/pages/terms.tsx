import { useIntlayer } from "react-intlayer";
import { LegalPageLayout } from "./legal-page-layout";

export function Terms() {
  const content = useIntlayer("terms");

  return (
    <LegalPageLayout
      title={content.title}
      updated={content.updated}
      intro={content.intro}
      sections={content.sections}
    />
  );
}
