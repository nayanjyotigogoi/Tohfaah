"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ManageParticipantsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [mapData, setMapData] = useState<any>(null)
  const [emails, setEmails] = useState("")
  const [error, setError] = useState(false)

  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  const fetchMap = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memory-maps/manage/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )

      if (!res.ok) {
        setError(true)
        return
      }

      const data = await res.json()
      setMapData(data.memory_map)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchMap()
  }, [id])

  const handleInvite = async () => {
    if (!emails.trim() || sending) return

    const token = localStorage.getItem("auth_token")
    if (!token) return

    setSending(true)

    const emailArray = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memory-maps/${id}/invite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails: emailArray }),
        }
      )

      if (!res.ok) {
        setModalMessage("Failed to send invite. Please try again.")
        setShowModal(true)
        setSending(false)
        return
      }

      setModalMessage("Invites sent successfully 💌")
      setShowModal(true)
      setEmails("")
      await fetchMap() // refresh participants
    } catch (err) {
      console.error(err)
      setModalMessage("Network error. Please try again.")
      setShowModal(true)
    }

    setSending(false)
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50 pt-32 md:pt-36 pb-20 px-6 relative z-0">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            Loading...
          </div>
        ) : error || !mapData ? (
          <div className="flex items-center justify-center h-[60vh]">
            Access denied.
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">

            <h1 className="text-3xl font-semibold">
              Manage Participants – {mapData.title}
            </h1>

            {/* Invite Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <h2 className="font-semibold text-lg">Invite Participants</h2>

              <input
                type="text"
                placeholder="Enter emails separated by commas"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                onClick={handleInvite}
                disabled={sending}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? "Sending..." : "Send Invite"}
              </button>

              <p className="text-sm text-gray-500">
                Seats used: {mapData.participants?.length} / {mapData.max_participants}
              </p>
            </div>

            {/* Participant List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Participants</h2>

              <div className="space-y-3">
                {mapData.participants?.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <div className="font-medium">{p.email}</div>
                      <div className="text-xs text-gray-500">
                        {p.role} – {p.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />

      {/* SUCCESS / ERROR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4">
            <p className="text-lg font-medium">{modalMessage}</p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl cursor-pointer hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}