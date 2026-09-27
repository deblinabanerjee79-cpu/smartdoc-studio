import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Calendar, 
  Sparkles, RefreshCw, Play, CheckSquare, 
  Square, Cpu, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  task: string;
  tag: string;
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
  summary: string;
}

const PRESETS: Record<string, DocumentData> = {
  stw: {
    title: "STW_4A5_Symbols_&_Abbreviations.pdf",
    unitHeader: "STRUCTURE OF SCIENTIFIC DOCUMENTS â€¢ TITLE, ABSTRACT, KEYWORDS",
    category: "Instructional Reference / Lecture Slides",
    format: "PDF-1.4 / Vector Stream",
    words: 1420,
    readingTime: "~4 min read",
    pageCount: 3,
    pages: [
      `UNIT 04: STRUCTURE OF SCIENTIFIC DOCUMENTS\nSYMBOLS & ABBREVIATIONS\n\n1. Guidelines for Notation:\nâ€¢ Provide a dedicated list of symbols and abbreviations immediately after Keywords.\nâ€¢ Symbols must follow established international SI conventions.\nâ€¢ Latin & Greek symbols should be cleanly separated in the appendices.\nâ€¢ Sequence Greek symbols by standard alphabetical progression: Î± (alpha), Î² (beta), Î³ (gamma), Î´ (delta), Îµ (epsilon)...`,
      `2. Sequence of Small Greek Letters:\nâ€¢ Î± (alpha)   â€¢ Î² (beta)   â€¢ Î³ (gamma)   â€¢ Î´ (delta)\nâ€¢ Îµ (epsilon) â€¢ Î¶ (zeta)   â€¢ Î· (eta)     â€¢ Î¸ (theta)\nâ€¢ Î¹ (iota)    â€¢ Îº (kappa)  â€¢ Î» (lambda)  â€¢ Î¼ (mu)\nâ€¢ Î½ (nu)      â€¢ Î¾ (xi)     â€¢ Î¿ (omicron) â€¢ Ï€ (pi)\nâ€¢ Ï (rho)     â€¢ Ïƒ (sigma)  â€¢ Ï„ (tau)     â€¢ Ï… (upsilon)\nâ€¢ Ï† (phi)     â€¢ Ï‡ (chi)    â€¢ Ïˆ (psi)     â€¢ Ï‰ (omega)`,
      `3. Units & Quantities:\nâ€¢ Units of measure such as mm, dB, min, hr, and Â°C.\nâ€¢ Statistical metrics like %, Î¼, ÏƒÂ², ANOVA, RÂ², t, F.\nâ€¢ Mathematical operators (max, min, lim, log).\nâ€¢ Chemical compounds (H2SO4, C6H12O6) and SI units.`
    ],
    acronyms: ["SI", "ANOVA", "ISO", "DNA", "ERP", "EHR"],
    deadlines: [],
    checklist: [
      { task: "Separate Latin and Greek symbols alphabetically in nomenclature index", tag: "Formatting" },
      { task: "Verify SI measurement units formatting (mm, dB, hr, Â°C)", tag: "Standard" },
      { task: "Define all abbreviations on their first appearance in body text", tag: "Rule" },
      { task: "Maintain consistent lowercase vs uppercase Greek symbol designations", tag: "Formatting" }
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
      `DEPARTMENT OF COMPUTER SCIENCE\nLAB EVALUATION 03: BALANCED SEARCH TREES\n\nObjective: Implement an AVL Tree with self-balancing rotation mechanisms.\n\nProblem 1: Implement Left-Rotate and Right-Rotate routines in C++/Java.\nProblem 2: Verify tree height invariants after 1,000 random insertions.\n\nSubmission Requirements:\nâ€¢ Submit zipped source code and benchmark graphs to the student portal.\nâ€¢ Deadline: October 15, 2026 at 23:59 IST.\nâ€¢ Late submissions deduct 20% marks per 24 hours.`
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
      `COURSE OUTLINE: COMPUTER NETWORKS & PROTOCOLS\n\nModule 1: Physical & Data Link Layer (Framing, Error Detection, CRC)\nModule 2: Network Layer (IP Addressing, CIDR, Subnetting, OSPF, BGP)\nModule 3: Transport Layer (TCP 3-Way Handshake, Congestion Control)\n\nGrading Weightage:\nâ€¢ Mid-Term Assessment: 30% (November 04, 2026)\nâ€¢ Lab Practicals & Continuous Eval: 25%\nâ€¢ End-Semester Examination: 45% (December 12, 2026)`
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
    summary: "Comprehensive university syllabus specifying course modules, textbook references, and grading milestone percentages for Computer Networks."
  }
};

/**
 * Bullet & Paragraph Spacing Normalization (Universal for all PDFs)
 */
function normalizePdfText(rawText: string): string {
  const cleaned = rawText
    .replace(/[\uFFFD\u0000-\u001F\u007F-\u009F\uF000-\uFFFF]/g, ' ')
    .replace(/[\uFFFD\uF0B7\u2022\uFEFF]/g, '\nâ€¢ ')
    .replace(/\s*â€¢\s*/g, '\nâ€¢ ')
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1\n\n') // Natural paragraph breaks after sentences
    .replace(/\s+([,.:;?!])/g, '$1')           // Attach orphan punctuation
    .replace(/\n\s*[,.:;?!]/g, '')             // Delete stray punctuation on new lines
    .replace(/\b([A-Za-z]+)\s+s\b/g, '$1s')   // Fix split trailing plurals (e.g. "title s" -> "titles")
    .replace(/\nâ€¢\s*(?=\n|$)/g, '')            // Remove empty bullets
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Renders structured document reader lines:
 * Default body text (95% of content) is in text-zinc-300 font-mono text-xs.
 * Headings (only if line < 45 chars, no punctuation, and matches distinct header) are emerald tags.
 */
function renderDocumentLines(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Strict Heading Detection:
    // ONLY if line is < 45 characters, has NO punctuation like periods or commas, and matches distinct slide headers
    const hasPunctuation = /[.,:;?!]/.test(trimmed);
    const isDistinctHeader = /^(PURPOSE OF TITLE|TITLE GUIDELINES|STATEMENT TITLE|QUESTION TITLE|TYPES OF TITLE|ABSTRACT|KEYWORDS|UNIT \d+|MODULE \d+|SECTION \d+|GUIDELINES FOR NOTATION|SEQUENCE OF SMALL GREEK LETTERS|UNITS & QUANTITIES)$/i.test(trimmed);
    const isShortCleanAllCaps = trimmed.length >= 4 && trimmed.length < 45 && trimmed === trimmed.toUpperCase() && !hasPunctuation && !trimmed.startsWith('â€¢');

    const isHeader = trimmed.length < 45 && !hasPunctuation && (isDistinctHeader || isShortCleanAllCaps);

    if (isHeader) {
      return (
        <h3
          key={idx}
          className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1 mt-4 block"
        >
          {trimmed}
        </h3>
      );
    }

    if (trimmed.startsWith('â€¢') || trimmed.startsWith('-')) {
      const bulletContent = trimmed.replace(/^[â€¢\-]\s*/, '');
      return (
        <div key={idx} className="pl-2 flex items-start gap-2 text-zinc-300 font-mono text-xs leading-relaxed">
          <span className="text-emerald-400/80 font-bold shrink-0">â€¢</span>
          <span>{bulletContent}</span>
        </div>
      );
    }

    // Default for 95% of text: Always body text
    return (
      <p key={idx} className="text-zinc-300 font-mono text-xs leading-relaxed">
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
      task: `Summarize the main takeaways into your revision notes in 3â€“4 bullet points`,
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

/**
 * Returns color classes for checklist tag badges
 */
function getTagBadgeClass(tag: string): string {
  switch (tag) {
    case 'Core Concept':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    case 'Quick Review':
    case 'Review':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    case 'Examples':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    case 'Comparison':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    case 'Key Points':
      return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    case 'Rules':
    case 'Rule':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    case 'Study Prep':
    case 'Metadata':
      return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
    case 'Deadline':
    case 'Submission':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    case 'Practice':
    case 'Standard':
      return 'bg-teal-500/10 text-teal-300 border-teal-500/20';
    case 'Self Test':
      return 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20';
    case 'Compliance':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    case 'Ethics':
      return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    case 'Disclosure':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    case 'Algorithm':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    case 'Formatting':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    default:
      return 'bg-zinc-800 text-zinc-300 border-zinc-700/60';
  }
}

export default function AppDarkBackup() {
  const [selectedPreset, setSelectedPreset] = useState<string>('stw');
  const [activeDoc, setActiveDoc] = useState<DocumentData>(PRESETS.stw);
  const [pipelineProgress, setPipelineProgress] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(3);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setActiveDoc(PRESETS[key]);
    setCompletedItems({});
    runPipelineSimulation(PRESETS[key]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPipelineProgress(15);
    setStage(1);

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
      setStage(2);

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
      setStage(3);

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

      // â”€â”€ Universal Student-Friendly Dynamic Checklist Engine â”€â”€
      const finalChecklist = generateStudentFriendlyChecklist(normalizedFullText, file.name, foundDates);

      const words = normalizedFullText.split(/\s+/).filter(Boolean);

      // Extract main unit/document title cleanly without cutting at commas
      let unitHeader = "";
      const firstPageLines = (extractedPages[0] || "").split("\n").map(l => l.trim()).filter(Boolean);

      const structDocLine = firstPageLines.find(l => /STRUCTURE OF SCIENTIFIC DOCUMENTS/i.test(l));
      if (structDocLine) {
        const idx = firstPageLines.indexOf(structDocLine);
        const nextLine = firstPageLines[idx + 1];
        if (nextLine && nextLine.length < 80 && !nextLine.startsWith('â€¢') && !/^(1\.|Objective|Module|Guidelines)/i.test(nextLine)) {
          unitHeader = `${structDocLine} â€¢ ${nextLine}`.replace(/^[â€¢\-]\s*/, '').replace(/\s+/g, ' ').trim();
        } else {
          unitHeader = structDocLine.replace(/^[â€¢\-]\s*/, '').replace(/\s+/g, ' ').trim();
        }
      } else {
        for (const line of firstPageLines) {
          if (/^(UNIT \d+|MODULE \d+|DEPARTMENT OF|COURSE OUTLINE|LAB EVALUATION|[A-Z0-9\s,â€“â€”â€¢:/-]{8,})/i.test(line) && line.length < 120 && !line.startsWith('â€¢')) {
            unitHeader = line.replace(/^[â€¢\-]\s*/, '').replace(/\s+/g, ' ').trim();
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
        summary: `Parsed ${pdf.numPages} pages from ${file.name}. Identified ${words.length} words, ${acronyms.length} key entities, and extracted 4 actionable checklist items.`
      };

      setSelectedPreset('custom');
      setActiveDoc(customDoc);
      setCompletedItems({});
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
    setStage(1);

    setTimeout(() => {
      setPipelineProgress(65);
      setStage(2);
    }, 450);

    setTimeout(() => {
      setPipelineProgress(100);
      setStage(3);
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

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/60 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
              SmartDoc AI 
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% In-Browser Engine
              </span>
            </h1>
          </div>
        </div>

        {/* Preset Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 flex items-center gap-1 shrink-0 ml-0.5">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            Demo Presets
          </span>

          <button 
            onClick={() => handleSelectPreset('stw')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
              selectedPreset === 'stw' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            STW Symbols
          </button>
          <button 
            onClick={() => handleSelectPreset('lab')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
              selectedPreset === 'lab' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CS Lab
          </button>
          <button 
            onClick={() => handleSelectPreset('syllabus')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
              selectedPreset === 'syllabus' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Networks Syllabus
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Upload PDF
            <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button 
            onClick={() => runPipelineSimulation(activeDoc)}
            disabled={isProcessing}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isProcessing ? 'Analyzing...' : 'Re-Run Pipeline'}
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Cohesive Document Reader Canvas (No broken single-slide pagination) */}
        <div className="w-1/2 border-r border-zinc-800/80 flex flex-col bg-zinc-950/40">
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl relative space-y-4">
              
              {/* Top Card Header with Main Title Badge & Metadata */}
              <div className="border-b border-zinc-800/80 pb-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase tracking-wide">
                      {activeDoc.unitHeader || activeDoc.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[220px]" title={activeDoc.title}>
                    {activeDoc.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-1 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60">
                    {activeDoc.format}
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60">
                    {activeDoc.pageCount} Pages Analyzed
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-800/90 text-cyan-300 border border-zinc-700/60 font-semibold">
                    {activeDoc.words} Words
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-800/90 text-zinc-400 border border-zinc-700/60">
                    {activeDoc.readingTime}
                  </span>
                </div>
              </div>

              {/* Main Reading Area: Full compiled body content */}
              <div className="space-y-5">
                {activeDoc.pages.map((pageContent, pIdx) => (
                  <div key={pIdx} className="space-y-3">
                    {activeDoc.pages.length > 1 && (
                      <div className="flex items-center gap-2 pt-2 pb-1 border-b border-zinc-800/60 text-[10px] font-mono text-zinc-500">
                        <span className="text-emerald-400/80 font-semibold">SECTION / SLIDE {pIdx + 1} OF {activeDoc.pageCount}</span>
                      </div>
                    )}
                    <div className="leading-relaxed select-text space-y-2">
                      {renderDocumentLines(pageContent)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>SmartDoc AI â€¢ Unified Document Stream</span>
                <span>Verified Clean OCR Buffer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction Intelligence Panel */}
        <div className="w-1/2 flex flex-col bg-zinc-950 overflow-y-auto p-5 space-y-4">
          {/* Real-Time Stepper Pipeline */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Pipeline Execution Status
              </span>
              <span className="font-mono text-emerald-400 font-medium">{pipelineProgress}% Complete</span>
            </div>
            
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${pipelineProgress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className={`p-2 rounded border ${stage >= 1 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-zinc-800 text-zinc-500'}`}>
                1. Text Ingest
              </div>
              <div className={`p-2 rounded border ${stage >= 2 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-zinc-800 text-zinc-500'}`}>
                2. Semantic Parse
              </div>
              <div className={`p-2 rounded border ${stage >= 3 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-zinc-800 text-zinc-500'}`}>
                3. Synthesis
              </div>
            </div>
          </div>

          {/* Metric Badges: 2-Column Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Words Analyzed
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">{activeDoc.words}</div>
              <div className="text-[10px] text-zinc-500">{activeDoc.readingTime}</div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadlines Detected
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">{activeDoc.deadlines.length}</div>
              <div className="text-[10px] text-zinc-500">
                {activeDoc.deadlines.length === 0 ? 'Reference Document' : 'Action Required'}
              </div>
            </div>
          </div>

          {/* Deadlines Section */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Detected Deadlines & Deliverables
            </h2>
            {activeDoc.deadlines.length === 0 ? (
              <div className="text-xs text-zinc-400 bg-zinc-950 border border-zinc-800/60 rounded-lg p-3.5">
                <span className="text-emerald-400 font-medium">âœ“ No academic deadlines detected.</span> This document is categorized as <span className="text-zinc-200">{activeDoc.category}</span>.
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeDoc.deadlines.map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-950 border border-zinc-800/80 p-3 rounded-lg text-xs">
                    <div>
                      <div className="font-medium text-zinc-200">{d.item}</div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{d.date}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {d.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* â”€â”€ Topic-Aware Synthesized Revision Checklist (Strictly 4 Items) â”€â”€ */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs mb-3">
              <h2 className="font-semibold text-zinc-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Synthesized Revision Checklist
              </h2>
              <span className="font-mono text-emerald-400 font-medium text-xs">
                {completedCount} of {activeDoc.checklist.length} Completed
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col justify-around">
              {activeDoc.checklist.map((item, i) => {
                const isChecked = !!completedItems[item.task];
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleChecklist(item.task)}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-950/70 hover:bg-zinc-900/90 border border-zinc-800/70 cursor-pointer transition-all group shadow-sm hover:border-zinc-700/80"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600 group-hover:text-zinc-500 shrink-0 mt-0.5" />
                      )}
                      <span className={`select-none flex-1 text-xs text-zinc-300 leading-normal break-words ${isChecked ? 'line-through text-zinc-500' : ''}`}>
                        {item.task}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border shrink-0 self-start ml-2 ${getTagBadgeClass(item.tag)}`}>
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

