import React, { useState } from 'react';
import { useHotelPro } from '../context/HotelProContext';
import { UserRole } from '../types';
import {
  Building2,
  Calendar,
  Compass,
  ShieldCheck,
  UserCheck,
  Briefcase,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  MapPin,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'dashboard' | 'about';
  setActiveTab: (tab: 'explore' | 'dashboard' | 'about') => void;
  onOpenBookingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchRole, resetToDefaultData } = useHotelPro();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { role: 'guest', label: 'Guest', icon: <UserIcon className="w-4 h-4" />, color: 'bg-emerald-600', desc: 'Browse, book & view GST invoices' },
    { role: 'staff', label: 'Front Desk / Staff', icon: <UserCheck className="w-4 h-4" />, color: 'bg-blue-600', desc: 'Check-in, checkout & housekeeping' },
    { role: 'manager', label: 'Hotel Manager', icon: <Briefcase className="w-4 h-4" />, color: 'bg-purple-600', desc: 'Room inventory, revenue & tariffs' },
    { role: 'admin', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-amber-600', desc: 'Platform oversight & audit logs' },
  ];

  const currentRoleConfig = roles.find(r => r.role === currentUser.role) || roles[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top regional announcement bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>Grand Festive Hospitality Offers: Enjoy 10% instant discount across Rajasthan, Goa & Kerala retreats with code <strong>NAMASTE10</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-amber-100 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> India Direct Concierge
            </span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> +91 1800 209 8888 (Toll Free)
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => { setActiveTab('explore'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-400/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">HotelPro</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                India
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">Heritage & Luxury Stays</p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/60">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Hotels
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{currentRoleConfig.label} Portal</span>
          </button>
        </nav>

        {/* Right Role Switcher & User Status */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Portfolio Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs transition-all shadow-sm"
              title="Switch role to preview specific permissions & dashboard"
            >
              <span className={`w-2 h-2 rounded-full ${currentRoleConfig.color}`}></span>
              <span className="text-slate-400">Role:</span>
              <span className="font-semibold text-white">{currentRoleConfig.label}</span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Switch Role (Portfolio Demo)</p>
                  <p className="text-xs text-slate-400">Experience the 4 authenticated role views</p>
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setRoleDropdownOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors ${
                      currentUser.role === r.role ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="mt-0.5 p-1 rounded bg-slate-800">{r.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{r.label}</div>
                      <div className="text-[11px] text-slate-400">{r.desc}</div>
                    </div>
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-800 px-2 flex justify-between items-center">
                  <button
                    onClick={() => {
                      resetToDefaultData();
                      setRoleDropdownOpen(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Demo Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/40"
            />
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-white leading-tight">{currentUser.name}</p>
              <p className="text-slate-400 text-[11px]">{currentUser.phone}</p>
            </div>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'explore' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Explore Hotels
            </button>
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {currentRoleConfig.label} Dashboard
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-2">Switch Active Role:</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left ${
                    currentUser.role === r.role
                      ? 'bg-amber-600 border-amber-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
