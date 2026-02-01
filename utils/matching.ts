import { Peer, MatchResult, IntakeData } from '../types';
import { MOCK_DATABASE, GROUP_NAMES } from '../constants';

// Define regex mappings with stricter boundaries to avoid false positives
const CATEGORY_MATCHERS = [
  { 
    name: "Postpartum Depression", 
    regex: /postpartum|baby|birth|pregnancy|pregnant|nursing|breastfeed|newborn|maternity/i 
  },
  { 
    name: "Relationship Issues", 
    regex: /partner|husband|wife|spouse|boyfriend|girlfriend|break up|divorce|lonely|dating|marriage|couple|fight|argue|love|toxic|ex\b|separate/i 
  },
  { 
    name: "Workplace Stress", 
    regex: /work|job|boss|career|office|deadline|burnout|exhausted|salary|colleague|project|manager|promotion|fired|layoff|employment/i 
  },
  { 
    name: "Grief Support", 
    regex: /grief|loss|died|death|passed|mourn|miss|sadness|cry|gone|memory|funeral|lost a/i 
  },
  { 
    name: "Anxiety Management", 
    regex: /anxious|anxiety|panic|fear|worry|nervous|overwhelm|shaking|scared|dread|unease|tension|heart racing/i 
  },
];

const determineCategoriesRegex = (text: string): string[] => {
  const detected = new Set<string>();
  CATEGORY_MATCHERS.forEach(matcher => {
    if (text.match(matcher.regex)) {
      detected.add(matcher.name);
    }
  });
  
  if (detected.size === 0) return ["Anxiety Management"]; // Default fallback
  return Array.from(detected);
};

const normalizeHobby = (text: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/game|gaming|playstation|xbox|pc|nintendo/)) return "Gaming";
  if (lowerText.match(/hike|walk|run|nature|outdoor|mountain|camp|forest/)) return "Hiking";
  if (lowerText.match(/art|draw|paint|sketch|create|design|color|museum/)) return "Art";
  if (lowerText.match(/read|book|novel|write|poetry|story/)) return "Reading";
  return "General";
};

export const findMatches = (intake: IntakeData): MatchResult => {
  // Use AI categories if available and not empty, otherwise fallback to Regex
  let userCategories = intake.aiCategories && intake.aiCategories.length > 0 
    ? intake.aiCategories 
    : determineCategoriesRegex(intake.feelings);

  const userHobby = normalizeHobby(intake.hobby);

  const selectedPeers: Peer[] = [];
  const usedPeerIds = new Set<number>();

  // SELECTION ALGORITHM:
  // We need exactly 3 peers.
  // We want to cover as many of the user's detected categories as possible.
  // We cycle through the detected categories (Round Robin) to pick peers.
  
  for (let i = 0; i < 3; i++) {
    // Cycle through categories: If 2 categories [A, B], indices 0->A, 1->B, 2->A
    const targetCategory = userCategories[i % userCategories.length];
    
    // Find candidates for this specific category that haven't been picked yet
    const candidates = MOCK_DATABASE.filter(p => 
      p.category === targetCategory && !usedPeerIds.has(p.id)
    );

    // Score candidates by hobby to break ties (Secondary matching criteria)
    const scored = candidates.map(p => ({
        ...p,
        score: (p.hobby === userHobby ? 1 : 0)
    })).sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      selectedPeers.push(scored[0]);
      usedPeerIds.add(scored[0].id);
    } else {
      // Fallback: If we run out of peers for a category, pick best available from ANY unused peer
      // Preferring shared hobby
       const fallback = MOCK_DATABASE.filter(p => !usedPeerIds.has(p.id))
         .map(p => ({ ...p, score: (p.hobby === userHobby ? 1 : 0) }))
         .sort((a, b) => b.score - a.score)[0];
         
       if (fallback) {
         selectedPeers.push(fallback);
         usedPeerIds.add(fallback.id);
       }
    }
  }

  // Generate icebreaker based on interest
  let icebreaker = "Share one small win from your week.";
  if (userHobby === "Gaming") icebreaker = "What's the most relaxing game you've ever played?";
  if (userHobby === "Hiking") icebreaker = "Where is your favorite place to find peace in nature?";
  if (userHobby === "Art") icebreaker = "What colors represent your mood today?";
  if (userHobby === "Reading") icebreaker = "What book has had the biggest impact on your life?";

  const randomGroupName = GROUP_NAMES[Math.floor(Math.random() * GROUP_NAMES.length)];

  return {
    groupName: randomGroupName,
    peers: selectedPeers,
    icebreaker,
    userCategories
  };
};