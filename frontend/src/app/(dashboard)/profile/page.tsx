"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Scale,
  Ruler,
  Activity,
  Edit3,
  Save,
  Camera,
  ChevronRight,
  Award,
  Flame,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { authApi, nutritionApi } from "@/lib/api";
import type { WeightEntry } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
  });
  const { success, error } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [userRes, weightRes] = await Promise.all([
        authApi.me(),
        nutritionApi.getWeightHistory(),
      ]);
      setUser(userRes.data.user);
      setWeightHistory(weightRes.data.history || []);
      setFormData((prev) => ({
        ...prev,
        name: userRes.data.user.name || "",
      }));
    } catch (err) {
      error("Failed to load profile data");
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call - in real app, would call profile update API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddWeight = async () => {
    const weight = parseFloat(formData.weight);
    if (!weight || weight <= 0) {
      error("Please enter a valid weight");
      return;
    }
    try {
      await nutritionApi.saveWeight({ weight });
      success("Weight recorded");
      fetchData();
    } catch (err) {
      error("Failed to save weight");
    }
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
    { value: "light", label: "Lightly Active", desc: "1-3 days/week" },
    { value: "moderate", label: "Moderately Active", desc: "3-5 days/week" },
    { value: "active", label: "Very Active", desc: "6-7 days/week" },
    { value: "extra", label: "Extra Active", desc: "Physical job/training" },
  ];

  const achievements = [
    { icon: Flame, label: "7 Day Streak", color: "text-orange-500" },
    { icon: Award, label: "Goal Crusher", color: "text-purple-500" },
    { icon: Activity, label: "Health Pioneer", color: "text-cyan-500" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-foreground-muted">
          Manage your personal information and health data
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Quick Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Profile Card */}
          <GlassCard className="p-6 text-center" gradient>
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-1">{user?.name || "User"}</h2>
            <p className="text-sm text-foreground-muted mb-4">{user?.email}</p>
            <Badge variant="success">Premium Member</Badge>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">
                  {weightHistory.length > 0
                    ? weightHistory[weightHistory.length - 1].weight
                    : "--"}
                </p>
                <p className="text-xs text-foreground-muted">Current Weight (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">
                  {weightHistory.length}
                </p>
                <p className="text-xs text-foreground-muted">Entries</p>
              </div>
            </div>
          </GlassCard>

          {/* Achievements */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((ach, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${ach.color}`}>
                    <ach.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">{ach.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column - Forms */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Personal Information */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p className="text-sm text-foreground-muted">
                    Update your basic details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {editing ? (
                  <Save className="w-5 h-5 text-primary" />
                ) : (
                  <Edit3 className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <AnimatedInput
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!editing}
                icon={<User className="w-5 h-5" />}
              />
              <AnimatedInput
                label="Email"
                value={user?.email || ""}
                disabled
                icon={<Mail className="w-5 h-5" />}
              />
              <AnimatedInput
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                disabled={!editing}
                icon={<Calendar className="w-5 h-5" />}
              />
              <AnimatedInput
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                disabled={!editing}
                icon={<Ruler className="w-5 h-5" />}
              />
            </div>

            {editing && (
              <div className="flex justify-end mt-4">
                <GradientButton
                  size="sm"
                  loading={saving}
                  onClick={handleSave}
                  icon={<Save className="w-4 h-4" />}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </GradientButton>
              </div>
            )}
          </GlassCard>

          {/* Health Metrics */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h3 className="font-semibold">Health Metrics</h3>
                <p className="text-sm text-foreground-muted">
                  Track your body measurements
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-subtle rounded-xl p-4">
                <label className="text-sm text-foreground-muted mb-2 block">
                  Current Weight (kg)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="Enter weight"
                    className="flex-1 bg-transparent text-2xl font-bold focus:outline-none"
                  />
                  <GradientButton size="sm" onClick={handleAddWeight}>
                    Log
                  </GradientButton>
                </div>
              </div>

              <div className="glass-subtle rounded-xl p-4">
                <label className="text-sm text-foreground-muted mb-2 block">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, activityLevel: e.target.value })
                  }
                  className="w-full bg-transparent text-lg font-medium focus:outline-none cursor-pointer"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-foreground-muted mt-1">
                  {
                    activityLevels.find((l) => l.value === formData.activityLevel)
                      ?.desc
                  }
                </p>
              </div>
            </div>

            {/* Weight History Chart Placeholder */}
            {weightHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">Weight History</h4>
                <div className="glass-subtle rounded-xl p-4 h-32 flex items-end gap-2">
                  {weightHistory.slice(-7).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      className="flex-1 bg-primary/50 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.weight / 150) * 100}%` }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-foreground-muted">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
