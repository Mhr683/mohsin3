import React, { useState } from 'react';
import {
  Home,
  Package,
  UserCheck,
  Building2,
  Sparkles,
  BookOpen,
  Headphones,
  FileSpreadsheet,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Download,
} from 'lucide-react';

export interface FrontNavigationBarProps {
  activeTab?: string;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onOpenDropshipperRegister: () => void;
  onOpenSupplierRegister: () => void;
  onOpenWhatsNew: () => void;
  onOpenLearningLibrary: () => void;
  onOpenHelpSupport: () => void;
  onExportProductsCSV: () => void;
  onOpenBusinessDashboard: () => void;
  variant?: 'topbar' | 'embedded' | 'gateway';
}

export const FrontNavigationBar: React.FC<FrontNavigationBarProps> = ({
  activeTab = 'dashboard',
  onNavigateHome,
  onNavigateProducts,
  onOpenDropshipperRegister,
  onOpenSupplierRegister,
  onOpenWhatsNew,
  onOpenLearningLibrary,
  onOpenHelpSupport,
  onExportProductsCSV,
  onOpenBusinessDashboard,
  variant = 'topbar',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [csvExporting, setCsvExporting] = useState(false);

  const handleCsvExport = () => {
    setCsvExporting(true);
    onExportProductsCSV();
    setTimeout(() => {
      setCsvExporting(false);
    }, 1200);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: onNavigateHome,
      isActive: activeTab === 'dashboard',
      badge: null,
      color: 'text-sky-600',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      action: onNavigateProducts,
      isActive: activeTab === 'catalog',
      badge: 'Wholesale',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      color: 'text-emerald-600',
    },
    {
      id: 'dropshipper-reg',
      label: 'DropShipper Registration',
      icon: UserCheck,
      action: onOpenDropshipperRegister,
      isActive: activeTab === 'dropshipper-registration',
      badge: 'Free',
      badgeColor: 'bg-emerald-500 text-white',
      color: 'text-emerald-600',
    },
    {
      id: 'supplier-reg',
      label: 'Supplier Registration',
      icon: Building2,
      action: onOpenSupplierRegister,
      isActive: activeTab === 'supplier-registration',
      badge: 'Verified',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      color: 'text-indigo-600',
    },
    {
      id: 'whats-new',
      label: "What's NEW",
      icon: Sparkles,
      action: onOpenWhatsNew,
      isActive: false,
      badge: 'New',
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      color: 'text-amber-500',
    },
    {
      id: 'learning-library',
      label: 'Learning Library',
      icon: BookOpen,
      action: onOpenLearningLibrary,
      isActive: false,
      badge: 'Guides',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      color: 'text-teal-600',
    },
    {
      id: 'help-support',
      label: 'Help & Support',
      icon: Headphones,
      action: onOpenHelpSupport,
      isActive: false,
      badge: '24/7',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      color: 'text-sky-600',
    },
    {
      id: 'export-csv',
      label: 'Export Products CSV',
      icon: FileSpreadsheet,
      action: handleCsvExport,
      isActive: false,
      badge: csvExporting ? 'Exporting...' : '.CSV',
      badgeColor: 'bg-emerald-600 text-white',
      color: 'text-emerald-600',
      highlight: true,
    },
    {
      id: 'business-dashboard',
      label: 'Business Dashboard',
      icon: LayoutDashboard,
      action: onOpenBusinessDashboard,
      isActive: activeTab === 'dashboard' || activeTab === 'supplier-portal',
      badge: 'Portal',
      badgeColor: 'bg-slate-900 text-white',
      color: 'text-slate-800',
    },
  ];

  return (
    <nav
      aria-label="Front Main Navigation"
      className={`w-full select-none ${
        variant === 'gateway'
          ? 'bg-white border-b border-slate-200 shadow-xs'
          : variant === 'embedded'
          ? 'bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs'
          : 'bg-slate-900 border-b border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Desktop & Tablet Navigation Row */}
        <div className="flex items-center justify-between gap-1 py-1.5 overflow-x-auto scrollbar-none">
          {/* Brand/Indicator on Gateway or Topbar */}
          <div className="flex items-center gap-1 shrink-0 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>Front Navigation ({navItems.length})</span>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-nowrap w-full justify-between">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isDark = variant === 'topbar';

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    item.isActive
                      ? isDark
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  } ${
                    item.highlight && !item.isActive
                      ? isDark
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : ''
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      item.isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-500'
                        : isDark
                        ? 'text-slate-400 group-hover:text-emerald-400'
                        : item.color
                    }`}
                  />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full leading-none tracking-tight ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Horizontal Scroller for medium screens */}
          <div className="hidden md:flex lg:hidden items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition ${
                    item.isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Expanded Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.action();
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      item.isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${item.isActive ? 'text-white' : item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
