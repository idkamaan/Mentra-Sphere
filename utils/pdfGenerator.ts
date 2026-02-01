import { MatchResult, UserProfile } from '../types';

// Helper to generate clinical narrative based on categories
const getClinicalContext = (categories: string[], name: string): string => {
  const mainCat = categories[0] || "General Well-being";
  
  const narratives: Record<string, string> = {
    "Postpartum Depression": `${name} is currently navigating the complex emotional landscape of the postpartum period. The selected support circle focuses on validating maternal experiences, reducing isolation, and navigating identity shifts. Key themes include sleep deprivation, hormonal regulation, and bonding challenges.`,
    "Relationship Issues": `${name} has indicated distress related to interpersonal relationships. The matched group provides a space to explore attachment styles, boundary setting, and communication patterns. The focus is on rebuilding self-worth independent of relationship status.`,
    "Workplace Stress": `${name} is experiencing high levels of professional burnout or anxiety. The support circle is curated to normalize these stressors and share coping mechanisms for high-pressure environments, focusing on work-life separation and redefining professional value.`,
    "Grief Support": `${name} is processing a significant loss. The group dynamic is centered on the 'continuing bonds' model of grief, offering a non-judgmental space to share memories and navigate the non-linear stages of mourning without pressure to 'move on'.`,
    "Anxiety Management": `${name} reports symptoms of elevated anxiety. The matched peers share similar experiences with nervous system regulation. The group's primary goal is to function as a co-regulation anchor, practicing grounding techniques and challenging catastrophic thinking.`
  };

  return narratives[mainCat] || `${name} is seeking a supportive community to enhance general mental well-being and resilience. The group focuses on shared human experiences and mutual support.`;
};

// Helper to get goals
const getTherapeuticGoals = (categories: string[]): string[] => {
  const mainCat = categories[0] || "General";
  
  const goals: Record<string, string[]> = {
    "Postpartum Depression": ["Normalize the 'Baby Blues' vs. PPD distinction", "Identify one self-care window per day", "Reduce guilt around parenting expectations"],
    "Relationship Issues": ["Establish one healthy boundary this week", "Identify triggers for emotional dysregulation", "Practice 'I' statements in communication"],
    "Workplace Stress": ["Define clear 'clock-out' rituals", "Identify physical signs of burnout", "Practice saying 'no' to non-essential tasks"],
    "Grief Support": ["Share one memory without judgment", "Allow space for 'grief waves'", "Create a small ritual of remembrance"],
    "Anxiety Management": ["Practice 4-7-8 breathing technique", "Identify cognitive distortions", "Create a 'safety anchor' visualization"]
  };

  return goals[mainCat] || ["Build a consistent support network", "Verbalize emotions safely", "Practice active listening"];
};

export const generateDossier = (user: UserProfile, match: MatchResult) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // --- CONFIGURATION ---
  const COLORS = {
    primary: [51, 105, 30],    // Deep Sage (#33691E)
    secondary: [139, 195, 74], // Light Green (#8BC34A)
    accent: [220, 237, 200],   // Very Light Sage (#DCEDC8)
    textDark: [30, 30, 30],
    textLight: [100, 100, 100],
    white: [255, 255, 255]
  };

  const MARGIN = 20;
  const CONTENT_WIDTH = 170; // 210 - 20 - 20
  const PAGE_HEIGHT = doc.internal.pageSize.height;
  const FOOTER_HEIGHT = 20;
  const BOTTOM_LIMIT = PAGE_HEIGHT - FOOTER_HEIGHT - 10;
  let cursorY = 0;

  // Helper: Check Page Break
  const checkPageBreak = (heightNeeded: number) => {
    if (cursorY + heightNeeded > BOTTOM_LIMIT) {
      doc.addPage();
      cursorY = 20; // Reset to top margin
      return true;
    }
    return false;
  };

  // --- HEADER SECTION ---
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, 210, 50, 'F');

  // Title
  doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Mentra Sphere", MARGIN, 25);
  
  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Confidential Clinical Session Brief", MARGIN, 33);

  // Date/ID Badge
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 190, 20, { align: "right" });
  doc.text(`Ref: MS-${Math.floor(Math.random() * 10000)}`, 190, 26, { align: "right" });

  cursorY = 70;

  // --- CLIENT PROFILE SECTION ---
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Client Profile", MARGIN, cursorY);
  
  doc.setDrawColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, cursorY + 2, 190, cursorY + 2);
  
  cursorY += 12;

  // Details Grid
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Name:", MARGIN, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(user.name, MARGIN + 25, cursorY);

  doc.setFont("helvetica", "bold");
  doc.text("Location:", MARGIN + 80, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(user.location, MARGIN + 105, cursorY);

  cursorY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Email:", MARGIN, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(user.email, MARGIN + 25, cursorY);

  doc.setFont("helvetica", "bold");
  doc.text("Primary Focus:", MARGIN + 80, cursorY);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(match.userCategories.join(", "), MARGIN + 115, cursorY);

  cursorY += 20;

  // --- CLINICAL CONTEXT BOX ---
  // 1. Prepare Text
  const narrative = getClinicalContext(match.userCategories, user.name);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const splitNarrative = doc.splitTextToSize(narrative, CONTENT_WIDTH - 10); // -10 for internal padding
  
  // 2. Calculate Dynamic Height
  // Approx 5 units per line + 20 units for title and padding
  const boxHeight = (splitNarrative.length * 5) + 25;

  // 3. Check if box fits
  checkPageBreak(boxHeight + 10);

  // 4. Draw Box
  doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.rect(MARGIN, cursorY, CONTENT_WIDTH, boxHeight, 'F');
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(MARGIN, cursorY, CONTENT_WIDTH, boxHeight, 'D');

  // 5. Draw Title inside Box
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Therapeutic Context & Group Fit", MARGIN + 5, cursorY + 10);

  // 6. Draw Body inside Box
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(splitNarrative, MARGIN + 5, cursorY + 18);

  cursorY += boxHeight + 15; // Move cursor past box

  // --- THE SPHERE (PEERS) ---
  checkPageBreak(30); // Check enough space for title
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Matched Sphere: ${match.groupName}`, MARGIN, cursorY);
  doc.line(MARGIN, cursorY + 2, 190, cursorY + 2);
  cursorY += 15;

  // Peer Cards Loop
  match.peers.forEach((peer) => {
    // Check if a single peer entry fits (approx 15 units height)
    checkPageBreak(20);

    // Bullet Dot
    doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.circle(MARGIN + 2, cursorY - 1, 1.5, 'F');

    // Name
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(peer.name, MARGIN + 8, cursorY);

    // Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    doc.text(`Category: ${peer.category}  |  Shared Interest: ${peer.hobby}`, MARGIN + 8, cursorY + 5);

    cursorY += 15;
  });

  cursorY += 10;

  // --- THERAPEUTIC GOALS & ICEBREAKER ---
  checkPageBreak(40); // Ensure title and at least one item fits

  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Initial Session Plan", MARGIN, cursorY);
  doc.line(MARGIN, cursorY + 2, 190, cursorY + 2);
  cursorY += 15;

  // Icebreaker
  checkPageBreak(25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Suggested Icebreaker:", MARGIN, cursorY);
  
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  
  const icebreakerText = `"${match.icebreaker}"`;
  const splitIcebreaker = doc.splitTextToSize(icebreakerText, CONTENT_WIDTH);
  doc.text(splitIcebreaker, MARGIN, cursorY + 7);
  
  cursorY += (splitIcebreaker.length * 5) + 15;

  // Goals
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Recommended Therapeutic Goals:", MARGIN, cursorY);
  cursorY += 8;

  const goals = getTherapeuticGoals(match.userCategories);
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  
  goals.forEach(goal => {
    checkPageBreak(10); // Check space for each goal line
    doc.text(`• ${goal}`, MARGIN + 5, cursorY);
    cursorY += 7;
  });

  // --- FOOTER ON ALL PAGES ---
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.rect(0, PAGE_HEIGHT - 20, 210, 20, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    doc.text("This document contains confidential health information. Intended for authorized clinical use only.", 105, PAGE_HEIGHT - 12, { align: "center" });
    doc.text(`© 2024 Mentra Sphere - Page ${i} of ${pageCount}`, 105, PAGE_HEIGHT - 7, { align: "center" });
  }

  doc.save(`${user.name.replace(" ", "_")}_Session_Brief.pdf`);
};