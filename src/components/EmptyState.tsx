"use client";

import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  ctaHref: string;
  ctaLabel: string;
  hint?: string;
};

export default function EmptyState({ title, description, ctaHref, ctaLabel, hint }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.05 }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Sprout className="h-7 w-7" />
        </motion.div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-6">
          <Link href={ctaHref}>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            >
              <Button className="transition-transform will-change-transform hover:scale-[1.02] active:scale-[0.99]">
                {ctaLabel}
              </Button>
            </motion.div>
          </Link>
        </div>
        {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      </motion.div>

      {/* Subtle gradient blobs */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl" />
    </div>
  );
}
