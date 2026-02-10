"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Sparkles,
  Gift,
  Settings,
  Plus,
  Copy,
  ShoppingBag,
  FileText,
  Trash,
  Play,
} from "lucide-react";

type Tab = "overview" | "free" | "paid" | "drafts" | "orders" | "settings";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    free_gifts: 0,
    premium_live: 0,
    premium_drafts: 0,
    orders: 0,
  });

  const [freeGifts, setFreeGifts] = useState<any[]>([]);
  const [paidPremium, setPaidPremium] = useState<any[]>([]);
  const [draftPremium, setDraftPremium] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load dashboard");

        const data = await res.json();

        setStats(data.stats);
        setFreeGifts(data.free || []);
        setPaidPremium(data.paid || []);
        setDraftPremium(data.drafts || []);
        setOrders(data.orders || []);
        setRecentActivity(data.recent_activity || []);
      } catch (err) {
        console.error("DASHBOARD[FE]: Error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= COPY FULL URL ================= */
  const copyLink = (link: string) => {
    const fullUrl = link.startsWith("http")
      ? link
      : `${window.location.origin}${link}`;

    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(fullUrl);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const playLink = (link: string) => {
    const fullUrl = link.startsWith("http")
      ? link
      : `${window.location.origin}${link}`;

    window.open(fullUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Heart className="w-8 h-8 animate-pulse text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Heart },
    { id: "free", label: "Free Gifts", icon: Gift },
    { id: "paid", label: "Premium Gifts", icon: Sparkles },
    { id: "drafts", label: "Drafts", icon: FileText },
    { id: "orders", label: "Shop Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <main className="relative min-h-screen bg-background">
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-foreground">
                Welcome back
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your gifts and experiences
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/free-gifts">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Free Gift
                </Button>
              </Link>

              <Link href="/premium-gifts">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium Experience
                </Button>
              </Link>
            </div>
          </div>

          {/* TABS */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={Gift} label="Free Gifts" value={stats.free_gifts} />
                  <StatCard icon={Sparkles} label="Premium Gifts" value={stats.premium_live} />
                  <StatCard icon={FileText} label="Drafts" value={stats.premium_drafts} />
                  <StatCard icon={ShoppingBag} label="Shop Orders" value={stats.orders} />
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-muted-foreground">No recent activity</p>
                    ) : (
                      recentActivity.map((item) => (
                        <GiftRow
                          key={`${item.category}-${item.id}`}
                          gift={item}
                          onCopy={copyLink}
                          copied={copiedLink}
                          onPlay={() =>
                            item.status === "draft"
                              ? window.open(
                                  `/premium-gifts/valentine/preview/${item.id}`,
                                  "_blank"
                                )
                              : playLink(
                                  `/premium-gifts/valentine/${item.share_token}`
                                )
                          }
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FREE */}
            {activeTab === "free" &&
              (freeGifts.length === 0 ? (
                <EmptyState
                  icon={Gift}
                  title="No free gifts yet"
                  description="Create your first free gift"
                  actionLabel="Create Free Gift"
                  actionHref="/free-gifts"
                />
              ) : (
                freeGifts.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    onCopyLink={() => copyLink(gift.link)}
                    copiedLink={copiedLink}
                    onPlay={() => playLink(gift.link)}
                  />
                ))
              ))}

            {/* PREMIUM */}
            {activeTab === "paid" &&
              (paidPremium.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No premium gifts yet"
                  description="Create a premium experience"
                  actionLabel="Create Experience"
                  actionHref="/premium-gifts/valentine/create"
                />
              ) : (
                paidPremium.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    onCopyLink={() =>
                      copyLink(`/premium-gifts/valentine/${gift.share_token}`)
                    }
                    copiedLink={copiedLink}
                    onPlay={() =>
                      playLink(`/premium-gifts/valentine/${gift.share_token}`)
                    }
                  />
                ))
              ))}

            {/* DRAFTS */}
            {activeTab === "drafts" &&
              (draftPremium.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No drafts"
                  description="Start creating to save drafts"
                  actionLabel="Create Experience"
                  actionHref="/premium-gifts/valentine/create"
                />
              ) : (
                draftPremium.map((gift) => (
                  <DraftCard
                    key={gift.id}
                    gift={gift}
                    onDeleted={() =>
                      setDraftPremium((prev) =>
                        prev.filter((d) => d.id !== gift.id)
                      )
                    }
                  />
                ))
              ))}

            {/* ORDERS */}
            {activeTab === "orders" &&
              (orders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="No orders yet"
                  description="Browse the shop"
                  actionLabel="Visit Shop"
                  actionHref="/coming-soon"
                />
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ))}

            {/* SETTINGS */}
            {activeTab === "settings" && <SettingsPanel />}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
/* ================= COMPONENTS ================= */

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <p className="text-3xl font-light">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: any) {
  return (
    <div className="text-center py-16 bg-secondary/30 rounded-2xl">
      <Icon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link href={actionHref}>
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}

function GiftRow({ gift, onCopy, copied, onPlay }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
      <div>
        <p className="font-medium">
          {gift.type} for {gift.recipient}
        </p>
        <p className="text-sm text-muted-foreground">{gift.date}</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onPlay}>
          <Play className="w-4 h-4" />
        </Button>

        {gift.link && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopy(gift.link)}
          >
            {copied === gift.link ? "Copied!" : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}

function GiftCard({ gift, onCopyLink, copiedLink, onPlay }: any) {
  const link =
    gift.share_token
      ? `/premium-gifts/valentine/${gift.share_token}`
      : gift.link;

  const fullUrl = link
    ? link.startsWith("http")
      ? link
      : `${typeof window !== "undefined" ? window.location.origin : ""}${link}`
    : null;

  return (
    <div className="flex items-center justify-between p-6 bg-card border border-border rounded-2xl">
      <div>
        <p className="font-medium">
          {gift.type ?? "Premium"} for {gift.recipient}
        </p>
        <p className="text-sm text-muted-foreground">{gift.date}</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onPlay}>
          <Play className="w-4 h-4" />
        </Button>

        {link && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopyLink(link)}
          >
            {copiedLink === fullUrl ? "Copied!" : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}

function DraftCard({ gift, onDeleted }: any) {
  const continueDraft = () => {
    window.location.href = `/premium-gifts/valentine/create?id=${gift.id}`;
  };

  const playDraft = () => {
    window.open(
      `/premium-gifts/valentine/preview/${gift.id}`,
      "_blank"
    );
  };

  const deleteDraft = async () => {
    const token = localStorage.getItem("auth_token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/${gift.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    onDeleted();
  };

  return (
    <div className="flex items-center justify-between p-6 bg-card border border-border rounded-2xl">
      <div>
        <p className="font-medium">Draft for {gift.recipient}</p>
        <p className="text-sm text-muted-foreground">
          Last updated {gift.updated_at ?? "recently"}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={playDraft}>
          <Play className="w-4 h-4" />
        </Button>

        <Button onClick={continueDraft}>
          Continue
        </Button>

        <Button variant="destructive" onClick={deleteDraft}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function OrderCard({ order }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-card border border-border rounded-2xl">
      <p className="font-medium">{order.item}</p>
      <span>{order.status}</span>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <Button variant="destructive">Delete Account</Button>
    </div>
  );
}
