"use client"

import { useState, useMemo, useCallback } from "react"
import { Lightbulb, Check, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WordSearchSectionProps {
  secretWord: string
  hint: string
  editable?: boolean
  onUpdate?: (field: "secretWord" | "hint", value: string) => void
}

export default function WordSearchSection({
  secretWord,
  hint,
  editable = false,
  onUpdate,
}: WordSearchSectionProps) {

  const [userGuess, setUserGuess] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set())

  /* ===========================
     GRID GENERATION
  ============================ */

  const grid = useMemo(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const size = 6
    const arr: string[] = []
    const wordPositions: number[] = []

    if (!secretWord) {
      return { array: Array(size * size).fill(""), positions: [] }
    }

    const word = secretWord.toUpperCase().slice(0, 6)
    const startRow = Math.floor((size - word.length) / 2)
    const startCol = Math.floor((size - word.length) / 2)

    for (let k = 0; k < word.length; k++) {
      wordPositions.push((startRow + k) * size + (startCol + k))
    }

    for (let i = 0; i < size * size; i++) {
      const idx = wordPositions.indexOf(i)
      if (idx !== -1) {
        arr.push(word[idx])
      } else {
        arr.push(
          letters[Math.floor(Math.random() * letters.length)]
        )
      }
    }

    return { array: arr, positions: wordPositions }
  }, [secretWord])

  /* ===========================
     CHECK ANSWER
  ============================ */

  const handleCheck = useCallback(() => {
    if (userGuess.toUpperCase() === secretWord.toUpperCase()) {
      setIsCorrect(true)
      setRevealedCells(new Set(grid.positions))
    } else {
      setIsCorrect(false)
    }
  }, [userGuess, secretWord, grid.positions])

  return (
    <section className="min-h-screen flex items-center justify-center bg-[hsl(350,70%,92%)] px-6 py-16">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

        {/* ===========================
           LEFT — HEADING
        ============================ */}
        <div className="space-y-6 text-left md:text-left">

          <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight flex items-center gap-3">
            Find The Hidden Word
            {editable && <Pencil className="w-5 h-5 text-primary" />}
          </h2>

          <p className="text-muted-foreground text-lg max-w-sm">
            Can you guess the secret word? Enter your guess and see if you can reveal the hidden message!
          </p>

          {editable && (
            <div className="space-y-4 bg-card p-6 rounded-2xl shadow-md">
              <Input
                value={secretWord}
                onChange={(e) =>
                  onUpdate?.("secretWord", e.target.value.toUpperCase())
                }
                placeholder="Secret Word"
                className="text-center uppercase text-lg"
                maxLength={6}
              />

              <Input
                value={hint}
                onChange={(e) =>
                  onUpdate?.("hint", e.target.value)
                }
                placeholder="Hint"
                className="text-center"
              />
            </div>
          )}
        </div>

        {/* ===========================
           CENTER — GRID
        ============================ */}
        <div className="flex justify-center">
          <div className="bg-pink-200/80 rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-300">
            <div className="grid grid-cols-6 gap-2">
              {grid.array.map((letter, i) => {
                const isRevealed = revealedCells.has(i)

                return (
                  <div
                    key={i}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-display text-xl md:text-2xl transition-all duration-500 ${
                      isRevealed
                        ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_15px_rgba(255,0,90,0.4)]"
                        : "bg-pink-100/80 text-foreground hover:scale-105"
                    }`}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ===========================
           RIGHT — HINT + INPUT
        ============================ */}
        {!editable && (
          <div className="space-y-6">

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Need a Hint?"}
              </Button>

              {showHint && (
                <div className="bg-card px-4 py-3 rounded-xl shadow-sm animate-fade-in">
                  <p className="text-muted-foreground italic text-sm">
                    {hint}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 max-w-xs">
              <div className="flex gap-2">
                <Input
                  value={userGuess}
                  onChange={(e) => {
                    setUserGuess(e.target.value.toUpperCase())
                    setIsCorrect(null)
                  }}
                  placeholder="Enter your guess"
                  className="text-center uppercase text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                />
                <Button onClick={handleCheck}>
                  <Check className="w-4 h-4" />
                </Button>
              </div>

              {isCorrect === true && (
                <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                  <Check className="w-5 h-5" />
                  <span className="font-display text-lg">
                    You found it 💖
                  </span>
                </div>
              )}

              {isCorrect === false && (
                <div className="flex items-center gap-2 text-red-500 animate-fade-in">
                  <X className="w-5 h-5" />
                  <span className="font-display">
                    Try again!
                  </span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>
    </section>
  )
}
