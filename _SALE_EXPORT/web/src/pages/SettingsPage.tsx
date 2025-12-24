import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../constants';
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

export const SettingsPage: React.FC = () => {
  const [pingMsg, setPingMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { userProfile, logout, refreshProfile } = useAuth();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Telegram State
  const [chatId, setChatId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Timezone State
  const [timezone, setTimezone] = useState('UTC');

  // Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

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

      await api.notifyTelegram(pingMsg || '🚀 Scanner · Test Ping');
      setStatus('success');
      toast.success('Test message sent!');
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 animate-fade-in text-slate-100 relative">

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <FileText className="rotate-45" size={20} /> {/* Close Icon as rotated FileText for laziness or import X */}
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

      {/* Header / Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">
            Manage your account settings and preferences.
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold text-sm bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20 transition-all active:scale-95"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* LEFT COLUMN: Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 rounded-2xl border border-slate-800 p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={120} />
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              <div className="relative">
                <img
                  src={
                    userProfile.user.avatar_url ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile.user.email}`
                  }
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-slate-800 shadow-2xl object-cover bg-slate-800"
                  alt="Profile"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full" title="Active"></div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{userProfile.user.name}</h2>
                  <p className="text-slate-400 font-medium">{userProfile.user.email}</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                    {userProfile.user.role}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard size={12} /> {plan} Plan
                  </span>

                  {/* Upgrade CTA - Only if NOT paid */}
                  {!isPaid && (
                    <Link to="/membership" className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors">
                      <Zap size={12} /> Upgrade
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Joined</label>
                  <div className="text-slate-200 font-medium text-sm">
                    {new Date(userProfile.user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <CreditCard size={18} />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Next Billing Date</label>
                  <div className="text-white font-medium text-sm">
                    {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-emerald-400" /> Security
            </h3>

            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200 text-sm mb-0.5">Password</div>
                  <div className="text-xs text-slate-500">Secure your account</div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Secondary Info */}
        <div className="space-y-6">

          {/* Support */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={20} className="text-blue-400" /> Help & Support
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Need assistance? Our specialized agent support team is available 24/7 for Pro plan members.
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@tradercopilot.com'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Contact Support
            </button>
          </div>

          {/* Legal Links */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-3">
            <button className="w-full flex items-center justify-between text-left text-sm text-slate-300 hover:text-white group">
              <span className="flex items-center gap-2"><FileText size={16} className="text-slate-500 group-hover:text-slate-300" /> Terms of Service</span>
              <span className="text-xs text-slate-600">v1.2</span>
            </button>
            <button className="w-full flex items-center justify-between text-left text-sm text-slate-300 hover:text-white group">
              <span className="flex items-center gap-2"><Shield size={16} className="text-slate-500 group-hover:text-slate-300" /> Privacy Policy</span>
            </button>
            <div className="pt-2 border-t border-slate-800/50">
              <div className="text-[10px] text-slate-500 text-center">
                TraderCopilot © 2025
              </div>
            </div>
          </div>

          {/* Advanced / System Toggle */}
          <div className="border-t border-slate-800 pt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors"
            >
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Advanced System Settings
            </button>

            {showAdvanced && (
              <div className="mt-4 bg-slate-950/50 rounded-xl border border-slate-800/50 p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-mono">
                  <Server size={14} /> System Configuration
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Version</span>
                    <span className="text-slate-300">v1.0.0-beta</span>
                  </div>

                  <div className="flex justify-between items-center text-xs group relative">
                    <span className="text-slate-500">Timezone</span>

                    <select
                      value={timezone}
                      onChange={handleSaveTimezone}
                      className="bg-slate-900/50 text-indigo-400 border border-slate-800 rounded px-2 py-1 text-xs cursor-pointer hover:bg-slate-800 transition-colors focus:ring-1 focus:ring-indigo-500 outline-none text-right appearance-none pl-6"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="UTC">UTC (Universal)</option>
                      <option disabled>──────────────</option>
                      <option value="Pacific/Honolulu">(UTC-10:00) Honolulu</option>
                      <option value="America/Los_Angeles">(UTC-08:00) Los Angeles</option>
                      <option value="America/denver">(UTC-07:00) Denver</option>
                      <option value="America/Chicago">(UTC-06:00) Chicago</option>
                      <option value="America/New_York">(UTC-05:00) New York</option>
                      <option value="America/Argentina/Buenos_Aires">(UTC-03:00) Buenos Aires</option>
                      <option value="America/Sao_Paulo">(UTC-03:00) Sao Paulo</option>
                      <option disabled>──────────────</option>
                      <option value="Europe/London">(UTC+00:00) London</option>
                      <option value="Europe/Berlin">(UTC+01:00) Berlin/Paris</option>
                      <option value="Europe/Istanbul">(UTC+03:00) Istanbul</option>
                      <option value="Asia/Dubai">(UTC+04:00) Dubai</option>
                      <option value="Asia/Bangkok">(UTC+07:00) Bangkok</option>
                      <option value="Asia/Singapore">(UTC+08:00) Singapore</option>
                      <option value="Asia/Tokyo">(UTC+09:00) Tokyo</option>
                      <option value="Australia/Sydney">(UTC+11:00) Sydney</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
