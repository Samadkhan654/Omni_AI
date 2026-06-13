import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Plus, 
  SlidersHorizontal, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Download, 
  Sparkles, 
  Layers, 
  ChevronDown,
  Phone
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
}

interface ContactsHubProps {
  theme: 'light' | 'dark';
  syncedContacts: Array<{ name: string; phone: string; email: string; tag: string }>;
  setSyncedContacts: React.Dispatch<React.SetStateAction<Array<{ name: string; phone: string; email: string; tag: string }>>>;
  showToast: (msg: string) => void;
  onTriggerCall?: (phone: string) => void;
}

export default function ContactsHub({ theme, syncedContacts, setSyncedContacts, showToast, onTriggerCall }: ContactsHubProps) {
  const isDark = true; // Forced premium high-contrast dark style with beautiful white text
  
  // High fidelity default mock including user's specific requested email & metadata
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'samad_1',
      firstName: 'Samad Khan',
      lastName: 'Sameer Khan',
      email: 'samadkhansameerkhan@gmail.com',
      phone: '+1 (555) 019-2834',
      account: 'Sameer Enterprises',
      dateCreated: '06/09/2026 17:46',
      status: 'Active',
      tags: ['Loyalist', 'VIP Owner']
    },
    {
      id: 'c_2',
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 'sarah.m@retailcloud.io',
      phone: '+44 (20) 7946-0958',
      account: 'Miller Logistics',
      dateCreated: '05/12/2026 12:30',
      status: 'Pending',
      tags: ['Standard', 'New Signup']
    },
    {
      id: 'c_3',
      firstName: 'Liam',
      lastName: 'Neeson',
      email: 'liam.n@takenoutlet.co.uk',
      phone: '+44 (77) 0090-0077',
      account: 'Action Sourcing Ltd',
      dateCreated: '04/10/2026 09:15',
      status: 'Active',
      tags: ['Wholesale']
    },
    {
      id: 'c_4',
      firstName: 'Amanda',
      lastName: 'Croft',
      email: 'croft.amanda@tombraider.com',
      phone: '+1 (310) 555-0143',
      account: 'Adventure Expeditions',
      dateCreated: '02/14/2026 16:50',
      status: 'Disengaged',
      tags: ['Churn Risk']
    }
  ]);

  // UI state filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [activeListFilter, setActiveListFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('Any');
  const [linesPerPage, setLinesPerPage] = useState<20 | 50>(20);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  // Interactive create state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Importer state
  const [showImporter, setShowImporter] = useState(false);
  const [pastedCSV, setPastedCSV] = useState('');

  // Action: Add single contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirst.trim() || !newEmail.trim()) {
      showToast("⚠️ First Name and E-mail are strictly mandatory.");
      return;
    }

    const created: Contact = {
      id: `c_${Date.now()}`,
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || 'No Phone Registered',
      account: newAccount.trim() || 'Personal Account',
      dateCreated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      tags: newTagInput ? newTagInput.split(',').map(t => t.trim()) : ['New']
    };

    setContacts(prev => [created, ...prev]);
    
    // sync back to syncedContacts list in main layout
    setSyncedContacts(prev => [
      { name: `${created.firstName} ${created.lastName}`, phone: created.phone, email: created.email, tag: created.tags[0] || 'Sync' },
      ...prev
    ]);

    // reset fields
    setNewFirst('');
    setNewLast('');
    setNewEmail('');
    setNewPhone('');
    setNewAccount('');
    setNewTagInput('');
    setShowAddModal(false);
    showToast(`👤 Registered contact: ${created.firstName} ${created.lastName}`);
  };

  // Action: Mass operator "Change all" tag modifier
  const handleChangeAllTags = () => {
    if (selectedContactIds.length === 0) {
      showToast("⚠️ Please select one or more contacts first.");
      return;
    }
    setContacts(prev => prev.map(c => 
      selectedContactIds.includes(c.id) 
        ? { ...c, tags: [...Array.from(new Set([...c.tags, 'Priority Segment']))] } 
        : c
    ));
    showToast(`🏷️ Appended 'Priority Segment' tag to ${selectedContactIds.length} customer records.`);
    setSelectedContactIds([]);
  };

  // Action: Process CSV Importer
  const handleCSVImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedCSV.trim()) {
      showToast("⚠️ Paste formatted rows (e.g. Samad, Khan, samadkhansameerkhan@gmail.com) first.");
      return;
    }

    const lines = pastedCSV.split('\n');
    const parsed: Contact[] = [];
    let count = 0;

    lines.forEach(ln => {
      const parts = ln.split(',');
      if (parts.length >= 3) {
        const first = parts[0]?.trim();
        const last = parts[1]?.trim() || '';
        const email = parts[2]?.trim();
        const phone = parts[3]?.trim() || '+1 (555) 000-0000';
        const account = parts[4]?.trim() || 'Imported Merchant';

        if (first && email) {
          parsed.push({
            id: `csv_${Date.now()}_${count}`,
            firstName: first,
            lastName: last,
            email: email,
            phone: phone,
            account: account,
            dateCreated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            status: 'Active',
            tags: ['Imported', 'CSV List']
          });
          count++;
        }
      }
    });

    if (parsed.length > 0) {
      setContacts(prev => [...parsed, ...prev]);
      setPastedCSV('');
      setShowImporter(false);
      showToast(`⚡ Successfully imported ${count} fresh CRM profiles!`);
    } else {
      showToast("⚠️ Could not parse records. Ensure correct order: FirstName, LastName, Email, Phone, Company");
    }
  };

  // Toggler selection
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

  // Filtration logic
  const filteredContacts = contacts.filter(c => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.account.toLowerCase().includes(term);

    const matchesTag = activeTagFilter === 'All' || c.tags.includes(activeTagFilter);
    const matchesStatus = activeStatusFilter === 'Any' || c.status === activeStatusFilter;
    
    return matchesSearch && matchesTag && matchesStatus;
  }).slice(0, linesPerPage);

  // Available unique tags for filtration
  const allUniqueTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  const cardBgCls = isDark 
    ? 'bg-stone-900 border-stone-800 text-white' 
    : 'bg-white border-stone-200 text-[#1C1917]';
  const textMutedCls = isDark ? 'text-stone-300' : 'text-neutral-500';
  const inputBgCls = isDark ? 'bg-stone-950 border-stone-850 text-white rounded-2xl' : 'bg-neutral-50 border-neutral-200 text-[#1C1917] rounded-xl';

  return (
    <div className="space-y-4">

      {/* Main Stats Header */}
      <div className={`p-4 px-5 rounded-[24px] border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Users size={14} /></span>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider font-mono">HubSpot-Style CRM Suite</span>
          </div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            Contacts <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full text-xs font-black">({contacts.length})</span>
          </h2>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowImporter(!showImporter)}
            className={`px-3 py-1.5 border rounded-2xl text-[10px] font-black tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
              isDark ? 'bg-stone-800 hover:bg-stone-750 border-stone-750 text-white' : 'bg-stone-100 hover:bg-stone-150 border-stone-300 text-stone-700'
            }`}
          >
            <Upload size={12} /> {showImporter ? "Close Importer" : "CSV Importer"}
          </button>
          
          <button 
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-450 text-black text-[10px] font-black tracking-widest uppercase rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer hover:scale-102"
          >
            <Plus size={12} /> Add a Contact
          </button>
        </div>
      </div>

      {/* CSV Bulk Importer Panel */}
      {showImporter && (
        <form onSubmit={handleCSVImport} className={`p-6 rounded-2xl border ${cardBgCls} space-y-4`}>
          <div>
            <h3 className="font-bold text-sm">Bulk CRM Contact Importer</h3>
            <p className="text-xs text-neutral-400 mt-1">Paste plain-text CSV formatted rows. Order required: First Name, Last Name, Email, Phone, Account Name</p>
          </div>
          <textarea
            rows={4}
            value={pastedCSV}
            onChange={e => setPastedCSV(e.target.value)}
            placeholder="Samad,Khan,samadkhansameerkhan@gmail.com,+15551928,Sameer Corp&#10;Alice,Green,alice@greencloud.io,+1312389,Alice Craft Co"
            className={`w-full p-3 font-mono text-xs rounded-xl focus:outline-none ${inputBgCls}`}
          />
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setShowImporter(false)}
              className="px-3 py-1.5 text-xs text-stone-400 font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-1.5 bg-amber-500 text-black text-xs font-black uppercase rounded-lg shadow-sm"
            >
              Parse & Load Records
            </button>
          </div>
        </form>
      )}

      {/* Direct Add Contact Popup Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-250 flex items-center justify-center p-4">
          <div className={`p-6 rounded-[28px] border shadow-2xl max-w-md w-full ${cardBgCls}`}>
            <h3 className="text-lg font-black tracking-tight mb-2">Register Single CRM Contact</h3>
            <p className="text-xs text-neutral-450 mb-4">Add a new merchant, client profile or wholesale account directly below.</p>
            
            <form onSubmit={handleAddContact} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="First name *" 
                  required
                  value={newFirst}
                  onChange={e => setNewFirst(e.target.value)}
                  className={`p-2.5 text-xs rounded-lg focus:outline-none ${inputBgCls}`}
                />
                <input 
                  type="text" 
                  placeholder="Last name" 
                  value={newLast}
                  onChange={e => setNewLast(e.target.value)}
                  className={`p-2.5 text-xs rounded-lg focus:outline-none ${inputBgCls}`}
                />
              </div>
              <input 
                type="email" 
                placeholder="E-mail *" 
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className={`p-2.5 text-xs rounded-lg focus:outline-none w-full ${inputBgCls}`}
              />
              <input 
                type="text" 
                placeholder="Phone (e.g. +44 77 1234)" 
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className={`p-2.5 text-xs rounded-lg focus:outline-none w-full ${inputBgCls}`}
              />
              <input 
                type="text" 
                placeholder="Account / Store (e.g. Sameer Ent)" 
                value={newAccount}
                onChange={e => setNewAccount(e.target.value)}
                className={`p-2.5 text-xs rounded-lg focus:outline-none w-full ${inputBgCls}`}
              />
              <div>
                <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1.5">Quick Tags Selection (Toggle)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['VIP', 'Loyal', 'Standard', 'New Signup', 'Wholesale', 'Churn Risk', 'B2B', 'Premium'].map(preset => {
                    const currentTagsList = newTagInput.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                    const isSelected = currentTagsList.includes(preset.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => {
                          const currentTags = newTagInput.split(',')
                            .map(s => s.trim())
                            .filter(Boolean);
                          const idx = currentTags.findIndex(t => t.toLowerCase() === preset.toLowerCase());
                          if (idx > -1) {
                            currentTags.splice(idx, 1);
                          } else {
                            currentTags.push(preset);
                          }
                          setNewTagInput(currentTags.join(', '));
                        }}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                          isSelected 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : isDark 
                            ? 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white' 
                            : 'bg-stone-100 border-stone-300 text-stone-600 hover:text-black'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
                <input 
                  type="text" 
                  placeholder="Custom tags (or edit manually, comma separated)" 
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  className={`p-2.5 text-xs rounded-lg focus:outline-none w-full ${inputBgCls}`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-dashed border-stone-850 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-400"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-black font-black uppercase text-xs rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Area Grid */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBgCls}`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Tags Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-neutral-400">Tags:</span>
            <select 
              value={activeTagFilter} 
              onChange={e => setActiveTagFilter(e.target.value)}
              className={`p-1.5 text-xs rounded-lg border focus:outline-none ${inputBgCls}`}
            >
              <option value="All">All Tags</option>
              {allUniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* List Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-neutral-400">List Type:</span>
            <select 
              value={activeListFilter} 
              onChange={e => setActiveListFilter(e.target.value)}
              className={`p-1.5 text-xs rounded-lg border focus:outline-none ${inputBgCls}`}
            >
              <option value="All">All Lists</option>
              <option value="Wholesale">Wholesale Members</option>
              <option value="Retail">Retail Clients</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-neutral-400">Status:</span>
            <select 
              value={activeStatusFilter} 
              onChange={e => setActiveStatusFilter(e.target.value)}
              className={`p-1.5 text-xs rounded-lg border focus:outline-none ${inputBgCls}`}
            >
              <option value="Any">Any Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Disengaged">Disengaged</option>
            </select>
          </div>

          {/* Lines View Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-neutral-400">Lines:</span>
            <select 
              value={linesPerPage} 
              onChange={e => setLinesPerPage(Number(e.target.value) as 20 | 50)}
              className={`p-1.5 text-xs rounded-lg border focus:outline-none ${inputBgCls}`}
            >
              <option value={20}>20 lines</option>
              <option value={50}>50 lines</option>
            </select>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={13} />
          <input 
            type="text"
            placeholder="Search for contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none ${inputBgCls}`}
          />
        </div>
      </div>

      {/* Mass Actions bar if contacts selected */}
      {selectedContactIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/20 flex justify-between items-center text-xs">
          <span className="font-bold text-amber-500">Selected {selectedContactIds.length} profiles</span>
          <div className="flex gap-2">
            <button 
              onClick={handleChangeAllTags}
              className="px-3.5 py-1.5 bg-amber-500 text-black font-black uppercase text-[10px] rounded-lg tracking-wider"
            >
              Change All (Append Tag)
            </button>
            <button 
              onClick={() => {
                setContacts(prev => prev.filter(c => !selectedContactIds.includes(c.id)));
                setSelectedContactIds([]);
                showToast("🗑️ Mass deleted selected CRM accounts.");
              }}
              className="px-3.5 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-[10px] rounded-lg"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main CRM Table Database Display panel */}
      <div className={`border rounded-2xl overflow-hidden ${cardBgCls}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b font-extrabold uppercase tracking-wider text-[10px] text-stone-500 dark:text-stone-400 ${
                isDark ? 'bg-stone-950/40 border-stone-850' : 'bg-neutral-50 border-neutral-150'
              }`}>
                <th className="p-4 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="accent-amber-500 rounded"
                  />
                </th>
                <th className="p-4">First name & Last name</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Date of creation</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Account name</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-stone-850/50">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500 dark:text-stone-400 italic font-mono">
                    No active contacts matched current filters.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(c => (
                  <tr key={c.id} className="hover:bg-stone-500/[0.02]">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedContactIds.includes(c.id)}
                        onChange={() => handleToggleSelectOne(c.id)}
                        className="accent-amber-500 rounded"
                      />
                    </td>
                    <td className="p-4 font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neutral-900 border border-stone-800 flex items-center justify-center text-[10px] text-amber-500 font-extrabold select-none">
                        {c.firstName[0]}{c.lastName[0] || ''}
                      </div>
                      <span>{c.firstName} {c.lastName}</span>
                    </td>
                    <td className="p-4 font-mono text-stone-500 dark:text-stone-300">{c.email}</td>
                    <td className="p-4 text-stone-600 dark:text-stone-400 font-medium">{c.dateCreated}</td>
                    <td className="p-4 font-mono text-stone-700 dark:text-stone-300">
                      <div className="flex items-center gap-2">
                        <span>{c.phone}</span>
                        {onTriggerCall && (
                          <button
                            onClick={() => onTriggerCall(c.phone)}
                            className="p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded border border-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                            title="Dial stakeholder via co-pilot phone"
                          >
                            <Phone size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-stone-500 dark:text-stone-400">{c.account}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                        c.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : c.status === 'Pending' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-stone-500/10 text-stone-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => {
                          setContacts(prev => prev.filter(item => item.id !== c.id));
                          showToast(`🗑️ Erased ${c.firstName} from CRM ledger.`);
                        }}
                        className="p-1 text-red-500 hover:bg-red-550/10 rounded transition-all cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className={`p-4 border-t flex justify-between items-center text-xs font-bold ${
          isDark ? 'bg-stone-950/20 border-stone-850' : 'bg-neutral-50/50 border-neutral-150'
        }`}>
          <span className="text-neutral-450">{filteredContacts.length} of {contacts.length} entries listed</span>
          <span className="text-[10px] font-mono font-semibold text-neutral-450">Active CRM Sync Channel: SSL Verified</span>
        </div>
      </div>
    </div>
  );
}
