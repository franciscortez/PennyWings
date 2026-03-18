import React from 'react';
import { 
  Building2, 
  Wallet, 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowDownToLine, 
  Plus, 
  PencilLine, 
  Trash2, 
  Search, 
  Clock, 
  Calendar, 
  Smartphone, 
  Wallet2,
  User,
  X,
  LogOut,
  ArrowLeft,
  Banknote,
  BarChart2
} from 'lucide-react';

const icons = {
  bank: Building2,
  wallet: Wallet,
  card: CreditCard,
  income: ArrowDownCircle,
  expense: ArrowUpCircle,
  withdrawal: ArrowDownToLine,
  plus: Plus,
  edit: PencilLine,
  delete: Trash2,
  search: Search,
  clock: Clock,
  calendar: Calendar,
  digital: Smartphone,
  traditional: Building2,
  ewallet: Wallet2,
  user: User,
  x: X,
  logout: LogOut,
  arrowLeft: ArrowLeft,
  cash: Banknote,
  reports: BarChart2
};

const Icon = ({ name, color = 'currentColor', className = "w-6 h-6", size, ...props }) => {
  const IconComponent = icons[name];
  
  if (!IconComponent) return null;

  return (
    <IconComponent 
      color={color} 
      size={size} 
      className={className} 
      strokeWidth={2}
      {...props} 
    />
  );
};

export default Icon;