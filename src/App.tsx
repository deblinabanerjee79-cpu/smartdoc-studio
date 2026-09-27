import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, CheckCircle2, Calendar, 
  Sparkles, RefreshCw, Play, CheckSquare, 
  Square, BookOpen, ArrowRight, ArrowLeft,
  Download, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  task: string;
  tag: string;
}

interface FlashcardItem {
  front: string;
  back: string;
  category: string;
}

interface DocumentData {
  title: string;
  unitHeader?: string;
  category: string;
  format: string;
  words: number;
  readingTime: string;
  pageCount: number;
  pages: string[];
  acronyms: string[];
  deadlines: { item: string; date: string; tag: string }[];
  checklist: ChecklistItem[];
  flashcards?: FlashcardItem[];
  summary: string;
}

const PRESETS: Record<string, DocumentData> = {
  stw: {
    title: "STW_4A5_Symbols_&_Abbreviations.pdf",
    unitHeader: "STRUCTURE OF SCIENTIFIC DOCUMENTS • TITLE, ABSTRACT, KEYWORDS",
    category: "Instructional Reference / Lecture Slides",
    format: "PDF-1.4 / Vector Stream",
    words: 1420,
    readingTime: "~4 min read",
    pageCount: 3,
    pages: [
      `UNIT 04: STRUCTURE OF SCIENTIFIC DOCUMENTS\nSYMBOLS & ABBREVIATIONS\n\n1. Guidelines for Notation:\n• Provide a dedicated list of symbols and abbreviations immediately after Keywords.\n• Symbols must follow established international SI conventions.\n• Latin & Greek symbols should be cleanly separated in the appendices.\n• Sequence Greek symbols by standard alphabetical progression: α (alpha), β (beta), γ (gamma), δ (delta), ε (epsilon)...`,
      `2. Sequence of Small Greek Letters:\n• α (alpha)   • β (beta)   • γ (gamma)   • δ (delta)\n• ε (epsilon) • ζ (zeta)   • η (eta)     • θ (theta)\n• ι (iota)    • κ (kappa)  • λ (lambda)  • μ (mu)\n• ν (nu)      • ξ (xi)     • ο (omicron) • π (pi)\n• ρ (rho)     • σ (sigma)  • τ (tau)     • υ (upsilon)\n• φ (phi)     • χ (chi)    • ψ (psi)     • ω (omega)`,
      `3. Units & Quantities:\n• Units of measure such as mm, dB, min, hr, and °C.\n• Statistical metrics like %, μ, σ², ANOVA, R², t, F.\n• Mathematical operators (max, min, lim, log).\n• Chemical compounds (H2SO4, C6H12O6) and SI units.`
    ],
    acronyms: ["SI", "ANOVA", "ISO", "DNA", "ERP", "EHR"],
    deadlines: [],
    checklist: [
      { task: "Separate Latin and Greek symbols alphabetically in nomenclature index", tag: "Formatting" },
      { task: "Verify SI measurement units formatting (mm, dB, hr, °C)", tag: "Standard" },
      { task: "Define all abbreviations on their first appearance in body text", tag: "Rule" },
      { task: "Maintain consistent lowercase vs uppercase Greek symbol designations", tag: "Formatting" }
    ],
    flashcards: [
      {
        front: "Alphabetical sequence for small Greek letters",
        back: "α (alpha), β (beta), γ (gamma), δ (delta), ε (epsilon)... up to ω (omega).",
        category: "Notation Sequence"
      },
      {
        front: "Standard location for Symbols & Abbreviations",
        back: "Provide a dedicated list immediately following the Keywords section and preceding the Introduction.",
        category: "Structural Standard"
      },
      {
        front: "SI Measurement Units Convention",
        back: "Standard metric units (mm, dB, min, hr, °C) must follow established international SI conventions without periods.",
        category: "SI Standard"
      },
      {
        front: "Rule for Abbreviations & Acronyms",
        back: "Define every abbreviation in full upon its first appearance in body text before utilizing the standalone acronym.",
        category: "Formatting Rule"
      }
    ],
    summary: "Lecture slides providing standardized formatting guidelines for scientific research documents, focusing on Greek letters, SI measurement units, and abbreviation indexes."
  },
  lab: {
    title: "CS204_Lab_Assignment_3_Trees.pdf",
    unitHeader: "BALANCED SEARCH TREES & ROTATIONS",
    category: "Problem Set / Lab Evaluation",
    format: "PDF-1.5 / Assignment",
    words: 850,
    readingTime: "~3 min read",
    pageCount: 1,
    pages: [
      `DEPARTMENT OF COMPUTER SCIENCE\nLAB EVALUATION 03: BALANCED SEARCH TREES\n\nObjective: Implement an AVL Tree with self-balancing rotation mechanisms.\n\nProblem 1: Implement Left-Rotate and Right-Rotate routines in C++/Java.\nProblem 2: Verify tree height invariants after 1,000 random insertions.\n\nSubmission Requirements:\n• Submit zipped source code and benchmark graphs to the student portal.\n• Deadline: October 15, 2026 at 23:59 IST.\n• Late submissions deduct 20% marks per 24 hours.`
    ],
    acronyms: ["AVL", "BST", "CLI", "IDE"],
    deadlines: [
      { item: "Lab 3 Code Submission", date: "Oct 15, 2026", tag: "Strict Deadline" },
      { item: "Viva & Benchmarking Session", date: "Oct 18, 2026", tag: "Evaluation" }
    ],
    checklist: [
      { task: "Implement Left and Right AVL Rotations", tag: "Algorithm" },
      { task: "Verify O(log N) balance invariant after insertions", tag: "Rule" },
      { task: "Generate height-growth comparative graphs", tag: "Formatting" },
      { task: "Archive code to ZIP format before deadline", tag: "Submission" }
    ],
    flashcards: [
      {
        front: "AVL Tree Balance Invariant",
        back: "For every node, the height difference between left and right subtrees (balance factor) must strictly remain in {-1, 0, +1}.",
        category: "Tree Invariant"
      },
      {
        front: "Self-Balancing Rotations",
        back: "Execute Left-Rotate or Right-Rotate routines in O(1) time immediately upon detecting a balance factor violation.",
        category: "Algorithm"
      },
      {
        front: "Worst-Case Time Complexity",
        back: "Guaranteed O(log N) worst-case time for search, insertion, and deletion operations even with ordered data.",
        category: "Complexity"
      },
      {
        front: "Late Submission Penalty",
        back: "Submissions past the October 15 at 23:59 IST deadline deduct an automatic 20% marks for every 24 hours elapsed.",
        category: "Grading Rule"
      }
    ],
    summary: "Practical laboratory assessment covering the implementation, self-balancing rotations, and performance benchmarking of AVL search trees."
  },
  syllabus: {
    title: "CS301_Computer_Networks_Syllabus.pdf",
    unitHeader: "COMPUTER NETWORKS & PROTOCOLS",
    category: "Course Curriculum / Academic Plan",
    format: "PDF-1.4 / Syllabus",
    words: 2150,
    readingTime: "~7 min read",
    pageCount: 2,
    pages: [
      `COURSE OUTLINE: COMPUTER NETWORKS & PROTOCOLS\n\nModule 1: Physical & Data Link Layer (Framing, Error Detection, CRC)\nModule 2: Network Layer (IP Addressing, CIDR, Subnetting, OSPF, BGP)\nModule 3: Transport Layer (TCP 3-Way Handshake, Congestion Control)\n\nGrading Weightage:\n• Mid-Term Assessment: 30% (November 04, 2026)\n• Lab Practicals & Continuous Eval: 25%\n• End-Semester Examination: 45% (December 12, 2026)`
    ],
    acronyms: ["TCP", "IP", "CIDR", "OSPF", "BGP", "CRC"],
    deadlines: [
      { item: "Mid-Term Examination", date: "Nov 04, 2026", tag: "30% Weight" },
      { item: "Final Examination", date: "Dec 12, 2026", tag: "45% Weight" }
    ],
    checklist: [
      { task: "Practice Classless Inter-Domain Routing (CIDR) calculations", tag: "Review" },
      { task: "Trace TCP sliding window and congestion avoidance graphs", tag: "Rule" },
      { task: "Review OSI vs TCP/IP architectural layers", tag: "Formatting" },
      { task: "Prepare continuous assessment deliverables before Mid-Term", tag: "Submission" }
    ],
    flashcards: [
      {
        front: "Role of the Network Layer",
        back: "Logical IP Addressing, CIDR subnetting, and packet routing (OSPF, BGP).",
        category: "Protocol Architecture"
      },
      {
        front: "TCP 3-Way Handshake Purpose",
        back: "Reliable connection establishment and sequence number synchronization via SYN → SYN-ACK → ACK packet exchange.",
        category: "Transport Layer"
      },
      {
        front: "Data Link Layer CRC Framing",
        back: "Cyclic Redundancy Check executes binary polynomial division over frame payloads to detect bit errors in transit.",
        category: "Link Layer"
      },
      {
        front: "Grading Weight Distribution",
        back: "Mid-Term assessment carries 30%, Continuous Lab Practicals carry 25%, and the End-Semester Final carries 45%.",
        category: "Curriculum Standard"
      }
    ],
    summary: "Comprehensive university syllabus specifying course modules, textbook references, and grading milestone percentages for Computer Networks."
  }
};

/**
 * Bullet & Paragraph Spacing Normalization (Universal for all PDFs)
 */
function normalizePdfText(rawText: string): string {
  const cleaned = rawText
    .replace(/[\uFFFD\u0000-\u001F\u007F-\u009F\uF000-\uFFFF]/g, ' ')
    .replace(/[\uFFFD\uF0B7\u2022\uFEFF]/g, '\n• ')
    .replace(/\s*•\s*/g, '\n• ')
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1\n\n') // Natural paragraph breaks after sentences
    .replace(/\s+([,.:;?!])/g, '$1')           // Attach orphan punctuation
    .replace(/\n\s*[,.:;?!]/g, '')             // Delete stray punctuation on new lines
    .replace(/\b([A-Za-z]+)\s+s\b/g, '$1s')   // Fix split trailing plurals (e.g. "title s" -> "titles")
    .replace(/\n•\s*(?=\n|$)/g, '')            // Remove empty bullets
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Renders structured document reader lines in warm editorial Canva style
 */
function renderDocumentLines(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Strict Heading Detection
    const hasPunctuation = /[.,:;?!]/.test(trimmed);
    const isDistinctHeader = /^(PURPOSE OF TITLE|TITLE GUIDELINES|STATEMENT TITLE|QUESTION TITLE|TYPES OF TITLE|ABSTRACT|KEYWORDS|UNIT \d+|MODULE \d+|SECTION \d+|GUIDELINES FOR NOTATION|SEQUENCE OF SMALL GREEK LETTERS|UNITS & QUANTITIES)$/i.test(trimmed);
    const isShortCleanAllCaps = trimmed.length >= 4 && trimmed.length < 45 && trimmed === trimmed.toUpperCase() && !hasPunctuation && !trimmed.startsWith('•');

    const isHeader = trimmed.length < 45 && !hasPunctuation && (isDistinctHeader || isShortCleanAllCaps);

    if (isHeader) {
      return (
        <h3
          key={idx}
          className="text-teal-700 font-bold text-xs uppercase tracking-wider mb-1 mt-4 block"
        >
          {trimmed}
        </h3>
      );
    }

    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const bulletContent = trimmed.replace(/^[•\-]\s*/, '');
      return (
        <div key={idx} className="pl-2 flex items-start gap-2.5 text-stone-700 font-sans text-xs sm:text-[13px] leading-relaxed">
          <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
          <span>{bulletContent}</span>
        </div>
      );
    }

    // Default for 95% of text: Always body text
    return (
      <p key={idx} className="text-stone-700 font-sans text-xs sm:text-[13px] leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

/**
 * Universal Dynamic Checklist Engine (Student-Friendly Study Checkpoints)
 */
function generateStudentFriendlyChecklist(fullText: string, fileName: string, foundDates: string[]): ChecklistItem[] {
  const clean = fullText.replace(/\s+/g, ' ');
  const lower = clean.toLowerCase();
  const items: ChecklistItem[] = [];

  // 1. Topic & Concept Extraction (Find prominent sections/headings)
  const headingMatches = clean.match(/(?:PURPOSE OF|TYPES OF|GUIDELINES FOR|INTRODUCTION TO|STRUCTURE OF|MODULE \d+|UNIT \d+|OVERVIEW OF)\s+([A-Z\s]{4,60})/gi) || [];
  const primaryTopics = headingMatches
    .map(h => h.replace(/(?:PURPOSE OF|TYPES OF|GUIDELINES FOR|INTRODUCTION TO|STRUCTURE OF|MODULE \d+|UNIT \d+|OVERVIEW OF)\s+/i, '').trim())
    .filter(t => t.length > 2);
  const uniqueTopics = Array.from(new Set(primaryTopics));

  // 2. Build 4 Natural, Conversational Checkpoints:

  // Item 1: Core Concept Mastery
  if (uniqueTopics.length > 0) {
    items.push({
      task: `Master key concepts behind "${uniqueTopics[0].toLowerCase()}" and note definitions`,
      tag: "Core Concept"
    });
  } else {
    items.push({
      task: `Review the foundational definitions and main ideas in ${fileName.replace(/\.pdf$/i, '').replace(/_/g, ' ')}`,
      tag: "Quick Review"
    });
  }

  // Item 2: Distinctions, Examples & Case Studies
  if (lower.includes("example") || lower.includes("case study") || lower.includes("e.g.")) {
    items.push({
      task: `Walk through the given examples and real-world case studies in the notes`,
      tag: "Examples"
    });
  } else if (uniqueTopics.length > 1) {
    items.push({
      task: `Compare key differences and classifications in "${uniqueTopics[1].toLowerCase()}"`,
      tag: "Comparison"
    });
  } else {
    items.push({
      task: `Highlight important formulas, diagrams, or rules emphasized in the slides`,
      tag: "Key Points"
    });
  }

  // Item 3: Rules, Standards & Formatting
  if (lower.includes("guideline") || lower.includes("rule") || lower.includes("format") || lower.includes("standard")) {
    items.push({
      task: `Double-check mandatory guidelines and formatting rules to avoid easy mark deductions`,
      tag: "Rules"
    });
  } else {
    items.push({
      task: `Summarize the main takeaways into your revision notes in 3–4 bullet points`,
      tag: "Study Prep"
    });
  }

  // Item 4: Action, Submission, or Self-Quiz
  if (foundDates.length > 0) {
    items.push({
      task: `Lock in milestone prep ahead of ${foundDates[0]}`,
      tag: "Deadline"
    });
  } else if (lower.includes("question") || lower.includes("exercise") || lower.includes("problem")) {
    items.push({
      task: `Try solving practice problems and self-test questions at the end of the chapter`,
      tag: "Practice"
    });
  } else {
    items.push({
      task: `Test yourself on the core terminology without looking back at the slides`,
      tag: "Self Test"
    });
  }

  return items.slice(0, 4);
}

function normalizeFlashcardKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Validates front inquiry to prevent malformed questions or dangling prepositions.
 */
function isValidFront(front: string): boolean {
  if (!front || front.length < 10) return false;
  // Disallow trailing prepositions, incomplete "regarding ...?", trailing slashes or dangling punctuation
  if (/\b(regarding|under|for|with|by|to|in|of|at|from)\s*\??$/i.test(front)) return false;
  if (/[\/\\,\-–—:;]\s*\??$/.test(front)) return false;
  return true;
}

/**
 * Preprocesses raw text by normalizing Latin abbreviations and removing citations.
 */
function preprocessTextForFlashcards(text: string): string {
  return text
    .replace(/\bi\.\s*e\./gi, 'that is,')
    .replace(/\be\.\s*g\./gi, 'for example,')
    .replace(/\[\s*definitions?\s+from[^\]]*\]/gi, '')
    .replace(/\[[^\]]*citation[^\]]*\]/gi, '');
}

/**
 * Cleans back explanation text:
 * - normalizes Latin abbreviations (i.e. -> that is, e.g. -> for example)
 * - strips leading bullets/symbols
 * - normalizes whitespace
 * - strips trailing list numbers (e.g. "competitor's work 2.")
 * - rejects incomplete thoughts / dangling conjunctions / short fragments
 * - ensures ends with clean punctuation (.!?)
 */
function cleanFlashcardBack(rawText: string, maxLen = 220): string | null {
  if (!rawText) return null;

  let text = preprocessTextForFlashcards(rawText)
    .replace(/^[•\-\d.\s❖◆◇◈●◦*#/]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip trailing list counter digits (e.g., " 2.", " 1", " 3.")
  text = text.replace(/\s+\d+\.?\s*$/, '').trim();

  // Strip trailing slashes, commas, dashes, colons
  text = text.replace(/[\/\\,\-–—:;]\s*$/, '').trim();

  if (text.length < 25) return null;

  // Split on sentence boundaries (.?! followed by space or end)
  const sentenceMatches = [...text.matchAll(/([.?!])(?:\s+|$)/g)];

  let result = '';
  if (sentenceMatches.length >= 2) {
    const secondEnd = sentenceMatches[1].index! + 1;
    if (secondEnd <= maxLen) {
      result = text.slice(0, secondEnd).trim();
    } else {
      const firstEnd = sentenceMatches[0].index! + 1;
      result = text.slice(0, firstEnd).trim();
    }
  } else if (sentenceMatches.length === 1) {
    const firstEnd = sentenceMatches[0].index! + 1;
    result = text.slice(0, firstEnd).trim();
  } else {
    // If no sentence punctuation, keep up to maxLen if it's a coherent clause
    if (text.length <= maxLen) {
      result = text;
    } else {
      // Find a safe word break
      const slice = text.slice(0, maxLen);
      const lastSpace = slice.lastIndexOf(' ');
      if (lastSpace > 30) {
        result = slice.slice(0, lastSpace).trim();
      } else {
        return null;
      }
    }
  }

  // Strip trailing list counter digits again if exposed by slicing
  result = result.replace(/\s+\d+\.?\s*$/, '').trim();

  // Reject dangling conjunctions, prepositions, or single letters like i. or e.
  if (/\b(and|or|the|in|at|of|to|for|with|by|a|an|from|on|which|that|who|whom|i|e)\.?\s*$/i.test(result)) {
    return null;
  }
  if (/[/\\,\-–—:;]$/.test(result)) {
    return null;
  }

  if (result.length < 25) return null;

  // Capitalize first character
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Ensure ends with clean punctuation
  if (!/[.!?]$/.test(result)) {
    result += '.';
  }

  return result;
}

function formatFrontInquiry(rawTerm: string): string {
  let clean = rawTerm
    .replace(/^(?:key concept|core concept|note|rule|standard|guideline|definition|term)[:\s-]*/i, '')
    .replace(/^(?:section|slide|unit|module)\s+\d+[:\s-]*/i, '')
    .replace(/^[•\-\d.\s❖◆◇◈●◦*#]+/, '')
    .trim();

  // Strip trailing numbers, slashes, or dashes
  clean = clean.replace(/[\s\d/\\,\-–—:;]+$/, '').trim();

  if (clean.length === 0) return '';

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  if (clean.includes('?')) return clean;

  // Semantic inquiry specialization
  if (/\baudience\b/i.test(clean)) {
    return `What is the definition and role of ${clean}?`;
  }
  if (/\b(conflict|interest|statement|requirement|disclosure|policy)\b/i.test(clean)) {
    return `What is the requirement for a ${clean}?`;
  }
  if (/\b(protocol|layer|factor|mechanism|criterion|criteria|method|structure|system|model|process|algorithm|architecture)\b/i.test(clean)) {
    return `What is the function and purpose of ${clean}?`;
  }

  if (clean.length > 35) {
    return `${clean}: Core Standard`;
  }

  return `What defines ${clean}?`;
}

function isFlashcardDuplicate(
  candidate: FlashcardItem,
  existingCards: FlashcardItem[],
  seenSet: Set<string>
): boolean {
  const normFront = normalizeFlashcardKey(candidate.front);
  const normBack = normalizeFlashcardKey(candidate.back);

  if (normFront.length === 0 || normBack.length === 0) return true;
  if (seenSet.has(normFront) || seenSet.has(normBack)) return true;

  const frontPrefix30 = normFront.slice(0, 30);
  const backPrefix30 = normBack.slice(0, 30);

  for (const card of existingCards) {
    const cardNormFront = normalizeFlashcardKey(card.front);
    const cardNormBack = normalizeFlashcardKey(card.back);

    if (frontPrefix30.length >= 25 && cardNormFront.startsWith(frontPrefix30)) return true;
    if (backPrefix30.length >= 25 && cardNormBack.startsWith(backPrefix30)) return true;

    if (normFront.length > 25 && cardNormFront.includes(normFront)) return true;
    if (cardNormFront.length > 25 && normFront.includes(cardNormFront)) return true;
    if (normBack.length > 35 && cardNormBack.includes(normBack)) return true;
    if (cardNormBack.length > 35 && normBack.includes(cardNormBack)) return true;

    // Word-level overlap similarity (>75%)
    const wordsCandFront = new Set(candidate.front.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    const wordsCardFront = new Set(card.front.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    if (wordsCandFront.size > 2 && wordsCardFront.size > 2) {
      let common = 0;
      wordsCandFront.forEach(w => { if (wordsCardFront.has(w)) common++; });
      const sim = (2 * common) / (wordsCandFront.size + wordsCardFront.size);
      if (sim > 0.75) return true;
    }

    const wordsCandBack = new Set(candidate.back.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    const wordsCardBack = new Set(card.back.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    if (wordsCandBack.size > 3 && wordsCardBack.size > 3) {
      let common = 0;
      wordsCandBack.forEach(w => { if (wordsCardBack.has(w)) common++; });
      const sim = (2 * common) / (wordsCandBack.size + wordsCardBack.size);
      if (sim > 0.75) return true;
    }
  }

  return false;
}

/**
 * Overhauled Semantic Flashcard Extraction Engine
 * 1. Preprocesses text to normalize Latin abbreviations (i.e. -> that is, e.g. -> for example)
 * 2. Academic Slide Tokenization (newlines, bullets, diamond markers)
 * 3. Explicit Term-Definition Pairs (Term: Explanation)
 * 4. Numbered / Condition Rules (Splitting multi-item guidelines into standalone cards)
 * 5. Strict validation & deduplication targeting 4-6 cards
 */
function generateFlashcards(rawText: string, pages: string[]): FlashcardItem[] {
  const cards: FlashcardItem[] = [];
  const seenSet = new Set<string>();

  const tryAddCard = (front: string, rawBack: string, category: string): boolean => {
    if (cards.length >= 6) return false;

    if (!isValidFront(front)) return false;

    const cleanedBack = cleanFlashcardBack(rawBack, 220);
    if (!cleanedBack || cleanedBack.length < 25) return false;

    const candidate: FlashcardItem = {
      front: front.trim(),
      back: cleanedBack,
      category
    };

    if (!isFlashcardDuplicate(candidate, cards, seenSet)) {
      cards.push(candidate);
      seenSet.add(normalizeFlashcardKey(candidate.front));
      seenSet.add(normalizeFlashcardKey(candidate.back));
      return true;
    }
    return false;
  };

  const slides = pages.length > 0 ? pages : [rawText];

  // 1. Iterate through slides with delimiter splitting & abbreviation protection
  for (const slide of slides) {
    if (cards.length >= 6) break;

    const cleanedSlide = preprocessTextForFlashcards(slide);

    // Split slide by diamond bullets, standard bullets, or newlines
    const rawSegments = cleanedSlide.split(/(?:\s[❖◆•◇◈●◦]\s)|(?:\n\s*[-•❖◆]\s*)|[\n\r]+/);

    const segments = rawSegments
      .map(s => s.trim())
      .filter(s => {
        if (!s || s.length < 8) return false;
        if (/^(?:section\s*\/\s*slide|slide\s+\d+|unit\s+\d+|module\s+\d+|that'?s\s+all|page\s+\d+|references?|bibliography|appendix|definitions?\s+from)\b/i.test(s)) return false;
        if (/^\[.*\]$/.test(s)) return false;
        if (/^https?:\/\//i.test(s)) return false;
        return true;
      });

    let currentHeading = '';

    for (let idx = 0; idx < segments.length && cards.length < 6; idx++) {
      const seg = segments[idx];

      // Check if segment is a heading
      const isHeading = (
        seg.length < 55 &&
        !/[.?!;]$/.test(seg) &&
        (seg === seg.toUpperCase() || /^(?:\d+\.\s*)?(?:Guidelines|Rules|Sequence|Module|Structure|Contrast|Types|Purpose|Conflict|Requirement)/i.test(seg))
      );

      if (isHeading) {
        currentHeading = seg.replace(/^\d+\.\s*/, '').replace(/^[•\-\s]+/, '').trim();
        continue;
      }

      // Check if segment contains numbered rules (e.g. "1. Financial interest... 2. Research findings...")
      if (/(?:^|\s)\b1\.\s+.*\b2\.\s+/s.test(seg)) {
        const numberedItems = seg.split(/(?:^|\s)\d+\.\s*/).map(item => item.trim()).filter(item => item.length >= 20);
        for (const item of numberedItems) {
          if (cards.length >= 6) break;
          let front = '';
          if (/\b(?:financial|investment|equity|stock|funding|grant)\b/i.test(item)) {
            front = "What constitutes financial or academic conflict of interest?";
          } else if (/\b(?:research|findings|data|competitor|evaluation)\b/i.test(item)) {
            front = "How can research findings represent a conflict of interest?";
          } else if (currentHeading) {
            front = `What is a key requirement under ${currentHeading}?`;
          } else {
            front = "What constitutes a formal conflict of interest?";
          }
          tryAddCard(front, item, "Requirement");
        }
        continue;
      }

      // 1. Explicit Term-Definition Pattern: Term: Definition or Term — Definition
      const termMatch = seg.match(/^([A-Za-z0-9\s/&()-]{3,35})\s*[:—–]\s*(.+)$/);
      if (termMatch) {
        const rawTerm = termMatch[1].trim();
        const rawDef = termMatch[2].trim();

        if (!/^(?:section|slide|page|unit|module|chapter|problem|objective|date|deadline|note|example)\b/i.test(rawTerm)) {
          const front = formatFrontInquiry(rawTerm);
          const category = /\b(audience|layer|protocol|architecture|tree|model|theory|system)\b/i.test(rawTerm)
            ? "Core Concept"
            : "Definition";
          if (tryAddCard(front, rawDef, category)) {
            continue;
          }
        }
      }

      // If segment is under a contrast/guidelines heading
      if (currentHeading && /\b(?:rules|guidelines|standards?|criteria|conflict|disclosure)\b/i.test(currentHeading)) {
        if (seg.length >= 25) {
          const front = `What is the established requirement for ${currentHeading}?`;
          if (tryAddCard(front, seg, "Standard")) {
            continue;
          }
        }
      }

      // If segment contains rule/action keywords
      if (/\b(must|limits?|formatting|conventions?|standards?|deduct|penalt(?:y|ies)|requirements?|invariant|prohibited)\b/i.test(seg)) {
        const topic = currentHeading ? currentHeading : "Document Standard";
        const front = `What is the established requirement for ${topic}?`;
        if (tryAddCard(front, seg, "Standard")) {
          continue;
        }
      }
    }
  }

  // 2. Fallback Synthesis across rawText if < 4 cards found
  if (cards.length < 4) {
    const cleanedText = preprocessTextForFlashcards(rawText);
    const lines = cleanedText.split('\n').map(l => l.trim()).filter(l => l.length >= 20 && l.length <= 260);

    for (const line of lines) {
      if (cards.length >= 6) break;
      if (line.startsWith('http')) continue;

      const termMatch = line.match(/^([A-Za-z0-9\s/&()-]{3,35})\s*[:—–]\s*(.+)$/);
      if (termMatch) {
        const rawTerm = termMatch[1].trim();
        const rawDef = termMatch[2].trim();
        if (!/^(?:section|slide|page|unit|module|chapter|problem|objective|date|deadline|note|example)\b/i.test(rawTerm)) {
          const front = formatFrontInquiry(rawTerm);
          tryAddCard(front, rawDef, "Core Concept");
        }
      }
    }
  }

  // 3. Slide-level takeaways if still < 4
  if (cards.length < 4 && pages.length > 0) {
    pages.forEach((page, pIdx) => {
      if (cards.length >= 6) return;
      const cleanedPage = preprocessTextForFlashcards(page);
      const pLines = cleanedPage.split('\n').map(l => l.trim()).filter(Boolean);
      if (pLines.length === 0) return;

      const header = pLines[0].replace(/^[•\-\d.\s❖◆◇◈●◦]+/, '').trim();
      const content = pLines.slice(1).filter(l => l.length >= 25 && !l.startsWith('http'));
      if (content.length > 0 && header.length >= 3) {
        const cleanHeader = header.length < 35 ? header : `Section ${pIdx + 1}`;
        const front = `What are the primary principles of ${cleanHeader}?`;
        tryAddCard(front, content.join(' '), "Core Concept");
      }
    });
  }

  // 4. Final fallback ensuring complete sentences & valid questions
  if (cards.length < 4) {
    const cleanedFull = preprocessTextForFlashcards(rawText);
    const rawSentences = cleanedFull.split(/[.?!]\s+/).map(s => s.trim()).filter(s => s.length >= 30 && s.length <= 200);
    for (let i = 0; i < rawSentences.length && cards.length < 4; i++) {
      const sentence = rawSentences[i];
      const words = sentence.split(/\s+/);
      if (words.length >= 5) {
        const subject = words.slice(0, 3).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
        if (subject.length >= 4) {
          const front = `What is the key principle concerning ${subject}?`;
          tryAddCard(front, sentence, "Study Point");
        }
      }
    }
  }

  return cards.slice(0, 6);
}

/**
 * Universal Dynamic Exam Flashcard Generator (Key Terms & Concise Rules)
 */
function generateFlashcardsForDoc(doc: DocumentData): FlashcardItem[] {
  if (doc.flashcards && doc.flashcards.length > 0) {
    return doc.flashcards;
  }
  return generateFlashcards(doc.pages.join('\n'), doc.pages);
}

/**
 * Editorial Pastel Tag Badge Mapper
 */
function getTagBadgeClass(tag: string): string {
  switch (tag) {
    case 'Core Concept':
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    case 'Quick Review':
    case 'Review':
      return 'bg-stone-100 text-stone-700 border-stone-200';
    case 'Examples':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    case 'Comparison':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
    case 'Key Points':
      return 'bg-purple-50 text-purple-800 border-purple-200/80';
    case 'Rules':
    case 'Rule':
      return 'bg-rose-50 text-rose-800 border-rose-200/80';
    case 'Study Prep':
    case 'Metadata':
      return 'bg-sky-50 text-sky-800 border-sky-200/80';
    case 'Deadline':
    case 'Submission':
      return 'bg-orange-50 text-orange-800 border-orange-200/80';
    case 'Practice':
    case 'Standard':
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    case 'Self Test':
      return 'bg-pink-50 text-pink-800 border-pink-200/80';
    case 'Compliance':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    case 'Ethics':
      return 'bg-violet-50 text-violet-800 border-violet-200/80';
    case 'Disclosure':
      return 'bg-cyan-50 text-cyan-800 border-cyan-200/80';
    case 'Algorithm':
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    case 'Formatting':
      return 'bg-stone-100 text-stone-700 border-stone-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
}

interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number | null;
  targetY: number | null;
  state: 'flying' | 'perching' | 'perched' | 'startled' | 'ascending';
  angle: number;
  wingAngle: number;
  flapSpeed: number;
  size: number;
  seed: number;
  baseColor: string;
  accentColor: string;
  borderColor: string;
  perchTimer: number;
  perchSlot: number;
}

/**
 * Renders an articulated butterfly with symmetrical forewing & hindwing lobes,
 * slender body, delicate antennae, and iridescent Morpho turquoise/cyan sheen.
 */
function drawArticulatedButterfly(ctx: CanvasRenderingContext2D, b: Butterfly) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.angle + Math.PI / 2);

  // 3D Flap perspective modulated with cos(wingAngle)
  const flapScale = Math.cos(b.wingAngle);
  const wingWidthScale = Math.max(0.12, Math.abs(flapScale)) * (flapScale >= 0 ? 1 : -1);

  const s = b.size;

  // 1. Slender Body & Head (Obsidian Teal / Dark Marine)
  ctx.fillStyle = 'rgba(8, 47, 53, 0.9)';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.08, s * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head & faint delicate antennae with tiny tip nodes
  ctx.beginPath();
  ctx.arc(0, -s * 0.52, s * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(13, 79, 87, 0.75)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.54);
  ctx.quadraticCurveTo(-s * 0.22, -s * 0.85, -s * 0.26, -s * 1.05);
  ctx.moveTo(0, -s * 0.54);
  ctx.quadraticCurveTo(s * 0.22, -s * 0.85, s * 0.26, -s * 1.05);
  ctx.stroke();

  ctx.fillStyle = 'rgba(13, 148, 136, 0.85)';
  ctx.beginPath();
  ctx.arc(-s * 0.26, -s * 1.05, 0.8, 0, Math.PI * 2);
  ctx.arc(s * 0.26, -s * 1.05, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Iridescent wing fill gradient: vivid cyan blending into deep teal
  const wingGrad = ctx.createLinearGradient(-s * 1.2, -s * 0.6, 0, s * 0.4);
  wingGrad.addColorStop(0, b.baseColor);
  wingGrad.addColorStop(1, b.accentColor);

  // 2. Left Wings
  ctx.save();
  ctx.scale(wingWidthScale, 1);

  // Forewing (Upper Wing Lobe - Delicate elongated sweep)
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.15);
  ctx.bezierCurveTo(-s * 0.7, -s * 0.82, -s * 1.4, -s * 0.65, -s * 1.2, -s * 0.05);
  ctx.bezierCurveTo(-s * 1.0, s * 0.24, -s * 0.35, s * 0.15, 0, s * 0.06);
  ctx.fillStyle = wingGrad;
  ctx.fill();
  ctx.strokeStyle = b.borderColor;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Hindwing (Lower Wing Lobe - Scalloped delicate petal)
  ctx.beginPath();
  ctx.moveTo(0, s * 0.03);
  ctx.bezierCurveTo(-s * 0.45, s * 0.12, -s * 0.98, s * 0.44, -s * 0.7, s * 0.88);
  ctx.bezierCurveTo(-s * 0.35, s * 1.0, -s * 0.1, s * 0.64, 0, s * 0.38);
  ctx.fillStyle = wingGrad;
  ctx.fill();
  ctx.stroke();

  // Translucent inner wing veins with subtle luminescence
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.06);
  ctx.lineTo(-s * 0.65, -s * 0.26);
  ctx.moveTo(0, s * 0.06);
  ctx.lineTo(-s * 0.4, s * 0.45);
  ctx.strokeStyle = 'rgba(207, 250, 254, 0.65)';
  ctx.lineWidth = 0.55;
  ctx.stroke();

  ctx.restore();

  // 3. Right Wings (Symmetrical opposite)
  ctx.save();
  ctx.scale(-wingWidthScale, 1);

  // Forewing
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.15);
  ctx.bezierCurveTo(-s * 0.7, -s * 0.82, -s * 1.4, -s * 0.65, -s * 1.2, -s * 0.05);
  ctx.bezierCurveTo(-s * 1.0, s * 0.24, -s * 0.35, s * 0.15, 0, s * 0.06);
  ctx.fillStyle = wingGrad;
  ctx.fill();
  ctx.strokeStyle = b.borderColor;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Hindwing
  ctx.beginPath();
  ctx.moveTo(0, s * 0.03);
  ctx.bezierCurveTo(-s * 0.45, s * 0.12, -s * 0.98, s * 0.44, -s * 0.7, s * 0.88);
  ctx.bezierCurveTo(-s * 0.35, s * 1.0, -s * 0.1, s * 0.64, 0, s * 0.38);
  ctx.fillStyle = wingGrad;
  ctx.fill();
  ctx.stroke();

  // Veins
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.06);
  ctx.lineTo(-s * 0.65, -s * 0.26);
  ctx.moveTo(0, s * 0.06);
  ctx.lineTo(-s * 0.4, s * 0.45);
  ctx.strokeStyle = 'rgba(207, 250, 254, 0.65)';
  ctx.lineWidth = 0.55;
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}

interface AquaMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  decay: number;
}

/**
 * Stage 1: Butterfly Landing Canvas (The Editorial Studio Hero)
 * - Articulated Blue Morpho butterflies in electric turquoise and cyan.
 * - Flap smoothly using 3D perspective cosine waves.
 * - Gentle luminous aqua light motes drifting along flight trails.
 * - Idle / Hover behavior: gently hover and perch on letters of "SmartDoc Studio".
 * - Cursor sweep reactivity: gracefully flutters away when mouse approaches (< 120px) before returning.
 */
function ButterflyLandingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseMoveTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMoveTime = Date.now();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      lastMouseMoveTime = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Blue Morpho electric turquoise, deep teal, and vivid seafoam palettes
    const butterflyPalettes = [
      { base: 'rgba(6, 182, 212, 0.88)', accent: 'rgba(13, 148, 136, 0.78)', border: 'rgba(165, 243, 252, 0.75)' },
      { base: 'rgba(20, 184, 166, 0.88)', accent: 'rgba(15, 118, 110, 0.78)', border: 'rgba(153, 246, 228, 0.75)' },
      { base: 'rgba(34, 211, 238, 0.88)', accent: 'rgba(14, 116, 144, 0.78)', border: 'rgba(186, 230, 253, 0.75)' },
      { base: 'rgba(45, 212, 191, 0.88)', accent: 'rgba(13, 148, 136, 0.78)', border: 'rgba(204, 251, 241, 0.75)' },
      { base: 'rgba(56, 189, 248, 0.88)', accent: 'rgba(8, 145, 178, 0.78)', border: 'rgba(224, 242, 254, 0.75)' },
    ];

    const butterflyCount = 10;
    const butterflies: Butterfly[] = [];
    const motes: AquaMote[] = [];

    for (let i = 0; i < butterflyCount; i++) {
      const palette = butterflyPalettes[i % butterflyPalettes.length];
      butterflies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.1,
        targetX: null,
        targetY: null,
        state: 'flying',
        angle: Math.random() * Math.PI * 2,
        wingAngle: Math.random() * Math.PI * 2,
        flapSpeed: 0.13 + Math.random() * 0.04,
        size: 13 + Math.random() * 3.5,
        seed: Math.random() * 1000,
        baseColor: palette.base,
        accentColor: palette.accent,
        borderColor: palette.border,
        perchTimer: 0,
        perchSlot: i % 6,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render & update luminous aqua light motes
      for (let mIdx = motes.length - 1; mIdx >= 0; mIdx--) {
        const m = motes[mIdx];
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.decay;

        if (m.alpha <= 0) {
          motes.splice(mIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${m.alpha * 0.65})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      const isMouseStationary = Date.now() - lastMouseMoveTime > 750;

      // Dynamic landing coordinates corresponding to the letters of "SmartDoc Studio"
      let perchTargets: { x: number; y: number }[] = [];
      const titleEl = document.getElementById('studio-hero-title');
      if (titleEl) {
        const rect = titleEl.getBoundingClientRect();
        perchTargets = [
          { x: rect.left + rect.width * 0.09, y: rect.top - 6 },
          { x: rect.left + rect.width * 0.24, y: rect.top - 4 },
          { x: rect.left + rect.width * 0.44, y: rect.top - 7 },
          { x: rect.left + rect.width * 0.60, y: rect.top - 5 },
          { x: rect.left + rect.width * 0.76, y: rect.top - 7 },
          { x: rect.left + rect.width * 0.91, y: rect.top - 4 },
        ];
      } else {
        perchTargets = [
          { x: width * 0.36, y: height * 0.44 },
          { x: width * 0.42, y: height * 0.43 },
          { x: width * 0.48, y: height * 0.45 },
          { x: width * 0.54, y: height * 0.43 },
          { x: width * 0.60, y: height * 0.45 },
          { x: width * 0.66, y: height * 0.44 },
        ];
      }

      for (let i = 0; i < butterflyCount; i++) {
        const b = butterflies[i];

        // 1. Cursor sweep reactivity (< 120px)
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < 120 && mouseX > -500) {
          b.state = 'startled';
          b.targetX = null;
          b.targetY = null;
          b.flapSpeed = 0.32 + Math.random() * 0.08;
          const force = (1 - dist / 120) * 4.6;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force - 2.2;
          b.perchTimer = 150 + Math.random() * 80;
        }

        // 2. Idle Perching AI on letters of "SmartDoc Studio" (butterflies 0 to 5)
        if (i < 6 && b.state !== 'startled' && b.perchTimer <= 0) {
          const target = perchTargets[b.perchSlot];
          if (target) {
            b.targetX = target.x;
            b.targetY = target.y;

            const tdx = b.targetX - b.x;
            const tdy = b.targetY - b.y;
            const tDist = Math.hypot(tdx, tdy);

            if (tDist > 14) {
              b.state = 'perching';
              b.vx += (tdx / tDist) * 0.34;
              b.vy += (tdy / tDist) * 0.34;
              b.vx *= 0.94;
              b.vy *= 0.94;
              b.flapSpeed = 0.12;
            } else {
              b.state = 'perched';
              b.x = b.targetX;
              b.y = b.targetY;
              b.vx = 0;
              b.vy = 0;
              b.flapSpeed = 0.032; // gentle resting flutter
            }
          }
        } else if (b.state === 'perched' && !isMouseStationary) {
          b.state = 'flying';
          b.targetX = null;
          b.targetY = null;
          b.flapSpeed = 0.16;
          b.vy = -1.6;
          b.vx = (Math.random() - 0.5) * 2;
        }

        // 3. Gentle natural flight & aqua light motes spawn
        if (b.state === 'flying' || b.state === 'startled') {
          if (b.perchTimer > 0) b.perchTimer -= 1;

          b.vy += Math.sin(time * 0.038 + b.seed) * 0.08 - 0.02;
          b.vx += Math.cos(time * 0.032 + b.seed) * 0.08;

          b.vx *= 0.975;
          b.vy *= 0.975;

          b.x += b.vx;
          b.y += b.vy;

          // Spawn faint luminous aqua light motes along flight trail
          if (Math.random() < 0.65) {
            motes.push({
              x: b.x + (Math.random() - 0.5) * 6,
              y: b.y + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 0.3,
              vy: -0.2 - Math.random() * 0.25,
              alpha: 0.65 + Math.random() * 0.3,
              size: 1.2 + Math.random() * 1.5,
              decay: 0.016 + Math.random() * 0.01,
            });
          }

          if (b.state === 'startled' && b.perchTimer < 70) {
            b.flapSpeed += (0.15 - b.flapSpeed) * 0.03;
            if (b.flapSpeed <= 0.18) b.state = 'flying';
          }

          if (b.x < -30) b.x = width + 20;
          if (b.x > width + 30) b.x = -20;
          if (b.y < -30) {
            b.y = height + 20;
            b.x = Math.random() * width;
          }
          if (b.y > height + 30) b.y = -20;
        }

        if (Math.hypot(b.vx, b.vy) > 0.1) {
          b.angle = Math.atan2(b.vy, b.vx);
        }

        b.wingAngle += b.flapSpeed;
        drawArticulatedButterfly(ctx, b);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />;
}

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('stw');
  const [activeDoc, setActiveDoc] = useState<DocumentData>(PRESETS.stw);
  const [pipelineProgress, setPipelineProgress] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<number>(3);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [studyTab, setStudyTab] = useState<'checklist' | 'flashcards'>('checklist');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});

  // Keyboard shortcut listener to enter on Space or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasEntered && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        setHasEntered(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered]);

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setActiveDoc(PRESETS[key]);
    setCompletedItems({});
    setActiveCardIndex(0);
    setIsCardFlipped(false);
    setMasteredCards({});
    runPipelineSimulation(PRESETS[key]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPipelineProgress(15);
    setPipelineStage(1);

    try {
      const buffer = await file.arrayBuffer();

      // Dynamically load PDF.js from CDN to avoid Vite worker bundler conflicts
      if (!(window as any).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(true);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const pdfjs = (window as any).pdfjsLib;
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      setPipelineProgress(45);
      setPipelineStage(2);

      const extractedPages: string[] = [];
      let fullText = "";

      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => item.str)
          .filter((str: string) => str && str.trim().length > 0);
        
        const rawPageText = pageStrings.join(" ");
        const cleanedPageText = normalizePdfText(rawPageText);

        extractedPages.push(cleanedPageText || `[Page ${i}: Visual diagram content]`);
        fullText += " " + cleanedPageText;
      }

      setPipelineProgress(75);
      setPipelineStage(3);

      const normalizedFullText = normalizePdfText(fullText);

      // Extract real acronyms with smart stop-word filtering
      const rawAcronyms = normalizedFullText.match(/\b[A-Z]{2,6}\b/g) || [];
      const twoLetterStopWords = new Set(["OF", "TO", "ON", "IN", "IS", "IT", "AT", "BY", "AS", "OR", "AN", "BE", "IF"]);
      const commonNoise = new Set([
        ...twoLetterStopWords,
        "THE", "AND", "FOR", "ARE", "NOT", "BUT", "ALL", "ANY", "CAN", "HER", "WAS", 
        "ONE", "OUT", "DAY", "GET", "HAS", "HIM", "HIS", "HOW", "MAN", "NEW", "NOW", 
        "OLD", "SEE", "TWO", "WAY", "WHO", "BOY", "DID", "ITS", "LET", "PUT", "SAY", 
        "SHE", "TOO", "USE", "SET", "MAY", "DOC", "PAGE", "UNIT", "LINE"
      ]);
      const acronyms = Array.from(new Set(rawAcronyms.filter(a => !commonNoise.has(a)))).slice(0, 8);

      // Extract real dates & deadlines
      const dateRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,\s*\d{4})?|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi;
      const foundDates = Array.from(new Set(normalizedFullText.match(dateRegex) || [])).slice(0, 3);
      
      const deadlines = foundDates.map((dateStr, idx) => ({
        item: `Milestone / Submission Event #${idx + 1}`,
        date: dateStr,
        tag: "Extracted Date"
      }));

      // ── Universal Student-Friendly Dynamic Checklist Engine ──
      const finalChecklist = generateStudentFriendlyChecklist(normalizedFullText, file.name, foundDates);

      // ── Dedicated Semantic Flashcard Extraction Engine ──
      const finalFlashcards = generateFlashcards(normalizedFullText, extractedPages);

      const words = normalizedFullText.split(/\s+/).filter(Boolean);

      // Extract main unit/document title cleanly without cutting at commas
      let unitHeader = "";
      const firstPageLines = (extractedPages[0] || "").split("\n").map(l => l.trim()).filter(Boolean);

      const structDocLine = firstPageLines.find(l => /STRUCTURE OF SCIENTIFIC DOCUMENTS/i.test(l));
      if (structDocLine) {
        const idx = firstPageLines.indexOf(structDocLine);
        const nextLine = firstPageLines[idx + 1];
        if (nextLine && nextLine.length < 80 && !nextLine.startsWith('•') && !/^(1\.|Objective|Module|Guidelines)/i.test(nextLine)) {
          unitHeader = `${structDocLine} • ${nextLine}`.replace(/^[•\-]\s*/, '').replace(/\s+/g, ' ').trim();
        } else {
          unitHeader = structDocLine.replace(/^[•\-]\s*/, '').replace(/\s+/g, ' ').trim();
        }
      } else {
        for (const line of firstPageLines) {
          if (/^(UNIT \d+|MODULE \d+|DEPARTMENT OF|COURSE OUTLINE|LAB EVALUATION|[A-Z0-9\s,–—•:/-]{8,})/i.test(line) && line.length < 120 && !line.startsWith('•')) {
            unitHeader = line.replace(/^[•\-]\s*/, '').replace(/\s+/g, ' ').trim();
            break;
          }
        }
      }

      if (!unitHeader) {
        unitHeader = file.name.replace(/\.pdf$/i, "").replace(/_/g, " ").trim();
      }

      const customDoc: DocumentData = {
        title: file.name,
        unitHeader: unitHeader,
        category: deadlines.length > 0 ? "Academic Assignment / Timed Document" : "Instructional Slide Deck / Reference",
        format: `PDF (${(file.size / 1024).toFixed(1)} KB)`,
        words: words.length,
        readingTime: `~${Math.max(1, Math.ceil(words.length / 200))} min read`,
        pageCount: pdf.numPages,
        pages: extractedPages,
        acronyms: acronyms.length > 0 ? acronyms : ["PDF", "DOC", "CLIENT"],
        deadlines: deadlines,
        checklist: finalChecklist,
        flashcards: finalFlashcards,
        summary: `Parsed ${pdf.numPages} pages from ${file.name}. Identified ${words.length} words, ${acronyms.length} key entities, and extracted 4 actionable checklist items.`
      };

      setSelectedPreset('custom');
      setActiveDoc(customDoc);
      setCompletedItems({});
      setActiveCardIndex(0);
      setIsCardFlipped(false);
      setMasteredCards({});
      setPipelineProgress(100);
      setIsProcessing(false);

    } catch (err) {
      console.error(err);
      alert("Could not extract text from this PDF. It may be a scanned image without an OCR text layer.");
      setIsProcessing(false);
    }
  };

  const runPipelineSimulation = (_doc: DocumentData) => {
    setIsProcessing(true);
    setPipelineProgress(25);
    setPipelineStage(1);

    setTimeout(() => {
      setPipelineProgress(65);
      setPipelineStage(2);
    }, 450);

    setTimeout(() => {
      setPipelineProgress(100);
      setPipelineStage(3);
      setIsProcessing(false);
    }, 900);
  };

  const toggleChecklist = (task: string) => {
    const next = { ...completedItems, [task]: !completedItems[task] };
    setCompletedItems(next);
    const allDone = activeDoc.checklist.every(item => next[item.task]);
    if (allDone && activeDoc.checklist.length > 0) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.85 } });
    }
  };

  const completedCount = activeDoc.checklist.filter(item => completedItems[item.task]).length;
  const progressPercent = activeDoc.checklist.length > 0 ? (completedCount / activeDoc.checklist.length) * 100 : 0;

  // Dynamic Flashcards for Active Document
  const flashcards = generateFlashcardsForDoc(activeDoc);
  const currentCard = flashcards[activeCardIndex] || flashcards[0];
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const isMastered = !!masteredCards[activeCardIndex];

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setActiveCardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setActiveCardIndex(prev => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  const toggleMastered = () => {
    setMasteredCards(prev => ({
      ...prev,
      [activeCardIndex]: !prev[activeCardIndex]
    }));
  };

  // ── 1. Export Study Brief (Markdown Download + Clean Print Preview) ──
  const handleExportStudyBrief = () => {
    const markdownContent = `# ${activeDoc.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
*SmartDoc Studio • Autonomous Study Intelligence Brief*

---

## 📌 Document Overview
- **Category:** ${activeDoc.category}
- **Format:** ${activeDoc.format}
- **Word Count:** ${activeDoc.words} words
- **Estimated Reading Time:** ${activeDoc.readingTime}
- **Pages Analyzed:** ${activeDoc.pageCount}
- **Unit / Focus Area:** ${activeDoc.unitHeader || activeDoc.title}

---

## 🎯 Topic-Aware Revision Checklist (${completedCount}/${activeDoc.checklist.length} Completed - ${Math.round(progressPercent)}%)
${activeDoc.checklist.map(item => {
  const isChecked = !!completedItems[item.task];
  return `- [${isChecked ? 'x' : ' '}] **[${item.tag}]** ${item.task}`;
}).join('\n')}

---

## 📅 Critical Deadlines & Deliverables
${activeDoc.deadlines.length === 0 
  ? `_✓ No academic deadlines detected for this reference document._` 
  : activeDoc.deadlines.map(d => `- **${d.item}**: \`${d.date}\` [${d.tag}]`).join('\n')}

---

## 🎴 Key Flashcards & Exam Takeaways
${flashcards.map((f, i) => `### Card ${i + 1}: ${f.front} [${f.category}]
> ${f.back}
`).join('\n')}

---

## 📖 Key Study Notes & Slide Breakdown
${activeDoc.pages.map((p, idx) => `### Section / Slide ${idx + 1}
${p.trim()}
`).join('\n\n')}

---
*Generated client-side with SmartDoc Studio • Verified Local OCR Buffer*
`;

    // 1. Trigger instant download of formatted .md file
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeFilename = activeDoc.title.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeFilename}_Study_Brief.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 2. Open clean print-to-PDF / Notion export preview dialog
    const printWindow = window.open('', '_blank', 'width=840,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${activeDoc.title} - SmartDoc Study Brief</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #082F35; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
              h1 { font-family: Georgia, serif; font-style: italic; color: #082F35; margin-bottom: 4px; font-size: 30px; }
              .subtitle { font-size: 13px; color: #0D9488; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; font-family: monospace; }
              hr { border: none; border-top: 1px solid #CCFBF1; margin: 24px 0; }
              h2 { font-size: 16px; color: #0F766E; margin-top: 24px; border-bottom: 1px solid #E0F2FE; padding-bottom: 6px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 8px; font-size: 14px; }
              .badge { display: inline-block; padding: 2px 8px; background: #CCFBF1; color: #0F766E; border-radius: 9999px; font-size: 11px; font-family: monospace; font-weight: bold; margin-right: 6px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; background: #F0FDFA; padding: 16px; border-radius: 12px; border: 1px solid #CCFBF1; }
              .flashcard-box { background: #F8FCFC; border: 1px solid #CCFBF1; border-left: 4px solid #0D9488; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; }
              .footer { margin-top: 40px; font-size: 11px; color: #94A3B8; text-align: center; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <h1>${activeDoc.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}</h1>
            <div class="subtitle">SmartDoc Studio • Autonomous Study Intelligence Brief</div>
            
            <div class="meta-grid">
              <div><strong>Words Analyzed:</strong> ${activeDoc.words} words</div>
              <div><strong>Estimated Reading:</strong> ${activeDoc.readingTime}</div>
              <div><strong>Document Format:</strong> ${activeDoc.format}</div>
              <div><strong>Checklist Completion:</strong> ${completedCount} of ${activeDoc.checklist.length} (${Math.round(progressPercent)}%)</div>
            </div>

            <hr/>
            <h2>🎯 Topic-Aware Revision Checklist</h2>
            <ul>
              ${activeDoc.checklist.map(item => `
                <li>
                  <span class="badge">${item.tag}</span>
                  <strong>${completedItems[item.task] ? '[✓ Completed]' : '[  Pending]'}</strong>
                  ${item.task}
                </li>
              `).join('')}
            </ul>

            <hr/>
            <h2>📅 Critical Deadlines & Deliverables</h2>
            ${activeDoc.deadlines.length === 0 
              ? '<p style="color:#0D9488; font-size:13px;">✓ No academic deadlines detected for this document.</p>' 
              : `<ul>${activeDoc.deadlines.map(d => `<li><strong>${d.item}</strong> &mdash; <code>${d.date}</code> (${d.tag})</li>`).join('')}</ul>`}

            <hr/>
            <h2>🎴 Key Flashcards & Exam Takeaways</h2>
            ${flashcards.map(f => `
              <div class="flashcard-box">
                <span class="badge">${f.category}</span>
                <strong>${f.front}</strong>
                <p style="margin: 6px 0 0; font-size: 13px; color: #334155;">${f.back}</p>
              </div>
            `).join('')}

            <hr/>
            <h2>📖 Key Study Notes & Slide Breakdown</h2>
            ${activeDoc.pages.map((p, idx) => `
              <div style="margin-bottom:18px;">
                <strong style="color:#0F766E; font-size:13px;">Section ${idx + 1}</strong>
                <p style="white-space: pre-wrap; font-size:13px; background:#F8FAFC; padding:12px; border-radius:8px; border: 1px solid #E2E8F0;">${p}</p>
              </div>
            `).join('')}

            <div class="footer">Generated Client-Side • SmartDoc Studio</div>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. Cinematic / Motion Intro Gate (The Entrance)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-screen bg-[#EEF7F6] overflow-hidden select-none film-grain font-sans">
      {/* Ambient Aurora Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#CCFBF1]/70 rounded-full blur-3xl animate-aurora-slow" />
        <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-[#E0F2FE]/70 rounded-full blur-3xl animate-aurora-reverse" />
        <div className="absolute -bottom-24 left-1/4 w-[600px] h-[600px] bg-[#D1FAE5]/60 rounded-full blur-3xl animate-aurora-slow" />

        {/* Soft cyan ambient aura: an ultra-subtle blurred glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-cyan-200/35 via-teal-100/25 to-transparent blur-3xl animate-pulse-slow" 
          style={{ animationDuration: '8s' }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. Hero Landing View (hasEntered === false)
          - Scales down slightly (scale-95) and fades out (opacity-0 blur-sm duration-700 ease-out)
          ───────────────────────────────────────────────────────────── */}
      <div 
        className={`absolute inset-0 z-10 flex flex-col justify-between items-center p-6 sm:p-10 select-none transition-all duration-700 ease-out transform ${
          hasEntered 
            ? 'opacity-0 scale-95 blur-sm pointer-events-none' 
            : 'opacity-100 scale-100 blur-0 pointer-events-auto'
        }`}
      >
        {/* Interactive Butterflies: articulated Blue Morpho butterflies that flutter with cursor & hover/perch around title */}
        <ButterflyLandingCanvas />

        {/* Top Minimal Brand Bar */}
        <div className="w-full max-w-6xl flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-teal-900/80 font-medium">
              SmartDoc Studio • 2026
            </span>
          </div>
          <span className="text-[11px] font-mono text-teal-950/80 border border-teal-900/10 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm shadow-xs">
            100% Client-Side Engine
          </span>
        </div>

        {/* Center Motion Typography & Action Hero */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-900/10 shadow-xs mb-6 text-teal-950 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Autonomous Document Intelligence • Client-Side Precision
          </div>

          <h1 id="studio-hero-title" className="font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl text-[#082F35] tracking-tight leading-[0.95] mb-5">
            SmartDoc <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent font-serif italic">Studio</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#2D4A4F] max-w-lg mx-auto font-light leading-relaxed mb-9">
            Transform complex academic slide decks, syllabi, and assignment briefs into structured study intelligence in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setHasEntered(true)}
              className="group relative px-9 py-4 rounded-full bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600 text-white font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-[0_12px_28px_rgba(13,148,136,0.35)] flex items-center gap-2.5 cursor-pointer"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <span className="text-[11px] font-mono text-teal-900/50">
              or press <kbd className="px-2 py-0.5 rounded bg-white/80 border border-teal-200/80 text-teal-900 font-mono text-[10px] shadow-xs">Space</kbd> or <kbd className="px-2 py-0.5 rounded bg-white/80 border border-teal-200/80 text-teal-900 font-mono text-[10px] shadow-xs">Enter</kbd>
            </span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-left relative z-10 border-t border-teal-900/10 pt-6">
          <div className="bg-white/60 backdrop-blur-xs p-3 rounded-xl border border-teal-900/10 shadow-[0_4px_20px_rgba(6,182,212,0.03)]">
            <div className="text-xs font-semibold text-[#082F35] mb-0.5">In-Browser PDF Parsing</div>
            <div className="text-[11px] text-teal-900/60 font-light leading-snug">Zero cloud latency, private local memory stream</div>
          </div>
          <div className="bg-white/60 backdrop-blur-xs p-3 rounded-xl border border-teal-900/10 shadow-[0_4px_20px_rgba(6,182,212,0.03)]">
            <div className="text-xs font-semibold text-[#082F35] mb-0.5">Dynamic Checklist Engine</div>
            <div className="text-[11px] text-teal-900/60 font-light leading-snug">Student-friendly actionable study checkpoints</div>
          </div>
          <div className="bg-white/60 backdrop-blur-xs p-3 rounded-xl border border-teal-900/10 shadow-[0_4px_20px_rgba(6,182,212,0.03)]">
            <div className="text-xs font-semibold text-[#082F35] mb-0.5">Deliverables & Analytics</div>
            <div className="text-[11px] text-teal-900/60 font-light leading-snug">Real milestone tracking and reading metrics</div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Canva-Style Editorial Dashboard (Workspace)
          - Frosted acrylic glass slide: opacity-0 translate-y-6 blur-md animating into opacity-100 translate-y-0 blur-0 (duration-700 ease-out)
          - Frosted backdrop: backdrop-blur-xl bg-white/70 border border-stone-200/50
          ───────────────────────────────────────────────────────────── */}
      <div 
        className={`absolute inset-0 z-20 flex flex-col overflow-hidden font-sans select-none film-grain text-stone-800 transition-all duration-700 ease-out transform ${
          hasEntered 
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto' 
            : 'opacity-0 translate-y-6 blur-md pointer-events-none'
        }`}
      >
        {/* Floating Acrylic Glass Navigation Header */}
        <header className="h-16 border-b border-cyan-100/70 bg-white/75 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setHasEntered(false)}
              className="flex items-center gap-1.5 text-xs font-mono text-teal-900/70 hover:text-teal-950 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1.5 rounded-full transition-all cursor-pointer border border-teal-900/10"
              title="Return to entrance landing"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Intro</span>
            </button>

          <div className="h-4 w-px bg-teal-900/15 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif italic font-semibold text-lg text-[#082F35]">
              SmartDoc <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent font-serif italic">Studio</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-teal-700 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 font-medium">
              Editorial Canvas
            </span>
          </div>
        </div>

        {/* Center Preset Tabs */}
        <div className="flex items-center gap-1.5 bg-teal-950/5 border border-teal-900/10 p-1 rounded-full shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 px-2.5 py-1 rounded-full bg-white border border-teal-900/10 flex items-center gap-1 shrink-0 ml-0.5 shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-teal-600" />
            Demo Presets
          </span>

          <button 
            onClick={() => handleSelectPreset('stw')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              selectedPreset === 'stw' ? 'bg-white text-teal-950 font-semibold shadow-xs border border-teal-200/80' : 'text-teal-900/60 hover:text-teal-950'
            }`}
          >
            STW Symbols
          </button>
          <button 
            onClick={() => handleSelectPreset('lab')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              selectedPreset === 'lab' ? 'bg-white text-teal-950 font-semibold shadow-xs border border-teal-200/80' : 'text-teal-900/60 hover:text-teal-950'
            }`}
          >
            CS Lab
          </button>
          <button 
            onClick={() => handleSelectPreset('syllabus')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              selectedPreset === 'syllabus' ? 'bg-white text-teal-950 font-semibold shadow-xs border border-teal-200/80' : 'text-teal-900/60 hover:text-teal-950'
            }`}
          >
            Networks Syllabus
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <label className="cursor-pointer px-3.5 py-1.5 text-xs font-medium rounded-full bg-[#082F35] hover:bg-[#0c424a] text-white shadow-xs flex items-center gap-1.5 transition-all">
            <FileText className="w-3.5 h-3.5 text-cyan-200" />
            <span>Upload PDF</span>
            <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button 
            onClick={() => runPipelineSimulation(activeDoc)}
            disabled={isProcessing}
            className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-sm shadow-teal-500/25 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isProcessing ? 'Analyzing...' : 'Re-Run'}</span>
          </button>

          <button
            onClick={handleExportStudyBrief}
            className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-white/80 border border-teal-200/60 text-teal-900 hover:bg-teal-50 hover:border-teal-300 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download formatted Markdown & Print-to-PDF / Notion summary"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Study Brief</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Column: Cohesive Document Reader Canvas */}
        <div className="w-1/2 flex flex-col bg-white/75 backdrop-blur-xl border border-cyan-100/70 rounded-3xl shadow-[0_10px_35px_rgba(6,182,212,0.06)] overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="w-full space-y-4">
              
              {/* Top Card Header with Main Title Badge & Metadata */}
              <div className="border-b border-teal-900/10 pb-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500 inline-block animate-pulse"></span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-800 border border-teal-500/20 uppercase tracking-wide">
                      {activeDoc.unitHeader || activeDoc.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-teal-900/60 truncate max-w-[220px]" title={activeDoc.title}>
                    {activeDoc.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-white/80 text-teal-900/70 border border-teal-900/10">
                    {activeDoc.format}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/80 text-teal-900/70 border border-teal-900/10">
                    {activeDoc.pageCount} Pages Analyzed
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-800 border border-teal-500/20 font-semibold">
                    {activeDoc.words} Words
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/80 text-teal-900/50 border border-teal-900/10">
                    {activeDoc.readingTime}
                  </span>
                </div>
              </div>

              {/* Main Reading Area: Full compiled body content */}
              <div className="space-y-6 pb-6">
                {activeDoc.pages.map((pageContent, pIdx) => (
                  <div key={pIdx} className="space-y-3">
                    {activeDoc.pages.length > 1 && (
                      <div className="flex items-center gap-2 pt-2 pb-1 border-b border-teal-900/10 text-[10px] font-mono text-teal-900/40">
                        <span className="text-teal-700 font-semibold">SECTION / SLIDE {pIdx + 1} OF {activeDoc.pageCount}</span>
                      </div>
                    )}
                    <div className="leading-relaxed select-text space-y-2.5">
                      {renderDocumentLines(pageContent)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction Intelligence Panel */}
        <div className="w-1/2 flex flex-col space-y-4 overflow-y-auto">
          {/* Stepper Pipeline Card */}
          <div className="bg-white/75 backdrop-blur-xl border border-cyan-100/70 rounded-3xl p-4 sm:p-5 shadow-[0_10px_35px_rgba(6,182,212,0.06)]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Pipeline Execution Status
              </span>
              <span className="font-mono text-teal-700 font-bold">{pipelineProgress}% Complete</span>
            </div>
            
            <div className="w-full bg-teal-950/5 h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${pipelineProgress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className={`p-2 rounded-xl border text-center transition-all ${pipelineStage >= 1 ? 'border-teal-500/30 bg-teal-50/80 text-teal-800 font-medium' : 'border-stone-200/80 text-stone-400 bg-stone-50/60'}`}>
                1. Text Ingest
              </div>
              <div className={`p-2 rounded-xl border text-center transition-all ${pipelineStage >= 2 ? 'border-teal-500/30 bg-teal-50/80 text-teal-800 font-medium' : 'border-stone-200/80 text-stone-400 bg-stone-50/60'}`}>
                2. Semantic Parse
              </div>
              <div className={`p-2 rounded-xl border text-center transition-all ${pipelineStage >= 3 ? 'border-teal-500/30 bg-teal-50/80 text-teal-800 font-medium' : 'border-stone-200/80 text-stone-400 bg-stone-50/60'}`}>
                3. Synthesis
              </div>
            </div>
          </div>

          {/* Metric Badges: 2-Column Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/75 backdrop-blur-xl border border-cyan-100/70 rounded-3xl p-4 shadow-[0_10px_35px_rgba(6,182,212,0.06)]">
              <div className="text-[11px] text-teal-900/60 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Words Analyzed
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{activeDoc.words}</div>
              <div className="text-[10px] text-teal-900/40 mt-0.5">{activeDoc.readingTime}</div>
            </div>

            <div className="bg-white/75 backdrop-blur-xl border border-cyan-100/70 rounded-3xl p-4 shadow-[0_10px_35px_rgba(6,182,212,0.06)]">
              <div className="text-[11px] text-teal-900/60 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> Deadlines Detected
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{activeDoc.deadlines.length}</div>
              <div className="text-[10px] text-teal-900/40 mt-0.5">
                {activeDoc.deadlines.length === 0 ? 'Reference Document' : 'Action Required'}
              </div>
            </div>
          </div>

          {/* Deadlines Section */}
          <div className="bg-white/75 backdrop-blur-xl border border-cyan-100/70 rounded-3xl p-5 shadow-[0_10px_35px_rgba(6,182,212,0.06)]">
            <h2 className="text-xs font-semibold text-stone-800 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Detected Deadlines & Deliverables
            </h2>
            {activeDoc.deadlines.length === 0 ? (
              <div className="text-xs text-stone-600 bg-stone-50/80 border border-teal-900/10 rounded-2xl p-3.5">
                <span className="text-teal-700 font-medium">✓ No academic deadlines detected.</span> This document is categorized as <span className="text-stone-800 font-medium">{activeDoc.category}</span>.
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeDoc.deadlines.map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-stone-50/80 border border-teal-900/10 p-3 rounded-2xl text-xs">
                    <div>
                      <div className="font-medium text-stone-900">{d.item}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">{d.date}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
                      {d.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Topic-Aware Synthesized Revision Checklist / Interactive Flashcards ── */}
          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-cyan-100/70 shadow-sm overflow-hidden h-auto min-h-fit flex flex-col justify-between">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between text-xs mb-3.5 gap-2">
              <div className="flex items-center gap-1 p-1 bg-teal-950/5 border border-teal-900/10 rounded-full shadow-2xs">
                <button
                  onClick={() => setStudyTab('checklist')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    studyTab === 'checklist' 
                      ? 'bg-white text-teal-950 font-semibold shadow-2xs border border-teal-200/80' 
                      : 'text-teal-900/60 hover:text-teal-950'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Checklist</span>
                </button>

                <button
                  onClick={() => setStudyTab('flashcards')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    studyTab === 'flashcards' 
                      ? 'bg-white text-teal-950 font-semibold shadow-2xs border border-teal-200/80' 
                      : 'text-teal-900/60 hover:text-teal-950'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Flashcards</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-teal-500/10 text-teal-700 border border-teal-500/20 font-semibold">
                    {flashcards.length}
                  </span>
                </button>
              </div>

              {studyTab === 'checklist' ? (
                <span className="font-mono text-teal-700 font-bold text-xs shrink-0">
                  {completedCount} of {activeDoc.checklist.length} Completed
                </span>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                  <span className="text-teal-700 font-bold">
                    Card {activeCardIndex + 1} of {flashcards.length}
                  </span>
                  {masteredCount > 0 && (
                    <span className="text-[10px] bg-teal-500/10 text-teal-700 px-2 py-0.5 rounded-full border border-teal-500/20 font-medium">
                      {masteredCount} Mastered
                    </span>
                  )}
                </div>
              )}
            </div>

            {studyTab === 'checklist' ? (
              <div className="flex-1 flex flex-col justify-between">
                {/* Mini Progress Bar */}
                <div className="w-full bg-teal-950/5 h-2 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-start max-h-[360px] overflow-y-auto pr-1 mb-2">
                  {activeDoc.checklist.map((item, i) => {
                    const isChecked = !!completedItems[item.task];
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleChecklist(item.task)}
                        className="flex items-start justify-between gap-3 py-2.5 px-3.5 rounded-2xl bg-white/60 hover:bg-white/90 border border-teal-900/10 hover:border-teal-400/50 cursor-pointer transition-all group shadow-2xs"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400 group-hover:text-teal-600 shrink-0 mt-0.5" />
                          )}
                          <span className={`select-none flex-1 text-xs text-stone-700 leading-normal break-words ${isChecked ? 'line-through text-stone-400' : ''}`}>
                            {item.task}
                          </span>
                        </div>

                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 self-start ml-2 font-medium ${getTagBadgeClass(item.tag)}`}>
                          {item.tag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Interactive 3D Flip Flashcard Mode */
              <div className="w-full flex flex-col items-center select-none">
                {/* Perspective Container */}
                <div 
                  className="w-full h-[260px] cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                >
                  {/* Inner Rotating Card */}
                  <div 
                    className="relative w-full h-full transition-transform duration-500"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* FRONT FACE */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between bg-white/90 backdrop-blur-xl border border-teal-200/60 shadow-sm"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium border border-teal-200/50">
                          {currentCard.category || 'Concept'}
                        </span>
                        <span className="text-teal-600/70 font-mono text-[11px]">Study Card</span>
                      </div>
                      
                      <div className="my-auto py-2 text-center overflow-y-auto max-h-[150px] pr-1 card-scrollbar">
                        <p className="font-serif text-base sm:text-lg text-slate-800 leading-snug px-4">
                          {currentCard.front}
                        </p>
                      </div>

                      <div className="text-center text-[11px] text-teal-600/70 font-sans">
                        Click to flip card ↺
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-teal-500/5 backdrop-blur-xl border border-teal-300 shadow-sm"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)' 
                      }}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-100/80 text-teal-800 font-medium">
                          Answer & Key Rule
                        </span>
                        <span className="text-teal-600/70 font-mono text-[11px]">Verified Note</span>
                      </div>

                      <div className="my-auto py-2 text-center overflow-y-auto max-h-[150px] pr-1 card-scrollbar">
                        <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed px-4">
                          {currentCard.back}
                        </p>
                      </div>

                      <div className="text-center text-[11px] text-teal-600/70 font-sans">
                        Click to flip back ↺
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Row (Below the Card, Never Collapsing or Overlapping) */}
                <div className="w-full flex items-center justify-between mt-4 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevCard();
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium border border-teal-200/60 bg-white/70 text-slate-700 hover:bg-teal-50 transition-all cursor-pointer"
                  >
                    ‹ Prev
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered();
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm cursor-pointer ${
                      isMastered
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-white/70 text-slate-700 border border-teal-200/60 hover:bg-teal-50'
                    }`}
                  >
                    {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextCard();
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium border border-teal-200/60 bg-white/70 text-slate-700 hover:bg-teal-50 transition-all cursor-pointer"
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
