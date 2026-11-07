import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { blogPosts } from "@/lib/blog";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Blog | Hotel Amil, Rajapalayam",
  description:
    "Travel tips, temple guides and stay ideas from Hotel Amil, Rajapalayam — temples near Rajapalayam, Ayyanar Falls, family stays and event planning.",
};

export default function BlogPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="STORIES & TRAVEL GUIDES"
        title="Stories & Guides from Hotel Amil"
        description="Everything worth knowing for your Rajapalayam trip — from nearby ancient temples and waterfalls to planning the perfect family holiday or grand celebration."
        variant="blog"
      />

      {/* Editorial list: alternating image/content rows separated by hairline rules */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            {blogPosts.map((post, i) => {
              const imageRight = i % 2 === 1;
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className={cn(
                    "group block",
                    i > 0 && "mt-12 border-t border-stone-200/80 pt-12 sm:mt-16 sm:pt-16"
                  )}
                >
                  <div className="grid items-center gap-7 md:grid-cols-2 md:gap-10 lg:gap-14">
                    {/* Large editorial image — alternates sides on md+ (stacks above content on mobile) */}
                    <div className={cn(imageRight && "md:order-2")}>
                      <ImagePlaceholder
                        name={post.image}
                        alt={post.title}
                        className="aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-stone-200/80 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>

                    {/* Content column */}
                    <div className={cn(imageRight && "md:order-1")}>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                          {post.category}
                        </span>
                        <span aria-hidden className="h-px w-8 bg-[#D8A34F]" />
                        <span className="text-stone-500 font-sans">{post.date}</span>
                      </div>

                      <h2 className="mt-3 font-display text-2xl font-normal leading-snug text-[#1C1917] transition-colors group-hover:text-[#382314] sm:text-3xl">
                        {post.title}
                      </h2>

                      <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base font-sans">
                        {post.excerpt}
                      </p>

                      <div className="mt-6 flex items-center gap-3 text-xs text-stone-500 font-sans">
                        <span className="font-medium text-stone-700">{post.author}</span>
                        <span aria-hidden className="h-1 w-1 rounded-full bg-[#D8A34F]" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
