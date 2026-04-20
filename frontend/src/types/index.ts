export interface User {
  id: number;
  name: string;
  email: string;
  is_verified?: boolean;
}

export interface Meal {
  id: number;
  user_id: number;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  ingredients: string[];
  description?: string;
  created_at: string;
  quantity?: number;
  grams?: number;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
}

export interface DailyData {
  meals: Meal[];
  totals: NutritionTotals;
}

export interface WeightEntry {
  id: number;
  user_id: number;
  weight: number;
  date: string;
  created_at: string;
}

export interface HealthProfile {
  id?: number;
  user_id?: number;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activity_level?: string;
  dietary_preferences?: string[];
  allergies?: string[];
  health_conditions?: string[];
  calorie_goal?: number;
  protein_goal?: number;
  carbs_goal?: number;
  fats_goal?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FoodDetection {
  food: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  ingredients: string[];
  description: string;
}

export interface HealthCheck {
  warning: string;
  suggestions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: string;
}
