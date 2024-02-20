export const DELIVERABLE_PROVINCES_IN_PH = [
  "ABRA",
  "ALBAY",
  "AURORA",
  "BATAAN",
  "BATANES",
  "BATANGAS",
  "BENGUET",
  "BULACAN",
  "CAGAYAN",
  "CAMARINES NORTE",
  "CAMARINES SUR",
  "CATANDUANES",
  "CAVITE",
  "IFUGAO",
  "ILOCOS NORTE",
  "ILOCOS SUR",
  "ISABELA",
  "KALINGA",
  "LA UNION",
  "LAGUNA",
  "MARINDUQUE",
  "MASBATE",
  "MOUNTAIN PROVINCE",
  "NUEVA ECIJA",
  "NUEVA VIZCAYA",
  "OCCIDENTAL MINDORO",
  "ORIENTAL MINDORO",
  "PALAWAN",
  "PAMPANGA",
  "PANGASINAN",
  "QUEZON",
  "QUIRINO",
  "RIZAL",
  "ROMBLON",
  "TARLAC",
  "ZAMBALES",
  "NATIONAL CAPITAL REGION",
]

export const philippineRegions = {
  NCR: "National Capital Region (NCR)",
  I: "Ilocos Region (Region I)",
  CAR: "Cordillera Administrative Region (CAR)",
  II: "Cagayan Valley (Region II)",
  III: "Central Luzon (Region III)",
  "IV-A": "CALABARZON (Region IV-A)",
  "IV-B": "MIMAROPA (Region IV-B)",
  V: "Bicol Region (Region V)",
  VI: "Western Visayas (Region VI)",
  VII: "Central Visayas (Region VII)",
  VIII: "Eastern Visayas (Region VIII)",
  IX: "Zamboanga Peninsula (Region IX)",
  X: "Northern Mindanao (Region X)",
  XI: "Davao Region (Region XI)",
  XII: "SOCCSKSARGEN (Region XII)",
  XIII: "CARAGA (Region XIII)",
  BARMM: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
} as const

export type PhilippineRegionCode = keyof typeof philippineRegions

export const philippineRegionCodes = Object.keys(
  philippineRegions,
) as PhilippineRegionCode[]

export function philippineRegionCodeToName(regionCode: PhilippineRegionCode) {
  return philippineRegions[regionCode] ?? "N/A"
}
