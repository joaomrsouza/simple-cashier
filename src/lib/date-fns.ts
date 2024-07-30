import * as dateFns from "date-fns";
import { ptBR } from "date-fns/locale";

dateFns.setDefaultOptions({ locale: ptBR });

export const fns = dateFns;
