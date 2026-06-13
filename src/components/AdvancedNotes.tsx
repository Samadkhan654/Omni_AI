import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Save, 
  Download, 
  Sparkles, 
  Heading1, 
  Heading2, 
  ListTodo, 
  Eye, 
  Bold, 
  Italic,
  BookOpen,
  CheckCircle2,
  Edit2,
  Heart,
  Search,
  ArrowUpDown,
  Play,
  Pause,
  Palette,
  Brush,
  Eraser,
  SquareKanban,
  Table,
  HelpCircle,
  Lightbulb,
  FileSpreadsheet,
  Clock,
  Briefcase
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  category: 'Workspace' | 'Procedures' | 'Co-Pilot' | 'Marketing';
  body: string;
  updatedAt: string;
  isFavorite: boolean;
  sketch?: string; // Stored base64 image data of whiteboard
  stage: 'Backlog' | 'In Progress' | 'Completed';
  timeSpentSeconds: number; // Persistent tracked documentation time
}

interface AdvancedNotesProps {
  theme: 'light' | 'dark';
  showToast: (msg: string) => void;
}

export default function AdvancedNotes({ theme, showToast }: AdvancedNotesProps) {
  const isDark = theme === 'dark';
  
  // Persistent notebook storage synchronisation
  const [notes, setNotes] = useState<Note[]>(() => {
    const local = localStorage.getItem('omni_notebook_notes_v2');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [
      {
        id: 'n_1',
        title: 'Sameer Ent — Delivery Strategy',
        category: 'Procedures',
        body: `> [!tip]
💡 **Official Strategy Framework for London Central Courier Delivery Route**: Always coordinate with local regional managers.

| Phase | Express Route Hub | SLA Level | VIP Retention |
|---|---|---|---|
| Q1 | Central London Express Hub | 99.4% SLA | Platinum VIP |
| Q2 | Sunday Express Delivery | 98.1% SLA | Silver VIP |
| Q3 | Software integration pipeline | 97.2% SLA | Gold Star VIP |

- Use Central London Sunday Express hubs.
- Standardize shipping tags to retain VIP tiers.
- Resolve software creep via CostGuard logs.
- [x] Integrate live tracking APIs
- [ ] Align retail account discount codes`,
        updatedAt: '06/11/2026 18:23',
        isFavorite: true,
        stage: 'In Progress',
        timeSpentSeconds: 120
      },
      {
        id: 'n_2',
        title: 'Aria Conversation Training FAQ',
        category: 'Co-Pilot',
        body: `> [!warning]
⚠️ **Training Guidelines**: These custom conversational scripts must align directly with Aria's active engine metrics.

| Accessory Type | Replacement Warranty | Discount Option | Target LTV |
|---|---|---|---|
| Premium LED Accessories | 12 Months Warranty | Auto-apply 20% | LTV Score > 450 |
| Standard Backing Glass | 6 Months Warranty | Custom coupon code | LTV Score > 150 |

- All premium LED accessory packs contain 12 months full replacement warranty.
- Auto-apply 20% discount structure for retail accounts with high LTV scores.
- [ ] Deploy v2 catalog rules
- [x] Check contact leads logs`,
        updatedAt: '05/30/2026 14:10',
        isFavorite: false,
        stage: 'Completed',
        timeSpentSeconds: 450
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    const savedId = localStorage.getItem('omni_notebook_active_note_id_v2');
    return savedId || 'n_1';
  });

  // Working States
  const [editingTitle, setEditingTitle] = useState('');
  const [editingBody, setEditingBody] = useState('');
  const [editingCategory, setEditingCategory] = useState<'Workspace' | 'Procedures' | 'Co-Pilot' | 'Marketing'>('Workspace');
  const [editingStage, setEditingStage] = useState<'Backlog' | 'In Progress' | 'Completed'>('Backlog');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'time'>('updated');
  const [editorMode, setEditorMode] = useState<'write' | 'preview' | 'whiteboard' | 'kanban'>('write');

  // Time Tracker state
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sketchboard state drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#F59E0B'); // Orange/Amber
  const [brushWidth, setBrushWidth] = useState(4);
  const [toolMode, setToolMode] = useState<'draw' | 'erase'>('draw');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('omni_notebook_notes_v2', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('omni_notebook_active_note_id_v2', activeNoteId);
  }, [activeNoteId]);

  // Sync active note form inputs upon switching active note ID (Only on initiation or switching notes, NOT on body changes)
  useEffect(() => {
    const currentNote = notes.find(n => n.id === activeNoteId);
    if (currentNote) {
      setEditingTitle(currentNote.title);
      setEditingBody(currentNote.body);
      setEditingCategory(currentNote.category);
      setEditingStage(currentNote.stage);
    }
  }, [activeNoteId]);

  // Real-time automatic sync of current edits back to the core notes state array
  useEffect(() => {
    if (!activeNoteId) return;
    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
      ...n,
      title: editingTitle,
      body: editingBody,
      category: editingCategory,
      stage: editingStage,
      updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    } : n));
  }, [editingTitle, editingBody, editingCategory, editingStage]);

  // Auto-saved tracking timer effect
  useEffect(() => {
    if (isTimerRunning && activeNoteId) {
      timerRef.current = setInterval(() => {
        setNotes(prev => prev.map(n => n.id === activeNoteId ? {
          ...n,
          timeSpentSeconds: n.timeSpentSeconds + 1
        } : n));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, activeNoteId]);

  // Init canvas drawings when opening whiteboard tab
  useEffect(() => {
    if (editorMode === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear and fill dark canvas background
        ctx.fillStyle = '#0c0a09';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load existing sketch if available
        const currentNote = notes.find(n => n.id === activeNoteId);
        if (currentNote && currentNote.sketch) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = currentNote.sketch;
        }
      }
    }
  }, [editorMode, activeNoteId]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `n_${Date.now()}`,
      title: 'Untitled Note Draft #' + (notes.length + 1),
      category: 'Workspace',
      body: `# New Strategy Document\n\n> [!tip]\n💡 **Tip**: Get started with procedures.\n\n- Write processes for your business\n- Align communication channels\n- [ ] Complete first draft milestones`,
      updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isFavorite: false,
      stage: 'Backlog',
      timeSpentSeconds: 0
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setEditorMode('write');
    showToast("📝 Generated new doc canvas!");
  };

  const handleSaveNote = () => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
      ...n,
      title: editingTitle || 'Untitled Document',
      body: editingBody,
      category: editingCategory,
      stage: editingStage,
      updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    } : n));
    showToast("💾 Saved notes changes to local workspace ledger.");
  };

  const insertTemplateBlock = (type: 'tip' | 'warning' | 'table' | 'todo' | 'header' | 'divider' | 'code') => {
    let block = '';
    if (type === 'tip') {
      block = `\n\n> [!tip]\n💡 **Tip**: [Your informative text here]`;
    } else if (type === 'warning') {
      block = `\n\n> [!warning]\n⚠️ **Warning Notice**: [Important compliance warning here]`;
    } else if (type === 'table') {
      block = `\n\n| Item | Description | Cost | Status |\n|---|---|---|---|\n| [Prod A] | [Details...] | $200 | Active |\n| [Prod B] | [Details...] | $150 | Pending |`;
    } else if (type === 'todo') {
      block = `\n- [ ] [Your actionable task item here]`;
    } else if (type === 'header') {
      block = `\n\n## Custom Section Header`;
    } else if (type === 'divider') {
      block = `\n\n---`;
    } else if (type === 'code') {
      block = `\n\n\`\`\`javascript\n// Custom business logic script\nfunction calculateSLA() {\n  return 99.4;\n}\n\`\`\``;
    }
    setEditingBody(prev => prev + block);
    showToast(`📝 Appended ${type} template block successfully!`);
  };

  const handleToggleFavorite = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
    showToast("💖 Updated note Favorite bookmarks.");
  };

  const handleDeleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (remaining.length > 0) {
      setActiveNoteId(remaining[0].id);
    } else {
      setActiveNoteId('');
    }
    showToast("🗑️ Erased notes document successfully.");
  };

  const insertMarkdownAccent = (prefix: string) => {
    setEditingBody(prev => prev + '\n' + prefix);
  };

  // Canvas Handlers for Whiteboard Strategy Board
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = toolMode === 'erase' ? '#0c0a09' : brushColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasSketch();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasSketch();
    showToast("🧹 Cleaned strategy whiteboard layout.");
  };

  const saveCanvasSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
      ...n,
      sketch: dataUrl
    } : n));
  };

  // NO-dependency Markdown and Tables / Callouts parser
  const renderMarkdown = (text: string) => {
    if (!text) {
      return <p className="text-stone-500 italic text-xs">No prose drafted yet. Start writing...</p>;
    }

    const lines = text.split('\n');
    let insideTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    const elements: React.ReactNode[] = [];

    // Temporary variables for callout tracking
    let insideCallout = false;
    let calloutType: 'tip' | 'warning' | 'info' = 'tip';
    let calloutLines: string[] = [];

    const flushTable = (keyIndex: number) => {
      if (tableRows.length > 0 || tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${keyIndex}`} className="overflow-x-auto my-3 border border-stone-800 rounded-xl bg-stone-900/30">
            <table className="min-w-full text-xs font-sans text-stone-200">
              {tableHeaders.length > 0 && (
                <thead className="bg-[#1C1917] border-b border-stone-800 text-amber-500 font-extrabold uppercase tracking-wider text-[9px]">
                  <tr>
                    {tableHeaders.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left border-r border-stone-800 last:border-0">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-stone-850/60 last:border-0 hover:bg-stone-850/30">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-stone-300 font-medium border-r border-stone-850/50 last:border-0">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
        insideTable = false;
      }
    };

    const flushCallout = (keyIndex: number) => {
      if (insideCallout) {
        let blockColor = 'bg-amber-500/10 border-amber-500/20 text-amber-500';
        let titleBlock = '💡 Co-Pilot Intelligence Recommendation';
        
        if (calloutType === 'warning') {
          blockColor = 'bg-red-500/10 border-red-500/20 text-red-400';
          titleBlock = '⚠️ Strategic Operational Warning';
        } else if (calloutType === 'info') {
          blockColor = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
          titleBlock = '📌 Informational Record Summary';
        }

        elements.push(
          <div key={`callout-${keyIndex}`} className={`p-4 rounded-xl border ${blockColor} my-3 text-[10.5px] font-sans leading-relaxed`}>
            <span className="block font-black uppercase text-[8px] tracking-widest font-mono mb-1.5 opacity-80">{titleBlock}</span>
            {calloutLines.map((l, li) => {
              let proc = l;
              if (proc.startsWith('💡 ') || proc.startsWith('⚠️ ')) proc = proc.slice(2);
              return <p key={li} className="text-stone-200 font-medium">{proc}</p>;
            })}
          </div>
        );
        calloutLines = [];
        insideCallout = false;
      }
    };

    lines.forEach((line, idx) => {
      // 1. Parse Callout starting line: `> [!tip]` etc
      if (line.startsWith('> [!')) {
        flushTable(idx);
        insideCallout = true;
        const typeStr = line.replace('> [!', '').replace(']', '').trim().toLowerCase();
        if (typeStr.includes('warning')) {
          calloutType = 'warning';
        } else if (typeStr.includes('info')) {
          calloutType = 'info';
        } else {
          calloutType = 'tip';
        }
        return;
      }

      // If inside callout block, collect lines starting with `> ` or general text
      if (insideCallout) {
        if (line.startsWith('> ') || line.startsWith('>')) {
          calloutLines.push(line.replace(/^>\s?/, ''));
          return;
        } else if (line.trim() === '') {
          flushCallout(idx);
          return;
        } else {
          // Non-nested row triggers callout layout flush
          flushCallout(idx);
        }
      }

      // 2. Parse Markdown Table row starting with `|`
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i !== 0 && i !== arr.length - 1);
        
        if (cells.every(cell => cell.startsWith('-') || cell.startsWith(':'))) {
          // Separator row, skip
          return;
        }

        if (!insideTable) {
          insideTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else {
        flushTable(idx);
      }

      // 3. Regular Markdown markup mapping
      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} className="text-lg font-black text-amber-500 mb-2 mt-4 pb-1 border-b border-stone-850">{line.replace('# ', '')}</h1>);
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-sm font-black text-stone-100 mb-1.5 mt-3">{line.replace('## ', '')}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-xs font-bold text-amber-400 mb-1 mt-2.5">{line.replace('### ', '')}</h3>);
        return;
      }
      if (line.startsWith('- [ ] ')) {
        elements.push(
          <div key={idx} className="flex items-center gap-2 my-1.5 text-xs text-stone-300">
            <span className="w-3.5 h-3.5 rounded border border-amber-500/40 flex items-center justify-center shrink-0 text-transparent font-mono"></span>
            <span className="font-semibold">{line.replace('- [ ] ', '')}</span>
          </div>
        );
        return;
      }
      if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
        elements.push(
          <div key={idx} className="flex items-center gap-2 my-1.5 text-xs text-stone-400 line-through opacity-70">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/10 border border-amber-500 flex items-center justify-center shrink-0 text-amber-500 text-[8.5px] font-black font-mono">✓</span>
            <span className="font-bold">{line.replace(/- \[(x|X)\]\s+/, '')}</span>
          </div>
        );
        return;
      }
      if (line.startsWith('- ')) {
        elements.push(<li key={idx} className="list-disc list-inside text-xs text-stone-300 my-1 ml-1 leading-relaxed font-sans font-medium">{line.replace('- ', '')}</li>);
        return;
      }

      let processed = line;
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-500">$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-stone-200">$1</em>');
      processed = processed.replace(/`(.*?)`/g, '<code class="bg-[#12100E] px-1 py-0.5 rounded font-mono text-[9px] text-amber-400 border border-white/5">$1</code>');

      if (!line.trim()) {
        elements.push(<div key={idx} className="h-2"></div>);
      } else {
        elements.push(
          <p 
            key={idx} 
            className="text-[11px] text-stone-300 leading-relaxed my-1 font-sans font-medium"
            dangerouslySetInnerHTML={{ __html: processed }}
          />
        );
      }
    });

    // Final flushes
    flushTable(9999);
    flushCallout(9999);

    return elements;
  };

  // NOTION AI Smart Assistant prompt commands
  const handleAiCommand = (cmd: 'summarize' | 'polish' | 'tasks' | 'align') => {
    let result = editingBody;
    
    if (cmd === 'summarize') {
      result = `> [!info]\n💡 **AI Summary**: Optimized procedural guide focusing on organizational efficiency, quality checks, LTV structures, and warranty compliance.\n\n${result}`;
      showToast("✨ Aria AI generated smart summary Callout Block!");
    } else if (cmd === 'polish') {
      result = result.replace(/untitled/gi, 'Official Strategic');
      result = `${result}\n\n*Page tone polished automatically with Aria Workspace Engine on ${new Date().toLocaleDateString('en-GB')}* 🚀`;
      showToast("✨ Polished tone layout to Premium corporate prose!");
    } else if (cmd === 'tasks') {
      result = `${result}\n\n### Extracted Task Milestones\n- [ ] Audit operational SLA level metrics\n- [ ] Verify courier express routes\n- [ ] Deploy client tracking feedback channels`;
      showToast("✨ Extracted checklists and formatted as Markdown todos!");
    } else if (cmd === 'align') {
      result = `${result}\n\n| Operational Goal | Target SLA | Priority Status |\n|---|---|---|\n| Standardize Courier Transit | 99.4% SLA | high |\n| Minimize Access Overhead | LTV Threshold | medium |`;
      showToast("✨ Aligned inline Markdown spreadsheet database view!");
    }

    setEditingBody(result);
    // Auto sync to note state
    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
      ...n,
      body: result,
      updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    } : n));
  };

  // Clean form views data filters
  const searchedNotes = notes.filter(n => {
    const isCategoryMatch = selectedCategoryFilter === 'All' || n.category === selectedCategoryFilter;
    const isSearchMatch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.body.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  // Sort notes lists
  const sortedNotes = [...searchedNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'time') {
      return b.timeSpentSeconds - a.timeSpentSeconds;
    }
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const downloadNotesAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([`Title: ${editingTitle}\nCategory: ${editingCategory}\nModified: ${new Date().toLocaleString()}\n\n${editingBody}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${editingTitle.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    showToast("📥 Exported document TXT into local downloads folder.");
  };

  // Kanban view card state updater
  const handleMoveKanbanStage = (noteId: string, nextStage: 'Backlog' | 'In Progress' | 'Completed') => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, stage: nextStage } : n));
    showToast(`🔀 Moved note status to ${nextStage}!`);
  };

  const formatTrackedTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins > 0 ? mins + 'm ' : ''}${secs}s`;
  };

  // Simulated Tutorial Video Playback
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoFrame, setVideoFrame] = useState(0);
  const [videoPhrase, setVideoPhrase] = useState("Draft official Markdown procedures and hook Aria up as your active Co-Pilot.");

  useEffect(() => {
    let timer: any;
    if (isVideoOpen) {
      timer = setInterval(() => {
        setVideoFrame(prev => {
          const next = (prev + 1) % 20;
          if (next === 0) setVideoPhrase("📝 Welcome to Executive Sandbox Notebook! Type title & content...");
          else if (next === 5) setVideoPhrase("💡 Utilize 'Insert Blocks' for fast warning callouts and spreadsheets...");
          else if (next === 10) setVideoPhrase("✨ Click 'Aria AI Help' beneath the editor to auto-summarize or polish tone...");
          else if (next === 15) setVideoPhrase("✏️ Switch to Sketch Strategy to visualize map structures on the whiteboard...");
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isVideoOpen]);

  const cardBgCls = isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-[#1C1917]';
  const inputBgCls = isDark ? 'bg-[#141210] border-stone-850 text-white rounded-2xl' : 'bg-neutral-50 border-neutral-250 text-[#1C1917] rounded-xl';

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-hidden">

      {/* Main Header Bento Box */}
      <div className={`p-4 px-5 rounded-[24px] border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><BookOpen size={14} /></span>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider font-mono">Executive Sandbox Notebook</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white select-none">Workspace Notebook Console</h2>
          <p className="text-xs text-stone-200 mt-0.5">Design state guidelines, align business SLAs, draw visual charts on whiteboards, and log tracking times.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulated Guide Playback Button */}
          <button
            type="button"
            onClick={() => {
              setIsVideoOpen(!isVideoOpen);
              if (!isVideoOpen) {
                setVideoFrame(0);
                showToast("🎥 Booted Notebook Interactive Walkthrough Video Simulator!");
              }
            }}
            className="px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-[10px] font-black tracking-wider uppercase rounded-full transition-all shadow-md flex items-center gap-1 cursor-pointer"
          >
            <span>{isVideoOpen ? '⏸ Pause Guide' : '🎥 Learn Workspace Docs (video)'}</span>
          </button>

          <button 
            onClick={handleCreateNote}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-450 text-black text-[10px] font-black tracking-widest uppercase rounded-full transition-all shadow-md flex items-center gap-1 cursor-pointer hover:scale-102"
          >
            <Plus size={11} /> New Document Page
          </button>
        </div>
      </div>

      {/* Embedded Simulated Interactive Video Guide if active */}
      {isVideoOpen && (
        <div className="p-3 bg-black border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-center gap-4 shrink-0 transition-all font-mono select-none">
          <div className="w-24 h-14 bg-neutral-900 border border-stone-800 rounded-lg flex flex-col justify-between p-1 shrink-0 relative overflow-hidden">
            <span className="text-[6px] font-black text-amber-500">TUTORIAL DEMO</span>
            <div className="flex justify-center gap-0.5 h-5 items-end bg-transparent">
              <span className="w-1 bg-amber-400 rounded-t h-3 animate-pulse"></span>
              <span className="w-1 bg-amber-500 rounded-t h-4 animate-bounce"></span>
              <span className="w-1 bg-amber-400 rounded-t h-2"></span>
              <span className="w-1 bg-amber-500 rounded-t h-5 animate-pulse"></span>
            </div>
            <div className="w-full bg-stone-800 h-1 rounded-sm overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(videoFrame / 20) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between text-[9px]">
              <span className="text-white font-black flex items-center gap-1">🎥 Notebook AI Workspace Co-Pilot (00:{videoFrame < 10 ? '0' + videoFrame : videoFrame} / 00:20)</span>
              <span className="text-[#32CD32] font-black uppercase tracking-wider">GUIDE ACTIVE</span>
            </div>
            <p className="text-[11px] leading-relaxed italic bg-neutral-950 p-1.5 rounded border border-stone-850 text-stone-200 font-sans">
              "{videoPhrase}"
            </p>
          </div>
        </div>
      )}

      {/* Controls & Rich Search Panel */}
      <div className={`p-4 rounded-2xl border ${cardBgCls} grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs select-none`}>
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 text-stone-500" size={13} />
          <input 
            type="text"
            placeholder="Search documents or text..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950/60 border border-stone-850 text-xs focus:outline-none focus:border-amber-500 text-stone-200"
          />
        </div>

        <div className="md:col-span-5 flex flex-wrap gap-1">
          {['All', 'Workspace', 'Procedures', 'Co-Pilot', 'Marketing'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategoryFilter === cat 
                  ? 'bg-amber-500 text-black font-black' 
                  : 'bg-stone-950/60 text-stone-400 border border-stone-850 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 flex items-center justify-end gap-2">
          <ArrowUpDown size={12} className="text-stone-500" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="p-1 px-2.5 text-[9px] font-bold uppercase rounded-xl border border-stone-850 bg-stone-950/60 text-stone-300 focus:outline-none focus:border-amber-500"
          >
            <option value="updated">last modified</option>
            <option value="title">document title</option>
            <option value="time">time spent</option>
          </select>

          <button
            onClick={() => setEditorMode(editorMode === 'kanban' ? 'write' : 'kanban')}
            className={`p-1.5 rounded-xl border flex items-center gap-1.5 text-[9px] font-black uppercase cursor-pointer ${
              editorMode === 'kanban' 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' 
                : 'bg-stone-950/60 border-stone-850 text-stone-405 hover:text-stone-200'
            }`}
          >
            <SquareKanban size={12} />
            <span>Map Board</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column Explorer Navigation */}
        <div className="md:col-span-4 space-y-3">
          <div className={`p-3 rounded-xl border flex flex-col h-[500px] justify-between ${cardBgCls}`}>
            <div className="space-y-3 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center pb-2 border-b border-stone-850">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-stone-400">Page Navigation Ledger</span>
                <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">{sortedNotes.length} notes</span>
              </div>

              {/* Favorites Quick List Section */}
              {notes.some(n => n.isFavorite) && (
                <div className="space-y-1.5">
                  <span className="text-[8px] uppercase tracking-widest text-[#F59E0B] font-bold block">★ FAVORITES</span>
                  <div className="space-y-1 max-h-[110px] overflow-y-auto pr-1">
                    {notes.filter(n => n.isFavorite).map(fn => (
                      <button
                        key={fn.id}
                        onClick={() => setActiveNoteId(fn.id)}
                        className={`w-full text-left px-2 py-1 rounded-lg text-[10px] truncate block ${
                          fn.id === activeNoteId ? 'bg-amber-500/10 text-amber-500 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        ❤ {fn.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Document Scroll */}
              <div className="space-y-2 flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                {sortedNotes.length === 0 ? (
                  <div className="py-12 text-center text-stone-500">
                    <p className="text-[10px]">No journal entries meet sorting criteria</p>
                    <button onClick={handleCreateNote} className="text-[9px] text-amber-500 underline mt-1 font-bold">Draft a note now</button>
                  </div>
                ) : (
                  sortedNotes.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setActiveNoteId(n.id);
                        if (editorMode === 'kanban') setEditorMode('write');
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all block relative group cursor-pointer ${
                        activeNoteId === n.id 
                          ? 'bg-amber-500/10 border-amber-500/50 text-stone-100 scale-102 shadow-inner'
                          : isDark ? 'bg-neutral-950/40 border-stone-850 hover:bg-stone-850/60 text-stone-300' : 'bg-stone-50 hover:bg-stone-100 border-stone-150 text-stone-800'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-2 mb-1">
                        <span className="font-extrabold text-[11px] block truncate max-w-[140px]">{n.title}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            n.stage === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {n.stage === 'Completed' ? 'done' : n.stage === 'In Progress' ? 'doing' : 'backlog'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[9.5px] text-neutral-450 truncate leading-relaxed">
                        {n.body.replace(/[#>!\[\]\-\|*`]/g, '')}
                      </p>

                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-dashed border-stone-850/60 text-[7.5px] text-neutral-500 font-mono">
                        <span className="flex items-center gap-1 font-bold text-stone-400"><Clock size={10} className="text-amber-550" /> {formatTrackedTime(n.timeSpentSeconds)}</span>
                        <span>{n.updatedAt}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(n.id);
                        }}
                        className={`absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-800 rounded transition-all cursor-pointer ${
                          n.isFavorite ? 'text-[#F59E0B] opacity-100' : 'text-stone-400'
                        }`}
                      >
                        <Heart size={10} fill={n.isFavorite ? '#F59E0B' : 'transparent'} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-dashed border-stone-850 pt-3 text-[9px] text-stone-500 flex justify-between font-mono">
              <span className="flex items-center gap-1 font-extrabold text-[#F59E0B]"><Clock size={10} /> Active Auto-Saver Lock</span>
              <span>Ledger Verified</span>
            </div>
          </div>
        </div>

        {/* Right Column workspace Content panel */}
        <div className="md:col-span-8">
          
          {/* Main workspace Kanban Board View */}
          {editorMode === 'kanban' ? (
            <div className={`p-3.5 rounded-xl border h-[500px] flex flex-col justify-between ${cardBgCls}`}>
              <div className="space-y-2.5 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center pb-2 border-b border-stone-850">
                  <div className="flex items-center gap-2">
                    <SquareKanban size={15} className="text-amber-500" />
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-stone-200">Project Status Board</span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-500">Drag procedures to align workflow</span>
                </div>

                {/* Stages Lanes columns */}
                <div className="grid grid-cols-3 gap-3 flex-grow overflow-hidden h-full items-stretch">
                  
                  {/* Lane Backlog */}
                  {['Backlog', 'In Progress', 'Completed'].map(lane => {
                    const laneNotes = notes.filter(n => n.stage === lane);
                    return (
                      <div key={lane} className="bg-stone-950/40 p-3 rounded-2xl border border-stone-850 flex flex-col h-full overflow-hidden justify-between">
                        <div className="space-y-3 flex flex-col h-full overflow-hidden">
                          <div className="flex justify-between items-center border-b border-stone-850 pb-1.5 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-500">{lane}</span>
                            <span className="text-[8.5px] font-mono text-stone-400 bg-stone-900 px-1.5 py-0.2 rounded">{laneNotes.length}</span>
                          </div>

                          <div className="space-y-2 overflow-y-auto pr-1 flex-grow scrollbar-thin">
                            {laneNotes.map(ln => (
                              <div 
                                key={ln.id}
                                className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl hover:border-amber-500/40 transition-all text-left"
                              >
                                <h4 className="font-extrabold text-[10px] text-stone-100 truncate">{ln.title}</h4>
                                <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded capitalize inline-block mt-1">{ln.category}</span>
                                
                                {/* Movement actions */}
                                <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-stone-850 text-[7px] font-black uppercase text-stone-400">
                                  {lane !== 'Backlog' && (
                                    <button 
                                      onClick={() => handleMoveKanbanStage(ln.id, lane === 'Completed' ? 'In Progress' : 'Backlog')}
                                      className="hover:text-amber-500 cursor-pointer"
                                    >
                                      ◀ Move Left
                                    </button>
                                  )}
                                  {lane !== 'Completed' && (
                                    <button 
                                      onClick={() => handleMoveKanbanStage(ln.id, lane === 'Backlog' ? 'In Progress' : 'Completed')}
                                      className="hover:text-amber-500 cursor-pointer ml-auto"
                                    >
                                      Move Right ▶
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

              <div className="border-t border-stone-850 pt-2 text-[9px] text-stone-500 mt-3 text-right">
                <button onClick={() => setEditorMode('write')} className="text-[#F59E0B] underline font-bold uppercase tracking-wider">Return to Documents Writer</button>
              </div>
            </div>
          ) : (
            
            /* Main editor draft sheets panel */
            <div className={`p-4 rounded-xl border h-[500px] flex flex-col justify-between ${cardBgCls}`}>
              <div className="space-y-2.5 flex flex-col h-full overflow-hidden">
                
                {/* Meta Form Section */}
                <div className="flex gap-3 items-center">
                  <input 
                    type="text"
                    placeholder="Document Title"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    className={`flex-grow p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 ${inputBgCls}`}
                  />
                  <select
                    value={editingCategory}
                    onChange={e => setEditingCategory(e.target.value as any)}
                    className={`p-2.5 text-xs rounded-xl focus:outline-none w-28 ${inputBgCls}`}
                  >
                    <option value="Workspace">Workspace</option>
                    <option value="Procedures">Procedures</option>
                    <option value="Co-Pilot">Co-Pilot</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  
                  <select
                    value={editingStage}
                    onChange={e => setEditingStage(e.target.value as any)}
                    className={`p-2.5 text-xs rounded-xl focus:outline-none w-28 ${inputBgCls}`}
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Editor Tabs Navigation & Time Spent Tracking Indicator */}
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-stone-800 pb-2 bg-transparent select-none">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        editorMode === 'write' ? 'bg-amber-500 text-black font-black' : 'bg-stone-950 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1"><Edit2 size={10} /> Editor</span>
                    </button>
                    <button 
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        editorMode === 'preview' ? 'bg-amber-500 text-black font-black' : 'bg-stone-950 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1"><Eye size={10} /> Live Preview</span>
                    </button>
                    <button 
                      onClick={() => setEditorMode('whiteboard')}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        editorMode === 'whiteboard' ? 'bg-amber-500 text-black font-black' : 'bg-stone-950 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1"><Palette size={10} /> Sketch Strategy</span>
                    </button>
                  </div>

                  {/* Documentation time logging indicators */}
                  <div className="flex items-center gap-2 bg-stone-950/60 px-3 py-1 rounded-xl border border-stone-850 text-[10px] text-stone-305">
                    <span className="font-mono text-amber-500 font-bold flex items-center gap-1">
                      <Clock size={11} /> 
                      {notes.find(n => n.id === activeNoteId) ? formatTrackedTime(notes.find(n => n.id === activeNoteId)!.timeSpentSeconds) : '0s'}
                    </span>
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`font-black uppercase tracking-wider text-[8.5px] cursor-pointer ${isTimerRunning ? 'text-red-500 hover:underline' : 'text-emerald-550 hover:underline'}`}
                    >
                      {isTimerRunning ? 'Pause Tracker' : 'Start Tracker'}
                    </button>
                  </div>
                </div>

                {/* Main Interactive Screen Window Frame */}
                <div className="flex-grow overflow-hidden relative">
                  
                  {/* WRITING editor panel */}
                  {editorMode === 'write' && (
                    <div className="w-full h-full flex flex-col justify-between overflow-hidden">
                      {/* Workspace Co-Pilot Block Insertion Bar */}
                      <div className="flex gap-1.5 items-center justify-between flex-wrap p-2 mb-2 rounded-xl bg-stone-950 border border-stone-850 select-none">
                        <div className="flex gap-1.5 items-center flex-wrap">
                          <span className="text-[7.5px] font-mono text-[#F59E0B] uppercase tracking-widest font-black mr-1">Insert Blocks:</span>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('header')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            H2 Header
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('tip')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            💡 Callout Tip
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('warning')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            ⚠️ Warning
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('table')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            📊 Table
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('todo')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            ☑ To-do task
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('code')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            💻 Code script
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertTemplateBlock('divider')}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[8.5px] font-bold text-stone-200 rounded border border-stone-800 cursor-pointer"
                          >
                            ― Divider
                          </button>
                        </div>

                        {/* Page Counters */}
                        <div className="text-[8px] font-mono text-stone-400 space-x-2 mr-1">
                          <span>words: {editingBody ? editingBody.trim().split(/\s+/).filter(Boolean).length : 0}</span>
                          <span>•</span>
                          <span>chars: {editingBody ? editingBody.length : 0}</span>
                          <span>•</span>
                          <span className="text-amber-500 font-bold">{Math.ceil((editingBody ? editingBody.trim().split(/\s+/).filter(Boolean).length : 0) / 225)}m read</span>
                        </div>
                      </div>

                      <textarea 
                        rows={10}
                        value={editingBody}
                        onChange={e => setEditingBody(e.target.value)}
                        placeholder="# Strategic Guide Header&#10;> [!tip]&#10;💡 Custom tips summary info&#10;&#10;| Phase | Value | Status |&#10;|---|---|---|&#10;| Draft Q1 | $4,500 | in-flight |&#10;&#10;- Align communication courier routes&#10;- [ ] Checklist draft milestones"
                        className={`w-full p-4 font-mono text-[11px] rounded-xl focus:outline-none leading-relaxed h-full resize-none flex-grow ${inputBgCls}`}
                      />
                      
                      {/* Quick Helpers Ribbon inside editor */}
                      <div className="flex gap-2.5 items-center flex-wrap mt-2 select-none bg-stone-950/40 p-2.5 rounded-xl border border-stone-850">
                        <span className="text-[7.5px] font-mono text-stone-500 uppercase tracking-widest font-bold">Aria AI Help:</span>
                        
                        <button 
                          onClick={() => handleAiCommand('summarize')}
                          className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[8.5px] font-black uppercase tracking-wider rounded border border-amber-550/10 cursor-pointer transition-colors"
                        >
                          ✨ Summarize Page
                        </button>
                        <button 
                          onClick={() => handleAiCommand('polish')}
                          className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[8.5px] font-black uppercase tracking-wider rounded border border-amber-550/10 cursor-pointer transition-colors"
                        >
                          🚀 Polish Tone
                        </button>
                        <button 
                          onClick={() => handleAiCommand('tasks')}
                          className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[8.5px] font-black uppercase tracking-wider rounded border border-amber-550/10 cursor-pointer transition-colors"
                        >
                          📝 Extract Tasks
                        </button>
                        <button 
                          onClick={() => handleAiCommand('align')}
                          className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[8.5px] font-black uppercase tracking-wider rounded border border-amber-550/10 cursor-pointer transition-colors"
                        >
                          📊 Align Table
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PREVIEW beautiful HTML view */}
                  {editorMode === 'preview' && (
                    <div className="w-full h-full p-5 rounded-xl border border-stone-800 bg-stone-950/65 overflow-y-auto font-sans leading-relaxed text-stone-100 select-text pr-2 scrollbar-thin scrollbar-thumb-stone-800">
                      <div>
                        {renderMarkdown(editingBody)}
                      </div>

                      {/* Embed Canvas Sketch preview at the bottom in Markdown view! */}
                      {notes.find(n => n.id === activeNoteId)?.sketch && (
                        <div className="mt-6 pt-4 border-t border-dashed border-stone-805/60 select-none">
                          <span className="text-[7px] uppercase font-mono text-amber-500 block mb-2 tracking-widest">Embedded Strategy white sketchboard illustration</span>
                          <div className="p-1 rounded bg-stone-900/40 border border-stone-850">
                            <img 
                              src={notes.find(n => n.id === activeNoteId)!.sketch} 
                              alt="Whiteboard strategic drawing" 
                              className="w-full max-h-[160px] object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* WHITEBOARD sketchpad engine canvas */}
                  {editorMode === 'whiteboard' && (
                    <div className="w-full h-full flex flex-col justify-between bg-stone-950 border border-stone-850 rounded-xl overflow-hidden">
                      <div className="relative flex-grow">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={280}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="w-full h-full cursor-crosshair block"
                        />
                        <div className="absolute top-2 left-2 p-2 bg-stone-900/90 rounded-lg text-[8px] tracking-wide uppercase text-stone-400 font-mono select-none pointer-events-none">
                          Draw strategies directly inside note draft canvas
                        </div>
                      </div>

                      {/* Whiteboard Palette controls */}
                      <div className="p-2.5 bg-stone-900 border-t border-stone-800 flex justify-between items-center flex-wrap gap-2 text-xs select-none">
                        <div className="flex gap-1.5 items-center">
                          <button 
                            onClick={() => {
                              setToolMode('draw');
                              setBrushColor('#F59E0B');
                            }}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${brushColor === '#F59E0B' && toolMode !== 'erase' ? 'bg-amber-500 border-amber-500 text-black' : 'bg-stone-950 border-stone-800 text-stone-400'}`}
                          >
                            Amber
                          </button>
                          <button 
                            onClick={() => {
                              setToolMode('draw');
                              setBrushColor('#10B981'); // Emerald
                            }}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${brushColor === '#10B981' && toolMode !== 'erase' ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-stone-950 border-stone-800 text-stone-405'}`}
                          >
                            Emerald
                          </button>
                          <button 
                            onClick={() => {
                              setToolMode('draw');
                              setBrushColor('#EF4444'); // Crimson
                            }}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${brushColor === '#EF4444' && toolMode !== 'erase' ? 'bg-red-500 border-red-500 text-white' : 'bg-stone-950 border-stone-800 text-stone-405'}`}
                          >
                            Crimson
                          </button>
                          <button 
                            onClick={() => {
                              setToolMode('draw');
                              setBrushColor('#3B82F6'); // Ocean Blue
                            }}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${brushColor === '#3B82F6' && toolMode !== 'erase' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-stone-950 border-stone-800 text-stone-405'}`}
                          >
                            Ocean
                          </button>
                          <button 
                            onClick={() => {
                              setToolMode('draw');
                              setBrushColor('#FFFFFF'); // Slate white
                            }}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${brushColor === '#FFFFFF' && toolMode !== 'erase' ? 'bg-white border-white text-black' : 'bg-stone-950 border-stone-800 text-stone-405'}`}
                          >
                            White
                          </button>
                        </div>

                        <div className="flex gap-1.5 items-center font-mono">
                          <button
                            onClick={() => setToolMode('erase')}
                            className={`p-1 px-2 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-0.5 ${toolMode === 'erase' ? 'bg-red-500 border-red-500 text-white font-extrabold' : 'bg-stone-950 border-stone-800 text-stone-405'}`}
                          >
                            <Eraser size={10} /> Eraser
                          </button>
                          
                          <select
                            value={brushWidth}
                            onChange={(e) => setBrushWidth(Number(e.target.value))}
                            className="p-1 text-[8.5px] bg-stone-950 border border-stone-800 rounded text-stone-300 focus:outline-none focus:border-amber-500 font-bold"
                          >
                            <option value={2}>S Stroke</option>
                            <option value={4}>M Stroke</option>
                            <option value={8}>L Stroke</option>
                            <option value={15}>XL Stroke</option>
                          </select>

                          <button 
                            onClick={clearCanvas}
                            className="p-1 px-2 text-[8px] font-black uppercase text-red-500 border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 rounded-lg cursor-pointer transition-colors"
                          >
                            Clear View
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Savers and export bottom toolbar element */}
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-stone-850 mt-4 select-none">
                <button 
                  onClick={() => handleDeleteNote(activeNoteId)}
                  className="p-1.5 px-3 bg-red-500/15 border border-red-500/10 text-red-505 hover:bg-red-500/30 text-[10px] rounded-lg transition-colors cursor-pointer font-bold"
                >
                  Delete Draft Page
                </button>
                
                <div className="flex gap-2.5">
                  <button 
                    onClick={downloadNotesAsTxt}
                    className="p-2 bg-stone-850 hover:bg-stone-750 text-white border border-stone-800 text-[10px] font-black uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    title="Export draft record to disk"
                  >
                    <Download size={13} /> Export Draft
                  </button>
                  <button 
                    onClick={handleSaveNote}
                    className="p-2 px-5 bg-amber-550 hover:bg-amber-450 text-black text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    title="Save current workspace drafting note"
                  >
                    <Save size={13} /> Save Document
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
