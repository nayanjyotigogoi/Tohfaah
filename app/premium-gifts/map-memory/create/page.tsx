"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function CreateMemoryMapPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [hasPassword, setHasPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordHint, setPasswordHint] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

const handleCreateDraft = async () => {
  if (!title.trim()) return

  try {
    setLoading(true)
    setError(null)

    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.replace("/login")
      return
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/memory-maps/draft`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create draft")
    }

   router.push(`/premium-gifts/map-memory/draft/${data.memory_map_id}`)



  } catch (err) {
    console.error(err)
    setError("Unable to create memory map.")
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Create Your{" "}
              <span className="italic text-primary">Memory Map</span>
            </h1>

            <p className="text-muted-foreground mb-12 text-lg">
              Pin your most meaningful moments to real-world places.
              Build something you can both revisit forever.
            </p>

            <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Map Title
                </label>
                <Input
                  placeholder="Our Story Across Cities"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="This map holds our most meaningful memories..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium">
                  Protect with Password
                </span>
                <Switch
                  checked={hasPassword}
                  onCheckedChange={setHasPassword}
                />
              </div>

              {hasPassword && (
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Password hint (optional)"
                    value={passwordHint}
                    onChange={(e) => setPasswordHint(e.target.value)}
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}

              <div className="pt-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateDraft}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Map"}
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
