import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

import zodTranslation from "@/localization/zod-localization-pt-br.json";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next.init({
  lng: "pt",
  resources: {
    pt: { zod: zodTranslation },
  },
});

z.setErrorMap(zodI18nMap);

export { z };
