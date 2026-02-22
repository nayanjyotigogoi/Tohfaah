export interface MemoryUser {
  id: string
  full_name: string
  avatar_url?: string
}

export interface Memory {
    id: string
    user_id: string 
 
    user?: MemoryUser 
    title: string
    badge: Badge
    message: string
    date?: string
    imageUrl?: string
    lat: number
    lng: number
    createdAt: number
    connectedTo?: string[] // IDs of connected memories
  }
  
  export interface Badge {
    emoji: string
    label: string
    color: string
    bgColor: string
  }
  
export const BADGES: Badge[] = [
  // ❤️ Love & Relationships
  { emoji: "❤️", label: "Love", color: "#e8457a", bgColor: "#fde2e9" },
  { emoji: "🥰", label: "Adore", color: "#ec4899", bgColor: "#fce7f3" },
  { emoji: "💍", label: "Engagement", color: "#d946ef", bgColor: "#fae8ff" },
  { emoji: "💑", label: "Together", color: "#f43f5e", bgColor: "#ffe4e6" },
  { emoji: "💌", label: "Proposal", color: "#fb7185", bgColor: "#ffe4e6" },

  // 👨‍👩‍👧 Family & Friends
  { emoji: "👨‍👩‍👧", label: "Family", color: "#16a34a", bgColor: "#dcfce7" },
  { emoji: "👯", label: "Friends", color: "#0ea5e9", bgColor: "#e0f2fe" },
  { emoji: "👶", label: "Baby", color: "#06b6d4", bgColor: "#cffafe" },
  { emoji: "🐶", label: "Pet", color: "#f59e0b", bgColor: "#fef3c7" },

  // 🎉 Celebrations
  { emoji: "🎂", label: "Birthday", color: "#f97316", bgColor: "#ffedd5" },
  { emoji: "🎉", label: "Party", color: "#f43f5e", bgColor: "#ffe4e6" },
  { emoji: "🎓", label: "Graduation", color: "#6366f1", bgColor: "#e0e7ff" },
  { emoji: "🎁", label: "Gift", color: "#ef4444", bgColor: "#fee2e2" },

  // ✈️ Travel & Places
  { emoji: "✈️", label: "Travel", color: "#0ea5e9", bgColor: "#e0f2fe" },
  { emoji: "🌅", label: "Sunset", color: "#ea580c", bgColor: "#ffedd5" },
  { emoji: "🏖️", label: "Beach", color: "#3b82f6", bgColor: "#dbeafe" },
  { emoji: "🏔️", label: "Adventure", color: "#10b981", bgColor: "#d1fae5" },
  { emoji: "🌆", label: "City", color: "#6b7280", bgColor: "#f3f4f6" },

  // 👩‍💻 Work & Study
  { emoji: "💼", label: "Work", color: "#374151", bgColor: "#e5e7eb" },
  { emoji: "📚", label: "Study", color: "#7c3aed", bgColor: "#ede9fe" },
  { emoji: "🖥️", label: "Project", color: "#4f46e5", bgColor: "#e0e7ff" },

  // 🏆 Achievements
  { emoji: "🏆", label: "Achievement", color: "#eab308", bgColor: "#fef9c3" },
  { emoji: "🥇", label: "Victory", color: "#f59e0b", bgColor: "#fef3c7" },
  { emoji: "🚀", label: "Milestone", color: "#22c55e", bgColor: "#dcfce7" },

  // 💪 Personal Growth
  { emoji: "💪", label: "Strength", color: "#ef4444", bgColor: "#fee2e2" },
  { emoji: "🌱", label: "Growth", color: "#16a34a", bgColor: "#dcfce7" },
  { emoji: "🧠", label: "Learning", color: "#9333ea", bgColor: "#f3e8ff" },

  // 🎭 Lifestyle & Hobbies
  { emoji: "🎶", label: "Music", color: "#7c3aed", bgColor: "#ede9fe" },
  { emoji: "📸", label: "Photography", color: "#6b7280", bgColor: "#f3f4f6" },
  { emoji: "☕", label: "Cozy", color: "#b45309", bgColor: "#fef3c7" },
  { emoji: "🎨", label: "Creative", color: "#db2777", bgColor: "#fce7f3" },
  { emoji: "⚽", label: "Sports", color: "#059669", bgColor: "#d1fae5" },

  // 🌧 Emotional Moments
  { emoji: "✨", label: "Magic", color: "#a855f7", bgColor: "#ede2fe" },
  { emoji: "🌟", label: "Star", color: "#eab308", bgColor: "#fef9c3" },
  { emoji: "💭", label: "Reflection", color: "#6b7280", bgColor: "#f3f4f6" },
  { emoji: "🌊", label: "Waves", color: "#3b82f6", bgColor: "#dbeafe" },
  { emoji: "🦋", label: "Flutter", color: "#06b6d4", bgColor: "#cffafe" },

  // 🏡 Everyday Moments
  { emoji: "🏡", label: "Home", color: "#10b981", bgColor: "#d1fae5" },
  { emoji: "🍽️", label: "Food", color: "#f97316", bgColor: "#ffedd5" },
  { emoji: "🚗", label: "Journey", color: "#0ea5e9", bgColor: "#e0f2fe" },
]
  