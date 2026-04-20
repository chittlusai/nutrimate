"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Shield,
  Trash2,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    weekly: true,
    reminders: false,
  });
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [language, setLanguage] = useState("en");
  const [units, setUnits] = useState("metric");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { success, error } = useToast();

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    success(`${key} notifications ${notifications[key] ? "disabled" : "enabled"}`);
  };

  const handleDeleteAccount = () => {
    error("Account deletion coming soon");
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-foreground-muted">
          Manage your preferences and account settings
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="font-medium">Theme</span>
                <p className="text-sm text-foreground-muted">Choose your preferred appearance</p>
              </div>
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => { setTheme("dark"); success("Theme changed to dark"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    theme === "dark" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dark</span>
                </button>
                <button
                  onClick={() => { setTheme("light"); success("Theme changed to light"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    theme === "light" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline">Light</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="divide-y divide-white/5">
              <ToggleItem
                label="Push Notifications"
                description="Receive notifications on your device"
                value={notifications.push}
                onChange={() => handleNotificationToggle("push")}
              />
              <ToggleItem
                label="Email Notifications"
                description="Receive updates via email"
                value={notifications.email}
                onChange={() => handleNotificationToggle("email")}
              />
              <ToggleItem
                label="Weekly Summary"
                description="Get a weekly nutrition report"
                value={notifications.weekly}
                onChange={() => handleNotificationToggle("weekly")}
              />
              <ToggleItem
                label="Meal Reminders"
                description="Remind me to log meals"
                value={notifications.reminders}
                onChange={() => handleNotificationToggle("reminders")}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>
            <div className="divide-y divide-white/5">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <span className="font-medium">Language</span>
                  <p className="text-sm text-foreground-muted">Select your preferred language</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value); success("Language updated"); }}
                  className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <span className="font-medium">Measurement Units</span>
                  <p className="text-sm text-foreground-muted">Metric (kg, cm) or Imperial (lbs, ft)</p>
                </div>
                <select
                  value={units}
                  onChange={(e) => { setUnits(e.target.value); success("Units updated"); }}
                  className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Privacy & Security</h2>
            </div>
            <div className="divide-y divide-white/5">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Lock className="w-4 h-4 text-foreground-muted" />
                  </div>
                  <div>
                    <span className="font-medium">Change Password</span>
                    <p className="text-sm text-foreground-muted">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => success("Password change coming soon")}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground-muted" />
                </button>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-foreground-muted" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Two-Factor Authentication</span>
                      <Badge variant="subtle" size="sm">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-foreground-muted">Add extra security to your account</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="border-destructive/30">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
                  <p className="text-sm text-foreground-muted">Irreversible actions for your account</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Delete Account</h3>
                  <p className="text-sm text-foreground-muted">Permanently delete your account and all data</p>
                </div>
                <GradientButton variant="outline" onClick={() => setDeleteModalOpen(true)}>
                  Delete Account
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
            <p className="text-destructive font-medium mb-2">Warning</p>
            <p className="text-sm text-foreground-muted">
              This action cannot be undone. All your data, including meal history, weight logs, and preferences will be permanently deleted.
            </p>
          </div>
          <div className="flex gap-3">
            <GradientButton variant="secondary" className="flex-1" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </GradientButton>
            <GradientButton
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleDeleteAccount}
            >
              Delete
            </GradientButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ToggleItem({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: () => void }) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
      <div>
        <span className="font-medium">{label}</span>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-primary" : "bg-secondary"}`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          animate={{ x: value ? 26 : 4 }}
          transition={{ type: "spring", stiffness: 500 }}
        />
      </button>
    </div>
  );
}
