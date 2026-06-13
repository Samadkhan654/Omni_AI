import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Settings, Trash2, ArrowRight, Play, Check, AlertCircle, Zap, 
  MessageSquare, Send, Bell, UserCheck, ShieldAlert, 
  HelpCircle, Copy, Clock, Layers, Flame, FileText, CheckCircle2,
  Database, Mail, Webhook, Bot, PlayCircle, Code, Save, Eye,
  RefreshCw, ZoomIn, ZoomOut, Maximize, FileCode, CheckSquare, 
  ChevronRight, ArrowUpRight, PlusCircle, AlertTriangle
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'integration' | 'custom';
  title: string;
  desc: string;
  category: string;
  icon: React.ReactNode;
  iconBg: string;
  status: 'idle' | 'running' | 'success' | 'error';
  x: number;
  y: number;
  config: {
    [key: string]: any;
  };
  inputPayload: any;
  outputPayload: any;
  // connection references for the n8n-style graph
  connections: string[]; // target node IDs (for branched/logic, indices map to outcomes)
  errorFallbackId?: string; // n8n error handling route
}

interface WorkflowBuilderProps {
  theme: 'light' | 'dark';
  onTriggerToast: (msg: string) => void;
  tokenBalance?: number;
  consumeTokens?: (amount: number, reason: string) => void;
}

export default function WorkflowBuilder({ theme, onTriggerToast, tokenBalance, consumeTokens }: WorkflowBuilderProps) {
  const isDark = theme === 'dark';

  // Chained Workflow Sandbox interactive state variables (User request solution)
  const [workflowActiveView, setWorkflowActiveView] = useState<'canvas' | 'sandbox'>('canvas');
  const [sandboxSelectedPattern, setSandboxSelectedPattern] = useState<'linear' | 'parallel' | 'conditional'>('linear');
  const [sandboxExecutionState, setSandboxExecutionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [sandboxCurrentStepIdx, setSandboxCurrentStepIdx] = useState<number>(0);
  const [sandboxProgressPct, setSandboxProgressPct] = useState<number>(0);
  const [sandboxLogBuffer, setSandboxLogBuffer] = useState<{ time: string; text: string; status: 'info' | 'generating' | 'success' }[]>([
    { time: '12:00:00', text: 'Auto-Chaining Engine initialized. Select workflow pattern to simulate.', status: 'info' }
  ]);
  const [sandboxGeneratedOutputs, setSandboxGeneratedOutputs] = useState<{ [key: string]: string }>({});

  const handleRunChainedWorkflow = async () => {
    if (sandboxExecutionState === 'running') return;
    
    // Deduct tokens
    if (consumeTokens) {
      if ((tokenBalance ?? 100) < 15) {
        onTriggerToast("⚠️ Insufficient token balance to execute generative pipeline! Please check Token Balance.");
        return;
      }
      consumeTokens(15, "Executed Multi-Step Autochaining Flow Simulation");
    }
    
    setSandboxExecutionState('running');
    setSandboxCurrentStepIdx(0);
    setSandboxProgressPct(5);
    setSandboxGeneratedOutputs({});
    
    const nowTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Setup initial variables based on pattern
    let steps: { id: number; name: string; outputDesc: string; logLines: string[] }[] = [];
    
    if (sandboxSelectedPattern === 'linear') {
      steps = [
        { 
          id: 1, 
          name: "Generate CRM Setup Workspace", 
          outputDesc: "🎯 DB Schema initialized with 4 primary CRM modules, indexes fully indexed on foreign keys (customerRef), and automated leads-funnels triggers.",
          logLines: ["Booting operational container...", "Mapping db constraints...", "Compiling CRM pipeline rules..."]
        },
        { 
          id: 2, 
          name: "Deploy Inventory Module", 
          outputDesc: "📦 Inventory live sensors bound on London Central logistics nodes. Low-stock limits locked at 30 items per accessory. Auto-supplier webhooks live.",
          logLines: ["Reading Warehouse GPS Coordinates...", "Deploying low stock alert loops...", "Piping supplier WhatsApp webhooks..."]
        },
        { 
          id: 3, 
          name: "Generate Finance & CFO Analytics", 
          outputDesc: "📊 CFO financial ledger dials successfully mounted on CRM dashboard. Real-time cost-guard metrics active. Daily token budget usage sync active.",
          logLines: ["Compiling monthly invoice ledgers...", "Verifying Stripe transaction endpoints...", "Finalizing ROI calculations telemetry..."]
        }
      ];
    } else if (sandboxSelectedPattern === 'parallel') {
      steps = [
        { 
          id: 1, 
          name: "Parallel generation: CRM Workspace", 
          outputDesc: "⚡ Parallel execution #1 complete: Client metrics database mounted with absolute token constraints.",
          logLines: ["Parallel route A active...", "Mapping client profiles...", "Syncing metadata indices..."]
        },
        { 
          id: 2, 
          name: "Parallel generation: Inventory Modules", 
          outputDesc: "⚡ Parallel execution #2 complete: Accessory supply sensors calibrated. Logistics webhook routes locked.",
          logLines: ["Parallel route B active...", "Inspecting warehouse reserves...", "Mounting GPS couriers..."]
        },
        { 
          id: 3, 
          name: "Merge Joint Actions Flow Hub", 
          outputDesc: "🔗 Operations nodes successfully merged! Social Inbox omni-channels automatically unified with stock triggers.",
          logLines: ["Reading outputs from Route A and Route B...", "Merging schema dependencies...", "Broadcasting live system heartbeat..."]
        }
      ];
    } else {
      steps = [
        { 
          id: 1, 
          name: "Conditional Step: CRM Master Init", 
          outputDesc: "🟢 CRM Core active. Evaluated scenario trigger: Industry matches 'Retail Wholesale Supply'. Rerouting path.",
          logLines: ["Reading scenario JSON input...", "Branch evaluation active...", "Choice matches 'Retails' route..."]
        },
        { 
          id: 2, 
          name: "Branch Action: Generate Custom Inventory Hub", 
          outputDesc: "📦 Branch chosen: Customized E-commerce Inventory Module initialized instead of generic service scheduler.",
          logLines: ["Condition met: Rerouting generator...", "Deploying low-stock warning trigger...", "Skipping Booking scheduler..."]
        },
        { 
          id: 3, 
          name: "Merge Step: Render Operational Dashboard", 
          outputDesc: "📊 Combined outcome compiled: Standard CRM workspace + Custom Stock Tracker live widgets loaded in Owner profile.",
          logLines: ["Integrating custom widgets...", "Clearing temporary staging caches...", "Dashboard fully deployed!"]
        }
      ];
    }
    
    setSandboxLogBuffer([{ time: nowTime(), text: "🔥 Triggered Multi-Step Sequential Generation Loop", status: 'info' }]);
    
    // Simple helper function for delays inside async flow
    const runDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setSandboxCurrentStepIdx(i + 1);
      setSandboxProgressPct(Math.round(((i + 0.5) / steps.length) * 100));
      
      // Print logs step-by-step
      for (const line of step.logLines) {
        await runDelay(450);
        setSandboxLogBuffer(prev => [...prev, { time: nowTime(), text: `[${step.name}] ${line}`, status: 'generating' }]);
      }
      
      await runDelay(750);
      
      // Mark step completed & append output
      setSandboxGeneratedOutputs(prev => ({
        ...prev,
        [step.id]: step.outputDesc
      }));
      setSandboxLogBuffer(prev => [...prev, { time: nowTime(), text: `✅ [SUCCESS] Node generated: ${step.name}`, status: 'success' }]);
      setSandboxProgressPct(Math.round(((i + 1) / steps.length) * 100));
    }
    
    await runDelay(400);
    setSandboxExecutionState('completed');
    onTriggerToast("🎉 Platform Automations: Sequential Multi-Step flow completed automatically without click waiting!");
  };

  // State for Canvas scale & dimensions
  const [scale, setScale] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // States for natural-language builder and onboarding wizard
  const [nlPrompt, setNlPrompt] = useState('');
  const [showWizardPopup, setShowWizardPopup] = useState(false);
  
  // Custom execution sandbox logs
  const [executionLogs, setExecutionLogs] = useState<{ time: string; type: 'info' | 'success' | 'warning' | 'error'; msg: string; nodeName?: string }[]>([
    { time: '16:47:00', type: 'info', msg: 'System automation container initialized and idling.' },
    { time: '16:47:15', type: 'success', msg: 'Webhooks endpoint listener bound securely to cloud ingress.' }
  ]);
  
  // Sandbox current run context
  const [sandboxCustomerInput, setSandboxCustomerInput] = useState<string>(
    JSON.stringify({
      customerName: "Eleanor Vance",
      membership: "Premium VIP",
      totalSpent: 480.50,
      daysSinceLastPurchase: 35,
      activeChatSentiment: 0.18, // 18% positive sentiment (frustrated)
      incomingOrderQuantity: 2
    }, null, 2)
  );

  // Default rich n8n nodes layout state
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'webhook-trigger',
      type: 'trigger',
      title: 'Stripe Webhook',
      desc: 'Starts on successful invoice event',
      category: 'Webhook Trigger',
      icon: <Webhook size={16} />,
      iconBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      status: 'idle',
      x: 40,
      y: 120,
      config: {
        path: '/v1/stripe/checkout',
        method: 'POST',
        secretHeaders: true
      },
      inputPayload: {},
      outputPayload: {},
      connections: ['gemini-analyze']
    },
    {
      id: 'gemini-analyze',
      type: 'integration',
      title: 'Gemini AI Agent',
      desc: 'Predicts retention risk from logs',
      category: 'AI Sentiment Engine',
      icon: <Bot size={16} />,
      iconBg: isDark ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-100',
      status: 'idle',
      x: 270,
      y: 120,
      config: {
        model: 'gemini-2.5-flash',
        temperature: 0.2,
        systemPrompt: 'Extract churn warning status based on customer engagement variables.'
      },
      inputPayload: {},
      outputPayload: {},
      connections: ['logic-check-vip']
    },
    {
      id: 'logic-check-vip',
      type: 'logic',
      title: 'If VIP Customer',
      desc: 'Splits path by loyalty eligibility',
      category: 'Branching Switch',
      icon: <Layers size={16} />,
      iconBg: isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100',
      status: 'idle',
      x: 500,
      y: 120,
      config: {
        expression: 'input.membership === "Premium VIP" || input.totalSpent > 300',
        trueBranchName: 'True Branch (VIP Campaign)',
        falseBranchName: 'False Branch (Standard Flow)'
      },
      inputPayload: {},
      outputPayload: {},
      connections: ['reward-dispatch', 'operator-notify'] // index 0 is True, index 1 is False
    },
    {
      id: 'reward-dispatch',
      type: 'action',
      title: 'Send Reward Coupon',
      desc: 'Dispatches instant discount stamp via Social API',
      category: 'Coupon Agent',
      icon: <Mail size={16} />,
      iconBg: isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100',
      status: 'idle',
      x: 730,
      y: 40,
      config: {
        templateCode: 'VIP_STAMP_26',
        discountPercentage: 20
      },
      inputPayload: {},
      outputPayload: {},
      connections: []
    },
    {
      id: 'operator-notify',
      type: 'action',
      title: 'Alert Operator',
      desc: 'Pushes warning notice to standard CRM team',
      category: 'Operator Warning',
      icon: <Bell size={16} />,
      iconBg: isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100',
      status: 'idle',
      x: 730,
      y: 220,
      config: {
        priority: 'high',
        notificationPayload: 'Immediate outreach requested for churn probability.'
      },
      inputPayload: {},
      outputPayload: {},
      connections: []
    }
  ]);

  // Sidebar Toolbox node catalogs (categorized like n8n)
  const masterNodeCatalog = [
    {
      type: 'trigger',
      title: 'Cron Scheduler',
      desc: 'Emits triggers at regular intervals',
      category: 'Schedule Timer',
      icon: <Clock size={15} />,
      iconBg: 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400',
      config: { cron: '*/5 * * * *', runParallel: false }
    },
    {
      type: 'trigger',
      title: 'RetainFlow Event',
      desc: 'Fires when customer silent threshold is reached',
      category: 'Loyalty Tracker',
      icon: <UserCheck size={15} />,
      iconBg: 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400',
      config: { thresholdDays: 30 }
    },
    {
      type: 'integration',
      title: 'Gemini Text Gen',
      desc: 'Utilises Gemini models to generate drafts',
      category: 'AI Copilot',
      icon: <Bot size={15} />,
      iconBg: 'bg-purple-500/10 border border-purple-500/25 text-purple-400',
      config: { model: 'gemini-2.5', prompt: 'Summarise notes' }
    },
    {
      type: 'integration',
      title: 'WhatsApp Dispatch',
      desc: 'Sends WhatsApp templates to active lead numbers',
      category: 'Communication API',
      icon: <MessageSquare size={15} />,
      iconBg: 'bg-amber-500/10 border border-amber-500/25 text-amber-400',
      config: { template: 'win_back_gold' }
    },
    {
      type: 'integration',
      title: 'PostgreSQL Query',
      desc: 'Executes DQL/DML commands on relational DB',
      category: 'Data Storage',
      icon: <Database size={15} />,
      iconBg: 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400',
      config: { sql: 'SELECT * FROM crm_leads LIMIT 1;' }
    },
    {
      type: 'custom',
      title: 'JavaScript Code',
      desc: 'Evaluate customized JS transforms on data',
      category: 'Data Morph Node',
      icon: <Code size={15} />,
      iconBg: 'bg-pink-500/10 border border-pink-500/25 text-pink-400',
      config: { script: 'item.pointsAwarded = item.totalSpent * 10;\nreturn item;' }
    },
    {
      type: 'logic',
      title: 'Wait Interval',
      desc: 'Holds transaction state for designated delay',
      category: 'Timer Buffer',
      icon: <Clock size={15} />,
      iconBg: 'bg-blue-500/10 border border-blue-500/25 text-blue-400',
      config: { delayAmount: 12, delayUnit: 'hours' }
    }
  ];

  // Drag and drop / Canvas mouse coordinate logic
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCanvasMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const canvasElement = document.getElementById('n8n-canvas-board');
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();
    // Save starting offsets
    const nodeObj = nodes.find(n => n.id === nodeId);
    if (!nodeObj) return;
    setDragOffset({
      x: e.clientX - (nodeObj.x * scale),
      y: e.clientY - (nodeObj.y * scale)
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggingNodeId) return;
      const canvasElement = document.getElementById('n8n-canvas-board');
      if (!canvasElement) return;
      
      const newX = Math.max(10, Math.min(1000, Math.round((e.clientX - dragOffset.x) / scale)));
      const newY = Math.max(10, Math.min(800, Math.round((e.clientY - dragOffset.y) / scale)));

      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
    };

    const handleGlobalMouseUp = () => {
      if (draggingNodeId) {
        setDraggingNodeId(null);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingNodeId, dragOffset, scale]);

  // Node position nudging buttons for manual control
  const adjustNodePos = (id: string, dx: number, dy: number) => {
    setNodes(prev => prev.map(n => n.id === id ? {
      ...n,
      x: Math.max(10, Math.min(1000, n.x + dx)),
      y: Math.max(10, Math.min(800, n.y + dy))
    } : n));
  };

  const handleAddNodeFromToolbox = (tpl: typeof masterNodeCatalog[0]) => {
    const newId = `node-${tpl.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36).substr(0,4)}`;
    
    // Position newly created nodes adjacent to selected, or centered on board
    let newX = 300;
    let newY = 200;
    if (selectedNodeId) {
      const activeNode = nodes.find(n => n.id === selectedNodeId);
      if (activeNode) {
        newX = activeNode.x + 230;
        newY = activeNode.y + 40;
      }
    }

    const newNode: WorkflowNode = {
      id: newId,
      type: tpl.type as any,
      title: tpl.title,
      desc: tpl.desc,
      category: tpl.category,
      icon: tpl.icon,
      iconBg: isDark ? 'bg-stone-850 text-amber-500 border border-stone-820' : 'bg-slate-50 border border-slate-200 text-amber-600',
      status: 'idle',
      x: newX,
      y: newY,
      config: JSON.parse(JSON.stringify(tpl.config)),
      inputPayload: {},
      outputPayload: {},
      connections: []
    };

    // Auto chain connection if some node was previously selected and doesn't have connections
    const updatedNodes = [...nodes];
    if (selectedNodeId) {
      const parentObjIdx = updatedNodes.findIndex(n => n.id === selectedNodeId);
      if (parentObjIdx !== -1) {
        // If the current node is a logic node, it can take up to 2, or standard nodes take 1
        if (updatedNodes[parentObjIdx].type === 'logic') {
          updatedNodes[parentObjIdx].connections.push(newId);
          onTriggerToast(`Bound Node as logic conditional alternative!`);
        } else if (updatedNodes[parentObjIdx].connections.length === 0) {
          updatedNodes[parentObjIdx].connections.push(newId);
          onTriggerToast(`Connected Stripe/Webhook serial pipeline down to '${newNode.title}'!`);
        }
      }
    }

    setNodes([...updatedNodes, newNode]);
    setSelectedNodeId(newId);
    setExecutionLogs(prev => [
      {
        time: new Date().toTimeString().split(' ')[0],
        type: 'info',
        msg: `Added workflow operational node '${newNode.title}' on grid (${newX}px, ${newY}px).`
      },
      ...prev
    ]);
  };

  const deleteNode = (id: string) => {
    // Clean all connection paths leading to this node
    const filteredNodes = nodes.filter(n => n.id !== id).map(n => ({
      ...n,
      connections: n.connections.filter(conn => conn !== id)
    }));
    setNodes(filteredNodes);
    if (selectedNodeId === id) setSelectedNodeId(null);
    onTriggerToast(`Node successfully deleted.`);
    setExecutionLogs(prev => [
      { time: new Date().toTimeString().split(' ')[0], type: 'warning', msg: `Node: '${id}' was deleted from canvas environment.` },
      ...prev
    ]);
  };

  // Connect Two Nodes Manually input selection state
  const [connectSource, setConnectSource] = useState<string>('');
  const [connectTarget, setConnectTarget] = useState<string>('');

  const executeManualConnection = () => {
    if (!connectSource || !connectTarget) {
      onTriggerToast("⚠️ Select source and target nodes first.");
      return;
    }
    if (connectSource === connectTarget) {
      onTriggerToast("⚠️ Node cannot connect to itself.");
      return;
    }

    setNodes(prev => prev.map(n => {
      if (n.id === connectSource) {
        if (n.connections.includes(connectTarget)) return n;
        return {
          ...n,
          connections: [...n.connections, connectTarget]
        };
      }
      return n;
    }));

    onTriggerToast(`🔌 Connected ${connectSource} -> ${connectTarget}!`);
    setConnectSource('');
    setConnectTarget('');
  };

  // Full interactive system simulator execution logic
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [currentExecutionNodeIndex, setCurrentExecutionNodeIndex] = useState<string | null>(null);

  const triggerPipelineMock = async () => {
    let parsedInput: any;
    try {
      parsedInput = JSON.parse(sandboxCustomerInput);
    } catch(e) {
      onTriggerToast("❌ Invalid JSON schema defined in input box.");
      return;
    }

    setIsRunningPipeline(true);
    setExecutionLogs(prev => [
      { time: new Date().toTimeString().split(' ')[0], type: 'info', msg: '--- INITIATING n8n ENYME REPL PIPELINE ---' },
      ...prev
    ]);

    // Set all nodes to default idle state
    setNodes(curr => curr.map(n => ({ ...n, status: 'idle', inputPayload: {}, outputPayload: {} })));

    // Sequential chain trace
    // Webhook node is almost always the start
    let currentNodeId: string | null = 'webhook-trigger';
    if (!nodes.some(n => n.id === currentNodeId)) {
      // Find any node that does not have another node pointing to it as trigger
      const targetIds = new Set(nodes.flatMap(n => n.connections));
      const rootNode = nodes.find(n => !targetIds.has(n.id));
      currentNodeId = rootNode ? rootNode.id : (nodes[0]?.id || null);
    }

    let payload = { ...parsedInput };
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    while (currentNodeId) {
      const activeNode = nodes.find(n => n.id === currentNodeId);
      if (!activeNode) break;

      setCurrentExecutionNodeIndex(currentNodeId);
      // set status to running
      setNodes(curr => curr.map(n => n.id === activeNode.id ? { ...n, status: 'running' } : n));
      
      setExecutionLogs(prev => [
        { 
          time: new Date().toTimeString().split(' ')[0], 
          type: 'info', 
          msg: `Node [${activeNode.title}] executing with payload variables.`,
          nodeName: activeNode.title
        },
        ...prev
      ]);

      await sleep(1000);

      // Perform simulated logic based on node
      let output: any = {};
      let isError = false;

      if (activeNode.id === 'webhook-trigger') {
        output = {
          receivedAt: new Date().toISOString(),
          source: 'Stripe API Ingress Gateway',
          event: 'invoice.payment_succeeded',
          data: {
            customerCode: 'CUST-89301',
            raw: payload
          }
        };
      } else if (activeNode.id === 'gemini-analyze') {
        // AI Sentiment evaluate simulation
        const sentimentScore = payload.activeChatSentiment ?? 0.5;
        const churnProbability = sentimentScore < 0.3 ? "CRITICAL RISK (92%)" : sentimentScore < 0.6 ? "MODERATE RISK (54%)" : "STABLE COMPLIANT (12%)";
        output = {
          modelUsed: 'gemini-2.5-flash-autopilot',
          tokensProcessed: 1420,
          predictions: {
            classifiedSentiment: sentimentScore < 0.3 ? "Frustrated/Hostile" : "Inquisitive",
            churnProbability,
            actionRecommended: sentimentScore < 0.4 ? "TAG_VIP_DISCOUNT_TRIGGER" : "STANDARD_FOLLOWUP"
          }
        };
      } else if (activeNode.id === 'logic-check-vip') {
        // Condition branch code execution
        const isVip = payload.membership === 'Premium VIP' || (payload.totalSpent > 300);
        output = {
          conditionTested: 'membership === "Premium VIP" || totalSpent > 300',
          evaluationOutcome: isVip ? 'TRUE' : 'FALSE',
          targetRouteIndex: isVip ? 0 : 1
        };
      } else if (activeNode.id === 'reward-dispatch') {
        output = {
          dispatchedAt: new Date().toTimeString().split(' ')[0],
          status: 'SUCCESS',
          recipient: payload.customerName,
          smsDispatchCode: 'SMS-901-PROMO',
          couponAppended: 'VIP_STAMP_26'
        };
      } else if (activeNode.id === 'operator-notify') {
        output = {
          sentToChannels: ['Slack-Support-Omni', 'Dashboard-Alert-Desk'],
          criticality: 'URGENT_HANDOFF',
          payloadBody: `Outreach to ${payload.customerName} regarding recent transaction friction.`
        };
      } else if (activeNode.type === 'custom') {
        // Evaluate dynamic JS simulated
        try {
          const runFn = new Function('item', `try { ${activeNode.config.script ?? 'return item;'} } catch(e) { return { error: e.message } }`);
          output = runFn({ ...payload });
          if (output?.error) {
            output = { error: output.error };
            isError = true;
          }
        } catch(e: any) {
          output = { error: e.message };
          isError = true;
        }
      } else {
        // Default catch-all Mock values
        output = {
          status: 'success',
          synthesizedTime: Date.now(),
          passedPayload: { ...payload }
        };
      }

      const nodeOut = output; // Local copy to avoid closure issues
      const nodeInputData = { ...payload };

      setNodes(curr => curr.map(n => n.id === activeNode.id ? { 
        ...n, 
        status: isError ? 'error' : 'success', 
        inputPayload: nodeInputData,
        outputPayload: nodeOut 
      } : n));

      setExecutionLogs(prev => [
        { 
          time: new Date().toTimeString().split(' ')[0], 
          type: isError ? 'error' : 'success', 
          msg: isError 
            ? `Node [${activeNode.title}] runtime error: Script compile failed.` 
            : `Node [${activeNode.title}] completed successfully. Output: ${JSON.stringify(nodeOut).substring(0, 75)}...`,
          nodeName: activeNode.title
        },
        ...prev
      ]);

      // Move to next node
      if (isError) {
        // Halt
        currentNodeId = null;
      } else if (activeNode.id === 'logic-check-vip') {
        const branchIndex = (payload.membership === 'Premium VIP' || payload.totalSpent > 300) ? 0 : 1;
        currentNodeId = activeNode.connections[branchIndex] || null;
      } else {
        currentNodeId = activeNode.connections[0] || null;
      }

      // Propagate modified customer payload down the pipeline stream structure where applicable
      if (activeNode.type === 'custom') {
        payload = { ...payload, ...nodeOut };
      }

      await sleep(1000);
    }

    setIsRunningPipeline(false);
    setCurrentExecutionNodeIndex(null);
    onTriggerToast("🎯 Workflow execution complete! Active rules deployed successfully.");
    setExecutionLogs(prev => [
      { time: new Date().toTimeString().split(' ')[0], type: 'success', msg: '=== PIPELINE RUN FINISHED SECURELY — 0 ERRORS EXITED ===' },
      ...prev
    ]);
  };

  // Helper calculation for SVG handles to draw connected paths
  // standard visual nodes dimensions are max-w-sm / w-[220px] / h-[70px]
  const renderWires = useMemo(() => {
    return nodes.flatMap(node => {
      return node.connections.map((targetId, idx) => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        // Origin output coordinates: right center of the parent
        const outX = node.x + 220; 
        const outY = node.connections.length > 1
          ? node.y + 35 + (idx === 0 ? -12 : 12) // branch bifurcation spacing offsets
          : node.y + 35;

        // Destination input coordinates: left center of target node
        const inX = targetNode.x;
        const inY = targetNode.y + 35;

        // Bezier handle control points
        const flexFactor = Math.abs(inX - outX) * 0.4;
        const cp1x = outX + flexFactor;
        const cp1y = outY;
        const cp2x = inX - flexFactor;
        const cp2y = inY;

        const pathDefinition = `M ${outX} ${outY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${inX} ${inY}`;
        const isWireActive = currentExecutionNodeIndex === node.id || (node.status === 'success' && targetNode.status === 'running');

        return (
          <g key={`${node.id}-${targetId}-${idx}`}>
            {/* Outline highlight shadow back of paths */}
            <path
              d={pathDefinition}
              fill="none"
              stroke={isWireActive ? 'rgba(245, 158, 11, 0.4)' : isDark ? '#262422' : '#e5e7eb'}
              strokeWidth={isWireActive ? 5 : 3}
              className="transition-all"
            />
            {/* The primary line */}
            <path
              d={pathDefinition}
              fill="none"
              stroke={isWireActive ? '#f59e0b' : isDark ? '#a8a29e' : '#94a3b8'}
              strokeWidth={2}
              strokeDasharray={isWireActive ? '6,6' : '0'}
              strokeDashoffset={isWireActive ? '12' : '0'}
              className={isWireActive ? 'animate-dash-pipeline fill-none transition-all' : 'fill-none transition-all'}
            />
            {/* Glowing flowing circular particle to guide visual telemetry */}
            {isWireActive && (
              <circle r="4" fill="#fbbf24" className="animate-pulse">
                <animateMotion dur="1s" repeatCount="indefinite" path={pathDefinition} />
              </circle>
            )}
          </g>
        );
      });
    }).filter(g => g !== null);
  }, [nodes, currentExecutionNodeIndex, isDark]);

  // Selected Node Details
  const activeSelectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const handleNaturalLanguageBuild = () => {
    if (!nlPrompt.trim()) return;
    const prompt = nlPrompt.toLowerCase();
    
    let newGeneratedNodes: WorkflowNode[] = [];
    let logsToAdd: string[] = [];
    
    if (prompt.includes('stripe') || prompt.includes('webhook') || prompt.includes('invoice')) {
      newGeneratedNodes.push({
        id: 'stripe-trigger',
        type: 'trigger',
        title: 'Stripe Webhook',
        desc: 'Starts on successful invoice event',
        category: 'Webhook Trigger',
        icon: <Webhook size={16} />,
        iconBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        status: 'idle',
        x: 40,
        y: 120,
        config: { path: '/v1/stripe/checkout', method: 'POST', secretHeaders: true },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      logsToAdd.push("Spawning Stripe Webhook event listener.");
    } else if (prompt.includes('silent') || prompt.includes('inactive') || prompt.includes('days')) {
      newGeneratedNodes.push({
        id: 'silent-tracker',
        type: 'trigger',
        title: 'Client Silent Trigger',
        desc: 'Starts on client inactive duration limit',
        category: 'Retention Tracker',
        icon: <UserCheck size={16} />,
        iconBg: isDark ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' : 'bg-[#EFFAF0] text-emerald-600 border border-emerald-100',
        status: 'idle',
        x: 40,
        y: 120,
        config: { thresholdDays: 30 },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      logsToAdd.push("Spawning Client Inactive Monitor trigger.");
    } else {
      newGeneratedNodes.push({
        id: 'timer-trigger',
        type: 'trigger',
        title: 'Cron Scheduler',
        desc: 'Emits triggers regularly',
        category: 'Schedule Timer',
        icon: <Clock size={16} />,
        iconBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        status: 'idle',
        x: 40,
        y: 120,
        config: { cron: '*/5 * * * *' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      logsToAdd.push("Spawning Cron Scheduler Trigger node.");
    }

    let currentX = 280;
    let nextId = '';
    
    if (prompt.includes('gemini') || prompt.includes('ai') || prompt.includes('sentiment') || prompt.includes('analyze')) {
      nextId = 'gemini-analyze';
      newGeneratedNodes.push({
        id: 'gemini-analyze',
        type: 'integration',
        title: 'Gemini AI Agent',
        desc: 'Predicts retention risk from logs',
        category: 'AI Sentiment Engine',
        icon: <Bot size={16} />,
        iconBg: isDark ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-100',
        status: 'idle',
        x: currentX,
        y: 120,
        config: { model: 'gemini-2.5-flash', temperature: 0.2, systemPrompt: 'Analyze properties' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      newGeneratedNodes[0].connections.push(nextId);
      currentX += 240;
      logsToAdd.push("Connecting AI Sentiment Analyzer.");
    } else if (prompt.includes('js') || prompt.includes('calculate') || prompt.includes('code') || prompt.includes('transform')) {
      nextId = 'points-calculator';
      newGeneratedNodes.push({
        id: 'points-calculator',
        type: 'custom',
        title: 'Points Calculator',
        desc: 'Calculate points bonus per dollar spent',
        category: 'Data Morph Node',
        icon: <Code size={16} />,
        iconBg: isDark ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-pink-50 text-pink-600 border border-pink-100',
        status: 'idle',
        x: currentX,
        y: 120,
        config: { script: 'item.pointsAwarded = item.totalSpent * 10;\nreturn item;' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      newGeneratedNodes[0].connections.push(nextId);
      currentX += 240;
      logsToAdd.push("Connecting Custom JS Sandbox Morph.");
    }

    if (prompt.includes('if') || prompt.includes('condition') || prompt.includes('check') || prompt.includes('vip') || prompt.includes('logic')) {
      const branchId = 'logic-check-vip';
      newGeneratedNodes.push({
        id: branchId,
        type: 'logic',
        title: 'If VIP Customer',
        desc: 'Splits path dynamically by VIP threshold',
        category: 'Branching Switch',
        icon: <Layers size={16} />,
        iconBg: isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100',
        status: 'idle',
        x: currentX,
        y: 120,
        config: { expression: 'membership === "Premium VIP" || totalSpent > 300' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      });
      
      if (nextId) {
        const prevIdx = newGeneratedNodes.findIndex(n => n.id === nextId);
        newGeneratedNodes[prevIdx].connections.push(branchId);
      } else {
        newGeneratedNodes[0].connections.push(branchId);
      }
      
      currentX += 240;
      nextId = branchId;
      logsToAdd.push("Appending 'If VIP Customer' branching switch node.");
    }

    const actionId = prompt.includes('whatsapp') ? 'whatsapp-action' : prompt.includes('coupon') ? 'reward-dispatch' : 'operator-notify';
    let finalActionNode: WorkflowNode;
    
    if (actionId === 'whatsapp-action') {
      finalActionNode = {
        id: 'whatsapp-action',
        type: 'action',
        title: 'WhatsApp Recipient',
        desc: 'Delivers custom message details onto cellular API',
        category: 'Communication API',
        icon: <MessageSquare size={16} />,
        iconBg: isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100',
        status: 'idle',
        x: currentX,
        y: 120,
        config: { template: 'win_back_gold' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      };
      logsToAdd.push("Concluding with WhatsApp Dispatch API node.");
    } else if (actionId === 'reward-dispatch') {
      finalActionNode = {
        id: 'reward-dispatch',
        type: 'action',
        title: 'Send Reward Coupon',
        desc: 'Dispatches instant discount coupon stamp',
        category: 'Coupon Agent',
        icon: <Mail size={16} />,
        iconBg: isDark ? 'bg-amber-500/10 text-amber-450 border border-amber-550/20' : 'bg-amber-50 text-amber-600 border border-amber-100',
        status: 'idle',
        x: currentX,
        y: 60,
        config: { templateCode: 'VIP_STAMP_26' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      };
      logsToAdd.push("Concluding with Coupon Rewards dispatch node.");
    } else {
      finalActionNode = {
        id: 'operator-notify',
        type: 'action',
        title: 'Alert Operator',
        desc: 'Pushes warning notice to CRM support desk',
        category: 'Operator Warning',
        icon: <Bell size={16} />,
        iconBg: isDark ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100',
        status: 'idle',
        x: currentX,
        y: 180,
        config: { priority: 'high' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      };
      logsToAdd.push("Concluding with Operator warning notification push.");
    }

    newGeneratedNodes.push(finalActionNode);
    
    if (nextId) {
      const prevIdx = newGeneratedNodes.findIndex(n => n.id === nextId);
      newGeneratedNodes[prevIdx].connections.push(actionId);
    } else {
      newGeneratedNodes[0].connections.push(actionId);
    }

    setNodes(newGeneratedNodes);
    setNlPrompt('');
    setSelectedNodeId(null);
    onTriggerToast("🪄 Generative Builder: Custom workflow compiled successfully!");
    
    const formatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setExecutionLogs(prev => [
      ...prev,
      { time: formatted, type: 'info', msg: `Generative NL compile initiated for: "${prompt}"` },
      ...logsToAdd.map(logMsg => ({ time: formatted, type: 'success' as const, msg: logMsg })),
      { time: formatted, type: 'success', msg: `Complete workflow compiled and connected on dynamic canvas cleanly.` }
    ]);
  };

  const applyWizardPreset = (presetType: 'lead' | 'silent' | 'b2b') => {
    if (presetType === 'lead') {
      setNodes([
        {
          id: 'stripe-trigger',
          type: 'trigger',
          title: 'Stripe webhook',
          desc: 'Triggered when invoice.paid event fires',
          category: 'Webhook Trigger',
          icon: <Webhook size={16} />,
          iconBg: 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20',
          status: 'idle',
          x: 40,
          y: 120,
          config: { path: '/v1/stripe' },
          inputPayload: {},
          outputPayload: {},
          connections: ['ai-eval']
        },
        {
          id: 'ai-eval',
          type: 'integration',
          title: 'Gemini AI Profiler',
          desc: 'Reads metadata to check active loyalty risk',
          category: 'AI Sentiment Engine',
          icon: <Bot size={16} />,
          iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
          status: 'idle',
          x: 290,
          y: 120,
          config: { model: 'gemini-2.5-flash' },
          inputPayload: {},
          outputPayload: {},
          connections: ['whatsapp-action']
        },
        {
          id: 'whatsapp-action',
          type: 'action',
          title: 'WhatsApp Recipient',
          desc: 'Broadcast digital lead rewards link over mobile API',
          category: 'Communication API',
          icon: <MessageSquare size={16} />,
          iconBg: 'bg-amber-500/10 text-amber-400',
          status: 'idle',
          x: 540,
          y: 120,
          config: { template: 'win_back_gold' },
          inputPayload: {},
          outputPayload: {},
          connections: []
        }
      ]);
      onTriggerToast("🪄 Installed E-Commerce Lead Recover Trigger Workflow!");
    } else if (presetType === 'silent') {
      setNodes([
        {
          id: 'silent-tracker',
          type: 'trigger',
          title: 'Client Silent Trigger',
          desc: 'Fires when client is silent for > 30 days',
          category: 'Retention Tracker',
          icon: <UserCheck size={16} />,
          iconBg: 'bg-emerald-500/10 text-emerald-400',
          status: 'idle',
          x: 40,
          y: 120,
          config: { thresholdDays: 30 },
          inputPayload: {},
          outputPayload: {},
          connections: ['notify-coupons']
        },
        {
          id: 'notify-coupons',
          type: 'action',
          title: 'Send Reward Coupon',
          desc: 'Dispatches high-value 20% discount offer stamp',
          category: 'Coupon Agent',
          icon: <Mail size={16} />,
          iconBg: 'bg-amber-500/10 text-amber-500',
          status: 'idle',
          x: 350,
          y: 120,
          config: { templateCode: 'SILENT_RECALL_30D' },
          inputPayload: {},
          outputPayload: {},
          connections: []
        }
      ]);
      onTriggerToast("🪄 Loaded Restaurant Silent Client Recall Workflow!");
    } else {
      setNodes([
        {
          id: 'postgres-query',
          type: 'trigger',
          title: 'Stock Database check',
          desc: 'Emits query to identify depleted stock counts',
          category: 'Data Storage',
          icon: <Database size={16} />,
          iconBg: 'bg-cyan-500/10 text-cyan-400',
          status: 'idle',
          x: 40,
          y: 120,
          config: { sql: 'SELECT * FROM inventory WHERE stock < 10' },
          inputPayload: {},
          outputPayload: {},
          connections: ['critical-check']
        },
        {
          id: 'critical-check',
          type: 'logic',
          title: 'Condition Logic',
          desc: 'Branches if item is critical physical stock supply',
          category: 'Branching Switch',
          icon: <Layers size={16} />,
          iconBg: 'bg-blue-500/10 text-blue-450',
          status: 'idle',
          x: 290,
          y: 120,
          config: { expression: 'stock < 5' },
          inputPayload: {},
          outputPayload: {},
          connections: ['escalate-alert']
        },
        {
          id: 'escalate-alert',
          type: 'action',
          title: 'Alert Operator',
          desc: 'Urgent CRM notice: dispatch replacement purchase orders',
          category: 'Operator Warning',
          icon: <Bell size={16} />,
          iconBg: 'bg-rose-500/10 text-rose-450',
          status: 'idle',
          x: 540,
          y: 125,
          config: { priority: 'high' },
          inputPayload: {},
          outputPayload: {},
          connections: []
        }
      ]);
      onTriggerToast("🪄 Loaded B2B Stock Supplier Logistics Warning Workflow!");
    }
    setShowWizardPopup(false);
  };

  // Presets load system templates
  const loadSystemPresetOne = () => {
    setNodes([
      {
        id: 'webhook-trigger',
        type: 'trigger',
        title: 'Stripe Webhook',
        desc: 'Starts on successful invoice event',
        category: 'Webhook Trigger',
        icon: <Webhook size={16} />,
        iconBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        status: 'idle',
        x: 40,
        y: 120,
        config: { path: '/v1/stripe/checkout', method: 'POST', secretHeaders: true },
        inputPayload: {},
        outputPayload: {},
        connections: ['js-code-eval']
      },
      {
        id: 'js-code-eval',
        type: 'custom',
        title: 'Points Calculator',
        desc: 'Calculate 10 points bonus per dollar',
        category: 'Data Morph Node',
        icon: <Code size={16} />,
        iconBg: isDark ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-pink-50 text-pink-600 border border-pink-100',
        status: 'idle',
        x: 300,
        y: 120,
        config: { script: 'item.pointsAwarded = item.totalSpent * 10;\nitem.membershipTier = "Gold Elite";\nreturn item;' },
        inputPayload: {},
        outputPayload: {},
        connections: ['whatsapp-action']
      },
      {
        id: 'whatsapp-action',
        type: 'action',
        title: 'WhatsApp Recipient',
        desc: 'Delivers custom coupon details',
        category: 'Communication API',
        icon: <MessageSquare size={16} />,
        iconBg: isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100',
        status: 'idle',
        x: 560,
        y: 120,
        config: { template: 'win_back_gold' },
        inputPayload: {},
        outputPayload: {},
        connections: []
      }
    ]);
    setSelectedNodeId(null);
    onTriggerToast("⚙️ Loaded n8n custom Custom-JS transformation formula!");
  };

  return (
    <div className="space-y-4 font-sans select-none">
      
      {/* HEADER BANNER */}
      <div className={`p-4 px-5 rounded-[24px] border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-[#1C1917]'
      }`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Layers size={9} />
              n8n Visual Automation Suite v2.4
            </span>
          </div>
          <h2 className="font-sans text-lg font-black tracking-tight uppercase leading-none">Visual Operations flow engine</h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-300">
            Build live connected graph charts with conditional evaluation branches, custom JS sandboxes, and automated Gemini AI integrations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Default Presets triggers */}
          <button
            onClick={() => setShowWizardPopup(true)}
            className="px-3 py-1.5 text-[10px] bg-[#F59E0B] text-black hover:bg-amber-400 font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
            title="Launch dynamic n8n SMB Automation template picker"
          >
            <span>🪄 SMB Wizard</span>
          </button>

          <button
            onClick={loadSystemPresetOne}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Load JS-Calculator Preset
          </button>
          
          <button
            onClick={() => {
              setNodes([
                {
                  id: 'webhook-trigger',
                  type: 'trigger',
                  title: 'Stripe Webhook',
                  desc: 'Starts on successful invoice event',
                  category: 'Webhook Trigger',
                  icon: <Webhook size={16} />,
                  iconBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
                  status: 'idle',
                  x: 40,
                  y: 120,
                  config: { path: '/v1/stripe/checkout', method: 'POST', secretHeaders: true },
                  inputPayload: {},
                  outputPayload: {},
                  connections: ['gemini-analyze']
                },
                {
                  id: 'gemini-analyze',
                  type: 'integration',
                  title: 'Gemini AI Agent',
                  desc: 'Predicts retention risk from logs',
                  category: 'AI Sentiment Engine',
                  icon: <Bot size={16} />,
                  iconBg: isDark ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-100',
                  status: 'idle',
                  x: 270,
                  y: 120,
                  config: { model: 'gemini-2.5-flash', temperature: 0.2, systemPrompt: '...' },
                  inputPayload: {},
                  outputPayload: {},
                  connections: ['logic-check-vip']
                },
                {
                  id: 'logic-check-vip',
                  type: 'logic',
                  title: 'If VIP Customer',
                  desc: 'Splits path by loyalty eligibility',
                  category: 'Branching Switch',
                  icon: <Layers size={16} />,
                  iconBg: isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100',
                  status: 'idle',
                  x: 500,
                  y: 120,
                  config: { expression: 'membership === "Premium VIP" || totalSpent > 300' },
                  inputPayload: {},
                  outputPayload: {},
                  connections: ['reward-dispatch', 'operator-notify']
                },
                {
                  id: 'reward-dispatch',
                  type: 'action',
                  title: 'Send Reward Coupon',
                  desc: 'Dispatches instant discount stamp via Social API',
                  category: 'Coupon Agent',
                  icon: <Mail size={16} />,
                  iconBg: isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100',
                  status: 'idle',
                  x: 730,
                  y: 40,
                  connections: []
                },
                {
                  id: 'operator-notify',
                  type: 'action',
                  title: 'Alert Operator',
                  desc: 'Pushes warning notice to standard CRM team',
                  category: 'Operator Warning',
                  icon: <Bell size={16} />,
                  iconBg: isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100',
                  status: 'idle',
                  x: 730,
                  y: 220,
                  connections: []
                }
              ]);
              setNodes(curr => curr.map(n => ({ ...n, status: 'idle', inputPayload: {}, outputPayload: {} })));
              setSelectedNodeId(null);
              onTriggerToast("🔄 Reset workflow graph to branched dynamic master template!");
            }}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-850' : 'bg-stone-100 border-stone-200 text-stone-500 hover:bg-stone-200'
            }`}
          >
            Reset Master Blueprint
          </button>
        </div>
      </div>

      {/* Dynamic Workflow Analytics telemetry block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Pipeline Health', value: '99.8%', desc: 'SLA uptime rate', color: 'text-emerald-500 dark:text-emerald-400' },
          { label: 'Calculated Cost Savings', value: '$4,320/mo', desc: 'Overhead replaced', color: 'text-amber-500 dark:text-amber-400' },
          { label: 'Manual Labor Hours Saved', value: '144 hrs/mo', desc: 'SOPs automated', color: 'text-blue-500 dark:text-blue-400' },
          { label: 'Executed Actions Count', value: '12,842 runs', desc: 'API webhooks piped', color: 'text-purple-500 dark:text-purple-400' }
        ].map((stat, sIdx) => (
          <div key={sIdx} className={`p-4 rounded-2xl border ${
            isDark ? 'bg-stone-950/45 border-stone-850' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <span className="text-[8.5px] font-black uppercase text-stone-400 block tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-lg font-black tracking-tight ${stat.color}`}>{stat.value}</span>
              <span className="text-[9px] text-stone-500 font-bold">({stat.desc})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Sub-Tab View Switcher (Auto-Chaining Request) */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 pb-2 mb-4 gap-2 items-center justify-between select-none">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setWorkflowActiveView('canvas'); onTriggerToast("🔌 Active Flow Canvas loaded successfully!"); }}
            className={`px-3 py-1.5 text-[10.5px] font-black uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              workflowActiveView === 'canvas'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-stone-450 hover:text-white bg-stone-900/10 dark:bg-white/5 border border-transparent'
            }`}
          >
            <span>Interactive Graph Canvas</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setWorkflowActiveView('sandbox'); onTriggerToast("🧠 Initialized Multi-Step Auto-Chaining simulation!"); }}
            className={`px-3 py-1.5 text-[10.5px] font-black uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative ${
              workflowActiveView === 'sandbox'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-stone-450 hover:text-white bg-stone-50 dark:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-amber-500 animate-pulse">⚡</span>
            <span>🧠 Sequential Auto-Chaining Simulator</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2 font-sans">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 font-sans"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button>
        </div>
        
        <div className="text-[9.5px] font-mono text-stone-500 font-bold dark:text-stone-400">
          Core Engine Status: <span className="text-emerald-400 font-black">● LIVE AUDITING READY</span>
        </div>
      </div>

      {workflowActiveView === 'canvas' ? (
        <>
          {/* Natural Language Generative flow compiler */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center gap-3.5 justify-between ${
            isDark ? 'bg-[#1e1a17] border-[#39322c]' : 'bg-[#FFFBEB] border-amber-200'
          }`}>
            <div className="space-y-0.5 max-w-xl">
              <span className="text-[8.5px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider flex items-center gap-1">
                <Bot size={11} />
                Generative Natural-Language Flow compiler
              </span>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Type your operational scenario in plain English (e.g., *"when stripe invoice is paid, analyze with Gemini and send WhatsApp coupon"*). Omni AI will compile and wire nodes instantly!
              </p>
            </div>

            <div className="flex gap-2 flex-1 md:max-w-md items-center shadow-inner rounded-xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 p-1.5">
              <input 
                type="text"
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNaturalLanguageBuild();
                }}
                placeholder="e.g. Stripe webhook -> Gemini AI analyze -> Alert operator"
                className="flex-1 bg-transparent text-xs p-1 px-2.5 text-stone-900 dark:text-stone-100 outline-none placeholder:text-stone-500 font-bold"
              />
              <button
                type="button"
                onClick={handleNaturalLanguageBuild}
                className="py-1 px-3.5 bg-amber-500 hover:bg-amber-440 text-black font-black uppercase text-[10px] rounded-lg transition-all shrink-0 cursor-pointer"
              >
                Compile Flow
              </button>
            </div>
          </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: n8n PALETTE TOOLBOX & SANDBOX DATA INPUT (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* SANDBOX VARIABLE INPUT PANEL */}
          <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1C1917] border-stone-850' : 'bg-white border-stone-200'}`}>
            <div className="flex justify-between items-center">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 leading-none">
                <FileCode size={13} />
                1. Payload Editor Sandbox
              </h4>
              <span className="text-[9px] font-bold text-neutral-400 py-0.5 px-2 bg-stone-950/40 rounded border border-stone-800/40 font-mono">JSON</span>
            </div>
            <p className="text-[9.5px] text-neutral-400 leading-tight">
              Edit the live customer dataset below, then click **Execute Pipeline** to trace how nodes dynamically branches & transforms data!
            </p>
            <textarea
              rows={6}
              value={sandboxCustomerInput}
              onChange={(e) => setSandboxCustomerInput(e.target.value)}
              className="w-full p-2 text-[10px] font-mono leading-relaxed rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500/60 transition-all bg-[#0d0c0c] border-[#2c2724] text-amber-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={triggerPipelineMock}
                disabled={isRunningPipeline}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black uppercase text-[10.5px] tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <PlayCircle size={13} className={isRunningPipeline ? 'animate-spin' : ''} />
                <span>{isRunningPipeline ? 'Running...' : 'Execute Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* n8n COMPLIANT PALETTE DRAWER */}
          <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1C1917] border-[#2e2b28]' : 'bg-white border-stone-200'}`}>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 dark:text-stone-100 flex items-center gap-1.5 leading-none">
                <PlusCircle size={14} className="text-amber-500" />
                2. Node Toolpack Catalog
              </h4>
              <p className="text-[9px] text-stone-400 leading-normal mt-1">Click a node template below to append it onto your live graph connection pipeline.</p>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {masterNodeCatalog.map((catalogItem, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddNodeFromToolbox(catalogItem)}
                  className={`w-full text-left p-2 rounded-xl border border-stone-200 dark:border-stone-850 hover:border-amber-500/20 dark:hover:bg-amber-500/5 flex items-center gap-2.5 transition-all cursor-pointer ${
                    isDark ? 'bg-stone-900/40 text-stone-100' : 'bg-stone-50/50 text-stone-800'
                  }`}
                >
                  <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-xs shrink-0 ${catalogItem.iconBg}`}>
                    {catalogItem.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="font-extrabold text-[10px] text-stone-800 dark:text-stone-200 block uppercase tracking-wide leading-tight truncate">{catalogItem.title}</span>
                    <span className="text-[8px] text-stone-400 leading-none truncate block">{catalogItem.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: INTERACTIVE VISUAL GRID CANVAS & SVG CONTROLS (xl:col-span-6) */}
        <div className="xl:col-span-6 space-y-4 flex flex-col justify-between">
          
          <div className={`p-4 rounded-3xl border flex-1 min-h-[500px] flex flex-col justify-between relative overflow-hidden ${
            isDark ? 'bg-stone-950 border-stone-850' : 'bg-slate-50 border-stone-200'
          }`}>
            {/* Grid Pattern matrix styling */}
            <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />

            <div>
              {/* Canvas Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 select-none z-[11] relative">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-sans text-xs font-black uppercase text-stone-600 dark:text-stone-300">Live Workspace Board</h3>
                    <span className="text-[10px] font-bold text-neutral-400 px-1.5 bg-neutral-800/20 rounded">Drag nodes to map coordinates!</span>
                  </div>
                  <p className="text-[9px] text-stone-400">Interactive SVG curves updates dynamically on node relocation coordinates.</p>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => setScale(prev => Math.min(1.2, prev + 0.1))}
                    className={`p-1.5 rounded-lg border cursor-pointer ${isDark ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800' : 'bg-white border-stone-250 text-stone-700'}`}
                    title="Zoom In"
                  >
                    <ZoomIn size={12} />
                  </button>
                  <button
                    onClick={() => setScale(prev => Math.max(0.7, prev - 0.1))}
                    className={`p-1.5 rounded-lg border cursor-pointer ${isDark ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800' : 'bg-white border-stone-250 text-stone-700'}`}
                    title="Zoom Out"
                  >
                    <ZoomOut size={12} />
                  </button>
                  <button
                    onClick={() => setScale(1)}
                    className={`p-1.5 rounded-lg border cursor-pointer ${isDark ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800' : 'bg-white border-stone-250 text-stone-700'}`}
                    title="Reset Zoom"
                  >
                    <Maximize size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNodes(curr => curr.map(n => ({ ...n, status: 'idle', inputPayload: {}, outputPayload: {} })));
                      onTriggerToast("Wiped simulation success states.");
                    }}
                    className={`p-1.5 rounded-lg border cursor-pointer text-amber-500 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-250'}`}
                    title="Reset run state ticks"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>

              {/* LIVE n8n GRAPH EDITOR CONTAINER FRAME */}
              <div 
                id="n8n-canvas-board"
                className="w-full h-[400px] border border-dashed rounded-2xl relative overflow-hidden shadow-inner bg-stone-900/10 border-stone-800"
                style={{ scale: scale }}
              >
                {/* SVG CONNECTION WIRES OVERLAY BOARD */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                  <defs>
                    <style>{`
                      .animate-dash-pipeline {
                        stroke-dasharray: 6;
                        animation: dash-flow 1s linear infinite;
                      }
                      @keyframes dash-flow {
                        to {
                          stroke-dashoffset: -20;
                        }
                      }
                    `}</style>
                  </defs>
                  {renderWires}
                </svg>

                {/* DYNAMIC POSITION NODES */}
                {nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isExecuting = currentExecutionNodeIndex === node.id;
                  
                  // Status border decorations
                  let statusBorderClass = 'border-stone-800';
                  if (isSelected) statusBorderClass = 'border-amber-500 ring-1 ring-amber-500/20';
                  if (node.status === 'success') statusBorderClass = 'border-emerald-500';
                  if (node.status === 'error') statusBorderClass = 'border-rose-500';
                  if (isExecuting || node.status === 'running') statusBorderClass = 'border-amber-400 animate-pulse';

                  return (
                    <div
                      key={node.id}
                      onMouseDown={(e) => handleCanvasMouseDown(node.id, e)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        cursor: 'grab'
                      }}
                      className={`w-[220px] rounded-xl border bg-neutral-950/95 text-stone-100 p-2.5 shadow-md hover:shadow-lg transition-all z-10 ${statusBorderClass}`}
                    >
                      {/* Top Header of Node */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-stone-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${node.iconBg}`}>
                            {node.icon}
                          </span>
                          <span className="text-[8px] font-mono tracking-wider uppercase text-stone-450 dark:text-stone-400 truncate">
                            {node.category}
                          </span>
                        </div>

                        {/* Ticks and status flags */}
                        <div className="flex items-center gap-1 shrink-0">
                          {node.status === 'success' && <Check size={11} className="text-emerald-500 font-bold" />}
                          {node.status === 'error' && <AlertTriangle size={11} className="text-rose-500 animate-bounce" />}
                          {node.status === 'running' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            className="p-1 rounded text-stone-400 hover:text-rose-500 hover:bg-stone-900 cursor-pointer"
                            title="Remove Node"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Main Node Titles */}
                      <div className="py-1.5">
                        <h4 className="text-[10.5px] font-black uppercase text-stone-200 truncate leading-tight select-text">
                          {node.title}
                        </h4>
                        <p className="text-[8.5px] text-stone-400 leading-normal truncate">
                          {node.desc}
                        </p>
                      </div>

                      {/* Handles for flow visibility on Node sides */}
                      {/* Input Dot Left */}
                      {node.id !== 'webhook-trigger' && (
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-stone-800 bg-stone-950 flex items-center justify-center z-20">
                          <span className="w-1 h-1 rounded-full bg-stone-500" />
                        </div>
                      )}

                      {/* Output Dot Right */}
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-stone-800 bg-stone-950 flex items-center justify-center z-20">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                      </div>

                      {/* Fine position nudge coordinate micro-block */}
                      <div className="flex justify-between items-center mt-1 pt-1 border-t border-dashed border-stone-900/60 text-[7.5px] font-mono text-neutral-400">
                        <span>x:{node.x} y:{node.y}</span>
                        <div className="flex gap-0.5">
                          <button 
                            onMouseDown={(e) => { e.stopPropagation(); adjustNodePos(node.id, 0, -25); }} 
                            className="bg-stone-900 hover:bg-stone-850 p-0.5 rounded cursor-pointer"
                          >
                            ↑
                          </button>
                          <button 
                            onMouseDown={(e) => { e.stopPropagation(); adjustNodePos(node.id, 0, 25); }} 
                            className="bg-stone-900 hover:bg-stone-850 p-0.5 rounded cursor-pointer"
                          >
                            ↓
                          </button>
                          <button 
                            onMouseDown={(e) => { e.stopPropagation(); adjustNodePos(node.id, -25, 0); }} 
                            className="bg-stone-900 hover:bg-stone-850 p-0.5 rounded cursor-pointer"
                          >
                            ←
                          </button>
                          <button 
                            onMouseDown={(e) => { e.stopPropagation(); adjustNodePos(node.id, 25, 0); }} 
                            className="bg-stone-900 hover:bg-stone-850 p-0.5 rounded cursor-pointer"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MANUAL PATH CONNECTOR TOOLBAR FORM */}
              <div className={`p-3 mt-3 border rounded-xl flex flex-wrap gap-3 items-center justify-between ${
                isDark ? 'bg-stone-900/10 border-stone-850 text-stone-300' : 'bg-slate-50 border-stone-200 text-[#1C1917]'
              }`}>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                  <span className="text-[10px] font-black uppercase text-amber-500">🔌 Wire Winding Terminal:</span>
                  <select 
                    value={connectSource} 
                    onChange={(e) => setConnectSource(e.target.value)}
                    className="p-1 px-1.5 text-[10.5px] font-sans font-black bg-stone-900 border border-stone-800 text-stone-300 rounded focus:outline-none"
                  >
                    <option value="">-- Choose Source Node --</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.title} (#{n.id.substring(0,6)})</option>)}
                  </select>

                  <ArrowRight size={10} className="text-neutral-400" />

                  <select 
                    value={connectTarget} 
                    onChange={(e) => setConnectTarget(e.target.value)}
                    className="p-1 px-1.5 text-[10.5px] font-sans font-black bg-stone-900 border border-stone-800 text-stone-300 rounded focus:outline-none"
                  >
                    <option value="">-- Choose Target Node --</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.title} (#{n.id.substring(0,6)})</option>)}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={executeManualConnection}
                  className="px-3.5 py-1 text-[9.5px] font-black bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black uppercase rounded-lg transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  Link Wires
                </button>
              </div>

            </div>

            {/* LIVE REAL-TIME LOG TRACEBACK LOGGER */}
            <div className={`border rounded-2xl p-4.5 mt-4 text-xs font-mono select-text max-h-[170px] overflow-y-auto space-y-1.5 ${
              isDark ? 'bg-black text-[#86EFAC]' : 'bg-white border-stone-250 text-emerald-800'
            }`}>
              <div className="flex justify-between items-center mb-1 select-none text-[9.5px] font-sans font-black text-neutral-450 border-b border-stone-900 pb-1">
                <span>📠 Active JVM Container Output Logs</span>
                <button 
                  onClick={() => setExecutionLogs([])} 
                  className="hover:text-white transition-all underline shrink-0 cursor-pointer font-mono text-[9px]"
                >
                  Clear Terminal
                </button>
              </div>
              {executionLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-neutral-500 shrink-0 text-[10.5px]">{log.time}</span>
                  <p className={`leading-normal text-[10.5px] flex-1 ${
                    log.type === 'error' ? 'text-rose-400 font-bold' : log.type === 'warning' ? 'text-amber-400' : 'text-emerald-400 font-medium'
                  }`}>
                    {log.nodeName && <span className="underline font-black mr-1 text-white">[{log.nodeName}]</span>}
                    {log.msg}
                  </p>
                </div>
              ))}
              {executionLogs.length === 0 && (
                <p className="text-center italic text-stone-500 text-[10px] py-2">Terminal backlog cleaned. Trigger mock pipeline to stream event trace.</p>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED NODE PARAMETERS CONFIG FORM & JSON INSPECTOR SIDEBAR (xl:col-span-3) */}
        <div className="xl:col-span-3">
          
          {activeSelectedNode ? (
            <div className={`p-4 rounded-3xl border space-y-4 shadow-sm select-none h-full flex flex-col justify-between ${
              isDark ? 'bg-[#1C1917] border-stone-850 text-stone-100' : 'bg-white border-stone-200 text-[#1C1917]'
            }`}>
              <div className="space-y-4">
                {/* Visual title header */}
                <div className="pb-3 border-b border-stone-900">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${activeSelectedNode.iconBg}`}>
                      {activeSelectedNode.icon}
                    </span>
                    <span className="text-[9px] font-black uppercase text-amber-500 font-mono tracking-widest leading-none bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Node Config (SHA-256)
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wide truncate">{activeSelectedNode.title}</h4>
                  <p className="text-[10px] text-neutral-400 leading-tight">Inspect raw parameters and JSON trace payloads.</p>
                </div>

                {/* PARAMETERS CONFIG FORM */}
                <div className="space-y-3.5 text-xs">
                  <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-400 border-b border-dashed border-stone-900 pb-1 font-mono">
                    🔧 Pipeline Parameters Form
                  </h5>

                  {/* Standard Webhook config */}
                  {activeSelectedNode.id === 'webhook-trigger' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 block mb-1">Webhooks Bind route</label>
                        <input
                          type="text"
                          value={activeSelectedNode.config.path || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, path: val }
                            } : n));
                          }}
                          className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-stone-900 border-stone-800 text-[#fff] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 block mb-1">Authorization Method</label>
                        <select
                          value={activeSelectedNode.config.method || 'POST'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, method: val }
                            } : n));
                          }}
                          className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-stone-900 border-stone-800 text-[#fff]"
                        >
                          <option value="POST">POST</option>
                          <option value="GET">GET</option>
                          <option value="PUT">PUT</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Gemini LLM API Prompt configuration */}
                  {activeSelectedNode.id === 'gemini-analyze' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 block mb-1">Gemini AI Model Alias</label>
                        <select
                          value={activeSelectedNode.config.model || 'gemini-2.5-flash'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, model: val }
                            } : n));
                          }}
                          className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-stone-900 border-stone-800 text-[#fff]"
                        >
                          <option value="gemini-2.5-flash">gemini-2.5-flash (Standard)</option>
                          <option value="gemini-2.5-pro">gemini-2.5-pro (Creative Math)</option>
                          <option value="gemini-2.0-flash">gemini-2.0-flash (Legacy)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 block mb-1">Dynamic Prompt Directive</label>
                        <textarea
                          rows={3}
                          value={activeSelectedNode.config.systemPrompt || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, systemPrompt: val }
                            } : n));
                          }}
                          className="w-full p-2 text-[10.5px] rounded-lg border focus:outline-none bg-stone-900 border-stone-800 text-[#fff] leading-snug font-sans"
                        />
                      </div>
                    </div>
                  )}

                  {/* Logic if-condition branch switch config */}
                  {activeSelectedNode.id === 'logic-check-vip' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 block mb-1">JS Logical Filter expression</label>
                        <input
                          type="text"
                          value={activeSelectedNode.config.expression || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, expression: val }
                            } : n));
                          }}
                          className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-stone-900 border-stone-800 text-[#fff] font-mono font-black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-emerald-400 font-extrabold">🟢 True Branch:</span>
                          <p className="p-1 px-1.5 bg-neutral-950 rounded mt-1 border border-stone-900 truncate">
                            {activeSelectedNode.connections[0] 
                              ? nodes.find(n => n.id === activeSelectedNode.connections[0])?.title 
                              : "Unbound Void"
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-rose-400 font-extrabold">🔴 False Branch:</span>
                          <p className="p-1 px-1.5 bg-neutral-950 rounded mt-1 border border-stone-900 truncate">
                            {activeSelectedNode.connections[1] 
                              ? nodes.find(n => n.id === activeSelectedNode.connections[1])?.title 
                              : "Unbound Void"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Code transform block */}
                  {activeSelectedNode.type === 'custom' && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-neutral-450 block">Morphed JS code block</label>
                          <span className="p-0.5 px-1 font-mono text-[8.5px] bg-[#d946ef]/10 text-[#d946ef] rounded">Sandbox Sandbox</span>
                        </div>
                        <p className="text-[8.5px] text-neutral-400 mb-1 leading-normal">Variables are modified via return values. Type calculations standard syntax.</p>
                        <textarea
                          rows={6}
                          value={activeSelectedNode.config.script || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === activeSelectedNode.id ? {
                              ...n,
                              config: { ...n.config, script: val }
                            } : n));
                          }}
                          className="w-full p-2 text-[10px] font-mono leading-relaxed rounded-lg border focus:outline-none bg-stone-950 border-stone-800 text-stone-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Catch-all general configurations block */}
                  {activeSelectedNode.id !== 'webhook-trigger' && activeSelectedNode.id !== 'gemini-analyze' && activeSelectedNode.id !== 'logic-check-vip' && activeSelectedNode.type !== 'custom' && (
                    <div>
                      <p className="text-[10px] italic text-neutral-400">Standard system parameters configured automatically for action. Edit endpoints via live triggers.</p>
                      <div className="mt-2.5 p-2 bg-stone-950/40 rounded border border-stone-900 text-[10px] font-mono text-[#a8a29e] space-y-1">
                        {Object.entries(activeSelectedNode.config).map(([key, val]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="text-white font-bold">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* REPL EVALUATION JSON PAYLOAD DISPLAY BOX */}
                <div className="space-y-2 pt-2 border-t border-dashed border-stone-900 select-all">
                  <h5 className="text-[9px] font-black uppercase tracking-wider text-[#ea580c] font-mono leading-none">
                    📈 Telemetry Node I/O Payloads
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
                    <div>
                      <span className="text-neutral-500 font-bold leading-none block mb-1">INCOMING PACKET:</span>
                      <div className="p-1 px-1.5 bg-[#080707] border border-stone-900 rounded max-h-[85px] overflow-y-auto leading-normal text-stone-300">
                        {Object.keys(activeSelectedNode.inputPayload).length > 0 
                          ? JSON.stringify(activeSelectedNode.inputPayload, null, 2) 
                          : "{}"
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-bold leading-none block mb-1">OUTGOING RESULT:</span>
                      <div className="p-1 px-1.5 bg-[#080707] border border-stone-900 rounded max-h-[85px] overflow-y-auto leading-normal text-amber-400">
                        {Object.keys(activeSelectedNode.outputPayload).length > 0
                          ? JSON.stringify(activeSelectedNode.outputPayload, null, 2)
                          : "{}"
                        }
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 flex gap-2 border-t border-neutral-900 select-none">
                <button
                  type="button"
                  onClick={() => {
                    onTriggerToast(`Node parameters saved!`);
                    setSelectedNodeId(null);
                  }}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-450 text-black text-[10.5px] font-black uppercase rounded-lg transition-all text-center cursor-pointer"
                >
                  Confirm Values
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="px-2 py-1.5 text-neutral-450 hover:text-white text-[10px] font-bold uppercase transition-all cursor-pointer"
                >
                  Hide Form
                </button>
              </div>
            </div>
          ) : (
            <div className={`p-4.5 rounded-3xl border space-y-4 text-center select-none h-full flex flex-col justify-center items-center ${
              isDark ? 'bg-stone-900/10 border-stone-850 text-stone-500' : 'bg-slate-50 border-stone-200 text-stone-400'
            }`}>
              <div className="w-10 h-10 rounded-full border border-dashed border-stone-700 flex items-center justify-center mb-1 text-stone-500 text-sm">
                ?
              </div>
              <div>
                <h5 className="text-xs uppercase font-black tracking-wider text-stone-400 dark:text-stone-300 mb-0.5">Parameters Inspector Vacant</h5>
                <p className="text-[10px] text-neutral-400 leading-normal max-w-[190px] mx-auto">
                  Click on an active node block within the grid workspace panel to view parameters and real-time JSON input/output traces.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
      </>
      ) : (
        /* MULTI-STEP AUTO-CHAINING INTERACTIVE SANDBOX PLAYGROUND PANEL */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch font-sans animate-fade-in select-none">
          
          {/* LEFT PANEL: PATTERN SELECTION & TIMING CONSTRAINTS (xl:col-span-4) */}
          <section className={`xl:col-span-4 p-5 rounded-[24px] border flex flex-col justify-between ${
            isDark ? 'bg-[#1C1917] border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs uppercase tracking-wider mb-2">
                <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Zap size={14} /></span>
                <span>Chained Flow Orchestrator</span>
              </div>
              <h3 className="text-base font-black truncate">Sequential Auto-Chaining Pattern</h3>
              <p className="text-[11px] text-stone-400 leading-relaxed mt-1 font-medium">
                The auto-chaining engine fixes compile-step blocking. Instead of pausing and waiting for a physical button click at each junction, it sequences and resolves the entire pipeline automatically.
              </p>

              {/* Chained Workflow Patterns Options */}
              <div className="mt-5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Choose Workflow Architectural Pattern:</span>
                
                {[
                  {
                    id: 'linear',
                    title: '1. Linear Chain Flow',
                    desc: 'Executes Step 1, then automatically triggers Step 2, then automatically triggers Step 3.',
                    indicator: 'Linear Sync Pipeline'
                  },
                  {
                    id: 'parallel',
                    title: '2. Parallel + Merge Flow',
                    desc: 'Spawns Step 1 & Step 2 in parallel, and triggers Step 3 automatically once both are completed.',
                    indicator: 'Fork & Join Merge'
                  },
                  {
                    id: 'conditional',
                    title: '3. Conditional Decision Chain',
                    desc: 'Resolves Step 1, evaluates scenario branch variables, and triggers Branch A or B automatically.',
                    indicator: 'Dynamic Router'
                  }
                ].map((pattern) => (
                  <button
                    key={pattern.id}
                    type="button"
                    disabled={sandboxExecutionState === 'running'}
                    onClick={() => {
                      setSandboxSelectedPattern(pattern.id as any);
                      setSandboxCurrentStepIdx(0);
                      setSandboxProgressPct(0);
                      setSandboxGeneratedOutputs({});
                      setSandboxLogBuffer([
                        { time: 'Ready', text: `Switched schema to ${pattern.title}. Ready to operate pipeline.`, status: 'info' }
                      ]);
                    }}
                    className={`w-full text-left p-3 border rounded-xl transition-all cursor-pointer block ${
                      sandboxSelectedPattern === pattern.id
                        ? 'bg-amber-500/10 border-amber-500/40 font-semibold scale-101 shadow-sm'
                        : isDark ? 'bg-stone-950/40 border-stone-850 hover:bg-stone-850' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 bg-transparent">
                      <span className="font-extrabold text-stone-900 dark:text-white text-xs leading-none">{pattern.title}</span>
                      <span className="text-[7.5px] font-mono font-bold uppercase p-0.5 px-1 bg-amber-500/15 text-amber-500 rounded">{pattern.indicator}</span>
                    </div>
                    <p className="text-[9.5px] text-stone-400 font-medium leading-normal">{pattern.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Token Balances & Trigger Actions */}
            <div className="border-t border-dashed border-stone-850/60 pt-4 mt-4 space-y-3 w-full bg-transparent">
              <div className="bg-[#141210] p-2 rounded-xl border border-stone-905 flex justify-between items-center">
                <div>
                  <span className="text-[9.5px] text-stone-400 font-bold block mb-0.5">Session Token Balance:</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="p-0.5 bg-yellow-500/20 text-xs text-yellow-400 rounded">⭐️</span>
                    <span className="font-mono text-xs font-black text-white">{tokenBalance ?? 100} tokens active</span>
                  </div>
                </div>
                <span className="text-[8px] font-bold bg-[#86EFAC]/15 text-emerald-400 p-1 px-1.5 rounded uppercase font-mono tracking-widest text-right shrink-0">Stripe Sync</span>
              </div>

              <button
                type="button"
                disabled={sandboxExecutionState === 'running'}
                onClick={handleRunChainedWorkflow}
                className={`w-full py-3 rounded-xl text-black font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                  sandboxExecutionState === 'running'
                    ? 'bg-amber-500/45 opacity-50 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 animate-pulse'
                }`}
              >
                <span>🚀 Trigger Auto-Chaining Simulation</span>
              </button>
            </div>
          </section>

          {/* MIDDLE PANEL: REAL-TIME SEQUENTIAL PIPELINE STEP VISUALIZER (xl:col-span-4) */}
          <section className={`xl:col-span-4 p-5 rounded-[24px] border flex flex-col justify-between ${
            isDark ? 'bg-[#1C1917] border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9.5px] text-stone-500 uppercase font-bold tracking-wider mb-2 block font-mono">Live Stage Tracking</span>
                <h3 className="text-base font-black truncate">Chained Sequence Process</h3>
                <p className="text-[11px] text-stone-400 leading-normal font-medium">
                  Watch the steps auto-trigger sequentially. Green indicates the step compiled, registered outputs, and automatically booted the next subnode.
                </p>
              </div>

              {/* Progress Slider Bar */}
              <div className="space-y-1.5 pb-2 border-b border-dashed border-stone-850/60 select-none bg-transparent">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-400 font-bold">Execution Completion:</span>
                  <span className="font-mono font-black text-amber-500">{sandboxProgressPct}%</span>
                </div>
                <div className="w-full bg-[#141210] rounded-full h-2.5 overflow-hidden border border-stone-900 relative">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300 pointer-events-none"
                    style={{ width: `${sandboxProgressPct}%` }}
                  />
                </div>
              </div>

              {/* Step Flow List Container */}
              <div className="flex-grow space-y-3.5 flex flex-col justify-center select-none font-sans bg-transparent">
                {[
                  {
                    stepNum: 1,
                    title: sandboxSelectedPattern === 'linear' ? 'CRM Setup Workspace' : sandboxSelectedPattern === 'parallel' ? 'Parallel: CRM Workspace' : 'Conditional: CRM Master Init',
                    desc: 'Instantiates metadata indices & clients datatree.'
                  },
                  {
                    stepNum: 2,
                    title: sandboxSelectedPattern === 'linear' ? 'Inventory Module' : sandboxSelectedPattern === 'parallel' ? 'Parallel: Inventory Modules' : 'Branch Action: Custom Stock Track',
                    desc: 'Calibrates stock sensors-routes.'
                  },
                  {
                    stepNum: 3,
                    title: sandboxSelectedPattern === 'linear' ? 'Finance & CFO Analytics' : sandboxSelectedPattern === 'parallel' ? 'Merge Joint Actions Hub' : 'Merge Step: Combined Dashboard',
                    desc: 'Pipes ledgers & launches live indicators.'
                  }
                ].map((item) => {
                  const isCompleted = sandboxCurrentStepIdx > item.stepNum || sandboxExecutionState === 'completed';
                  const isCurrent = sandboxCurrentStepIdx === item.stepNum && sandboxExecutionState === 'running';
                  let boxBorder = isDark ? 'border-stone-850 bg-stone-950/20' : 'border-stone-150 bg-stone-50';
                  let textBadge = 'IDLE';
                  let badgeColors = 'bg-stone-900 text-stone-500 dark:text-stone-300';

                  if (isCompleted) {
                    boxBorder = 'border-emerald-500/25 bg-emerald-500/5 text-emerald-450';
                    textBadge = '✓ DONE';
                    badgeColors = 'bg-emerald-500/15 text-emerald-500 font-bold';
                  } else if (isCurrent) {
                    boxBorder = 'border-yellow-500/25 bg-yellow-500/5 text-yellow-500 animate-pulse';
                    textBadge = '⚡ AUTOACTIVE';
                    badgeColors = 'bg-yellow-500/25 text-[#D97706] font-black animate-pulse';
                  }

                  return (
                    <div 
                      key={item.stepNum}
                      className={`p-3 rounded-2xl border transition-all flex justify-between items-center gap-3 ${boxBorder}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${
                          isCompleted ? 'border-emerald-500 bg-[#141210] text-[#86EFAC]' : 'border-stone-500 bg-[#080707] text-white'
                        }`}>
                          {item.stepNum}
                        </div>
                        <div>
                          <p className="font-extrabold text-[11.5px] uppercase leading-tight tracking-wide text-stone-900 dark:text-stone-100">{item.title}</p>
                          <p className="text-[9px] text-stone-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[7.5px] font-mono uppercase px-2 py-0.5 rounded ${badgeColors}`}>{textBadge}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-[9px] text-[#A8A29E] italic">
                {sandboxExecutionState === 'running' ? "⏳ Live orchestration loop running continuously..." : "All microservices pipeline threads synchronized."}
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: COMPILED SCHEMAS & DETAILED LOG STREAM OVERVIEW (xl:col-span-4) */}
          <section className={`xl:col-span-4 p-5 rounded-[24px] border flex flex-col justify-between ${
            isDark ? 'bg-[#1C1917] border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="h-full flex flex-col justify-between space-y-4">
              
              {/* Log stream micro-logs */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Microservices Webhook Stream:</span>
                <div className="p-3.5 rounded-2xl bg-stone-950 font-mono text-[10px] h-[180px] overflow-y-auto space-y-1.5 scrollbar-none border border-stone-900 leading-snug">
                  {sandboxLogBuffer.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-stone-500 font-bold shrink-0">{log.time}</span>
                      <span className={`shrink-0 font-extrabold ${
                        log.status === 'success' ? 'text-emerald-400' : log.status === 'generating' ? 'text-yellow-500' : 'text-[#818CF8]'
                      }`}>
                        {log.status.toUpperCase()}:
                      </span>
                      <span className="text-stone-300">{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic generated JSON schema output buffer */}
              <div className="flex-grow space-y-2 select-none">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Compiled Staging Schemas:</span>
                <div className="p-3.5 rounded-2xl bg-stone-950 font-sans border border-stone-900 h-[225px] overflow-y-auto space-y-2 scrollbar-none text-[10.5px]">
                  {Object.keys(sandboxGeneratedOutputs).length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-stone-500 text-center py-6 bg-transparent">
                      <div className="text-sm">⏳</div>
                      <p className="text-[9.5px] mt-2 max-w-[170px] mx-auto text-neutral-400 leading-normal">Outputs will resolve sequentially here as soon as you execute execution loops.</p>
                    </div>
                  ) : (
                    Object.entries(sandboxGeneratedOutputs).map(([stepId, value]) => (
                      <div key={stepId} className="p-2 bg-stone-900/60 border border-stone-850 rounded-xl leading-normal text-stone-300">
                        <span className="text-[8px] font-mono font-black text-amber-500 block mb-0.5 uppercase">Compiled Output Node #{stepId}</span>
                        {value}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </section>

        </div>
      )}

      {/* SMB Onboarding Template Wizard Popup Modal Overlay */}
      {showWizardPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className={`p-6 rounded-[32px] border shadow-2xl max-w-xl w-full flex flex-col justify-between ${
            isDark ? 'bg-[#1C1917] border-[#3E3832] text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-505/20 font-mono animate-pulse">
                    n8n Onboarding Mode
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight">Onboarding Wizard: Choose Template</h3>
                </div>
                <button 
                  onClick={() => setShowWizardPopup(false)}
                  className="p-1 text-stone-450 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 mb-5">
                Don't start from a blank canvas. Select from our pre-configured SMB automation recipes to bootstrap your workflow graph instantly.
              </p>

              {/* Three Templates Cards */}
              <div className="space-y-3.5">
                
                {/* Scenario 1 */}
                <button
                  type="button"
                  onClick={() => applyWizardPreset('lead')}
                  className="w-full text-left p-4 rounded-2xl border bg-black/35 hover:bg-black/55 border-white/5 hover:border-amber-500/40 transition-all cursor-pointer flex gap-3.5 items-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Webhook size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-white">🛒 E-Commerce Lead Win-Back & AI Scoring</h4>
                      <span className="text-[7.5px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">Sales Recovery</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Catches Checkout success webhooks, prompts **Gemini AI** to categorize customer segments, and shoots automated WhatsApp coupons.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Scenario 2 */}
                <button
                  type="button"
                  onClick={() => applyWizardPreset('silent')}
                  className="w-full text-left p-4 rounded-2xl border bg-black/35 hover:bg-black/55 border-white/5 hover:border-amber-500/40 transition-all cursor-pointer flex gap-3.5 items-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-450 flex items-center justify-center shrink-0 border border-amber-550/20 group-hover:scale-105 transition-transform">
                    <UserCheck size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-white">🍽️ Restaurant Silent Client Recall</h4>
                      <span className="text-[7.5px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded">Retention</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Fires automatically if a customer stays quiet for &gt; 30 days. Generates and pushes high-conversion loyalty stamp incentives.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Scenario 3 */}
                <button
                  type="button"
                  onClick={() => applyWizardPreset('b2b')}
                  className="w-full text-left p-4 rounded-2xl border bg-black/35 hover:bg-black/55 border-white/5 hover:border-amber-500/40 transition-all cursor-pointer flex gap-3.5 items-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-405 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Database size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-white">📦 B2B Critical Stock Supply Watchdog</h4>
                      <span className="text-[7.5px] font-bold uppercase tracking-widest bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded">Logistics</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Sparks periodic SQL check scripts to identify low stock inventory, branching to dispatch high-priority replacement alerts.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-500 group-hover:translate-x-1 transition-transform" />
                </button>

              </div>
            </div>

            {/* Popup actions footer */}
            <div className="flex gap-2.5 justify-end pt-4 border-t border-dashed border-stone-850 mt-5">
              <button
                type="button"
                onClick={() => setShowWizardPopup(false)}
                className="px-4 py-2 text-xs font-black uppercase text-stone-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
