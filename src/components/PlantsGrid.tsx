"use client";

import { type PlantCardProps } from "@/components/PlantCard";
import PlantCard from "@/components/PlantCard";
import { motion } from "framer-motion";

export default function PlantsGrid({ items }: { items: PlantCardProps[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06 } },
      }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((p) => (
        <motion.div
          key={p.id}
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.25 }}
        >
          <PlantCard {...p} />
        </motion.div>
      ))}
    </motion.div>
  );
}

