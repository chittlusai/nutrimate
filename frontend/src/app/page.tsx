"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Brain,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  Utensils,
  Heart,
  Activity,
  ChevronRight,
} from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: Camera,
    title: "AI Food Recognition",
    description: "Snap a photo of your meal and our AI instantly identifies the food and calculates accurate nutritional information.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "Get personalized meal suggestions based on your health goals, dietary preferences, and nutritional needs.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your nutrition journey with beautiful charts and insights that help you stay on track.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Health Insights",
    description: "Understand how your food choices impact your health with AI-powered analysis of ingredients and nutrition.",
    color: "from-orange-500 to-red-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Snap a Photo",
    description: "Take a picture of your meal or search for food in our database. Our AI recognizes thousands of foods instantly.",
  },
  {
    number: "02",
    title: "Get Nutrition Data",
    description: "Receive detailed nutritional breakdown including calories, macros, micronutrients, and health insights.",
  },
  {
    number: "03",
    title: "Track & Improve",
    description: "Log your meals, track your progress, and receive personalized recommendations to reach your goals.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "500K+", label: "Meals Logged" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "4.9", label: "App Rating" },
];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent-cyan/20 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <Badge variant="success" size="sm">New</Badge>
                <span className="text-sm text-foreground-muted">
                  AI-Powered Nutrition Tracking
                </span>
                <ChevronRight className="w-4 h-4 text-primary" />
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Eat Smarter with{" "}
                <span className="gradient-text">AI</span>
              </motion.h1>

              <motion.p
                className="text-xl text-foreground-muted mb-8 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Snap a photo of any food and instantly get accurate nutrition facts,
                health insights, and personalized recommendations.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/auth/register">
                  <GradientButton size="lg" icon={<Sparkles className="w-5 h-5" />}>
                    Get Started Free
                  </GradientButton>
                </Link>
                <Link href="#features">
                  <GradientButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                    Learn More
                  </GradientButton>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-foreground-muted">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - App Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent-cyan/30 rounded-3xl blur-3xl" />

                {/* Mock Dashboard */}
                <GlassCard className="relative p-6" glow>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Today</p>
                          <p className="text-xs text-foreground-muted">Monday, Dec 16</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Nutrition Rings */}
                    <div className="grid grid-cols-4 gap-4 py-4">
                      {[
                        { label: "Cal", value: 1.2, max: 2, color: "text-orange-500" },
                        { label: "Pro", value: 85, max: 150, color: "text-cyan-500" },
                        { label: "Carb", value: 120, max: 250, color: "text-purple-500" },
                        { label: "Fat", value: 45, max: 70, color: "text-pink-500" },
                      ].map((ring, i) => (
                        <div key={i} className="text-center">
                          <div className="relative w-full aspect-square">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(ring.value / ring.max) * 251} 251`} className={ring.color} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold">{ring.value}</span>
                            </div>
                          </div>
                          <p className="text-xs text-foreground-muted mt-1">{ring.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Meals */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Recent Meals</p>
                      {[
                        { name: "Grilled Salmon Salad", cal: "420 cal", time: "1:30 PM" },
                        { name: "Greek Yogurt Bowl", cal: "280 cal", time: "10:00 AM" },
                      ].map((meal, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/50 to-accent-cyan/50 flex items-center justify-center">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{meal.name}</p>
                            <p className="text-xs text-foreground-muted">{meal.time}</p>
                          </div>
                          <span className="text-sm text-primary font-medium">{meal.cal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="default" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Everything you need to track, understand, and optimize your nutrition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 h-full" gradient>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground-muted">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">Simple. Smart. Seamless.</h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Start tracking your nutrition in three easy steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <GlassCard className="p-8 text-center relative" glow>
                  <div className="text-5xl font-bold gradient-text opacity-20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-foreground-muted">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center relative overflow-hidden" gradient>
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-purple/20 to-accent-cyan/20 opacity-50" />
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-[100px]"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
                <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have already taken control of their nutrition with NutriMate.
                </p>

                <Link href="/auth/register">
                  <GradientButton size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                    Start Your Free Journey
                  </GradientButton>
                </Link>

                <p className="mt-6 text-sm text-foreground-muted">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">NutriMate</span>
              </Link>
              <p className="text-foreground-muted max-w-sm">
                AI-powered nutrition tracking that helps you make smarter food choices and achieve your health goals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground-muted">
              © 2024 NutriMate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-foreground-muted">
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
