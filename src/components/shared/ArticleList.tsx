"use client";
import { useMemo, useState } from "react";
import { articles } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import ArticleCard from "./ArticleCard";
import { cn } from "@/lib/utils";
export default function ArticleList({ base = "/berita" }: { base?: string }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          (category === "all" || article.category === category) &&
          `${article.title} ${article.excerpt}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );
  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter kategori"
        >
          {[
            { id: "all", label: "Lorem ipsum" },
            { id: "lorem", label: "Lorem" },
            { id: "ipsum", label: "Ipsum" },
            { id: "dolor", label: "Dolor" },
          ].map((tab) => (
            <Button
              key={tab.id}
              size="default"
              variant="outline"
              aria-pressed={category === tab.id}
              onClick={() => setCategory(tab.id)}
              className={cn(
                "h-10 text-xs",
                category === tab.id &&
                  "border-primary bg-primary text-white hover:bg-primary-dark",
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Cari artikel"
          placeholder="Dolor sit amet…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="field max-w-sm"
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} artikel
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <ArticleCard key={article.slug} article={article} base={base} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-3xl bg-mist px-6 py-16 text-center">
          <p className="text-xl font-medium">Lorem ipsum dolor sit amet.</p>
          <p className="body-copy mt-3">Consectetur adipiscing elit.</p>
          <Button
            variant="outline"
            aria-label="Reset pencarian"
            className="mt-6"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Lorem ipsum
          </Button>
        </div>
      )}
    </div>
  );
}
