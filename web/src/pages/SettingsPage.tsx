import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  Check,
  AlertCircle,
  LogOut,
  User,
  CreditCard,
  Shield,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Server,
  Bell,
  Calendar,
  Zap,
  Save,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

// Simple collapsible wrapper
const CollapsibleSection: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, subtitle, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-slate-800/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-white transition-colors">{title}</h3>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out border-t border-slate-800/50 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="p-6 md:p-8 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const [pingMsg, setPingMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { userProfile, logout, refreshProfile } = useAuth();

  // Telegram State
  const [chatId, setChatId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Timezone State
  const [timezone, setTimezone] = useState('UTC');

  // Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Copilot Profile State
  const [copilotProfile, setCopilotProfile] = useState<any>({
    trader_style: 'BALANCED',
    risk_tolerance: 'MEDIUM',
    time_horizon: 'INTRADAY',
    custom_instructions: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    api.getAdvisorProfile().then(setCopilotProfile).catch(err => console.error("Failed to load advisor profile", err));
  }, [userProfile]);

  const handleSaveCopilot = async () => {
    setLoadingProfile(true);
    try {
      await api.updateAdvisorProfile(copilotProfile);
      toast.success("Copilot preferences updated!");
    } catch (err) {
      toast.error("Failed to save Copilot preferences");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.old || !passwordForm.new) {
      toast.error("Please fill in both fields");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.changePassword(passwordForm.old, passwordForm.new);
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ old: '', new: '' });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };


  useEffect(() => {
    if (userProfile?.user?.timezone) {
      setTimezone(userProfile.user.timezone);
    } else {
      // Fallback to browser zone
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.user?.telegram_chat_id) {
      setChatId(userProfile.user.telegram_chat_id);
    }
  }, [userProfile]);

  const handleSaveTimezone = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTz = e.target.value;
    setTimezone(newTz);
    try {
      await api.updateTimezone(newTz);
      toast.success(`Timezone updated to ${newTz}`);
      await refreshProfile();
    } catch (err) {
      toast.error("Failed to update timezone");
    }
  };

  const handleSaveTelegram = async () => {
    setIsSaving(true);
    try {
      await api.updateTelegramId(chatId);
      toast.success('Telegram Chat ID saved!');
      await refreshProfile(); // reload profile to confirm syncing
    } catch (e) {
      toast.error('Failed to save Chat ID');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePing = async () => {
    setStatus('loading');
    try {
      // Backend now sends to the saved ID (or custom if we wanted, but logic is user-centric now)
      if (!userProfile?.user?.telegram_chat_id) {
        toast.error("Please save your Chat ID first.");
        setStatus('idle');
        return;
      }

      try {
        await api.notifyTelegram(pingMsg || 'Scanner: Test Ping', chatId);
        setStatus('success');
        toast.success('Test message sent!');
      } catch (e: any) {
        setStatus('error');
        toast.error(`Error: ${e.message}`);
      }
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setStatus('error');
      toast.error('Failed to send test message');
    }
  };

  if (!userProfile) return null;

  const plan = userProfile.user.plan || "Free";
  const isPaid = ["Trader", "Pro", "Owner"].includes(plan) || plan.toUpperCase() === "TRADER" || plan.toUpperCase() === "PRO";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-12 animate-fade-in text-slate-100 relative">

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <FileText className="rotate-45" size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">Change Password</h3>
            <p className="text-slate-400 text-sm mb-6">Enter your current password to confirm changes.</p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.old}
                  onChange={e => setPasswordForm(p => ({ ...p, old: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="New secure password"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-lg font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-indigo-500/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 max-w-xl">
            Manage your profile, neural preferences, and security settings.
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold text-sm bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20 transition-all active:scale-95"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT SIDEBAR (Profile Card) - Span 4 */}
        <div className="lg:col-span-4 space-y-6">

          {/* Main Profile Card */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 relative overflow-hidden group">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={
                    userProfile.user.avatar_url ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile.user.email}`
                  }
                  className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-2xl object-cover bg-slate-950"
                  alt="Profile"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full" title="Online"></div>
              </div>

              <h2 className="text-xl font-bold text-white">{userProfile.user.name}</h2>
              <p className="text-slate-400 text-sm mb-4">{userProfile.user.email}</p>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
                  {userProfile.user.role}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <CreditCard size={10} /> {plan.toUpperCase()}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-800/50 pt-4">
                <div className="text-center">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Member Since</label>
                  <span className="text-xs text-slate-300 font-medium">{new Date(userProfile.user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-center border-l border-slate-800/50">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Next Billing</label>
                  <span className="text-xs text-slate-300 font-medium">{new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {!isPaid && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-amber-500 text-sm mb-1">Upgrade to Pro</h4>
                  <p className="text-xs text-slate-400 mb-3">Unlock unlimited Copilot requests and advanced strategies.</p>
                  <Link to="/membership" className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg inline-block transition-colors">
                    View Plans
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Help Links */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 space-y-1">
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm group">
              <span className="flex items-center gap-3"><HelpCircle size={16} /> Help & Support</span>
            </button>
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm group">
              <span className="flex items-center gap-3"><FileText size={16} /> Terms of Service</span>
            </button>
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm group">
              <span className="flex items-center gap-3"><Shield size={16} /> Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT (Settings) - Span 8 */}
        <div className="lg:col-span-8 space-y-6">

          {/* SECTION 1: Copilot Neural Config (Collapsible) */}
          <CollapsibleSection
            title="Copilot Configuration"
            subtitle="Customize how your AI Advisor analyzes the market"
            icon={<Zap size={20} />}
            defaultOpen={true}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Trader Style</label>
                  <select
                    value={copilotProfile.trader_style}
                    onChange={e => setCopilotProfile({ ...copilotProfile, trader_style: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-500/50 transition-colors"
                  >
                    <option value="SCALPER">Scalper (Fast)</option>
                    <option value="DAY">Day Trader</option>
                    <option value="SWING">Swing Trader</option>
                    <option value="BALANCED">Balanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Risk Tolerance</label>
                  <select
                    value={copilotProfile.risk_tolerance}
                    onChange={e => setCopilotProfile({ ...copilotProfile, risk_tolerance: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-500/50 transition-colors"
                  >
                    <option value="LOW">Low Risk (Conservative)</option>
                    <option value="MEDIUM">Medium (Balanced)</option>
                    <option value="HIGH">High Risk (Aggressive)</option>
                    <option value="DEGEN">Degen (Max Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                  Custom Instructions <span className="text-slate-600 font-normal normal-case ml-2">(Optional system prompt override)</span>
                </label>
                <textarea
                  value={copilotProfile.custom_instructions || ''}
                  onChange={e => setCopilotProfile({ ...copilotProfile, custom_instructions: e.target.value })}
                  placeholder="Eg: 'I strictly trade breakouts on ETH and SOL only. Ignore RSI divergences if volume is low.'"
                  className="w-full bg-[#0B1120] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  onClick={handleSaveCopilot}
                  disabled={loadingProfile}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {loadingProfile ? <span className="animate-spin">⏳</span> : <Save size={16} />}
                  {loadingProfile ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECTION 2: Notification Center (Collapsible) */}
          <CollapsibleSection
            title="Notifications"
            subtitle="Manage how you receive alerts"
            icon={<Bell size={20} />}
            defaultOpen={false}
          >
            <div className="space-y-4 max-w-2xl">
              <label className="text-xs font-bold text-slate-500 uppercase block">Telegram Chat ID</label>
              <div className="flex gap-3">
                <input
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600"
                  placeholder="12345678"
                />
                <button
                  onClick={handleSaveTelegram}
                  disabled={isSaving}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium border border-slate-700 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save ID'}
                </button>
              </div>
              <div className="flex justify-between items-center bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                <p className="text-[11px] text-blue-300">
                  Start a chat with <a href="https://t.me/TraderCopilotV1Bot" target="_blank" className="underline font-bold hover:text-white">@TraderCopilotV1Bot</a> and type <code>/myid</code> to get your ID.
                </p>
                <button onClick={handlePing} className="text-[10px] font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md transition-colors">
                  {status === 'loading' ? 'Sending...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECTION 3: System Preferences (Collapsible) */}
          <CollapsibleSection
            title="System Preferences"
            subtitle="Timezone and regional settings"
            icon={<Server size={20} />}
            defaultOpen={false}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-slate-950/30 rounded-xl border border-slate-800/50">
              <div className="text-sm text-slate-300">Timezone Configuration</div>
              <select
                value={timezone}
                onChange={handleSaveTimezone}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-800 transition-colors outline-none"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>

                <optgroup label="North America">
                  <option value="America/New_York">New York, Washington DC (EST/EDT) - UTC-5</option>
                  <option value="America/Chicago">Chicago, Mexico City (CST/CDT) - UTC-6</option>
                  <option value="America/Denver">Denver (MST/MDT) - UTC-7</option>
                  <option value="America/Los_Angeles">Los Angeles, Vancouver (PST/PDT) - UTC-8</option>
                  <option value="America/Anchorage">Anchorage (AKST/AKDT) - UTC-9</option>
                  <option value="Pacific/Honolulu">Honolulu (HST) - UTC-10</option>
                </optgroup>

                <optgroup label="South America">
                  <option value="America/Sao_Paulo">São Paulo, Rio de Janeiro - UTC-3</option>
                  <option value="America/Argentina/Buenos_Aires">Buenos Aires - UTC-3</option>
                  <option value="America/Santiago">Santiago - UTC-4</option>
                </optgroup>

                <optgroup label="Europe">
                  <option value="Europe/London">London, Dublin (GMT/BST) - UTC+0</option>
                  <option value="Europe/Paris">Paris, Berlin, Madrid (CET/CEST) - UTC+1</option>
                  <option value="Europe/Lisbon">Lisbon (WET/WEST) - UTC+0</option>
                  <option value="Europe/Istanbul">Istanbul (TRT) - UTC+3</option>
                  <option value="Europe/Moscow">Moscow (MSK) - UTC+3</option>
                </optgroup>

                <optgroup label="Asia & Pacific">
                  <option value="Asia/Dubai">Dubai (GST) - UTC+4</option>
                  <option value="Asia/Kolkata">Mumbai, New Delhi (IST) - UTC+5:30</option>
                  <option value="Asia/Bangkok">Bangkok, Jakarta (ICT) - UTC+7</option>
                  <option value="Asia/Hong_Kong">Hong Kong, Singapore (HKT) - UTC+8</option>
                  <option value="Asia/Tokyo">Tokyo, Seoul (JST) - UTC+9</option>
                  <option value="Australia/Sydney">Sydney (AEST/AEDT) - UTC+10</option>
                  <option value="Pacific/Auckland">Auckland (NZST/NZDT) - UTC+12</option>
                </optgroup>
              </select>
            </div>
          </CollapsibleSection>

          {/* SECTION 4: Security (Collapsible) */}
          <CollapsibleSection
            title="Security"
            subtitle="Password and authentication"
            icon={<Shield size={20} />}
            defaultOpen={false}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-300">
                  Update your account password to keep your account secure.
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-xs font-bold bg-slate-800 hover:bg-slate-750 text-white px-4 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </CollapsibleSection>

        </div>
      </div>
    </div>

  );
};
