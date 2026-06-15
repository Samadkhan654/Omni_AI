import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  Phone,
  Heart,
  FileSpreadsheet
} from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  account: string;
  dateCreated: string;
  status: 'Active' | 'Disengaged' | 'Pending';
  tags: string[];
  healthScore: number; // 0-100 scale human metric
}

interface ContactsHubProps {
  theme: 'light' | 'dark';
  syncedContacts: Array<{ name: string; phone: string; email: string; tag: string }>;
  setSyncedContacts: React.Dispatch<React.SetStateAction<Array<{ name: string; phone: string; email: string; tag: string }>>>;
  showToast: (msg: string) => void;
  onTriggerCall?: (phone: string) => void;
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
}

export default function ContactsHub({ 
  theme, 
  syncedContacts, 
  setSyncedContacts, 
  showToast, 
  onTriggerCall,
  isSimulatingLive,
  setIsSimulatingLive
}: ContactsHubProps) {
  const isDark = true; // Premium sleek high-contrast charcoal black style
  
  // Real initial structured data with Customer Health Score mapping
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'samad_1',
      firstName: 'Samad Khan',
      lastName: 'Sameer Khan',
      email: 'samadkhansameerkhan@gmail.com',
      phone: '+1 (555) 019-2834',
      account: 'Sameer Enterprises',
      dateCreated: '06/09/2026',
      status: 'Active',
      tags: ['Loyalist', 'VIP Owner'],
      healthScore: 98 // Highly stable customer
    },
    {
      id: 'c_2',
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 'sarah.m@retailcloud.io',
      phone: '+44 (20) 7946-0958',
      account: 'Miller Logistics',
      dateCreated: '05/12/2026',
      status: 'Pending',
      tags: ['Standard', 'New Signup'],
      healthScore: 72 // Warning stage
    },
    {
      id: 'c_3',
      firstName: 'Liam',
      lastName: 'Neeson',
      email: 'liam.n@takenoutlet.co.uk',
      phone: '+44 (77) 0090-0077',
      account: 'Action Sourcing Ltd',
      dateCreated: '04/10/2026',
      status: 'Active',
      tags: ['Wholesale'],
      healthScore: 88 // Strong value
    },
    {
      id: 'c_4',
      firstName: 'Amanda',
      lastName: 'Croft',
      email: 'croft.amanda@tombraider.com',
      phone: '+1 (310) 555-0143',
      account: 'Adventure Expeditions',
      dateCreated: '02/14/2026',
      status: 'Disengaged',
      tags: ['Churn Risk'],
      healthScore: 34 // Critical Churn Risk!
    }
  ]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('Any');
  const [linesPerPage, setLinesPerPage] = useState<20 | 50>(20);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  // Add Contact Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newHealthScore, setNewHealthScore] = useState<number>(80);

  // CSV Reader States
  const [showImporter, setShowImporter] = useState(false);
  const [pastedCSV, setPastedCSV] = useState('');

  // Add Contact Single Handler
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirst.trim() || !newEmail.trim()) {
      showToast("⚠️ Customer First Name and Email are required properties.");
      return;
    }

    const created: Contact = {
      id: `c_${Date.now()}`,
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || 'No Phone Registered',
      account: newAccount.trim() || 'Standard Retail Account',
      dateCreated: new Date().toLocaleDateString('en-GB'),
      status: newHealthScore < 50 ? 'Disengaged' : 'Active',
      tags: newTagInput ? newTagInput.split(',').map(t => t.trim()) : ['Manual Entry'],
      healthScore: Number(newHealthScore) || 80
    };

    setContacts(prev => [created, ...prev]);
    setSyncedContacts(prev => [
      { name: `${created.firstName} ${created.lastName}`, phone: created.phone, email: created.email, tag: created.tags[0] || 'Sync' },
      ...prev
    ]);

    // Cleanup
    setNewFirst('');
    setNewLast('');
    setNewEmail('');
    setNewPhone('');
    setNewAccount('');
    setNewTagInput('');
    setNewHealthScore(80);
    setShowAddModal(false);
    showToast(`👤 Created People profile: ${created.firstName} ${created.lastName} with health index: ${created.healthScore}/100.`);
  };

  // Append priorities in bulk tags
  const handleBulkTagAppend = () => {
    if (selectedContactIds.length === 0) {
      showToast("⚠️ Select at least one customer row.");
      return;
    }
    setContacts(prev => prev.map(c => 
      selectedContactIds.includes(c.id) 
        ? { ...c, tags: Array.from(new Set([...c.tags, 'Priority Hub'])) } 
        : c
    ));
    showToast(`🏷️ Injected 'Priority Hub' segmentation tag across ${selectedContactIds.length} profiles.`);
    setSelectedContactIds([]);
  };

  // Process Import CSV
  const handleCSVImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedCSV.trim()) {
      showToast("⚠️ Paste comma-separated text lines first.");
      return;
    }

    const rows = pastedCSV.split('\n');
    const parsed: Contact[] = [];
    let count = 0;

    rows.forEach((ln, rIdx) => {
      const parts = ln.split(',');
      if (parts.length >= 3) {
        const first = parts[0]?.trim();
        const last = parts[1]?.trim() || '';
        const email = parts[2]?.trim();
        const phone = parts[3]?.trim() || '+1 (555) 000-0192';
        const account = parts[4]?.trim() || 'Imported Wholesale Account';
        const score = parts[5] ? parseInt(parts[5].trim(), 10) : 85;

        if (first && email) {
          parsed.push({
            id: `imported_${Date.now()}_${rIdx}`,
            firstName: first,
            lastName: last,
            email: email,
            phone: phone,
            account: account,
            dateCreated: new Date().toLocaleDateString('en-GB'),
            status: score < 50 ? 'Disengaged' : 'Active',
            tags: ['Bulk CSVImport'],
            healthScore: isNaN(score) ? 85 : score
          });
          count++;
        }
      }
    });

    if (parsed.length > 0) {
      setContacts(prev => [...parsed, ...prev]);
      setPastedCSV('');
      setShowImporter(false);
      showToast(`⚡ Multi-profile importer complete: Loaded ${count} contacts into People Hub!`);
    } else {
      showToast("⚠️ Format error: Verify FirstName, LastName, Email, Phone, Company, HealthScore pattern.");
    }
  };

  // Selections helper
  const handleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter application
  const filteredContacts = contacts.filter(c => {
    const term = searchQuery.toLowerCase();
    const matchSearch = 
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.account.toLowerCase().includes(term);

    const matchTag = activeTagFilter === 'All' || c.tags.includes(activeTagFilter);
    const matchStatus = activeStatusFilter === 'Any' || c.status === activeStatusFilter;

    return matchSearch && matchTag && matchStatus;
  }).slice(0, linesPerPage);

  const allUniqueTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  const cardStyle = isDark ? 'bg-[#181614] border-stone-855 border-stone-800/80 text-white shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-sm';
  const inputStyle = 'bg-stone-950/80 border-stone-800 text-white rounded-xl placeholder-stone-600 focus:outline-none focus:border-amber-500/50';

  // Return Customer Health status badge color rules
  const getHealthBadgeCSS = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-y-auto pr-1 pb-6 scrollbar-thin">
      
      {/* Upper Title and Header Actions bar */}
      <div className={`p-5 rounded-[24px] border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${cardStyle}`}>
        <div>
          <div className="flex items-center gap-2 mb-1 bg-transparent select-none">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Users size={14} /></span>
            <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest block">Operational CRM Interface</span>
          </div>
          <h2 className="text-lg font-black tracking-tight leading-none text-white uppercase font-sans">
            People Hub <span className="text-stone-400 font-mono font-semibold ml-1">({isSimulatingLive ? contacts.length : 0} total profiles)</span>
          </h2>
          <p className="text-[10.5px] text-stone-300 mt-1">
            Track retention indexing, VIP loyalty lifespans, and real-time <strong className="text-amber-500">Customer Health Scores</strong> calculated by Aria.
          </p>
        </div>

        <div className="flex items-center gap-2 select-none">
          <button 
            onClick={() => setShowImporter(!showImporter)}
            className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={12} />
            <span>CSV Importer</span>
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-450 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md cursor-pointer inline-flex items-center gap-1 hover:scale-102"
          >
            <Plus size={11} className="stroke-[3]" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* CSV Bulk Importer Node */}
      {showImporter && (
        <form onSubmit={handleCSVImport} className={`p-5 rounded-2xl border space-y-3 ${cardStyle}`}>
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">Bulk Data CSV Import Node</h3>
            <p className="text-[10.5px] text-stone-300 mt-0.5">Paste comma-separated rows. Required pattern order: <code>First Name, Last Name, Email, Phone, Company, HealthScore</code></p>
          </div>
          <textarea
            rows={4}
            value={pastedCSV}
            onChange={e => setPastedCSV(e.target.value)}
            placeholder="Arthur, Dent, arthur@betelgeuse.com,+15551928,Dent Auto Supplies, 95&#10;Tricia, McMillan, tricia@earthmail.org,+1312389,Heart of Gold inc, 42"
            className={`w-full p-3 font-mono text-xs border ${inputStyle}`}
          />
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setShowImporter(false)} 
              className="px-3 py-1.5 text-xs font-bold text-stone-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 bg-amber-500 text-black font-black uppercase text-xs rounded-xl hover:bg-amber-450 transition-all cursor-pointer"
            >
              Parse and Load Records
            </button>
          </div>
        </form>
      )}

      {/* Add Single Contact Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className={`p-6 rounded-[28px] border shadow-2xl max-w-md w-full relative ${cardStyle}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 tool-yellow-400 to-amber-650 rounded-t-[28px]"></div>
            
            <div className="flex justify-between items-start bg-transparent mb-2">
              <div>
                <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-500 font-mono block">Register Single stakeholder</span>
                <h3 className="text-md font-black text-white font-sans uppercase">Create People Profile</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 px-2 hover:bg-stone-800 rounded text-stone-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="First name *" 
                  required
                  value={newFirst}
                  onChange={e => setNewFirst(e.target.value)}
                  className={`p-2.5 text-xs border ${inputStyle}`}
                />
                <input 
                  type="text" 
                  placeholder="Last name" 
                  value={newLast}
                  onChange={e => setNewLast(e.target.value)}
                  className={`p-2.5 text-xs border ${inputStyle}`}
                />
              </div>

              <input 
                type="email" 
                placeholder="E-mail address *" 
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className={`p-2.5 text-xs border w-full ${inputStyle}`}
              />

              <input 
                type="text" 
                placeholder="Phone (e.g. +44 20 7946 0958)" 
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className={`p-2.5 text-xs border w-full ${inputStyle}`}
              />

              <input 
                type="text" 
                placeholder="Account / Enterprise (e.g. Miller Logistics)" 
                value={newAccount}
                onChange={e => setNewAccount(e.target.value)}
                className={`p-2.5 text-xs border w-full ${inputStyle}`}
              />

              {/* Health Score Slider input */}
              <div className="bg-[#12100f] p-3 rounded-2xl border border-stone-800/60 space-y-1.5">
                <div className="flex justify-between items-center bg-transparent">
                  <label className="text-[10px] font-black uppercase text-stone-300 font-mono">Assigned Customer Health Score</label>
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black ${
                    newHealthScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' : newHealthScore >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-00'
                  }`}>{newHealthScore} / 100</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="100"
                  value={newHealthScore}
                  onChange={e => setNewHealthScore(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-auto"
                />
                <div className="flex justify-between items-center text-[8.5px] font-bold text-stone-500">
                  <span>Critical Churn Risk</span>
                  <span>Average Warning</span>
                  <span>Perfect Retention Health</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono font-black uppercase text-stone-400 block mb-1">Tags (Comma-Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. VIP, Wholesale" 
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  className={`p-2.5 text-xs border w-full ${inputStyle}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800/80">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-stone-400 font-bold hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-amber-500 text-black font-black uppercase text-xs rounded-xl hover:bg-amber-450 transition-all cursor-pointer shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!isSimulatingLive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-[28px] border border-dashed border-amber-500/25 bg-stone-900/10 font-sans select-none max-w-xl mx-auto my-12 w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 shadow-inner">
            <Users size={30} className="animate-pulse" />
          </div>
          <h3 className="text-base font-black uppercase text-stone-100 tracking-wider">Contact CRM Offline</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed max-w-sm">
            Unified Customer Relationship Management (CRM) tracking is currently on STANDBY. Establish your WebSocket and Server-Sent Events pipeline stream to sync CRM contacts in real-time.
          </p>
          <button
            onClick={() => {
              setIsSimulatingLive(true);
              localStorage.setItem('omni_dashboard_simulating', 'true');
              showToast("📡 Contact CRM synced with websocket stream!");
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-450 text-black text-[10.5px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/10 active:scale-97"
          >
            🔌 Link Live SSE Stream
          </button>
        </div>
      ) : (
        <>
          {/* Control Filters Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${cardStyle}`}>
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase text-stone-400 font-mono">Tags:</span>
            <select 
              value={activeTagFilter} 
              onChange={e => setActiveTagFilter(e.target.value)}
              className="p-1.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer text-left"
            >
              <option value="All">All Tags</option>
              {allUniqueTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase text-stone-400 font-mono">Status Selector:</span>
            <select 
              value={activeStatusFilter} 
              onChange={e => setActiveStatusFilter(e.target.value)}
              className="p-1.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="Any">Any Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Disengaged">Disengaged</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase text-stone-400 font-mono">Page size:</span>
            <select 
              value={linesPerPage} 
              onChange={e => setLinesPerPage(Number(e.target.value) as 20 | 50)}
              className="p-1.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

        </div>

        {/* CRM Search Field */}
        <div className="relative w-full sm:w-64 select-none">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={13} />
          <input 
            type="text"
            placeholder="Search matching accounts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/40"
          />
        </div>
      </div>

      {/* Mass Action Selected Controls */}
      {selectedContactIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/20 flex justify-between items-center text-xs animate-fadeIn select-none">
          <span className="font-bold text-amber-500 flex items-center gap-1">✨ selected {selectedContactIds.length} customer records</span>
          <div className="flex gap-2">
            <button 
              onClick={handleBulkTagAppend}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-450 text-black font-black uppercase text-[10px] rounded-lg tracking-wider transition-all cursor-pointer"
            >
              Bulk Tag Append
            </button>
            <button 
              onClick={() => {
                setContacts(prev => prev.filter(c => !selectedContactIds.includes(c.id)));
                setSelectedContactIds([]);
                showToast("🗑️ Erased selected active accounts from CRM buffer.");
              }}
              className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-black uppercase text-[10px] rounded-lg transition-all cursor-pointer"
            >
              Erase Selected
            </button>
          </div>
        </div>
      )}

      {/* Main CRM Spreadsheet Table Display */}
      <div className={`border rounded-2xl overflow-hidden ${cardStyle}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="border-b font-extrabold uppercase tracking-wider text-[10px] text-stone-400 bg-stone-950/50 border-stone-800">
                <th className="p-4 w-10 text-center select-none">
                  <input 
                    type="checkbox"
                    checked={selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Customer Health Score</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Active Phone</th>
                <th className="p-4">Linked Account / Company</th>
                <th className="p-4">Profile Created</th>
                <th className="p-4">Segment Tags</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center select-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850 bg-black/15">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-stone-500 italic font-mono select-none">
                    No active stakeholder profiles matches selected criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.015] transition-colors leading-relaxed">
                    <td className="p-4 text-center select-none">
                      <input 
                        type="checkbox"
                        checked={selectedContactIds.includes(c.id)}
                        onChange={() => handleToggleSelectOne(c.id)}
                        className="accent-amber-500 rounded cursor-pointer"
                      />
                    </td>
                    
                    {/* Customer Name */}
                    <td className="p-4 font-black text-stone-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-[10px] text-amber-500 font-serif font-black select-none">
                        {c.firstName[0]}{c.lastName[0] || ''}
                      </div>
                      <span>{c.firstName} {c.lastName}</span>
                    </td>

                    {/* Customer Health Score pill & visual bar */}
                    <td className="p-4 select-none">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-black tracking-wider border text-center min-w-[50px] ${getHealthBadgeCSS(c.healthScore)}`}>
                          {c.healthScore}%
                        </span>
                        
                        {/* Horizontal Health rating mini visual scale bar */}
                        <div className="w-16 h-1 rounded-full bg-stone-800 overflow-hidden shrink-0 hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${
                              c.healthScore >= 80 ? 'bg-emerald-500' : c.healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${c.healthScore}%` }}
                          />
                        </div>

                        {c.healthScore < 50 && (
                          <Heart size={10} className="text-red-500 fill-red-500/20 shrink-0 animate-pulse" title="Needs immediate engagement campaign assistance" />
                        )}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 font-mono text-stone-300">{c.email}</td>

                    {/* Phone + Action Dial */}
                    <td className="p-4 font-mono text-stone-300">
                      <div className="flex items-center gap-1.5">
                        <span>{c.phone}</span>
                        {onTriggerCall && (
                          <button
                            onClick={() => onTriggerCall(c.phone)}
                            className="p-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded transition-all cursor-pointer hover:scale-105"
                            title="Dial stakeholder via co-pilot gateway"
                          >
                            <Phone size={10} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Linked Enterprise Company */}
                    <td className="p-4 text-stone-200 font-medium font-sans">{c.account}</td>

                    {/* Date */}
                    <td className="p-4 font-mono text-stone-400">{c.dateCreated}</td>

                    {/* Tags */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.2 bg-[#1f1a16] border border-amber-500/10 text-amber-500 text-[8px] font-mono font-black uppercase rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                        c.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : c.status === 'Pending' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Action Erasures */}
                    <td className="p-4 text-center select-none">
                      <button 
                        onClick={() => {
                          setContacts(prev => prev.filter(item => item.id !== c.id));
                          showToast(`🗑️ Erased CRM entry: ${c.firstName} ${c.lastName}.`);
                        }}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Spreadsheet Footer status bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-[9.5px] font-mono font-bold text-stone-400 flex justify-between items-center select-none">
          <span>Displaying {filteredContacts.length} of {contacts.length} entries registered inside database</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Database Node Synchronization checked & fully operational
          </span>
        </div>
      </div>
      </>
      )}

    </div>
  );
}
