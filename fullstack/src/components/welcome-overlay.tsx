"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(false);

  // 检查是否为新用户
  useEffect(() => {
    const seen = localStorage.getItem("hasSeenWelcome");
    if (!seen) {
      setVisible(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setVisible(true)}
        aria-label="Show welcome"
        className="h-10 w-10"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* 欢迎面板 */}
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border bg-background p-6 text-foreground shadow-lg">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-center text-xl font-bold">
              🎉 Welcome to CryptoBubble! 🚀
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                Here, you'll dive into the universe of Twitter KOLs and explore
                their interconnected influence:
              </p>
              <p>
                🔵 <strong>Bubble size</strong> represents a user's follower
                count — the bigger the bubble, the greater their influence.
              </p>
              <p>
                🟢 <strong>Green lines</strong> indicate positive interactions,
                while 🔴 <strong>red lines</strong> signify negative ones.
              </p>
              <p>
                ⏳ Use the <strong>time slider</strong> to travel through the
                past and observe how sentiment shifts over time.
              </p>
              <p>
                🔎 <strong>Search and refine your KOL list</strong> — find
                specific users and mark them as interested or excluded.
              </p>
              <p>
                📈 Click a bubble to view tweet details and sentiment dynamics
                in real time.
              </p>
              <p>
                ✨ Ready to explore the KOL galaxy around your favorite tokens?
              </p>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={handleClose}>Exploring Now</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
