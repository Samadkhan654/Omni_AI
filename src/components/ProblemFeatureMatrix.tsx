import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Users,
  Coins,
  PackageSearch,
  Check,
  Bot,
  Copy,
  Download,
  AlertTriangle,
  RefreshCw,
  Sliders,
  FileText,
  Play
} from 'lucide-react';

interface ProblemFeatureMatrixProps {
  theme: 'light' | 'dark';
  showToast: (message: string) => void;
  setCurrentTab: (tab: string) => void;
}

// Full 95 Problems Structured Dataset
const PROBLEMS = [
  // --- CLIENT RETENTION PROBLEMS (1 - 25) ---
  { id: 1, text: "High cost of getting new customers", category: "retention", sub: "Acquisition & Onboarding font-bold" },
  { id: 2, text: "No clear onboarding process for new clients", category: "retention", sub: "Acquisition & Onboarding" },
  { id: 3, text: "First impression is poor — bad service or experience", category: "retention", sub: "Acquisition & Onboarding" },
  { id: 4, text: "No follow-up after first purchase/visit", category: "retention", sub: "Acquisition & Onboarding" },
  { id: 5, text: "Lack of welcome offers or loyalty incentives", category: "retention", sub: "Acquisition & Onboarding" },
  { id: 6, text: "No regular communication with existing clients", category: "retention", sub: "Communication & Relationship" },
  { id: 7, text: "Not remembering customer preferences or history", category: "retention", sub: "Communication & Relationship" },
  { id: 8, text: "No personalized experience for repeat customers", category: "retention", sub: "Communication & Relationship" },
  { id: 9, text: "Slow or no response to customer queries", category: "retention", sub: "Communication & Relationship" },
  { id: 10, text: "Language or communication barriers with clients", category: "retention", sub: "Communication & Relationship" },
  { id: 11, text: "No loyalty or rewards program", category: "retention", sub: "Loyalty & Engagement" },
  { id: 12, text: "Customers forget about the business over time", category: "retention", sub: "Loyalty & Engagement" },
  { id: 13, text: "No referral program to encourage word of mouth", category: "retention", sub: "Loyalty & Engagement" },
  { id: 14, text: "Competitors offer better deals or discounts", category: "retention", sub: "Loyalty & Engagement" },
  { id: 15, text: "No birthday, anniversary, or special occasion offers", category: "retention", sub: "Loyalty & Engagement" },
  { id: 16, text: "Inconsistent product or service quality", category: "retention", sub: "Service Quality" },
  { id: 17, text: "Staff behavior issues driving customers away", category: "retention", sub: "Service Quality" },
  { id: 18, text: "Long waiting times or delays", category: "retention", sub: "Service Quality" },
  { id: 19, text: "No after-sales support or guarantee", category: "retention", sub: "Service Quality" },
  { id: 20, text: "Complaints not handled properly", category: "retention", sub: "Service Quality" },
  { id: 21, text: "No online presence to stay connected with clients", category: "retention", sub: "Digital Presence" },
  { id: 22, text: "No app, website, or WhatsApp for easy reordering", category: "retention", sub: "Digital Presence" },
  { id: 23, text: "Not collecting customer reviews or testimonials", category: "retention", sub: "Digital Presence" },
  { id: 24, text: "Negative online reviews hurting reputation", category: "retention", sub: "Digital Presence" },
  { id: 25, text: "No social media engagement with customers", category: "retention", sub: "Digital Presence" },

  // --- INVENTORY MANAGEMENT PROBLEMS (26 - 50) ---
  { id: 26, text: "Overstocking — too much stock tying up cash", category: "inventory", sub: "Stock Control" },
  { id: 27, text: "Understocking — losing sales due to stockouts", category: "inventory", sub: "Stock Control" },
  { id: 28, text: "No real-time tracking of stock levels", category: "inventory", sub: "Stock Control" },
  { id: 29, text: "Manual tracking leading to errors", category: "inventory", sub: "Stock Control" },
  { id: 30, text: "Difficulty managing multiple product variants", category: "inventory", sub: "Stock Control" },
  { id: 31, text: "Unreliable suppliers causing delays", category: "inventory", sub: "Supplier & Procurement" },
  { id: 32, text: "Minimum order quantities too high for small budgets", category: "inventory", sub: "Supplier & Procurement" },
  { id: 33, text: "No backup supplier when primary one fails", category: "inventory", sub: "Supplier & Procurement" },
  { id: 34, text: "Poor negotiation leading to bad purchase prices", category: "inventory", sub: "Supplier & Procurement" },
  { id: 35, text: "Delayed deliveries disrupting business operations", category: "inventory", sub: "Supplier & Procurement" },
  { id: 36, text: "Limited storage space", category: "inventory", sub: "Storage & Handling" },
  { id: 37, text: "Products getting damaged in storage", category: "inventory", sub: "Storage & Handling" },
  { id: 38, text: "Perishable goods expiring before sale", category: "inventory", sub: "Storage & Handling" },
  { id: 39, text: "No proper labeling or categorization of stock", category: "inventory", sub: "Storage & Handling" },
  { id: 40, text: "Theft or pilferage of inventory", category: "inventory", sub: "Storage & Handling" },
  { id: 41, text: "Cannot predict seasonal demand accurately", category: "inventory", sub: "Demand Forecasting" },
  { id: 42, text: "Dead stock — items that never sell", category: "inventory", sub: "Demand Forecasting" },
  { id: 43, text: "No data or tools to analyze sales trends", category: "inventory", sub: "Demand Forecasting" },
  { id: 44, text: "Buying based on gut feeling, not data", category: "inventory", sub: "Demand Forecasting" },
  { id: 45, text: "Sudden demand spikes causing stockouts", category: "inventory", sub: "Demand Forecasting" },
  { id: 46, text: "No inventory management software", category: "inventory", sub: "Technology & Systems" },
  { id: 47, text: "Using spreadsheets leading to mistakes", category: "inventory", sub: "Technology & Systems" },
  { id: 48, text: "No barcode or scanning system", category: "inventory", sub: "Technology & Systems" },
  { id: 49, text: "Different locations not synced in inventory", category: "inventory", sub: "Technology & Systems font" },
  { id: 50, text: "No alerts for low stock levels", category: "inventory", sub: "Technology & Systems" },

  // --- RISING BUSINESS COSTS PROBLEMS (51 - 85) ---
  { id: 51, text: "Increasing rent for shop or office space", category: "costs", sub: "Operational Costs" },
  { id: 52, text: "Rising electricity and utility bills", category: "costs", sub: "Operational Costs" },
  { id: 53, text: "High water and maintenance costs", category: "costs", sub: "Operational Costs" },
  { id: 54, text: "Expensive equipment repairs or replacement", category: "costs", sub: "Operational Costs" },
  { id: 55, text: "Rising fuel costs for delivery or travel", category: "costs", sub: "Operational Costs" },
  { id: 56, text: "Increasing minimum wage requirements", category: "costs", sub: "Staff & Labor" },
  { id: 57, text: "High staff turnover leading to constant rehiring", category: "costs", sub: "Staff & Labor" },
  { id: 58, text: "Training costs for new employees", category: "costs", sub: "Staff & Labor" },
  { id: 59, text: "Absenteeism reducing productivity", category: "costs", sub: "Staff & Labor" },
  { id: 60, text: "Paying for staff even during slow seasons", category: "costs", sub: "Staff & Labor" },
  { id: 61, text: "Raw material prices going up", category: "costs", sub: "Supplier & Product Costs" },
  { id: 62, text: "Supplier increasing wholesale prices", category: "costs", sub: "Supplier & Product Costs" },
  { id: 63, text: "Import duties and taxes rising", category: "costs", sub: "Supplier & Product Costs" },
  { id: 64, text: "Packaging material costs increasing", category: "costs", sub: "Supplier & Product Costs" },
  { id: 65, text: "Freight and shipping costs rising", category: "costs", sub: "Supplier & Product Costs" },
  { id: 66, text: "Rising cost of paid ads (Google, Meta, Instagram)", category: "costs", sub: "Marketing & Acquisitions" },
  { id: 67, text: "No budget for professional marketing", category: "costs", sub: "Marketing & Acquisitions" },
  { id: 68, text: "Printing and offline marketing costs", category: "costs", sub: "Marketing & Acquisitions" },
  { id: 69, text: "Influencer or promotional costs too high", category: "costs", sub: "Marketing & Acquisitions" },
  { id: 70, text: "No ROI tracking on marketing spend", category: "costs", sub: "Marketing & Acquisitions" },
  { id: 71, text: "Subscription costs for multiple software tools", category: "costs", sub: "Technology & Software" },
  { id: 72, text: "POS system or billing software fees", category: "costs", sub: "Technology & Software" },
  { id: 73, text: "Website hosting and maintenance costs", category: "costs", sub: "Technology & Software" },
  { id: 74, text: "Cybersecurity and data protection costs", category: "costs", sub: "Technology & Software" },
  { id: 75, text: "Upgrading hardware or devices", category: "costs", sub: "Technology & Software" },
  { id: 76, text: "GST / VAT filing costs", category: "costs", sub: "Taxes & Compliance" },
  { id: 77, text: "Accountant or bookkeeping fees", category: "costs", sub: "Taxes & Compliance" },
  { id: 78, text: "Business license renewal fees", category: "costs", sub: "Taxes & Compliance" },
  { id: 79, text: "Legal compliance costs", category: "costs", sub: "Taxes & Compliance" },
  { id: 80, text: "Penalties for late payments or filings", category: "costs", sub: "Taxes & Compliance" },
  { id: 81, text: "Cash flow gaps between expenses and income", category: "costs", sub: "Financial Management" },
  { id: 82, text: "No emergency fund for unexpected costs", category: "costs", sub: "Financial Management" },
  { id: 83, text: "Taking high-interest loans to cover operations", category: "costs", sub: "Financial Management" },
  { id: 84, text: "No budget planning or financial forecasting", category: "costs", sub: "Financial Management" },
  { id: 85, text: "Mixing personal and business finances", category: "costs", sub: "Financial Management" },

  // --- CROSS-CUTTING (86 - 95) ---
  { id: 86, text: "No business management system or software", category: "cross", sub: "General Operations" },
  { id: 87, text: "Owner doing everything alone — no delegation", category: "cross", sub: "General Operations" },
  { id: 88, text: "No data or analytics to make decisions", category: "cross", sub: "General Operations" },
  { id: 89, text: "Lack of digital transformation", category: "cross", sub: "General Operations" },
  { id: 90, text: "No mentor or business advisor", category: "cross", sub: "General Operations" },
  { id: 91, text: "Seasonal fluctuations affecting all areas", category: "cross", sub: "General Operations" },
  { id: 92, text: "Competition from large chains and e-commerce", category: "cross", sub: "General Operations" },
  { id: 93, text: "No clear business processes or SOPs", category: "cross", sub: "General Operations" },
  { id: 94, text: "Poor time management", category: "cross", sub: "General Operations" },
  { id: 95, text: "Lack of financial literacy", category: "cross", sub: "General Operations" }
];

// Full 125 Features Structured Dataset
const FEATURES = [
  // --- CLIENT RETENTION (1 - 25) ---
  { id: 1, text: "CRM Profiles: visitation, preferences, segments", tab: "contacts", type: "retention" },
  { id: 2, text: "Integrated Purchase/Service History Logs", tab: "contacts", type: "retention" },
  { id: 3, text: "Dynamic Customer Segmentation engine (New, Regular, Inactive, VIP)", tab: "contacts", type: "retention" },
  { id: 4, text: "Notes section per customer (allergies, custom preferences)", tab: "contacts", type: "retention" },
  { id: 5, text: "Aesthetic Calendar tracking of Birthdays & Anniversaries", tab: "contacts", type: "retention" },
  { id: 6, text: "Automated WhatsApp & SMS follow-up templates", tab: "social_omni", type: "retention" },
  { id: 7, text: "Direct Email marketing and bulk sequence sender", tab: "social_omni", type: "retention" },
  { id: 8, text: "Push notification creator for instant segment reachout", tab: "social_omni", type: "retention" },
  { id: 9, text: "Personalized message dispatcher mapped to purchases", tab: "social_omni", type: "retention" },
  { id: 10, text: "Sub-segment targeted bulk social messaging suite", tab: "social_omni", type: "retention" },
  { id: 11, text: "Points-based customer loyalty incentive structures", tab: "retainflow", type: "retention" },
  { id: 12, text: "Digital Stamp Card visualizer in wallet passes", tab: "retainflow", type: "retention" },
  { id: 13, text: "Referral campaign creator & conversion track logs", tab: "retainflow", type: "retention" },
  { id: 14, text: "Quick retention discount parameters sandbox", tab: "retainflow", type: "retention" },
  { id: 15, text: "VIP Status Tiers (Bronze, Silver, Gold metadata, custom perks)", tab: "retainflow", type: "retention" },
  { id: 16, text: "Automated feedback review request dispatch loops", tab: "community", type: "retention" },
  { id: 17, text: "Universal 5-Star feedback rating tracker on checkouts", tab: "community", type: "retention" },
  { id: 18, text: "Complaint ticketing & direct resolution audit log", tab: "contacts", type: "retention" },
  { id: 19, text: "Review summary display panel on shareable business card", tab: "community", type: "retention" },
  { id: 20, text: "Net Promoter Score (NPS) tracking trend metrics", tab: "dashboard", type: "retention" },
  { id: 21, text: 'Automated "We Miss You" messaging sequence for inactive clients', tab: "retainflow", type: "retention" },
  { id: 22, text: "Win-back discount codes and conversion rate reports", tab: "retainflow", type: "retention" },
  { id: 23, text: "Seasonal notification and campaign batch planner", tab: "workflows", type: "retention" },
  { id: 24, text: "Abandoned cart & booking reminders pipeline", tab: "workflows", type: "retention" },
  { id: 25, text: "Incentivized survey follow-ups after checkout completes", tab: "community", type: "retention" },

  // --- INVENTORY MANAGEMENT (26 - 50) ---
  { id: 26, text: "Real-time visual stock counts & thresholds monitor", tab: "stocksense", type: "inventory" },
  { id: 27, text: "Multi-variant matrix support (Size, Color, Type cataloging)", tab: "stocksense", type: "inventory" },
  { id: 28, text: "Integrated QR Scan simulator tool", tab: "stocksense", type: "inventory" },
  { id: 29, text: "Proactive push low stock warning alerts", tab: "stocksense", type: "inventory" },
  { id: 30, text: "Perishables expiry countdown tracker & batch logger", tab: "stocksense", type: "inventory" },
  { id: 31, text: "Supplier Directory with response confidence score logs", tab: "stocksense", type: "inventory" },
  { id: 32, text: "Purchase Order (PO) creation, tracking, status logs", tab: "costguard", type: "inventory" },
  { id: 33, text: "Vendor quote comparison & price index table", tab: "costguard", type: "inventory" },
  { id: 34, text: "Delivery transit updates tracker & ETA notifications", tab: "stocksense", type: "inventory" },
  { id: 35, text: "Auto-reorder script parameters triggered on low thresholds", tab: "workflows", type: "inventory" },
  { id: 36, text: "Stock-in and Stock-out digital ledger controls", tab: "stocksense", type: "inventory" },
  { id: 37, text: "Multi-facility stock transfer validation logs", tab: "stocksense", type: "inventory" },
  { id: 38, text: "Spill, damage, and waste tracker parameters", tab: "stocksense", type: "inventory" },
  { id: 39, text: "Return stock automatic inventory adjustments", tab: "stocksense", type: "inventory" },
  { id: 40, text: "Discrepancies audit reconciliation workbench", tab: "stocksense", type: "inventory" },
  { id: 41, text: "Demand trend charts mapped by catalog products", tab: "stocksense", type: "inventory" },
  { id: 42, text: "Predicted seasonal demand forecasts index", tab: "stocksense", type: "inventory" },
  { id: 43, text: "Dead stock report tracker with quick liquidation triggers", tab: "stocksense", type: "inventory" },
  { id: 44, text: "Direct rank table of bestselling catalog models", tab: "dashboard", type: "inventory" },
  { id: 45, text: "Dynamic restocking suggestions on demand rises", tab: "stocksense", type: "inventory" },
  { id: 46, text: "Multi-branch digital inventory hub selector", tab: "stocksense", type: "inventory" },
  { id: 47, text: "Central warehouse ledger configurations", tab: "stocksense", type: "inventory" },
  { id: 48, text: "Branch stock-level mismatch analytics matrix", tab: "stocksense", type: "inventory" },
  { id: 49, text: "Branch-wise dynamic demand variance trends", tab: "stocksense", type: "inventory" },
  { id: 50, text: "Unified universal catalog synced across multi-locations", tab: "stocksense", type: "inventory" },

  // --- COST MANAGEMENT (51 - 75) ---
  { id: 51, text: "Daily ledger expense log categorized by tax groups", tab: "costguard", type: "costs" },
  { id: 52, text: "Recurring lease & subscriptions tracker dashboard", tab: "costguard", type: "costs" },
  { id: 53, text: "Receipt scanner & OCR file system organizer", tab: "notepad", type: "costs" },
  { id: 54, text: "Staff payroll, hourly hours & shift expenses panel", tab: "costguard", type: "costs" },
  { id: 55, text: "Water, electricity & power utility consumption logger", tab: "costguard", type: "costs" },
  { id: 56, text: "Dynamic Profit & Loss (P&L) statement forecast charts", tab: "costguard", type: "costs" },
  { id: 57, text: "Actual revenue vs operational costs discrepancy charts", tab: "costguard", type: "costs" },
  { id: 58, text: "Rolling daily/monthly cash flow timeline tracker", tab: "costguard", type: "costs" },
  { id: 59, text: "Financial statements compiler (PDF/XLS preview)", tab: "costguard", type: "costs" },
  { id: 60, text: "Direct break-even point analyzer calculator", tab: "pricing", type: "costs" },
  { id: 61, text: "Category-level monthly bounds budget sets", tab: "costguard", type: "costs" },
  { id: 62, text: "Real-time alarms on exceeding set budgets", tab: "costguard", type: "costs" },
  { id: 63, text: "Direct margins savings suggestions sidebar", tab: "costguard", type: "costs" },
  { id: 64, text: "Isolated safety emergency fund progress bar", tab: "costguard", type: "costs" },
  { id: 65, text: "Core financial business goals tracker KPI logs", tab: "costguard", type: "costs" },
  { id: 66, text: "Digital invoice creator with secure share link generator", tab: "costguard", type: "costs" },
  { id: 67, text: "Payment collections monitor (Paid, Pending, Overdue)", tab: "costguard", type: "costs" },
  { id: 68, text: "Automated cron payment invoice follow-ups", tab: "workflows", type: "costs" },
  { id: 69, text: "Comprehensive split payment logs (Card, Cash, QR)", tab: "costguard", type: "costs" },
  { id: 70, text: "GST/VAT tax slab auto-calculation report helper", tab: "costguard", type: "costs" },
  { id: 71, text: "Supplier wholesale purchase cost archive trends", tab: "costguard", type: "costs" },
  { id: 72, text: "Lower wholesale supplier warning alarms", tab: "costguard", type: "costs" },
  { id: 73, text: "Batch order planning & logistics budget parameters", tab: "costguard", type: "costs" },
  { id: 74, text: "Purchase unit-cost fluctuation tracking system", tab: "costguard", type: "costs" },
  { id: 75, text: "Procurement price negotiation log entries workspace", tab: "notepad", type: "costs" },

  // --- ANALYTICS & REPORTING (76 - 85) ---
  { id: 76, text: "Universal 360 Business Dashboard (Sales, Stock, Retention)", tab: "dashboard", type: "analytics" },
  { id: 77, text: "Weekly/Monthly automatic business summaries", tab: "dashboard", type: "analytics" },
  { id: 78, text: "CLV (Customer Lifetime Value) live cohort models", tab: "retainflow", type: "analytics" },
  { id: 79, text: "Loyal customer cohort tier lists creator", tab: "contacts", type: "analytics" },
  { id: 80, text: "Revenue breakdown charts mapped by categorization", tab: "dashboard", type: "analytics" },
  { id: 81, text: "Staff service conversions performance lists", tab: "contacts", type: "analytics" },
  { id: 82, text: "Historical performance overlay index datasets", tab: "dashboard", type: "analytics" },
  { id: 83, text: "Universal print-to-PDF / copy csv format exporters", tab: "dashboard", type: "analytics" },
  { id: 84, text: "Dynamic reports builder with custom drag parameters", tab: "dashboard", type: "analytics" },
  { id: 85, text: "Primary OKR & KPI target milestones track lines", tab: "dashboard", type: "analytics" },

  // --- OPERATIONS & MANAGEMENT (86 - 95) ---
  { id: 86, text: "Booking & service times schedule agenda calendar", tab: "notepad", type: "ops" },
  { id: 87, text: "Staff shift rotations & calendar planners", tab: "workflows", type: "ops" },
  { id: 88, text: "Task checklist delegation workflow system board", tab: "workflows", type: "ops" },
  { id: 89, text: "Business Operating Procedures standard SOP card folders", tab: "notepad", type: "ops" },
  { id: 90, text: "File organizer, catalogs, licensing, digital storage", tab: "notepad", type: "ops" },
  { id: 91, text: "Granular access level parameters (Manager, Staff)", tab: "settings", type: "ops" },
  { id: 92, text: "Sub-account profiles and roles configurations", tab: "settings", type: "ops" },
  { id: 93, text: "Real-time activity audit trails dashboard logs", tab: "dashboard", type: "ops" },
  { id: 94, text: "Online unique profile hub (Shareable business landing)", tab: "community", type: "ops" },
  { id: 95, text: "Customer walk-in QR code ticket check-ins scanner", tab: "community", type: "ops" },

  // --- PLATFORM & INTEGRATIONS (96 - 105) ---
  { id: 96, text: "Adaptive mobile browser and web layouts sync", tab: "settings", type: "platform" },
  { id: 97, text: "Native WhatsApp sandbox messaging endpoints channel", tab: "social_omni", type: "platform" },
  { id: 98, text: "Stripe Payment processor integration module", tab: "pricing", type: "platform" },
  { id: 99, text: "Google Maps directions and location widget map", tab: "contacts", type: "platform" },
  { id: 100, text: "Direct Instagram & Meta DM feed pipeline listeners", tab: "social_omni", type: "platform" },
  { id: 101, text: "Universal POS system billing hardware adapter link", tab: "settings", type: "platform" },
  { id: 102, text: "Financial spreadsheets & ledger bookkeeping converters", tab: "costguard", type: "platform" },
  { id: 103, text: "Local storage fallback script (Safe local draft updates)", tab: "settings", type: "platform" },
  { id: 104, text: "Language translates selector sandbox", tab: "settings", type: "platform" },
  { id: 105, text: "Automatic database offline cloud synchronization controls", tab: "settings", type: "platform" },

  // --- AI & SMART (106 - 115) ---
  { id: 106, text: "Aria Smart Auto-Reply answers generator in social logs", tab: "aria", type: "ai" },
  { id: 107, text: "Predictive restocking stock quantity calculation algorithms", tab: "stocksense", type: "ai" },
  { id: 108, text: "Customer attrition risks scoring systems classifier", tab: "retainflow", type: "ai" },
  { id: 109, text: "Custom automated client discounts draft copy writing", tab: "aria", type: "ai" },
  { id: 110, text: "Voice audio search instructions transcript compiler", tab: "aria", type: "ai" },
  { id: 111, text: "Aria executive performance highlights analyzer", tab: "dashboard", type: "ai" },
  { id: 112, text: "Sub-account ledger automated tagging parameters", tab: "costguard", type: "ai" },
  { id: 113, text: "Product trends correlation calculations core", tab: "stocksense", type: "ai" },
  { id: 114, text: "Comprehensive automated text summaries exports generator", tab: "notepad", type: "ai" },
  { id: 115, text: "Intelligent commands system matching quick navigation", tab: "dashboard", type: "ai" },

  // --- SUPPORT & ONBOARDING (116 - 125) ---
  { id: 116, text: "Fast setup configuration templates", tab: "settings", type: "support" },
  { id: 117, text: "Uncapped lifetime trial variables sandbox", tab: "pricing", type: "support" },
  { id: 118, text: "Aria step tutorials workspace documentations", tab: "aria", type: "support" },
  { id: 119, text: "Aria Support ticket help chat panels", tab: "aria", type: "support" },
  { id: 120, text: "Fast WhatsApp feedback report channels", tab: "community", type: "support" },
  { id: 121, text: "Owner forum threads links", tab: "community", type: "support" },
  { id: 122, text: "Daily mini growth tips tickers widget", tab: "dashboard", type: "support" },
  { id: 123, text: "Pre-templated standard invoice designs", tab: "costguard", type: "support" },
  { id: 124, text: "Legacy XLS bookkeeping spreadsheets parser wizard", tab: "costguard", type: "support" },
  { id: 125, text: "Human onboarding operator chat request log", tab: "aria", type: "support" }
];

// Direct correlation matrix mapping a Problem with solved Features
const PROBLEM_TO_FEATURE_MAP: Record<number, number[]> = {
  // Client Retention
  1: [1, 3, 13, 14, 78],  // High cost of getting new customers solved by CRM tags, segmentation, referral tracking, cohort model
  2: [1, 4, 116],        // No onboarding -> CRM notes, preset setup instructions
  3: [1, 16, 17, 18],     // Bad impression -> feedback system, customer complaints ticket
  4: [6, 9, 21, 24],      // No follow-up -> automated WhatsApp, mis-you sequence
  5: [11, 12, 14, 15],    // No welcome offers -> Points loyalty, gold/silver tiers, stamp passes
  6: [6, 7, 10, 97],      // No regular communication -> WA/Sms notifications, Email builder, WhatsApp integration
  7: [1, 2, 4],           // Forget preference -> CRM preference log, purchase histories
  8: [3, 9, 15, 109],     // No personalization -> segment messages, VIP status, AI generator
  9: [106, 97, 100],      // Slow response -> Aria auto-replies, WhatsApp & Insta DM sync
  10: [104],              // Language barriers -> multi-language templates translation sync
  11: [11, 12, 15],       // No loyalty program -> stamp pass, loyalty structures, tiers
  12: [6, 21, 23],        // Customers forget -> automated "we miss you", seasonal campaigns
  13: [13],               // No referral -> referral tracking conversions
  14: [14, 15, 109],      // Competitors offer better -> retention discount sandbox, AI promo writer
  15: [5],                // Anniversary -> birthdays tracking calendar
  16: [16, 17, 20],       // Inconsistent quality -> review requests loop, checkouts rating, NPS tracking
  17: [18, 81],           // Staff behavior -> complaint logs, staff conversions analyzer
  18: [18, 86],           // Delay waiting -> ticketing systems, booking calendars scheduling
  19: [18],               // No support -> ticket audits
  20: [18, 20],           // Handled poorly -> ticket auditing, NPS
  21: [94],               // No digital presence -> public profile hub link
  22: [94, 97, 22],       // No app/WA ordering -> WhatsApp channel integration, public profile ordering
  23: [16, 17],           // Not collecting review -> automated feedback loop
  24: [17, 19],           // Bad reviews -> feedback rating filter, positive review highlights on cards
  25: [100, 8, 97],       // No social engagement -> Instagram integration, push notifications

  // Inventory Control
  26: [26, 43, 107],      // Overstocking -> real-time monitor, dead stock list, predicted restocking AI
  27: [26, 29, 35, 107],  // Understocking -> real-time monitor, warning alerts, automatic reorder trigger scripts, AI restocking
  28: [26, 46],           // No real-time track -> stock count monitor, multi-branch dashboard
  29: [26, 28, 47],       // Manual tracking errors -> stock counts, QR scanner simulator, central warehouse sync
  30: [27, 50],           // Variants -> variant matrix, unified synced catalog
  31: [31, 34],           // Bad suppliers -> Supplier directory, ETAs transit tracker
  32: [32, 73],           // MOQs too high -> PO log tracker, bulk planning tools
  33: [31, 33],           // No backup supplier -> supplier backup roster directories, supplier quotes compare
  34: [33, 75],           // Bad purchase price -> quote comparing catalog, negotiation logs
  35: [34, 35],           // Delayed delivery -> ETA tracking, automated low warning reorder triggers
  36: [47],               // Limited storage -> warehouse configurations
  37: [38],               // damaged stock -> damage journal tracker
  38: [30],               // perishable expiring -> batch expiration countdown tracker
  39: [28, 50],           // No labels -> QR creator barcodes, catalog sync
  40: [40],               // theft -> audit mismatch reconciler
  41: [42, 113],          // seasonal prediction -> demand forecasts, trend correlations AI
  42: [43, 113],          // dead stock -> dead stock reporting lists, quick liquify AI recommendation
  43: [41, 44, 48],       // no sales trends data -> product demand logs, bestseller rank charts
  44: [42, 45, 107],      // buying on gut -> predictions, restocking AI
  45: [29, 107],          // sudden spike -> early low warning warnings, AI predictions
  46: [46],               // No software -> multi-branch inventory dashboard
  47: [47, 124],          // Spreadsheets -> warehouse system, importer wizard converter
  48: [28],               // No barcodes -> QR simulator
  49: [46, 48, 50],       // Not synced -> branch mismatches, sync catalog
  50: [29, 35],           // No low alerts -> warning alerts push, auto reorder scripts

  // Rising Costs
  51: [52, 61],           // Rent -> lease tracker, categories budget cap
  52: [52, 55],           // Utility bills -> utilities tracker, subscription panel
  53: [55, 61],           // Water bills -> utility consumption logs, category budget
  54: [51, 61],           // Repairs -> expense journals, margin logs
  55: [51],               // fuel -> category log
  56: [54],               // Min wage -> staff shift expenses
  57: [54, 87, 88],       // Staff turnover -> shift planners, task checklists delegation lists
  58: [89],               // Training -> Procedures SOP folders
  59: [87, 88],           // Absenteeism -> shift planners, delegate panels
  60: [54, 87],           // Idle staff -> shift rotation calendar planners
  61: [71, 74],           // Raw materials rise -> supplier cost trends, unit-cost fluctuations
  62: [31, 33, 72],       // Supplier price hike -> alternative supplier directory, low wholesale alarms
  63: [70],               // tax rise -> VAT slab calculative reports
  64: [71, 74],           // packaging rise -> units cost fluctuations logs
  65: [73],               // freight cost rise -> batch order logistics analyzer
  66: [67, 109, 21],      // paid ads rise -> SEO public landing link, free auto-emails VIP winbacks, AI copy generator
  67: [67, 94, 109],      // no budget -> public business page, AI copywriting helper logs
  68: [6, 7],             // printing costs -> paperless digital notifications
  69: [94, 122],          // influencer costs -> customer referral converting logs, growth tips ticker
  70: [80, 85],           // no ROI tracking -> category sales revenue breakdown logs, OKR milestone tracks
  71: [52, 63],           // software subscriptions -> lease logging, subscriptions consolidation wizard
  72: [101, 69],          // POS fees -> POS billing hardware links, split payment logs
  73: [94],               // hosting costs -> integrated free public directory card
  74: [105, 103],         // security costs -> offline auto sync protocols, local storage secure buffers
  75: [75],               // hardware upgrade -> hardware maintenance checklists
  76: [70],               // VAT filing cost -> automated report slabs helper
  77: [59, 102],          // accountant fee -> XLSX financial export compiler
  78: [79],               // license fees -> OKR milestone trackers
  79: [89],               // compliance costs -> digital SOP procedure compliance logs
  80: [68, 80],           // late penalties -> automated client billing logs, AR targets
  81: [58, 66, 67],       // cash flow gaps -> roll timeline trackers, invoice creators, payment status collections
  82: [64],               // empty reserves -> emergency buffer progress tracker
  83: [60, 63],           // high interest loans -> break-even point logs, consolidated budget advisors
  84: [56, 57, 84],       // no budget planning -> P&L statements, budget comparison actuals, custom builder
  85: [51, 102],          // mixing assets -> categorized corporate ledger, export formats

  // Cross-cutting ops
  86: [76, 111],          // No management software -> universal 360 dashboard, Aria analytical insights
  87: [87, 88, 91],       // Owner solo -> shift calendars, delegated checklists, manager roles levels
  88: [76, 77, 82],       // No data decision -> universal dashboard graphs, performance reviews overlay
  89: [94, 96, 105],      // lack of transformation -> public web landing, adaptive styles, online db syncing
  90: [111, 118, 125],     // no advisor -> Aria intelligence highlights, tutorial workspace guides, human onboarding requests
  91: [42, 113],          // seasonal drops -> predictive trend models, seasonal correlations
  92: [11, 13, 94],       // large retailer threat -> loyalty programs, client referrals, optimized public search
  93: [89],               // no procedural SOPs -> operating guides directories
  94: [86, 88],           // bad time mgmt -> booking agendas, delegation boards
  95: [56, 60, 111]       // no financial literacy -> simple P&L forecasts, break-even visualizers, Aria performance summary
};

export default function ProblemFeatureMatrix({ theme, showToast, setCurrentTab }: ProblemFeatureMatrixProps) {
  const isDark = theme === 'dark';
  
  // State
  const [activeTab, setActiveTab] = useState<'scan' | 'blueprint' | 'simulator'>('scan');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'retention' | 'inventory' | 'costs' | 'cross'>('all');
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<'all' | 'retention' | 'inventory' | 'costs' | 'analytics' | 'ops' | 'platform' | 'ai' | 'support'>('all');
  const [simulatorSearchQuery, setSimulatorSearchQuery] = useState('');
  const [simulatorCategoryFilter, setSimulatorCategoryFilter] = useState<'all' | 'retention' | 'inventory' | 'costs' | 'cross'>('all');
  
  // Simulator State
  const [targetProblemToSimulate, setTargetProblemToSimulate] = useState<number>(11); // "No loyalty program" by default
  const [simulatorOutput, setSimulatorOutput] = useState<{
    smsDraft: string;
    alertRule: string;
    actionSteps: string[];
    potentialValue: string;
  }>({
    smsDraft: "🎁 Hey [Name]! To thank you for staying with us, we've loaded 250 points onto your new custom Digital Stamp Pass! Save this link to redeem on your next checkout! [Link]",
    alertRule: "IF Customer Segment === 'VIP' AND Days Since Last Visit >= 14 THEN Trigger: Automated WhatsApp follow-up with personal discount parameter limit (15%)",
    actionSteps: [
      "Access the 'Client Retention Flow' tab to configure points per customer purchase.",
      "Check the 'Unified Social Inbox' to preview the automated Stamp Pass templates.",
      "Dispatch the campaign instantly to VIPs from your active CRM profiles list."
    ],
    potentialValue: "+18% client retention, increasing average lifetime customer value by $450/annum."
  });

  // Toggle problem selection
  const handleToggleProblem = (id: number) => {
    setSelectedProblems(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Select all problems in current filter
  const handleSelectAllFiltered = (filteredIds: number[]) => {
    setSelectedProblems(prev => {
      const alreadyAllSelected = filteredIds.every(id => prev.includes(id));
      if (alreadyAllSelected) {
        // Deselect only these filtered items
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        // Union of currently selected and filtered items
        return Array.from(new Set([...prev, ...filteredIds]));
      }
    });
    showToast("⚡ Bulk selection toggled!");
  };

  // Reset problem choices
  const handleReset = () => {
    setSelectedProblems([]);
    showToast("Cleared selected issues.");
  };

  // Filtered list of problems
  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(prob => {
      const matchesCat = categoryFilter === 'all' || prob.category === categoryFilter;
      const matchesSearch = prob.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prob.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            `#${prob.id}`.includes(searchQuery);
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Derived recommendation features
  const recommendedFeatures = useMemo(() => {
    const featureIdsSet = new Set<number>();
    selectedProblems.forEach(pId => {
      const linked = PROBLEM_TO_FEATURE_MAP[pId] || [];
      linked.forEach(fId => featureIdsSet.add(fId));
    });
    
    return FEATURES.filter(feat => featureIdsSet.has(feat.id));
  }, [selectedProblems]);

  // Combined filtered features for Master catalog
  const filteredFeatures = useMemo(() => {
    const source = selectedProblems.length > 0 ? recommendedFeatures : FEATURES;
    return source.filter(feat => {
      const matchesCat = featureCategoryFilter === 'all' || feat.type === featureCategoryFilter;
      const matchesSearch = feat.text.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
                            `#${feat.id}`.includes(featureSearchQuery) ||
                            feat.tab.toLowerCase().includes(featureSearchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedProblems, recommendedFeatures, featureCategoryFilter, featureSearchQuery]);

  // Combined filtered problems for simulator picker (no slice!)
  const filteredSimulatorProblems = useMemo(() => {
    return PROBLEMS.filter(prob => {
      const matchesCat = simulatorCategoryFilter === 'all' || prob.category === simulatorCategoryFilter;
      const matchesSearch = prob.text.toLowerCase().includes(simulatorSearchQuery.toLowerCase()) ||
                            prob.sub.toLowerCase().includes(simulatorSearchQuery.toLowerCase()) ||
                            `#${prob.id}`.includes(simulatorSearchQuery);
      return matchesCat && matchesSearch;
    });
  }, [simulatorCategoryFilter, simulatorSearchQuery]);

  // Calculate simulated business health metric
  const calculatedHealthImpact = useMemo(() => {
    const totalCount = PROBLEMS.length;
    const selectedCount = selectedProblems.length;
    if (selectedCount === 0) return { score: 100, label: "EXCELLENT", color: "text-emerald-500", progressColor: "bg-emerald-500" };
    
    // Each selected problem decreases baseline health
    const score = Math.max(15, 100 - Math.round((selectedCount / totalCount) * 120));
    if (score >= 80) return { score, label: "STABLE", color: "text-amber-500", progressColor: "bg-amber-500" };
    if (score >= 50) return { score, label: "RISK EXPOSURE", color: "text-amber-600", progressColor: "bg-amber-600" };
    return { score, label: "CRITICAL ACTION REQUESTED", color: "text-rose-500", progressColor: "bg-rose-500" };
  }, [selectedProblems]);

  // Handle choice of problem to simulate in the playground
  const handleSelectSimulationProblem = (probId: number) => {
    setTargetProblemToSimulate(probId);
    const prob = PROBLEMS.find(p => p.id === probId);
    if (!prob) return;

    // Direct mapping rules to change the simulated output parameters based on categories
    let sms = "";
    let alertText = "";
    let value = "";
    let steps: string[] = [];

    if (prob.category === 'inventory') {
      sms = `⚠️ STOCKOUT PREVENTION ORDER:\nRef: Reorder-Stock-#${prob.id}\nAuto SKU restock trigger dispatched to primary supplier directory due to falling below safety buffer threshold level. Confirm wholesale quotes below!`;
      alertText = `IF SKU stockLevel <= ThresholdValue(${prob.id}) THEN Action: Generate automated draft PO for Supplier Backup, and send urgent system warning.`;
      value = "Safeguards replenishment times, eliminating dead assets while securing +24% stock availability.";
      steps = [
        "Go to the 'StockSense Hub' tab to verify the current variant stock levels.",
        "Check your 'Supplier Price Comparison Directory' under CostGuard logs to audit wholesale quotes.",
        "Launch our 'Dynamic Restocking suggestions' tool for automated quantity recommendations."
      ];
    } else if (prob.category === 'costs') {
      sms = `📊 RISING EXPENSE LEAK CORRECTED:\nCategory: ${prob.sub}\nAction: Auto-flagging sub-contract subscription fees exceeding specified corporate budget parameters. Consolidating billing details.`;
      alertText = `IF DailyExpenseCategory('${prob.sub}') >= AllocatedMonthlyBudget(${prob.id}) THEN Action: Lock further checkout variances and push immediate warnings to account administrator client.`;
      value = "Saves upwards of $240 to $850 in unnecessary recurring sublicensing monthly runrates.";
      steps = [
        "Navigate to the 'CostGuard Margins' pane in your sidebar view.",
        "Upload receipts and active subscriptions to our automatic ledger categorized scanner.",
        "Calculate your corporate break-even timeline thresholds in our 'Pricing & Plans' engine."
      ];
    } else {
      sms = `✨ CAMPAIGN DRAFT [${prob.text}]:\nHi [Customer Name]! We noticed it's been a while since your last visit. We've compiled a special welcome discount sequence just for you. Claim your 15% code here: [Link]`;
      alertText = `IF Client Status === 'silenced' AND ProfileSegement === 'VIP' THEN Action: Initiate bulk WhatsApp re-engagement drip with a personalized offer template generator.`;
      value = "Unlocks direct retention gains, converting at least 15% of previously dormant small business accounts.";
      steps = [
        "Select the 'Client Retention' hub to classify segments of inactives.",
        "Go to 'Unified Social Inbox' containing your Instagram and WhatsApp sandbox pipelines.",
        "Enable the 'Aria Auto-Reply' assist tool to formulate answers to custom customer queries."
      ];
    }

    setSimulatorOutput({
      smsDraft: sms,
      alertRule: alertText,
      potentialValue: value,
      actionSteps: steps
    });
    showToast(`🎯 Formulated dynamic simulation parameters for Problem #${probId}!`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Copied output text to clipboard!");
  };

  return (
    <div className="space-y-5 select-none text-left">
      {/* HEADER BANNER */}
      <div className={`p-5 rounded-[20px] border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-gradient-to-tr from-[#211F1D] to-[#1C1917] border-[#37312C] text-[#F5F5F4]' : 'bg-white border-stone-200 text-[#1C1917]'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Diagnostic Core
            </span>
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
          </div>
          <h2 className="text-lg font-black tracking-tight mt-1.5 flex items-center gap-1.5">
            <Sliders className="text-amber-500" size={18} />
            Small Business Problem & Solution Matrix
          </h2>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-xl">
            A comprehensive mapping grid connecting <strong>95 small business pain points</strong> across Client Retention, Inventory Control, and Escalating Overhead Costs directly to <strong>125 actionable Forge AI tech solutions</strong>.
          </p>
        </div>

        {/* Dynamic Health Score Tracker */}
        <div className={`p-3 px-4.5 rounded-xl border flex items-center gap-3 shrink-0 ${
          isDark ? 'bg-stone-900/60 border-stone-850' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="space-y-1">
            <p className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-extrabold text-right">Owner Pain Level</p>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className={`text-base font-black font-mono ${calculatedHealthImpact.color}`}>{selectedProblems.length}</span>
              <span className="text-[9px] text-neutral-400">/ 95 Active</span>
            </div>
            <p className="text-[8px] text-neutral-450 text-right font-black uppercase tracking-wider">{calculatedHealthImpact.label}</p>
          </div>
          <div className="w-px h-10 bg-stone-200 dark:bg-stone-800" />
          <div>
            <p className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-extrabold">Simulated Resilience Score</p>
            <div className="text-base font-mono font-black text-amber-500 mt-0.5">{calculatedHealthImpact.score}%</div>
            {/* simple horizontal bar */}
            <div className="w-20 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mt-1">
              <div className={`h-full ${calculatedHealthImpact.progressColor}`} style={{ width: `${calculatedHealthImpact.score}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX TABS */}
      <div className="flex border-b border-stone-200 dark:border-stone-850 gap-1.5">
        {[
          { id: 'scan', label: '1. Diagnostic Problem Scan', icon: ShieldAlert, count: selectedProblems.length },
          { id: 'blueprint', label: '2. 125 Master Feature Blueprint', icon: Sparkles, count: recommendedFeatures.length || FEATURES.length },
          { id: 'simulator', label: '3. Solution Playground Simulator', icon: Play, alert: true }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-500 font-black'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Icon size={13} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 ? (
                <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold font-mono border border-amber-500/20">
                  {tab.count}
                </span>
              ) : null}
              {tab.alert && (
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* VIEWPORT AREA */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: DIAGNOSTIC SCAN */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              
              {/* Executive Overview Panel */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-stone-950/40 border-stone-850' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded bg-amber-500/10 text-amber-500"><ShieldAlert size={14} /></span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-stone-200">
                    Understanding the Diagnostic Problem Matrix
                  </h4>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  The **Diagnostic Problem Matrix** is an advanced operational framework containing **95 real-world small business pain points** spanning Client Retention, Inventory Controls, Overhead Costs, and Cross-Ops. 
                  By selecting your bottlenecks, our engine executes a **Cross-Correlation Sweep** to map those problems directly onto the **125 Master Feature Blueprints** in Forge AI.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3.5 pt-3.5 border-t border-dashed border-stone-100 dark:border-stone-850/60">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-500 block">1. SCAN bottlenecks</span>
                    <p className="text-[10px] text-neutral-400">Toggle active problems below. The risk meter tracks operational metrics and active business friction index levels.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-500 block">2. TRACE BLUEPRINTS</span>
                    <p className="text-[10px] text-neutral-400">The matrix matches features instantly in the Blueprint panel, letting you click to jump straight onto active CRM/Inbox tabs!</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-500 block">3. SIMULATE SOLUTIONS</span>
                    <p className="text-[10px] text-neutral-400">Navigate to the Simulator playground to formulate SMS/WhatsApp drafts, webhook pipeline rules, and SOP correction maps.</p>
                  </div>
                </div>
              </div>

              {/* FILTERS PANEL */}
              <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
                isDark ? 'bg-stone-900/40 border-stone-850' : 'bg-stone-50 border-stone-200'
              }`}>
                {/* Freeform Search */}
                <div className="relative w-full md:max-w-xs">
                  <Search size={13} className="absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search 95 problem statements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-amber-500/80 transition-all ${
                      isDark 
                        ? 'bg-stone-950/60 border-stone-800 text-stone-100 placeholder-stone-500' 
                        : 'bg-white border-stone-300 text-[#1C1917] placeholder-stone-400'
                    }`}
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0 justify-start">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'retention', label: 'CRM & Client Retention (1-25)' },
                    { id: 'inventory', label: 'Inventory Controls (26-50)' },
                    { id: 'costs', label: 'Overhead Costs (51-85)' },
                    { id: 'cross', label: 'Cross-Ops Mappings (86-95)' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        categoryFilter === cat.id
                          ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/10'
                          : isDark
                          ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:bg-stone-850'
                          : 'bg-stone-100 border-stone-250 text-stone-600 hover:text-black hover:bg-stone-150'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Clear Selected / Bulk actions */}
                <div className="flex gap-2 shrink-0 justify-end w-full md:w-auto">
                  <button
                    onClick={() => handleSelectAllFiltered(filteredProblems.map(p => p.id))}
                    className={`px-3 py-1 text-[9.5px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${
                      isDark
                        ? 'bg-stone-850 hover:bg-stone-800 border-stone-800 text-[#E7E5E4]'
                        : 'bg-stone-100 hover:bg-stone-150 border-stone-200 text-stone-700'
                    }`}
                    title="Toggle selections for all listed items below"
                  >
                    Invert list Selection
                  </button>
                  {selectedProblems.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="px-3 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[9.5px] font-black uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Clear ({selectedProblems.length})
                    </button>
                  )}
                </div>
              </div>

              {/* GRID OF INSTRUCTION PROBLEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProblems.map(prob => {
                  const isChecked = selectedProblems.includes(prob.id);
                  return (
                    <div
                      key={prob.id}
                      onClick={() => handleToggleProblem(prob.id)}
                      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left flex items-start gap-3 relative overflow-hidden group ${
                        isChecked
                          ? isDark
                            ? 'bg-amber-500/5 border-amber-550 shadow-sm shadow-amber-500/5'
                            : 'bg-amber-500/5 border-amber-500/60 shadow-xs'
                          : isDark
                          ? 'bg-neutral-900/60 hover:bg-[#211F1D] border-neutral-800/85 hover:border-neutral-750'
                          : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-250 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                      }`}
                    >
                      {/* Check indicator circle */}
                      <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-black font-extrabold'
                          : isDark ? 'border-stone-700' : 'border-stone-300'
                      }`}>
                        {isChecked && <Check size={10} className="stroke-[3.5]" />}
                      </div>

                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8px] font-mono p-0.5 px-1 bg-neutral-100 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-850/60 rounded text-neutral-400">
                            #{prob.id}
                          </span>
                          <span className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">
                            {prob.sub}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold leading-relaxed tracking-tight ${
                          isChecked ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {prob.text}
                        </p>
                      </div>

                      {/* Accent highlight strip */}
                      {isChecked && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
                      )}
                    </div>
                  );
                })}

                {filteredProblems.length === 0 && (
                  <div className="col-span-full py-16 text-center text-stone-500">
                    <p className="text-xs italic">No pain point matched search parameters</p>
                    <button onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }} className="mt-2 text-[10px] text-amber-500 underline font-black uppercase">Reset Filter Search</button>
                  </div>
                )}
              </div>

              {/* ACTION: MAP ACTIVE RESOLUTIONS AND DEPLOY */}
              <div className={`p-5 rounded-[20px] border flex flex-col md:flex-row items-center justify-between gap-5 ${
                isDark ? 'bg-stone-950/40 border-stone-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-stone-200">
                    {selectedProblems.length === 0 ? "Step 1: Select Problems Above" : `Mapped Solutions Available: ${recommendedFeatures.length} Dynamic Features`}
                  </h4>
                  <p className="text-[10px] text-neutral-400">
                    {selectedProblems.length === 0 
                      ? "Select one or more small business problems from the matrix above, then click Map Resolutions to render linked platform features!"
                      : `You've identified ${selectedProblems.length} client / inventory pain points. We've matched ${recommendedFeatures.length} precise features within Forge AI to solve them!`
                    }
                  </p>
                </div>

                <div className="flex gap-2">
                  {selectedProblems.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveTab('blueprint');
                        showToast("🔍 Mapped problems to the 125 Feature Blueprint!");
                      }}
                      className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-black text-[10px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <span>Render Matrix Map Blueprint ({recommendedFeatures.length})</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER FEATURE BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-center gap-4 ${
                isDark ? 'bg-stone-900/40 border-stone-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-white">
                    {selectedProblems.length > 0 ? `Dynamic Diagnostics Map: ${recommendedFeatures.length} Features Loaded` : "Master Platform Catalog: 125 Solved Features Listed"}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {selectedProblems.length > 0 
                      ? `Showing only optimized features linked directly to your selected ${selectedProblems.length} diagnostic problems. Click any feature's card to navigate to its functional tab!`
                      : "Displaying the complete matrix catalog of all 125 platform competencies. Click on a specific feature to view its corresponding system module tab in your sidebar."
                    }
                  </p>
                </div>

                {selectedProblems.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedProblems([]);
                      showToast("Loaded full 125 catalog.");
                    }}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                      isDark ? 'bg-stone-900 border-stone-820 hover:bg-stone-800 text-stone-300' : 'bg-white border-stone-250 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    Show Full 125 Features Catalog
                  </button>
                )}
              </div>

              {/* FEATURES FILTERS & SEARCH ROW */}
              <div className={`p-3 rounded-xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
                isDark ? 'bg-stone-900/20 border-stone-850' : 'bg-stone-50/50 border-stone-200'
              }`}>
                {/* Search */}
                <div className="relative w-full md:max-w-xs">
                  <Search size={13} className="absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search 125 features, tabs..."
                    value={featureSearchQuery}
                    onChange={(e) => setFeatureSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-amber-500/80 transition-all ${
                      isDark 
                        ? 'bg-stone-950/60 border-stone-800 text-stone-100 placeholder-stone-500' 
                        : 'bg-white border-stone-300 text-[#1C1917] placeholder-stone-400'
                    }`}
                  />
                  {featureSearchQuery && (
                    <button 
                      onClick={() => setFeatureSearchQuery('')} 
                      className="absolute right-3 top-2 text-[10px] font-bold text-neutral-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0 justify-start">
                  {[
                    { id: 'all', label: 'All features' },
                    { id: 'retention', label: 'Retention' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'costs', label: 'Costs' },
                    { id: 'analytics', label: 'Analytics' },
                    { id: 'ops', label: 'Ops' },
                    { id: 'platform', label: 'Platform' },
                    { id: 'ai', label: 'AI' },
                    { id: 'support', label: 'Support' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFeatureCategoryFilter(cat.id as any)}
                      className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        featureCategoryFilter === cat.id
                          ? 'bg-amber-500 text-black border-amber-500'
                          : isDark
                          ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                          : 'bg-stone-100 border-stone-250 text-stone-600 hover:bg-stone-200 hover:text-black font-semibold'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST GRID OF 125 FEATURES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredFeatures.map(feat => {
                  return (
                    <div
                      key={feat.id}
                      onClick={() => {
                        setCurrentTab(feat.tab);
                        showToast(`🚀 Navigated to ${feat.tab.toUpperCase()} sidebar hub to handle Feature #${feat.id}: "${feat.text}"`);
                      }}
                      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group hover:scale-[1.01] hover:shadow-xs ${
                        isDark
                          ? 'bg-neutral-900/60 border-neutral-800/80 hover:bg-[#211F1D] hover:border-amber-500/40'
                          : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-amber-500/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                      }`}
                    >
                      <div>
                        {/* Upper line */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 p-0.5 px-1 rounded-sm border border-amber-500/10 font-bold">
                            F-#{feat.id}
                          </span>
                          <span className={`text-[8.5px] font-black uppercase tracking-wider ${
                            feat.type === 'retention' ? 'text-blue-500' :
                            feat.type === 'inventory' ? 'text-emerald-500' :
                            feat.type === 'costs' ? 'text-purple-500' : 'text-amber-500'
                          }`}>
                            {feat.type}
                          </span>
                        </div>

                        <p className="text-xs font-semibold leading-relaxed tracking-tight text-neutral-850 dark:text-[#E7E5E4] group-hover:text-amber-500 transition-colors">
                          {feat.text}
                        </p>
                      </div>

                      {/* Lower Tag & navigation arrow */}
                      <div className="mt-4 pt-2.5 border-t border-stone-100 dark:border-stone-850/60 flex items-center justify-between">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-[#A8A29E] dark:text-stone-400 font-mono">
                          Tab: {feat.tab}
                        </span>
                        <ArrowRight size={11} className="text-neutral-450 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EMPTY CORRELATION HANDLING */}
              {selectedProblems.length > 0 && recommendedFeatures.length === 0 && (
                <div className="py-20 text-center text-stone-500">
                  <p className="text-xs italic">No matching automated features resolved selected subset of parameters.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOLUTION PLAYGROUND SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              
              {/* LEFT SIDE PANEL: Select specific problem to generate blueprint playground */}
              <div className="xl:col-span-4 flex flex-col space-y-3">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-900/40 border-stone-850' : 'bg-stone-50 border-stone-200'}`}>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1917] dark:text-white">
                    1. Choose Target Client/Stock Pain Point
                  </h3>
                  <p className="text-[9.5px] text-neutral-400 mt-1">
                    Select any small business problem below to formulate simulated resolution paths, automated SMS outreach copy, and proactive rules!
                  </p>
                </div>

                {/* Search & filters for Simulator picker */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search 95 simulator pain points..."
                      value={simulatorSearchQuery}
                      onChange={(e) => setSimulatorSearchQuery(e.target.value)}
                      className={`w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border focus:outline-none focus:border-amber-500/80 transition-all ${
                        isDark 
                          ? 'bg-stone-950/60 border-stone-800 text-stone-100 placeholder-stone-500' 
                          : 'bg-white border-stone-300 text-[#1C1917] placeholder-stone-400 font-semibold'
                      }`}
                    />
                  </div>

                  <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                    {[
                      { id: 'all', label: 'All (95)' },
                      { id: 'retention', label: 'Retention' },
                      { id: 'inventory', label: 'Inventory' },
                      { id: 'costs', label: 'Costs' },
                      { id: 'cross', label: 'Cross-Ops' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSimulatorCategoryFilter(cat.id as any)}
                        className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                          simulatorCategoryFilter === cat.id
                            ? 'bg-amber-500 text-black border-amber-500'
                            : isDark
                            ? 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                            : 'bg-stone-100 border-stone-250 text-stone-600 hover:bg-stone-200 hover:text-black font-semibold'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scannable problem picker select strip */}
                <div className={`border rounded-xl p-2 max-h-[360px] overflow-y-auto space-y-1.5 ${
                  isDark ? 'bg-stone-950/60 border-stone-850' : 'bg-white border-stone-200'
                }`}>
                  {filteredSimulatorProblems.map(prob => {
                    const isTarget = targetProblemToSimulate === prob.id;
                    return (
                      <button
                        key={prob.id}
                        onClick={() => handleSelectSimulationProblem(prob.id)}
                        className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          isTarget
                            ? isDark ? 'bg-amber-500/10 text-white border border-amber-500/30' : 'bg-amber-500/10 border border-amber-500/20 text-black'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        <span className="text-[8px] font-mono bg-neutral-200 dark:bg-stone-800 p-0.5 px-1 rounded-xs font-black text-neutral-450 mt-0.5 shrink-0">
                          #{prob.id}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold block uppercase tracking-wide text-neutral-400">{prob.sub}</p>
                          <p className="text-xs font-semibold leading-snug truncate">{prob.text}</p>
                        </div>
                      </button>
                    );
                  })}
                  {filteredSimulatorProblems.length === 0 && (
                    <p className="text-[10px] text-center italic text-stone-500 py-6">No problems matched search parameters</p>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE PANEL: Live Campaign Copy Generator & Smart Actions */}
              <div className="xl:col-span-8 flex flex-col justify-between space-y-4">
                
                {/* ACTIVE SIMULATION BANNER */}
                <div className={`p-5 rounded-[20px] border relative overflow-hidden ${
                  isDark ? 'bg-gradient-to-tr from-[#1E1B18] to-[#1C1917] border-[#37312C]' : 'bg-[#FAF9F6] border-stone-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="p-1 px-2.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                        Active Simulation Parameter: P-#{targetProblemToSimulate}
                      </span>
                      <h4 className="text-sm font-black text-[#1C1917] dark:text-[#E7E5E4] mt-2">
                        {PROBLEMS.find(p => p.id === targetProblemToSimulate)?.text}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1 capitalize font-medium">
                        Sector Category: {PROBLEMS.find(p => p.id === targetProblemToSimulate)?.sub} ({PROBLEMS.find(p => p.id === targetProblemToSimulate)?.category} logs)
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      <span className="p-2 rounded-xl bg-amber-550/10 text-amber-500">
                        <Bot size={15} />
                      </span>
                    </div>
                  </div>

                  {/* Expected Business Metric Uplift */}
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-2.5">
                    <TrendingUp className="text-amber-500 animate-pulse shrink-0" size={14} />
                    <p className="text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-stone-300">
                      <strong>Predicted Margin Uplift:</strong> {simulatorOutput.potentialValue}
                    </p>
                  </div>
                </div>

                {/* AUTOMATED OUTREACH OR ORDER SCRIPT */}
                <div className={`p-4 rounded-xl border space-y-2.5 text-left ${
                  isDark ? 'bg-stone-900/60 border-stone-850' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-850/60">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1C1917] dark:text-white font-mono">
                      ✉️ AI-Generated Smart Outreach Copy / Supplier PO Details
                    </span>
                    <button
                      onClick={() => handleCopyText(simulatorOutput.smsDraft)}
                      className="text-[9px] font-black uppercase flex items-center gap-1 text-amber-500 hover:underline shrink-0"
                    >
                      <Copy size={11} /> Copy Template
                    </button>
                  </div>
                  <pre className="font-mono text-xs p-3.5 rounded-lg bg-stone-950 text-amber-400 overflow-x-auto whitespace-pre-wrap select-text leading-relaxed">
                    {simulatorOutput.smsDraft}
                  </pre>
                </div>

                {/* AUTOMATED WORKFLOW ENGINE RULE */}
                <div className={`p-4 rounded-xl border space-y-2.5 text-left ${
                  isDark ? 'bg-stone-900/60 border-stone-850' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-850/60">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1C1917] dark:text-white font-mono">
                      ⚡ Actionable Trigger automation Script Rule
                    </span>
                    <button
                      onClick={() => handleCopyText(simulatorOutput.alertRule)}
                      className="text-[9px] font-black uppercase flex items-center gap-1 text-amber-500 hover:underline shrink-0"
                    >
                      <Copy size={11} /> Copy Rule
                    </button>
                  </div>
                  <code className="font-mono text-xs block p-3.5 rounded-lg bg-stone-950 text-[#A8A29E] select-text">
                    {simulatorOutput.alertRule}
                  </code>
                </div>

                {/* RECOMMENDED CORRECTION ROADMAP */}
                <div className={`p-4 rounded-xl border space-y-2.5 ${
                  isDark ? 'bg-stone-900/60 border-stone-850' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1C1917] dark:text-white font-mono block pb-2 border-b border-stone-100 dark:border-stone-850/60">
                    SOP Corrective Action Steps of Platform Hubs
                  </span>
                  <ul className="space-y-2">
                    {simulatorOutput.actionSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs font-medium text-neutral-600 dark:text-stone-300">
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-[9.5px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
