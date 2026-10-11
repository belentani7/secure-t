import type { Locale } from "../i18n";

/**
 * Calendarios oficiales de festivos.
 *
 * Cada entrada declara su **fuente oficial** y sus reglas. Las reglas se
 * resuelven de forma determinista y sin red: el cálculo ocurre en el
 * dispositivo del estudiante (privacidad por diseño, promesa P6).
 *
 * Criterio de honestidad: sólo se incluyen festivos estatales/nacionales y las
 * regiones que el autor puede citar con fuente. Lo que no está, no se inventa:
 * `scope: "optional"` marca los que dependen de comunidad o convenio.
 */

export type ShiftPolicy =
  /** No se traslada: si cae en fin de semana, se pierde. */
  | "none"
  /** España: si cae en domingo, pasa al lunes siguiente (traslado del BOE). */
  | "sundayToMonday"
  /** Estados Unidos: sábado → viernes observado; domingo → lunes observado. */
  | "usObserved"
  /** Reino Unido: sábado/domingo → siguiente día laborable libre (bank holiday). */
  | "ukSubstitute";

export type HolidayRule =
  | { kind: "fixed"; month: number; day: number }
  /** Desplazamiento en días respecto al domingo de Pascua (negativo = antes). */
  | { kind: "easter"; offset: number }
  | { kind: "nth"; month: number; weekday: number; n: number }
  | { kind: "lastNth"; month: number; weekday: number };

export interface HolidayDef {
  /** Identificador estable, p. ej. `es.reyes`. */
  key: string;
  /** Nombre oficial en el idioma del país (así lo ve quien vive allí). */
  name: string;
  rule: HolidayRule;
  shift?: ShiftPolicy;
  scope?: "national" | "regional" | "optional";
  since?: number;
}

export interface RegionDef {
  code: string;
  name: string;
  holidays: HolidayDef[];
}

export interface CalendarDef {
  /** ISO 3166-1 alpha-2, o `ES-CT` para regiones. */
  code: string;
  country: string;
  region?: string;
  /** Idioma en el que se muestran los nombres oficiales. */
  locale: Locale;
  holidays: HolidayDef[];
  regions?: RegionDef[];
  /** Fuente oficial de la que se tomaron los festivos. */
  source: string;
  /** Nota honesta sobre limitaciones conocidas. */
  note?: string;
}

const JAN = 1, FEB = 2, MAR = 3, APR = 4, MAY = 5, JUN = 6, JUL = 7, AUG = 8, SEP = 9, OCT = 10, NOV = 11, DEC = 12;

export const CALENDARS: CalendarDef[] = [
  {
    code: "ES",
    country: "España",
    locale: "es",
    source: "https://www.boe.es/ (calendario laboral del Estatuto de los Trabajadores, art. 37.2)",
    note: "Incluye el traslado a lunes cuando el festivo estatal cae en domingo.",
    holidays: [
      { key: "es.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 }, shift: "sundayToMonday" },
      { key: "es.reyes", name: "Epifanía del Señor", rule: { kind: "fixed", month: JAN, day: 6 }, shift: "sundayToMonday" },
      { key: "es.viernes-santo", name: "Viernes Santo", rule: { kind: "easter", offset: -2 } },
      { key: "es.trabajo", name: "Fiesta del Trabajo", rule: { kind: "fixed", month: MAY, day: 1 }, shift: "sundayToMonday" },
      { key: "es.asuncion", name: "Asunción de la Virgen", rule: { kind: "fixed", month: AUG, day: 15 }, shift: "sundayToMonday" },
      { key: "es.hispanidad", name: "Fiesta Nacional de España", rule: { kind: "fixed", month: OCT, day: 12 }, shift: "sundayToMonday" },
      { key: "es.todos-los-santos", name: "Todos los Santos", rule: { kind: "fixed", month: NOV, day: 1 }, shift: "sundayToMonday" },
      { key: "es.constitucion", name: "Día de la Constitución", rule: { kind: "fixed", month: DEC, day: 6 }, shift: "sundayToMonday" },
      { key: "es.inmaculada", name: "Inmaculada Concepción", rule: { kind: "fixed", month: DEC, day: 8 }, shift: "sundayToMonday" },
      { key: "es.navidad", name: "Natividad del Señor", rule: { kind: "fixed", month: DEC, day: 25 }, shift: "sundayToMonday" }
    ],
    regions: [
      {
        code: "CA",
        name: "Cataluña",
        holidays: [
          { key: "es-ct.sant-joan", name: "Sant Joan", rule: { kind: "fixed", month: JUN, day: 24 }, scope: "regional" },
          { key: "es-ct.diada", name: "Diada Nacional de Catalunya", rule: { kind: "fixed", month: SEP, day: 11 }, scope: "regional" },
          { key: "es-ct.sant-esteve", name: "Sant Esteve", rule: { kind: "fixed", month: DEC, day: 26 }, scope: "regional" },
          { key: "es-ct.pasqua-granada", name: "Dilluns de Pasqua Granada", rule: { kind: "easter", offset: 50 }, scope: "regional" }
        ]
      },
      {
        code: "MD",
        name: "Comunidad de Madrid",
        holidays: [
          { key: "es-md.dos-mayo", name: "Fiesta de la Comunidad de Madrid", rule: { kind: "fixed", month: MAY, day: 2 }, scope: "regional" },
          { key: "es-md.santiago", name: "Santiago Apóstol", rule: { kind: "fixed", month: JUL, day: 25 }, scope: "regional" }
        ]
      },
      {
        code: "AN",
        name: "Andalucía",
        holidays: [
          { key: "es-an.andalucia", name: "Día de Andalucía", rule: { kind: "fixed", month: FEB, day: 28 }, scope: "regional" },
          { key: "es-an.jueves-santo", name: "Jueves Santo", rule: { kind: "easter", offset: -3 }, scope: "regional" }
        ]
      },
      {
        code: "GA",
        name: "Galicia",
        holidays: [
          { key: "es-ga.santiago", name: "Santiago Apóstol", rule: { kind: "fixed", month: JUL, day: 25 }, scope: "regional" },
          { key: "es-ga.galicia", name: "Día Nacional de Galicia", rule: { kind: "fixed", month: JUL, day: 25 }, scope: "regional" }
        ]
      },
      {
        code: "PV",
        name: "País Vasco",
        holidays: [
          { key: "es-pv.euskadi", name: "Día del País Vasco", rule: { kind: "fixed", month: OCT, day: 25 }, scope: "regional" },
          { key: "es-pv.jueves-santo", name: "Jueves Santo", rule: { kind: "easter", offset: -3 }, scope: "regional" }
        ]
      }
    ]
  },
  {
    code: "PT",
    country: "Portugal",
    locale: "pt",
    source: "https://dre.pt/ (Código do Trabalho, art. 234)",
    note: "Los feriados que caen en fin de semana no se trasladan.",
    holidays: [
      { key: "pt.ano-novo", name: "Ano Novo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "pt.carnaval", name: "Carnaval", rule: { kind: "easter", offset: -47 }, scope: "optional" },
      { key: "pt.sexta-santa", name: "Sexta-feira Santa", rule: { kind: "easter", offset: -2 } },
      { key: "pt.pascoa", name: "Domingo de Páscoa", rule: { kind: "easter", offset: 0 } },
      { key: "pt.liberdade", name: "Dia da Liberdade", rule: { kind: "fixed", month: APR, day: 25 } },
      { key: "pt.trabalhador", name: "Dia do Trabalhador", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "pt.corpo-de-deus", name: "Corpo de Deus", rule: { kind: "easter", offset: 60 } },
      { key: "pt.portugal", name: "Dia de Portugal", rule: { kind: "fixed", month: JUN, day: 10 } },
      { key: "pt.assuncao", name: "Assunção de Nossa Senhora", rule: { kind: "fixed", month: AUG, day: 15 } },
      { key: "pt.republica", name: "Implantação da República", rule: { kind: "fixed", month: OCT, day: 5 } },
      { key: "pt.finados", name: "Dia de Todos os Santos", rule: { kind: "fixed", month: NOV, day: 1 } },
      { key: "pt.restauracao", name: "Restauração da Independência", rule: { kind: "fixed", month: DEC, day: 1 } },
      { key: "pt.imaculada", name: "Imaculada Conceição", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "pt.natal", name: "Natal", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "BR",
    country: "Brasil",
    locale: "pt",
    source: "https://www.planalto.gov.br/ (Lei 662/1949 e Lei 10.607/2002)",
    note: "Incluye feriados nacionais e os pontos facultativos mais usados (Carnaval).",
    holidays: [
      { key: "br.confraternizacao", name: "Confraternização Universal", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "br.carnaval", name: "Carnaval", rule: { kind: "easter", offset: -47 }, scope: "optional" },
      { key: "br.sexta-santa", name: "Sexta-feira Santa", rule: { kind: "easter", offset: -2 } },
      { key: "br.tiradentes", name: "Tiradentes", rule: { kind: "fixed", month: APR, day: 21 } },
      { key: "br.trabalhador", name: "Dia do Trabalho", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "br.corpus-christi", name: "Corpus Christi", rule: { kind: "easter", offset: 60 }, scope: "optional" },
      { key: "br.independencia", name: "Independência do Brasil", rule: { kind: "fixed", month: SEP, day: 7 } },
      { key: "br.aparecida", name: "Nossa Senhora Aparecida", rule: { kind: "fixed", month: OCT, day: 12 } },
      { key: "br.finados", name: "Finados", rule: { kind: "fixed", month: NOV, day: 2 } },
      { key: "br.republica", name: "Proclamação da República", rule: { kind: "fixed", month: NOV, day: 15 } },
      { key: "br.consciencia-negra", name: "Dia Nacional de Zumbi e da Consciência Negra", rule: { kind: "fixed", month: NOV, day: 20 }, since: 2024 },
      { key: "br.natal", name: "Natal", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "GB",
    country: "United Kingdom",
    locale: "en",
    source: "https://www.gov.uk/bank-holidays",
    note: "England & Wales. Escocia e Irlanda del Norte tienen días adicionales que no se incluyen.",
    holidays: [
      { key: "gb.new-year", name: "New Year's Day", rule: { kind: "fixed", month: JAN, day: 1 }, shift: "ukSubstitute" },
      { key: "gb.good-friday", name: "Good Friday", rule: { kind: "easter", offset: -2 } },
      { key: "gb.easter-monday", name: "Easter Monday", rule: { kind: "easter", offset: 1 } },
      { key: "gb.early-may", name: "Early May bank holiday", rule: { kind: "nth", month: MAY, weekday: 1, n: 1 } },
      { key: "gb.spring", name: "Spring bank holiday", rule: { kind: "lastNth", month: MAY, weekday: 1 } },
      { key: "gb.summer", name: "Summer bank holiday", rule: { kind: "lastNth", month: AUG, weekday: 1 } },
      { key: "gb.christmas", name: "Christmas Day", rule: { kind: "fixed", month: DEC, day: 25 }, shift: "ukSubstitute" },
      { key: "gb.boxing-day", name: "Boxing Day", rule: { kind: "fixed", month: DEC, day: 26 }, shift: "ukSubstitute" }
    ]
  },
  {
    code: "US",
    country: "United States",
    locale: "en",
    source: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/",
    note: "Festivos federales. Si caen en sábado se observan el viernes y si caen en domingo, el lunes.",
    holidays: [
      { key: "us.new-year", name: "New Year's Day", rule: { kind: "fixed", month: JAN, day: 1 }, shift: "usObserved" },
      { key: "us.mlk", name: "Martin Luther King Jr. Day", rule: { kind: "nth", month: JAN, weekday: 1, n: 3 } },
      { key: "us.washington", name: "Washington's Birthday", rule: { kind: "nth", month: FEB, weekday: 1, n: 3 } },
      { key: "us.memorial", name: "Memorial Day", rule: { kind: "lastNth", month: MAY, weekday: 1 } },
      { key: "us.juneteenth", name: "Juneteenth National Independence Day", rule: { kind: "fixed", month: JUN, day: 19 }, shift: "usObserved", since: 2021 },
      { key: "us.independence", name: "Independence Day", rule: { kind: "fixed", month: JUL, day: 4 }, shift: "usObserved" },
      { key: "us.labor", name: "Labor Day", rule: { kind: "nth", month: SEP, weekday: 1, n: 1 } },
      { key: "us.columbus", name: "Columbus Day", rule: { kind: "nth", month: OCT, weekday: 1, n: 2 } },
      { key: "us.veterans", name: "Veterans Day", rule: { kind: "fixed", month: NOV, day: 11 }, shift: "usObserved" },
      { key: "us.thanksgiving", name: "Thanksgiving Day", rule: { kind: "nth", month: NOV, weekday: 4, n: 4 } },
      { key: "us.christmas", name: "Christmas Day", rule: { kind: "fixed", month: DEC, day: 25 }, shift: "usObserved" }
    ]
  },
  {
    code: "FR",
    country: "France",
    locale: "en",
    source: "https://www.legifrance.gouv.fr/ (Code du travail, art. L3133-1)",
    holidays: [
      { key: "fr.jour-an", name: "Jour de l'an", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "fr.paques", name: "Lundi de Pâques", rule: { kind: "easter", offset: 1 } },
      { key: "fr.travail", name: "Fête du Travail", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "fr.victoire", name: "Victoire 1945", rule: { kind: "fixed", month: MAY, day: 8 } },
      { key: "fr.ascension", name: "Ascension", rule: { kind: "easter", offset: 39 } },
      { key: "fr.pentecote", name: "Lundi de Pentecôte", rule: { kind: "easter", offset: 50 } },
      { key: "fr.nationale", name: "Fête nationale", rule: { kind: "fixed", month: JUL, day: 14 } },
      { key: "fr.assomption", name: "Assomption", rule: { kind: "fixed", month: AUG, day: 15 } },
      { key: "fr.toussaint", name: "Toussaint", rule: { kind: "fixed", month: NOV, day: 1 } },
      { key: "fr.armistice", name: "Armistice 1918", rule: { kind: "fixed", month: NOV, day: 11 } },
      { key: "fr.noel", name: "Noël", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "DE",
    country: "Deutschland",
    locale: "en",
    source: "https://www.gesetze-im-internet.de/ (Feiertagsgesetze der Länder)",
    note: "Sólo festivos presentes en todos los Länder.",
    holidays: [
      { key: "de.neujahr", name: "Neujahr", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "de.karfreitag", name: "Karfreitag", rule: { kind: "easter", offset: -2 } },
      { key: "de.ostermontag", name: "Ostermontag", rule: { kind: "easter", offset: 1 } },
      { key: "de.tanz", name: "Tag der Arbeit", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "de.himmelfahrt", name: "Christi Himmelfahrt", rule: { kind: "easter", offset: 39 } },
      { key: "de.pfingstmontag", name: "Pfingstmontag", rule: { kind: "easter", offset: 50 } },
      { key: "de.einheit", name: "Tag der Deutschen Einheit", rule: { kind: "fixed", month: OCT, day: 3 } },
      { key: "de.weihnachten1", name: "1. Weihnachtstag", rule: { kind: "fixed", month: DEC, day: 25 } },
      { key: "de.weihnachten2", name: "2. Weihnachtstag", rule: { kind: "fixed", month: DEC, day: 26 } }
    ]
  },
  {
    code: "IT",
    country: "Italia",
    locale: "en",
    source: "https://www.normattiva.it/ (Legge 27 maggio 1949, n. 260)",
    holidays: [
      { key: "it.capodanno", name: "Capodanno", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "it.epifania", name: "Epifania", rule: { kind: "fixed", month: JAN, day: 6 } },
      { key: "it.pasquetta", name: "Lunedì dell'Angelo", rule: { kind: "easter", offset: 1 } },
      { key: "it.liberazione", name: "Festa della Liberazione", rule: { kind: "fixed", month: APR, day: 25 } },
      { key: "it.lavoro", name: "Festa dei Lavoratori", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "it.repubblica", name: "Festa della Repubblica", rule: { kind: "fixed", month: JUN, day: 2 } },
      { key: "it.ferragosto", name: "Ferragosto", rule: { kind: "fixed", month: AUG, day: 15 } },
      { key: "it.ognissanti", name: "Ognissanti", rule: { kind: "fixed", month: NOV, day: 1 } },
      { key: "it.immacolata", name: "Immacolata", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "it.natale", name: "Natale", rule: { kind: "fixed", month: DEC, day: 25 } },
      { key: "it.santo-stefano", name: "Santo Stefano", rule: { kind: "fixed", month: DEC, day: 26 } }
    ]
  },
  {
    code: "MX",
    country: "México",
    locale: "es",
    source: "https://www.diputados.gob.mx/ (Ley Federal del Trabajo, art. 74)",
    holidays: [
      { key: "mx.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "mx.constitucion", name: "Día de la Constitución", rule: { kind: "nth", month: FEB, weekday: 1, n: 1 } },
      { key: "mx.benito-juarez", name: "Natalicio de Benito Juárez", rule: { kind: "nth", month: MAR, weekday: 1, n: 3 } },
      { key: "mx.trabajo", name: "Día del Trabajo", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "mx.independencia", name: "Día de la Independencia", rule: { kind: "fixed", month: SEP, day: 16 } },
      { key: "mx.revolucion", name: "Día de la Revolución", rule: { kind: "nth", month: NOV, weekday: 1, n: 3 } },
      { key: "mx.transmision", name: "Transmisión del Poder Ejecutivo Federal", rule: { kind: "fixed", month: OCT, day: 1 } },
      { key: "mx.navidad", name: "Navidad", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "AR",
    country: "Argentina",
    locale: "es",
    source: "https://www.argentina.gob.ar/ (Ley 27.399 y Decreto 1584/2010)",
    holidays: [
      { key: "ar.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "ar.carnaval", name: "Carnaval", rule: { kind: "easter", offset: -48 } },
      { key: "ar.memoria", name: "Día de la Memoria por la Verdad y la Justicia", rule: { kind: "fixed", month: MAR, day: 24 } },
      { key: "ar.malvinas", name: "Día del Veterano de Malvinas", rule: { kind: "fixed", month: APR, day: 2 } },
      { key: "ar.viernes-santo", name: "Viernes Santo", rule: { kind: "easter", offset: -2 } },
      { key: "ar.trabajador", name: "Día del Trabajador", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "ar.mayo", name: "Revolución de Mayo", rule: { kind: "fixed", month: MAY, day: 25 } },
      { key: "ar.guemes", name: "Paso a la Inmortalidad del General Güemes", rule: { kind: "fixed", month: JUN, day: 17 } },
      { key: "ar.belgrano", name: "Paso a la Inmortalidad del General Belgrano", rule: { kind: "fixed", month: JUN, day: 20 } },
      { key: "ar.independencia", name: "Día de la Independencia", rule: { kind: "fixed", month: JUL, day: 9 } },
      { key: "ar.san-martin", name: "Paso a la Inmortalidad del General San Martín", rule: { kind: "nth", month: AUG, weekday: 1, n: 3 } },
      { key: "ar.diversidad", name: "Día del Respeto a la Diversidad Cultural", rule: { kind: "fixed", month: OCT, day: 12 } },
      { key: "ar.soberania", name: "Día de la Soberanía Nacional", rule: { kind: "nth", month: NOV, weekday: 1, n: 4 } },
      { key: "ar.inmaculada", name: "Inmaculada Concepción de María", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "ar.navidad", name: "Navidad", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "CO",
    country: "Colombia",
    locale: "es",
    source: "https://www.funcionpublica.gov.co/ (Ley 51 de 1983)",
    note: "Varios festivos se trasladan al lunes siguiente (Ley Emiliani).",
    holidays: [
      { key: "co.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "co.reyes", name: "Día de los Reyes Magos", rule: { kind: "nth", month: JAN, weekday: 1, n: 1 } },
      { key: "co.san-jose", name: "Día de San José", rule: { kind: "nth", month: MAR, weekday: 1, n: 3 } },
      { key: "co.jueves-santo", name: "Jueves Santo", rule: { kind: "easter", offset: -3 } },
      { key: "co.viernes-santo", name: "Viernes Santo", rule: { kind: "easter", offset: -2 } },
      { key: "co.trabajo", name: "Día del Trabajo", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "co.ascension", name: "Ascensión del Señor", rule: { kind: "easter", offset: 43 } },
      { key: "co.corpus", name: "Corpus Christi", rule: { kind: "easter", offset: 64 } },
      { key: "co.sagrado-corazon", name: "Sagrado Corazón", rule: { kind: "easter", offset: 71 } },
      { key: "co.san-pedro", name: "San Pedro y San Pablo", rule: { kind: "nth", month: JUN, weekday: 1, n: 5 } },
      { key: "co.independencia", name: "Día de la Independencia", rule: { kind: "fixed", month: JUL, day: 20 } },
      { key: "co.boyaca", name: "Batalla de Boyacá", rule: { kind: "fixed", month: AUG, day: 7 } },
      { key: "co.asuncion", name: "La Asunción", rule: { kind: "nth", month: AUG, weekday: 1, n: 3 } },
      { key: "co.raza", name: "Día de la Raza", rule: { kind: "nth", month: OCT, weekday: 1, n: 2 } },
      { key: "co.todos-los-santos", name: "Todos los Santos", rule: { kind: "nth", month: NOV, weekday: 1, n: 1 } },
      { key: "co.independencia-cartagena", name: "Independencia de Cartagena", rule: { kind: "nth", month: NOV, weekday: 1, n: 2 } },
      { key: "co.inmaculada", name: "La Inmaculada Concepción", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "co.navidad", name: "Navidad", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "CL",
    country: "Chile",
    locale: "es",
    source: "https://www.dt.gob.cl/ (Código del Trabajo, art. 169)",
    holidays: [
      { key: "cl.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "cl.viernes-santo", name: "Viernes Santo", rule: { kind: "easter", offset: -2 } },
      { key: "cl.sabado-santo", name: "Sábado Santo", rule: { kind: "easter", offset: -1 } },
      { key: "cl.trabajo", name: "Día Nacional del Trabajo", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "cl.marina", name: "Día de las Glorias Navales", rule: { kind: "fixed", month: MAY, day: 21 } },
      // Solsticio de invierno austral: se celebra el 20 o el 21 de junio según el año.
      { key: "cl.pueblos", name: "Día Nacional de los Pueblos Indígenas", rule: { kind: "fixed", month: JUN, day: 21 }, scope: "optional" },
      { key: "cl.san-pedro", name: "San Pedro y San Pablo", rule: { kind: "nth", month: JUN, weekday: 1, n: 5 } },
      { key: "cl.virgen-carmen", name: "Día de la Virgen del Carmen", rule: { kind: "fixed", month: JUL, day: 16 } },
      { key: "cl.asuncion", name: "Asunción de la Virgen", rule: { kind: "fixed", month: AUG, day: 15 } },
      { key: "cl.independencia", name: "Independencia Nacional", rule: { kind: "fixed", month: SEP, day: 18 } },
      { key: "cl.glorias-ejercito", name: "Día de las Glorias del Ejército", rule: { kind: "fixed", month: SEP, day: 19 } },
      { key: "cl.encuentro", name: "Día del Encuentro de Dos Mundos", rule: { kind: "nth", month: OCT, weekday: 1, n: 2 } },
      { key: "cl.iglesias", name: "Día Nacional de las Iglesias Evangélicas", rule: { kind: "fixed", month: OCT, day: 31 } },
      { key: "cl.todos-los-santos", name: "Día de Todos los Santos", rule: { kind: "fixed", month: NOV, day: 1 } },
      { key: "cl.inmaculada", name: "La Inmaculada Concepción", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "cl.navidad", name: "Navidad", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "PE",
    country: "Perú",
    locale: "es",
    source: "https://www.gob.pe/ (Decreto Legislativo 713)",
    holidays: [
      { key: "pe.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "pe.jueves-santo", name: "Jueves Santo", rule: { kind: "easter", offset: -3 } },
      { key: "pe.viernes-santo", name: "Viernes Santo", rule: { kind: "easter", offset: -2 } },
      { key: "pe.trabajo", name: "Día del Trabajo", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "pe.san-pedro", name: "San Pedro y San Pablo", rule: { kind: "fixed", month: JUN, day: 29 } },
      { key: "pe.independencia", name: "Día de la Independencia", rule: { kind: "fixed", month: JUL, day: 28 } },
      { key: "pe.fiestas-patrias", name: "Fiestas Patrias", rule: { kind: "fixed", month: JUL, day: 29 } },
      { key: "pe.santa-rosa", name: "Santa Rosa de Lima", rule: { kind: "fixed", month: AUG, day: 30 } },
      { key: "pe.angamos", name: "Combate de Angamos", rule: { kind: "fixed", month: OCT, day: 8 } },
      { key: "pe.todos-los-santos", name: "Todos los Santos", rule: { kind: "fixed", month: NOV, day: 1 } },
      { key: "pe.inmaculada", name: "Inmaculada Concepción", rule: { kind: "fixed", month: DEC, day: 8 } },
      { key: "pe.navidad", name: "Navidad del Señor", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "UY",
    country: "Uruguay",
    locale: "es",
    source: "https://www.gub.uy/ (Ley 16.805)",
    note: "Carnaval son dos días (lunes y martes). Semana de Turismo no se incluye: es jornada no laborable sólo para algunos sectores.",
    holidays: [
      { key: "uy.ano-nuevo", name: "Año Nuevo", rule: { kind: "fixed", month: JAN, day: 1 } },
      { key: "uy.carnaval", name: "Carnaval (lunes)", rule: { kind: "easter", offset: -48 } },
      { key: "uy.carnaval-martes", name: "Carnaval (martes)", rule: { kind: "easter", offset: -47 } },
      { key: "uy.desembarco", name: "Desembarco de los 33 Orientales", rule: { kind: "fixed", month: APR, day: 19 } },
      { key: "uy.trabajador", name: "Día de los Trabajadores", rule: { kind: "fixed", month: MAY, day: 1 } },
      { key: "uy.artigas", name: "Natalicio de Artigas", rule: { kind: "fixed", month: JUN, day: 19 } },
      { key: "uy.constitucion", name: "Jura de la Constitución", rule: { kind: "fixed", month: JUL, day: 18 } },
      { key: "uy.independencia", name: "Declaratoria de la Independencia", rule: { kind: "fixed", month: AUG, day: 25 } },
      { key: "uy.diversidad", name: "Día de la Diversidad Cultural", rule: { kind: "fixed", month: OCT, day: 12 } },
      { key: "uy.difuntos", name: "Día de los Difuntos", rule: { kind: "fixed", month: NOV, day: 2 } },
      { key: "uy.navidad", name: "Día de la Familia", rule: { kind: "fixed", month: DEC, day: 25 } }
    ]
  },
  {
    code: "INTL",
    country: "Internacional",
    locale: "en",
    source: "Sin festivos: sólo se ajustan sábados y domingos.",
    note: "Calendario neutro para quien estudia sin calendario nacional definido.",
    holidays: []
  }
];

export const CALENDAR_CODES = CALENDARS.map((calendar) => calendar.code);

export function findCalendar(code: string, region?: string): { calendar: CalendarDef; region?: RegionDef } | undefined {
  const calendar = CALENDARS.find((entry) => entry.code === code.toUpperCase());
  if (!calendar) return undefined;
  const regionDef = region ? calendar.regions?.find((entry) => entry.code === region.toUpperCase()) : undefined;
  return { calendar, region: regionDef };
}

export function isWeekend(iso: string): boolean {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}
