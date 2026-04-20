"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Plus,
  TrendingUp,
  Flame,
  Droplets,
  Wheat,
  ChevronRight,
  Utensils,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { NutritionRing } from "@/components/ui/NutritionRing";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { useToast } from "@/components/ui/Toast";
import { nutritionApi, aiApi } from "@/lib/api";
import type { Meal, NutritionTotals } from "@/types";

// Daily goals (should come from user profile)
const DAILY_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fats: 70,
  fiber: 30,
};

export default function DashboardPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totals, setTotals] = useState<NutritionTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [foodInput, setFoodInput] = useState("");
  const [detectedFood, setDetectedFood] = useState<any>(null);
  const { success, error } = useToast();

  const fetchTodayMeals = useCallback(async () => {
    try {
      const res = await nutritionApi.getTodayMeals();
      setMeals(res.data.meals);
      setTotals(res.data.totals);
    } catch (err) {
      error("Failed to load today's meals");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchTodayMeals();
  }, [fetchTodayMeals]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      const res = await aiApi.detectFood(file);
      setDetectedFood(res.data);
      success(`Detected: ${res.data.food}`);
    } catch (err) {
      error("Failed to analyze image");
    } finally {
      setScanning(false);
    }
  };

  const handleManualAdd = async () => {
    if (!foodInput.trim()) return;

    setScanning(true);
    try {
      const res = await aiApi.manualFood(foodInput);
      setDetectedFood(res.data);
      success(`Found: ${res.data.food}`);
      setManualModalOpen(false);
      setScanModalOpen(true);
    } catch (err) {
      error("Failed to find food");
    } finally {
      setScanning(false);
      setFoodInput("");
    }
  };

  const handleAddMeal = async () => {
    if (!detectedFood) return;

    try {
      await nutritionApi.addMeal(detectedFood);
      success("Meal added successfully!");
      setScanModalOpen(false);
      setDetectedFood(null);
      fetchTodayMeals();
    } catch (err) {
      error("Failed to add meal");
    }
  };

  const handleDeleteMeal = async (id: number) => {
    try {
      await nutritionApi.deleteMeal(id);
      success("Meal deleted");
      fetchTodayMeals();
    } catch (err) {
      error("Failed to delete meal");
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-20 mb-4" />
              <div className="h-8 bg-white/10 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-foreground-muted">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton
            variant="secondary"
            onClick={() => setManualModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Manually
          </GradientButton>
          <GradientButton
            onClick={() => setScanModalOpen(true)}
            icon={<Camera className="w-4 h-4" />}
          >
            AI Scan
          </GradientButton>
        </div>
      </motion.div>

      {/* Nutrition Rings */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <NutritionRing
          value={totals.calories}
          max={DAILY_GOALS.calories}
          label="Calories"
          unit="kcal"
          icon={<Flame className="w-5 h-5" />}
        />
        <NutritionRing
          value={totals.protein}
          max={DAILY_GOALS.protein}
          label="Protein"
          unit="g"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <NutritionRing
          value={totals.carbs}
          max={DAILY_GOALS.carbs}
          label="Carbs"
          unit="g"
          icon={<Wheat className="w-5 h-5" />}
        />
        <NutritionRing
          value={totals.fats}
          max={DAILY_GOALS.fats}
          label="Fats"
          unit="g"
          icon={<Droplets className="w-5 h-5" />}
        />
        <NutritionRing
          value={totals.fiber}
          max={DAILY_GOALS.fiber}
          label="Fiber"
          unit="g"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/dashboard/scan">
          <GlassCard className="p-6 cursor-pointer group" hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Food Scan</h3>
                <p className="text-sm text-foreground-muted">
                  Snap a photo to analyze nutrition
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/dashboard/history">
          <GlassCard className="p-6 cursor-pointer group" hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Meal History</h3>
                <p className="text-sm text-foreground-muted">
                  View past meals and trends
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/dashboard/progress">
          <GlassCard className="p-6 cursor-pointer group" hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-red-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Progress</h3>
                <p className="text-sm text-foreground-muted">
                  Track your nutrition goals
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today's Meals</h2>
          <Badge variant="subtle">{meals.length} meals</Badge>
        </div>

        {meals.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No meals logged yet</h3>
            <p className="text-foreground-muted mb-6">
              Start tracking your nutrition by adding your first meal
            </p>
            <GradientButton
              onClick={() => setScanModalOpen(true)}
              icon={<Camera className="w-4 h-4" />}
            >
              Scan Food
            </GradientButton>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4" hover={false}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/50 to-accent-cyan/50 flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{meal.food}</h4>
                      <p className="text-sm text-foreground-muted">
                        {new Date(meal.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {Math.round(meal.calories)} cal
                      </p>
                      <p className="text-xs text-foreground-muted">
                        P: {Math.round(meal.protein)}g • C:{" "}
                        {Math.round(meal.carbs)}g • F: {Math.round(meal.fats)}g
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-foreground-muted hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* AI Scan Modal */}
      <Modal
        isOpen={scanModalOpen}
        onClose={() => {
          setScanModalOpen(false);
          setDetectedFood(null);
        }}
        title="AI Food Detection"
        size="md"
      >
        {!detectedFood ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="food-image"
              />
              <label
                htmlFor="food-image"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {scanning ? (
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-primary" />
                  )}
                </div>
                <p className="font-medium mb-1">
                  {scanning ? "Analyzing..." : "Upload Food Photo"}
                </p>
                <p className="text-sm text-foreground-muted">
                  Click to take a photo or upload from device
                </p>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-1">{detectedFood.food}</h3>
              <p className="text-sm text-foreground-muted">
                Confidence: {detectedFood.confidence}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-subtle rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(detectedFood.calories)}
                </p>
                <p className="text-xs text-foreground-muted">Calories</p>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-accent-cyan">
                  {Math.round(detectedFood.protein)}g
                </p>
                <p className="text-xs text-foreground-muted">Protein</p>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-accent-purple">
                  {Math.round(detectedFood.carbs)}g
                </p>
                <p className="text-xs text-foreground-muted">Carbs</p>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-accent-pink">
                  {Math.round(detectedFood.fats)}g
                </p>
                <p className="text-xs text-foreground-muted">Fats</p>
              </div>
            </div>

            {detectedFood.ingredients?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {detectedFood.ingredients.map((ing: string, i: number) => (
                    <Badge key={i} variant="subtle" size="sm">
                      {ing}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <GradientButton
                variant="secondary"
                className="flex-1"
                onClick={() => setDetectedFood(null)}
              >
                Retake
              </GradientButton>
              <GradientButton className="flex-1" onClick={handleAddMeal}>
                Add Meal
              </GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Add Modal */}
      <Modal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title="Add Food Manually"
        size="md"
      >
        <div className="space-y-4">
          <AnimatedInput
            label="Food Name"
            placeholder="e.g., Grilled chicken breast"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
          />
          <GradientButton
            className="w-full"
            loading={scanning}
            onClick={handleManualAdd}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {scanning ? "Searching..." : "Find Nutrition Info"}
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
}
