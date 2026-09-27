import * as pdfjsLib from 'pdfjs-dist';
// Configure worker for Vite client environment
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ExtractedPage {
  pageNumber: number;
  lines: string[];
  fullText: string;
}

export interface ExtractedDeadline {
  rawDate: string;
  context: string;
  inferredTitle: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface ExtractedChecklistItem {
  id: string;
  text: string;
  category: 'Review' | 'Milestone' | 'Practical' | 'Self-Assessment';
  completed: boolean;
}

export interface ParsedPdfDocument {
  title: string;
  documentType: 'Academic Syllabus' | 'Problem Set / Lab Assignment' | 'Technical Lecture Notes' | 'Academic Notice';
  pageCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  pages: ExtractedPage[];
  headings: string[];
  deadlines: ExtractedDeadline[];
  hasDeadlines: boolean;
  acronyms: string[];
  entities: string[];
  checklist: ExtractedChecklistItem[];
  healthScore: number;
  rawJson: object;
}

/**
 * Escapes PDF text strings
 */
function escapePdfText(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Generates an authentic, 100% compliant PDF 1.4 binary array
 * so that preset documents are parsed through the EXACT same pdfjs-dist engine.
 */
export function buildPresetPdfBytes(title: string, pagesData: string[][]): Uint8Array {
  const pageCount = pagesData.length;
  const objects: string[] = [];
  const xrefOffsets: number[] = [];

  // Helper to add object and record offset
  function addObject(content: string): number {
    const objNum = objects.length + 1;
    objects.push(`${objNum} 0 obj\n${content}\nendobj`);
    return objNum;
  }

  // Obj 1: Catalog
  addObject(`<< /Type /Catalog /Pages 2 0 R >>`);

  // Obj 2: Pages placeholder (will be filled after page objects)
  objects.push(''); // placeholder for obj 2

  const pageObjNums: number[] = [];

  // Standard Helvetica Font
  const fontObjNum = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  const boldFontObjNum = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  // Generate each page and content stream
  for (let p = 0; p < pageCount; p++) {
    const lines = pagesData[p];
    let streamText = `BT\n/F2 16 Tf\n50 740 Td\n(${escapePdfText(title)}) Tj\n`;
    streamText += `/F1 9 Tf\n0 -16 Td\n(SmartDoc AI Academic Repository • Page ${p + 1} of ${pageCount}) Tj\n`;
    streamText += `0 -20 Td\n`;

    let y = 690;
    for (const line of lines) {
      if (y < 60) break;
      const isHeader = line.toUpperCase() === line && line.length < 50 && line.length > 3;
      const font = isHeader ? '/F2 11 Tf' : '/F1 10 Tf';
      streamText += `${font}\n(${escapePdfText(line.slice(0, 95))}) Tj\n0 -15 Td\n`;
      y -= 15;
    }
    streamText += `ET`;

    const streamLen = streamText.length;
    const contentObjNum = addObject(`<< /Length ${streamLen} >>\nstream\n${streamText}\nendstream`);

    const pageObjNum = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
      `/Resources << /Font << /F1 ${fontObjNum} 0 R /F2 ${boldFontObjNum} 0 R >> >> ` +
      `/Contents ${contentObjNum} 0 R >>`
    );
    pageObjNums.push(pageObjNum);
  }

  // Update Obj 2 (Pages root)
  const kidsStr = pageObjNums.map((n) => `${n} 0 R`).join(' ');
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>\nendobj`;

  // Assemble full file
  let header = `%PDF-1.4\n%âãÏÓ\n`;
  let body = '';
  let currentOffset = header.length;

  for (let i = 0; i < objects.length; i++) {
    xrefOffsets.push(currentOffset);
    const objStr = objects[i] + '\n';
    body += objStr;
    currentOffset += objStr.length;
  }

  const startxref = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of xrefOffsets) {
    xref += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  const trailer =
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` +
    `startxref\n${startxref}\n%%EOF\n`;

  const fullPdfStr = header + body + xref + trailer;
  const uint8 = new Uint8Array(fullPdfStr.length);
  for (let i = 0; i < fullPdfStr.length; i++) {
    uint8[i] = fullPdfStr.charCodeAt(i) & 0xff;
  }
  return uint8;
}

/**
 * Common Acronyms and Technical abbreviations extractor
 */
const ACRONYM_REGEX = /\b[A-Z]{2,6}(?:\/[A-Z]{2,6})?\b/g;
const GREEK_TERMS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Theta', 'Omega', 'Sigma', 'Lambda', 'Epsilon', 'Phi', 'Psi'];
const COMMON_IGNORE = new Set(['AND', 'THE', 'FOR', 'NOT', 'PAGE', 'UNIT', 'LINE', 'DOC', 'DATE', 'TERM', 'FALL', 'FALL24']);

/**
 * Real PDF Extraction Engine using pdfjs-dist
 */
export async function parsePdfWithEngine(
  source: ArrayBuffer | Uint8Array,
  fallbackTitle = 'Uploaded Academic Document'
): Promise<ParsedPdfDocument> {
  const loadingTask = pdfjsLib.getDocument({
    data: source instanceof Uint8Array ? source : new Uint8Array(source),
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = Math.min(pdfDoc.numPages, 15);
  const pages: ExtractedPage[] = [];

  let fullDocumentText = '';
  const allLines: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    // Group items by vertical proximity or natural item order
    const pageLines: string[] = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const text = item.str.trim();
        if (text) {
          if (currentLine) {
            currentLine += ' ' + text;
          } else {
            currentLine = text;
          }
          if (item.hasEOL || currentLine.length > 80) {
            pageLines.push(currentLine);
            currentLine = '';
          }
        }
      }
    }
    if (currentLine) pageLines.push(currentLine);

    const pageFullText = pageLines.join('\n');
    pages.push({
      pageNumber: i,
      lines: pageLines.length > 0 ? pageLines : ['[Page contains visual diagram or sparse formatted layout]'],
      fullText: pageFullText,
    });

    fullDocumentText += '\n' + pageFullText;
    allLines.push(...pageLines);
  }

  // 1. Calculate Real Word Count & Reading Time
  const words = fullDocumentText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // 2. Detect Document Type
  const lowerText = fullDocumentText.toLowerCase();
  let documentType: ParsedPdfDocument['documentType'] = 'Academic Notice';
  if (lowerText.includes('syllabus') || lowerText.includes('course') || lowerText.includes('grading') || lowerText.includes('instructor')) {
    documentType = 'Academic Syllabus';
  } else if (lowerText.includes('assignment') || lowerText.includes('lab') || lowerText.includes('problem set') || lowerText.includes('tasks')) {
    documentType = 'Problem Set / Lab Assignment';
  } else if (lowerText.includes('symbol') || lowerText.includes('abbreviation') || lowerText.includes('slide') || lowerText.includes('lecture') || lowerText.includes('chapter')) {
    documentType = 'Technical Lecture Notes';
  }

  // 3. Extract Real Headings
  const headings: string[] = [];
  const seenHeadings = new Set<string>();

  for (const line of allLines) {
    const trimmed = line.trim();
    if (
      trimmed.length >= 4 &&
      trimmed.length <= 60 &&
      !trimmed.endsWith('.') &&
      (trimmed === trimmed.toUpperCase() ||
       /^(\d+\.|\bUnit\b|\bModule\b|\bSection\b|\bPart\b|\bChapter\b|\bTask\b)/i.test(trimmed))
    ) {
      if (!seenHeadings.has(trimmed.toLowerCase())) {
        seenHeadings.add(trimmed.toLowerCase());
        headings.push(trimmed);
      }
    }
  }

  // 4. Extract Real Deadlines & Dates
  const DATE_REGEX = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,\s*\d{4})?|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi;

  const deadlines: ExtractedDeadline[] = [];
  const seenDates = new Set<string>();

  for (const line of allLines) {
    const matches = line.match(DATE_REGEX);
    if (matches) {
      for (const m of matches) {
        if (!seenDates.has(m.toLowerCase())) {
          seenDates.add(m.toLowerCase());
          const cleanContext = line.replace(m, '').trim().replace(/^[^\w]+/, '');
          deadlines.push({
            rawDate: m,
            context: line,
            inferredTitle: cleanContext.length > 5 ? cleanContext.slice(0, 55) : `Scheduled Milestone (${m})`,
            urgency: /due|exam|final|submission|quiz|cutoff/i.test(line) ? 'High' : 'Medium',
          });
        }
      }
    }
  }

  const hasDeadlines = deadlines.length > 0;

  // 5. Extract Key Acronyms & Terms
  const acronyms: string[] = [];
  const seenAcronyms = new Set<string>();

  const acronymMatches = fullDocumentText.match(ACRONYM_REGEX) || [];
  for (const ac of acronymMatches) {
    if (!COMMON_IGNORE.has(ac) && ac.length >= 2 && !seenAcronyms.has(ac)) {
      seenAcronyms.add(ac);
      acronyms.push(ac);
    }
  }

  for (const greek of GREEK_TERMS) {
    if (new RegExp(`\\b${greek}\\b`, 'i').test(fullDocumentText) && !seenAcronyms.has(greek)) {
      seenAcronyms.add(greek);
      acronyms.push(greek);
    }
  }

  // 6. Extract Key Entities (topics, tools, languages)
  const candidateEntities = [
    'Binary Search Tree', 'Data Structures', 'QuickSort', 'MergeSort', 'AVL Tree',
    'TCP/IP', 'OSI Model', 'Subnetting', 'DNS', 'HTTP', 'GitHub', 'Python', 'C++',
    'Java', 'MOSS', 'SI Units', 'LaTeX', 'ANOVA', 'Circuits', 'Algorithms',
    'Continuous Assessment', 'Examination', 'Faculty', 'Registrar', 'IEEE Standard'
  ];

  const entities = candidateEntities.filter((ent) =>
    new RegExp(`\\b${ent.replace('/', '\\/')}\\b`, 'i').test(fullDocumentText)
  );

  // 7. Synthesize Smart Action Items / Checklist
  const checklist: ExtractedChecklistItem[] = [];

  if (headings.length > 0) {
    headings.slice(0, 5).forEach((h, idx) => {
      checklist.push({
        id: `chk-h-${idx}`,
        text: `Review topic syllabus: "${h}"`,
        category: 'Review',
        completed: false,
      });
    });
  }

  if (deadlines.length > 0) {
    deadlines.slice(0, 4).forEach((d, idx) => {
      checklist.push({
        id: `chk-d-${idx}`,
        text: `Prepare deliverable for ${d.rawDate}: "${d.inferredTitle}"`,
        category: 'Milestone',
        completed: false,
      });
    });
  } else {
    checklist.push({
      id: 'chk-ref-1',
      text: 'Annotate key symbols & abbreviation definitions in lecture notebook',
      category: 'Self-Assessment',
      completed: false,
    });
    checklist.push({
      id: 'chk-ref-2',
      text: 'Cross-check SI metric conversions and standardized nomenclature',
      category: 'Review',
      completed: false,
    });
  }

  // Health Score heuristic based on document richness
  const healthScore = Math.min(99.4, Math.max(88.0, 90 + (headings.length * 1.2) + (acronyms.length * 0.4)));

  return {
    title: headings[0] || fallbackTitle,
    documentType,
    pageCount: numPages,
    wordCount,
    readingTimeMinutes,
    pages,
    headings: headings.slice(0, 12),
    deadlines,
    hasDeadlines,
    acronyms: acronyms.slice(0, 16),
    entities: entities.slice(0, 10),
    checklist: checklist.slice(0, 8),
    healthScore: Math.round(healthScore * 10) / 10,
    rawJson: {
      documentTitle: headings[0] || fallbackTitle,
      type: documentType,
      pages: numPages,
      wordCount,
      readingTime: `${readingTimeMinutes} min`,
      detectedDeadlines: deadlines,
      keyTerms: acronyms.slice(0, 16),
      headings: headings.slice(0, 12),
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PRESET DEFINITIONS WITH AUTHENTIC CONTENT
// ─────────────────────────────────────────────────────────────

export interface PresetDef {
  key: string;
  name: string;
  category: string;
  fileName: string;
  generatePdf: () => Uint8Array;
}

export const PRESET_DOCUMENTS: PresetDef[] = [
  {
    key: 'stw',
    name: 'STW: Symbols & Abbreviations (Slide Deck)',
    category: 'Technical Lecture Notes',
    fileName: 'STW_Lecture_Symbols_Abbreviations.pdf',
    generatePdf: () =>
      buildPresetPdfBytes('STW: Scientific & Technical Writing — Symbols and Abbreviations', [
        [
          'SCIENTIFIC & TECHNICAL WRITING (STW-2024)',
          'MODULE 3: STANDARD SYMBOLS, UNITS, AND FORMAL ABBREVIATIONS',
          'Academic Reference Material — Prepared by Dr. Helen Vance',
          '------------------------------------------------------------',
          'SECTION 1: SI BASE UNITS AND DERIVED METRIC STANDARDS',
          'In engineering documentation, standard SI nomenclature is strictly mandatory.',
          'Always leave a non-breaking space between the numeric value and unit symbol.',
          'Examples: 10 kHz (frequency), 5.4 MPa (pressure), 250 mA (electric current).',
          'Abbreviation standards: Write "s" for seconds (not sec), "h" for hours (not hr).',
          'SI prefix capitalization: mega (M), giga (G), tera (T) are uppercase.',
          'milli (m), micro (Greek letter Mu), nano (n), pico (p) are strictly lowercase.',
          '',
          'SECTION 2: GREEK NOTATION IN COMPUTING AND STATISTICAL ANALYSIS',
          'Alpha (type I error probability in hypothesis testing and significance).',
          'Beta (type II error rate, also used in machine learning regression weights).',
          'Theta (asymptotic tight computational bound in algorithm complexity analysis).',
          'Omega (lower bound complexity indicator), Sigma (summation and standard deviation).',
          'Delta (difference operator or change in system state over discrete time).',
          'Lambda (eigenvalues, functional calculus expressions, and Poisson arrival rates).',
        ],
        [
          'SECTION 3: FORMAL ACRONYMS AND INITIALISMS USAGE RULES',
          'Rule 1: Always spell out the term on first appearance followed by the acronym in parentheses.',
          'Example: "Analysis of Variance (ANOVA) was executed across all experimental batches."',
          'Subsequent occurrences must use the bare acronym ANOVA without re-definition.',
          'Common computing acronyms: TCP, UDP, DNS, API, PDF, RAM, CPU, GPU, BFS, DFS, IEEE.',
          '',
          'SECTION 4: MATHEMATICAL DELIMITERS AND EQUATION STYLING',
          'Use parentheses () for simple grouping, brackets [] for secondary precedence,',
          'and braces {} exclusively for sets and mathematical ensembles.',
          'Notice on Submissions: This slide deck is an instructional study reference.',
          'No submission deadlines are scheduled for this technical reference module.',
          'Students are encouraged to self-audit their lab documentation against these standards.',
        ],
      ]),
  },
  {
    key: 'dsa_lab',
    name: 'Data Structures Lab Assignment',
    category: 'Problem Set / Lab Assignment',
    fileName: 'CS301_Lab_Assignment_3_BST.pdf',
    generatePdf: () =>
      buildPresetPdfBytes('CS301P: Data Structures & Algorithms Lab — Assignment 3', [
        [
          'DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING',
          'CS301P: LABORATORY ASSIGNMENT 3 — BINARY SEARCH TREES',
          'Term: Odd Semester 2024-25 | Instructor: Dr. Rajesh Sharma',
          '------------------------------------------------------------',
          'TASK 1: POINTER-BASED BST NODE IMPLEMENTATION (20 PTS)',
          'Implement a dynamic node representation with key, left, right, and parent pointers.',
          'Construct iterative Insert and Recursive In-Order traversal methods.',
          '',
          'TASK 2: DELETION ALGORITHM WITH THREE ATOMIC CASES (25 PTS)',
          'Implement node deletion supporting: Case 1 (Leaf Node), Case 2 (Single Child),',
          'and Case 3 (Two Children using In-Order Successor swap).',
          '',
          'TASK 3: BREADTH-FIRST SEARCH & TREE HEIGHT CALCULATION (25 PTS)',
          'Implement level-order BFS traversal using an explicit queue data structure.',
          'Compute tree height and diameter in O(N) linear time complexity.',
          '',
          'IMPORTANT SUBMISSION DEADLINE: October 18, 2024 at 23:59 IST',
          'All students must push clean code and README to the designated GitHub portal.',
        ],
        [
          'TASK 4: INTERACTIVE LAB VIVA AND ORAL DEMONSTRATION (30 PTS)',
          'SCHEDULED VIVA DATE: October 25, 2024 during regular lab schedule.',
          'Students must explain node balance invariants and amortized search complexity.',
          '',
          'ACADEMIC INTEGRITY DIRECTIVE AND MOSS AUDIT',
          'All submissions are automatically screened using MOSS (Measure of Software Similarity).',
          'Submissions exhibiting code similarity exceeding 20% will receive an immediate zero.',
          'Permitted languages: C++, Java, or Python 3.8+.',
          'Please ensure all test suites pass before the October 18, 2024 cutoff.',
        ],
      ]),
  },
  {
    key: 'networks',
    name: 'Computer Networks Syllabus',
    category: 'Academic Syllabus',
    fileName: 'CS402_Computer_Networks_Syllabus.pdf',
    generatePdf: () =>
      buildPresetPdfBytes('CS402: Computer Networks & Protocol Engineering — Course Syllabus', [
        [
          'SCHOOL OF COMPUTING & INFORMATION SCIENCES',
          'CS402: COMPUTER NETWORKS & PROTOCOL ARCHITECTURE',
          'Credits: 4 (Lecture: 3, Tutorial: 1) | Term: Fall Semester 2024',
          '------------------------------------------------------------',
          'COURSE OVERVIEW AND OBJECTIVES',
          'Fundamental study of network layering, OSI Model and TCP/IP stack.',
          'Exploration of routing protocols, link-layer framing, and congestion control.',
          '',
          'UNIT 1: PHYSICAL & DATA LINK LAYERING',
          'Packet switching vs circuit switching, framing, CRC error detection, CSMA/CD, IEEE 802.3.',
          '',
          'UNIT 2: NETWORK LAYER & INTERNET PROTOCOLS',
          'IPv4 and IPv6 addressing, CIDR subnetting, Dijkstra shortest path algorithm, BGP, OSPF.',
          '',
          'ASSESSMENT TIMELINE & GRADED MILESTONES',
          'Continuous Assessment Quiz 1: October 15, 2024 (15% Course Weight)',
          'Formal Mid-Term Written Exam: November 05, 2024 (30% Course Weight)',
          'Network Simulation Term Project: December 02, 2024 (25% Course Weight)',
        ],
        [
          'UNIT 3: TRANSPORT LAYER & CONGESTION ARCHITECTURE',
          'TCP flow control, sliding window protocol, congestion avoidance (Reno, Cubic), UDP sockets.',
          '',
          'UNIT 4: APPLICATION PROTOCOLS',
          'DNS resolution, HTTP/1.1 vs HTTP/2 multiplexing, TLS security handshakes.',
          '',
          'GRADING CRITERIA & POLICY REMINDERS',
          'Final Semester Written Examination: December 18, 2024 (30% Course Weight).',
          'Minimum 75% attendance is required to qualify for examination hall admission.',
          'Students must register for the project portal by October 20, 2024.',
        ],
      ]),
  },
];
