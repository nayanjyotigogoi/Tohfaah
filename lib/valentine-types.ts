export interface ValentineConfig {
  identity: {
    selectedDate: number
    senderName: string
    recipientName: string
  }

  visuals: {
    loveLevel: number
    photo1: string | null
    photo2: string | null
    carDesign: "pink" | "red" | "classic"
  }

  puzzle: {
    secretWord: string
    hint: string
  }

  lock: {
    enabled: boolean
    question: string
    answer: string
    hint: string
  }

  message: {
    heartToHeartMessage: string
    coupons: { title: string; subtitle: string }[]
  }

  interaction: {
    dateQuestion: string
    dateActivity: string
    noMessages: string[]
    activityLabels: Record<string, string>
  }

  closing: {
    foreverMessage: string
  }
}

export const DEFAULT_CONFIG: ValentineConfig = {
  identity: {
    selectedDate: 14,
    senderName: "",
    recipientName: "",
  },

  visuals: {
    loveLevel: 80,
    photo1: null,
    photo2: null,
    carDesign: "pink",
  },

  puzzle: {
    secretWord: "LOVE",
    hint: "A four letter word that makes the world go round",
  },

  lock: {
    enabled: false,
    question: "",
    answer: "",
    hint: "",
  },

  message: {
    heartToHeartMessage:
      "I think about you every second of every day",
    coupons: [
      { title: "free kisses", subtitle: "uses: unlimited" },
      { title: "cuddle with me", subtitle: "expires: never" },
      { title: "free hugs", subtitle: "available use 24/7" },
      { title: "sleep call", subtitle: "just talk to me" },
    ],
  },

  interaction: {
    dateQuestion: "Will you go on a date with me?",
    dateActivity: "Dinner",
    noMessages: [],
    activityLabels: {},
  },

  closing: {
    foreverMessage: "Add your own romantic message here",
  },
}

