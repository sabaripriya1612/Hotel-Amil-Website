import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
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
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">Blog</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Stories &amp; guides from Hotel Amil
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Everything worth knowing for your Rajapalayam trip — from nearby temples and waterfalls
            to planning the perfect family stay or celebration.
          </p>
        </Container>
      </section>

      {/* Editorial list: alternating image/content rows separated by hairline rules */}
      <section className="py-14 sm:py-16">
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
                    i > 0 && "mt-12 border-t border-maroon-100 pt-12 sm:mt-16 sm:pt-16"
                  )}
                >
                  <div className="grid items-center gap-7 md:grid-cols-2 md:gap-10 lg:gap-14">
                    {/* Large editorial image — alternates sides on md+ (stacks above content on mobile) */}
                    <div className={cn(imageRight && "md:order-2")}>
                      <ImagePlaceholder
                        name={post.image}
                        alt={post.title}
                        className="aspect-[16/10] md:aspect-[4/3]"
                      />
                    </div>

                    {/* Content column */}
                    <div className={cn(imageRight && "md:order-1")}>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold uppercase tracking-[0.18em] text-gold-600">
                          {post.category}
                        </span>
                        <span aria-hidden className="h-px w-8 bg-gold-400/70" />
                        <span className="text-muted">{post.date}</span>
                      </div>

                      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-maroon-900 transition-colors group-hover:text-maroon-700 sm:text-3xl">
                        {post.title}
                      </h2>

                      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                        {post.excerpt}
                      </p>

                      <div className="mt-6 flex items-center gap-3 text-xs text-muted">
                        <span className="font-medium text-maroon-800">{post.author}</span>
                        <span aria-hidden className="h-1 w-1 rounded-full bg-gold-400" />
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
