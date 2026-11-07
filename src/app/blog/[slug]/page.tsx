import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { blogPosts, getPostBySlug } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Hotel Amil Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="bg-[#FAF8F5] text-stone-900 min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category },
        ]}
        eyebrow={post.category}
        title={post.title}
        description={`By ${post.author} · ${post.date} · ${post.readTime}`}
        variant="blog"
      />

      <section className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <ImagePlaceholder
            name={post.image}
            className="aspect-[16/9] overflow-hidden rounded-2xl shadow-sm border border-stone-200/80"
            label="Hotel Amil · Rajapalayam"
          />
          <div className="mx-auto mt-8 sm:mt-10 space-y-6">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-base sm:text-lg leading-relaxed text-stone-700">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-10 sm:mt-12 flex flex-wrap gap-4 border-t border-stone-200/80 pt-8">
            <Button href="/rooms">Book Your Stay</Button>
            <Button href="/blog" variant="outline">
              More Articles
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16 border-t border-stone-200/80">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Related reads</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <ImagePlaceholder name={p.image} className="aspect-[16/9]" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">{p.category}</p>
                  <h3 className="mt-2 font-display text-base font-semibold text-[#1C1917] group-hover:text-[#382314] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-auto pt-3 text-xs text-stone-500 font-sans">{p.date} · {p.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
