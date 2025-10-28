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
