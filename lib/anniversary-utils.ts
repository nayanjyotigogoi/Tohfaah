import { Memory } from "./memory-types"

export interface Anniversary {
  type: '1-year' | '6-months' | '1-month' | 'today'
  label: string
  daysUntil: number
  isToday: boolean
}

export function getMemoryAnniversary(memory: Memory): Anniversary | null {
  if (!memory.date) return null

  const memoryDate = new Date(memory.date)
  const today = new Date()
  
  // Reset times to compare dates only
  memoryDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - memoryDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Check for today's anniversary (same month and day)
  if (memoryDate.getMonth() === today.getMonth() && memoryDate.getDate() === today.getDate()) {
    const yearsDiff = today.getFullYear() - memoryDate.getFullYear()
    if (yearsDiff > 0) {
      return {
        type: '1-year',
        label: `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} ago today`,
        daysUntil: 0,
        isToday: true
      }
    }
    return {
      type: 'today',
      label: 'Today',
      daysUntil: 0,
      isToday: true
    }
  }

  // Check for upcoming anniversaries (within next 7 days)
  const nextAnniversary = new Date(today.getFullYear(), memoryDate.getMonth(), memoryDate.getDate())
  if (nextAnniversary < today) {
    nextAnniversary.setFullYear(today.getFullYear() + 1)
  }

  const daysUntilAnniversary = Math.floor((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilAnniversary <= 7 && daysUntilAnniversary > 0) {
    const yearsDiff = nextAnniversary.getFullYear() - memoryDate.getFullYear()
    return {
      type: '1-year',
      label: `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} anniversary in ${daysUntilAnniversary} ${daysUntilAnniversary === 1 ? 'day' : 'days'}`,
      daysUntil: daysUntilAnniversary,
      isToday: false
    }
  }

  // Check for 6-month anniversary
  const sixMonthsAfter = new Date(memoryDate)
  sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6)
  sixMonthsAfter.setHours(0, 0, 0, 0)

  if (sixMonthsAfter.getMonth() === today.getMonth() && sixMonthsAfter.getDate() === today.getDate()) {
    return {
      type: '6-months',
      label: '6 months ago today',
      daysUntil: 0,
      isToday: true
    }
  }

  return null
}

export function getUpcomingAnniversaries(memories: Memory[]): (Memory & { anniversary: Anniversary })[] {
  return memories
    .map(memory => {
      const anniversary = getMemoryAnniversary(memory)
      return anniversary ? { ...memory, anniversary } : null
    })
    .filter((item): item is Memory & { anniversary: Anniversary } => item !== null)
    .sort((a, b) => a.anniversary.daysUntil - b.anniversary.daysUntil)
}
