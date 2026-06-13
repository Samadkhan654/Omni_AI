export interface Customer {
  id: string;
  name: string;
  avatar: string;
  healthScore: number;
  daysSilent: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  revenue: number;
  nextBestAction: string;
  status: 'pending' | 'executed' | 'silenced';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  stockoutDays: number;
  ltvImpact: number;
  decision: string;
  cashImpact: 'safe' | 'warning' | 'danger';
  lifecycle: 'growing' | 'stable' | 'declining' | 'dying';
}

export interface ProfitLeak {
  id: string;
  category: string;
  amount: number;
  description: string;
  resolved: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'customer' | 'aria';
  text: string;
  timestamp: string;
}
