
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Shield,
  HelpCircle,
  FileText,
  Server,
  Bell,
  Zap,
  Save,
  LogOut,
  Check,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Collapsible Wrapper using Card
const CollapsibleSection: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, subtitle, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={cn("mb-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group border-white/5 bg-slate-900/40 backdrop-blur-sm")}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300",
            isOpen ? "bg-brand-500/20 text-brand-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
          )}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white transition-colors tracking-tight">{title}</h3>
            <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
          </div>
        </div>
        <div className={cn("text-slate-500 transition-transform duration-300", isOpen && "rotate-180 text-brand-400")}>
          <ChevronDown size={20} />
        </div>
      </div>

      <div className={cn("transition-all duration-300 ease-in-out border-t border-white/5 bg-[#020617]/30", isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
        <div className="p-6 pt-6">
          {children}
        </div>
      </div>
    </Card>
  );
};

export const SettingsPage: React.FC = () => {
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

  useEffect(() => {
    if (userProfile?.user?.timezone) {
      setTimezone(userProfile.user.timezone);
    } else {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.user?.telegram_chat_id) {
      setChatId(userProfile.user.telegram_chat_id);
    }
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

  const handleSaveTimezone = async (val: string) => {
    setTimezone(val);
    try {
      await api.updateTimezone(val);
      toast.success(`Timezone updated to ${val}`);
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
      await refreshProfile();
    } catch (e) {
      toast.error('Failed to save Chat ID');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePing = async () => {
    setStatus('loading');
    try {
      if (!userProfile?.user?.telegram_chat_id) {
        toast.error("Please save your Chat ID first.");
        setStatus('idle');
        return;
      }

      try {
        await api.notifyTelegram('Scanner: Test Ping', chatId);
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-12 animate-fade-in text-slate-100 relative min-h-screen">
      {/* Background Texture & Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
      </div>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password to confirm changes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
              <Input
                type="password"
                value={passwordForm.old}
                onChange={e => setPasswordForm(p => ({ ...p, old: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
              <Input
                type="password"
                value={passwordForm.new}
                onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                placeholder="New secure password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
              <Button type="submit" disabled={passwordLoading} className="bg-brand-600 hover:bg-brand-500 text-white">
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10 pl-2">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1 bottom-1 w-1.5 bg-gradient-to-b from-brand-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3 drop-shadow-md">
            Account Preferences
          </h1>
          <p className="text-slate-400 max-w-xl font-medium text-lg">
            Manage your profile, neural preferences, and security settings.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={logout}
          className="flex items-center gap-2 font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* LEFT SIDEBAR (Profile Card) - Span 4 */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none"></div>

            <CardContent className="flex flex-col items-center text-center pt-8 pb-8">
              <div className="relative mb-4">
                <img
                  src={userProfile.user.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile.user.email}`}
                  className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-2xl object-cover bg-slate-950"
                  alt="Profile"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full" title="Online"></div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{userProfile.user.name}</h2>
              <p className="text-slate-400 text-sm mb-6">{userProfile.user.email}</p>

              <div className="flex gap-2 mb-8">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  {userProfile.user.role}
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                  <CreditCard size={10} /> {plan.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-800/50 pt-6">
                <div className="text-center">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Member Since</label>
                  <span className="text-xs text-slate-300 font-medium">{new Date(userProfile.user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-center border-l border-slate-800/50">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Next Billing</label>
                  <span className="text-xs text-slate-300 font-medium">{new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isPaid && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-5 flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 mt-1">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-amber-500 text-sm mb-1">Upgrade to Pro</h4>
                  <p className="text-xs text-slate-400 mb-3">Unlock unlimited Copilot requests and advanced strategies.</p>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-8 text-xs" asChild>
                    <Link to="/membership">View Plans</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900/50 border-slate-800">
            <div className="p-2 space-y-1">
              {[
                { icon: <HelpCircle size={16} />, label: "Help & Support" },
                { icon: <FileText size={16} />, label: "Terms of Service" },
                { icon: <Shield size={16} />, label: "Privacy Policy" }
              ].map((item, i) => (
                <Button key={i} variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
                  <span className="flex items-center gap-3">{item.icon} {item.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-8 space-y-6">

          {/* Copilot Config */}
          <CollapsibleSection
            title="Copilot Configuration"
            subtitle="Customize how your AI Advisor analyzes the market"
            icon={<Zap size={20} />}
            defaultOpen={true}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Trader Style</label>
                  <Select value={copilotProfile.trader_style} onValueChange={(val) => setCopilotProfile({ ...copilotProfile, trader_style: val })}>
                    <SelectTrigger className="bg-slate-950 border-slate-700/80 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCALPER">Scalper (Fast)</SelectItem>
                      <SelectItem value="DAY">Day Trader</SelectItem>
                      <SelectItem value="SWING">Swing Trader</SelectItem>
                      <SelectItem value="BALANCED">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Risk Tolerance</label>
                  <Select value={copilotProfile.risk_tolerance} onValueChange={(val) => setCopilotProfile({ ...copilotProfile, risk_tolerance: val })}>
                    <SelectTrigger className="bg-slate-950 border-slate-700/80 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low Risk (Conservative)</SelectItem>
                      <SelectItem value="MEDIUM">Medium (Balanced)</SelectItem>
                      <SelectItem value="HIGH">High Risk (Aggressive)</SelectItem>
                      <SelectItem value="DEGEN">Degen (Max Risk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Custom Instructions <span className="text-slate-600 font-normal normal-case ml-2">(Optional system prompt override)</span>
                </label>
                <textarea
                  value={copilotProfile.custom_instructions || ''}
                  onChange={e => setCopilotProfile({ ...copilotProfile, custom_instructions: e.target.value })}
                  placeholder="Eg: 'I strictly trade breakouts on ETH and SOL only. Ignore RSI divergences if volume is low.'"
                  className="w-full bg-[#0B1120] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-sm h-32 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono leading-relaxed placeholder:text-slate-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveCopilot}
                  disabled={loadingProfile}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  {loadingProfile ? <span className="animate-spin mr-2">⏳</span> : <Save size={16} className="mr-2" />}
                  {loadingProfile ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </div>
          </CollapsibleSection>

          {/* Notifications */}
          <CollapsibleSection
            title="Notifications"
            subtitle="Manage how you receive alerts"
            icon={<Bell size={20} />}
            defaultOpen={false}
          >
            <div className="space-y-4 max-w-2xl">
              <label className="text-xs font-bold text-slate-500 uppercase">Telegram Chat ID</label>
              <div className="flex gap-3">
                <Input
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                  placeholder="12345678"
                />
                <Button onClick={handleSaveTelegram} disabled={isSaving} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                  {isSaving ? 'Saving...' : 'Save ID'}
                </Button>
              </div>
              <div className="flex justify-between items-center bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                <p className="text-[11px] text-blue-300">
                  Start a chat with <a href="https://t.me/TraderCopilotV1Bot" target="_blank" className="underline font-bold hover:text-white">@TraderCopilotV1Bot</a> and type <code>/myid</code> to get your ID.
                </p>
                <Button size="sm" variant="ghost" onClick={handlePing} className="text-[10px] font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 h-7 px-3">
                  {status === 'loading' ? 'Sending...' : 'Test Ping'}
                </Button>
              </div>
            </div>
          </CollapsibleSection>

          {/* System Prefs */}
          <CollapsibleSection
            title="System Preferences"
            subtitle="Timezone and regional settings"
            icon={<Server size={20} />}
            defaultOpen={false}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-slate-950/30 rounded-xl border border-slate-800/50">
              <div className="text-sm text-slate-300">Timezone Configuration</div>
              <Select value={timezone} onValueChange={handleSaveTimezone}>
                <SelectTrigger className="w-[280px] bg-slate-900 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                  <SelectGroup>
                    <SelectLabel>North America</SelectLabel>
                    <SelectItem value="America/New_York">New York (EST/EDT)</SelectItem>
                    <SelectItem value="America/Chicago">Chicago (CST/CDT)</SelectItem>
                    <SelectItem value="America/Denver">Denver (MST/MDT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Los Angeles (PST/PDT)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET/CEST)</SelectItem>
                    <SelectItem value="Europe/Moscow">Moscow (MSK)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Asia & Pacific</SelectLabel>
                    <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleSection>

          {/* Security */}
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
              <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="border-slate-700 hover:bg-slate-800 text-white">
                Change Password
              </Button>
            </div>
          </CollapsibleSection>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
