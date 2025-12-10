import { Brain, Camera, Lightbulb } from "lucide-react-native";

export const analysisSteps = [
  {
    icon: Camera,
    title: "Images Captured",
    description: "Processing plant photos",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Identifying plant conditions",
  },
  {
    icon: Lightbulb,
    title: "Solutions Ready",
    description: "Preparing recommendations",
  },
];

// Supported plants with scientific name keywords for fuzzy matching
export const supportedPlants = [
  { keywords: ["rosa"], commonName: "Rose" },
  { keywords: ["hibiscus"], commonName: "Hibiscus" },
  { keywords: ["epipremnum", "aureum", "money plant", "pothos"], commonName: "Money Plant" },
  { keywords: ["dypsis", "lutescens", "areca"], commonName: "Areca Palm" },
  { keywords: ["solanum", "lycopersicum", "tomato"], commonName: "Tomato" },
  { keywords: ["spathiphyllum", "peace lily"], commonName: "Peace Lily" },
  { keywords: ["murraya", "koenigii", "curry"], commonName: "Curry Leaf" },
  { keywords: ["codiaeum", "variegatum", "croton"], commonName: "Croton" },
  { keywords: ["ficus", "lyrata", "fiddle"], commonName: "Fiddle Leaf Fig" },
  { keywords: ["sansevieria", "dracaena", "snake plant"], commonName: "Snake Plant" },
  { keywords: ["parlor palm"], commonName: "Areca Palm" },
];

/**
 * Fuzzy match plant name against supported plants
 * Returns { isSupported: boolean, commonName: string | null }
 */
export const matchSupportedPlant = (
  scientificName?: string,
  commonName?: string
): { isSupported: boolean; commonName: string | null } => {
  if (!scientificName && !commonName) {
    return { isSupported: false, commonName: null };
  }

  const searchText = `${scientificName || ""} ${commonName || ""}`.toLowerCase();

  for (const plant of supportedPlants) {
    for (const keyword of plant.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return { isSupported: true, commonName: plant.commonName };
      }
    }
  }

  return { isSupported: false, commonName: null };
};

// Legacy export for backward compatibility
export const allowedPlants: Record<string, string> = {
  rosa: "Rose",
  "hibiscus rosa-sinensis": "Hibiscus",
  "epipremnum aureum": "Money Plant",
  "dypsis lutescens": "Areca Palm",
  "solanum lycopersicum": "Tomato",
  "spathiphyllum spp": "Peace Lily",
  "murraya koenigii": "Curry Leaf",
  "codiaeum variegatum": "Croton",
  "ficus lyrata": "Fiddle Leaf Fig",
  "sansevieria trifasciata": "Snake Plant",
};