"use client";

import { motion } from "motion/react";
import TutorialCard from "./TutorialCard";
import type { Tutorial } from "@/lib/types";

interface TutorialsGridProps {
  tutorials: Tutorial[];
}

export default function TutorialsGrid({ tutorials }: TutorialsGridProps) {
  return (
    <section id="tutorials" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
            Learn
          </p>
          <h2 className="font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Tutorials
          </h2>
          <p className="mt-4 text-lg text-muted">
            Tips, techniques, and insights on photography and post-processing.
          </p>
        </motion.div>

        {/* Tutorials Grid */}
        {tutorials.length > 0 ? (
          <motion.div
            className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.documentId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TutorialCard tutorial={tutorial} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="mx-auto max-w-md rounded-xl border border-border bg-card p-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-muted">
              No tutorials yet. Check back soon for tips and techniques!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
