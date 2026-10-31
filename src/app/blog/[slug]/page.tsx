import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { getPostBySlug, blogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/Button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
      title: `${post.title} | Hotel Amil Blog`,
      description: post.excerpt,
    };
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container className="max-w-4xl">
          <nav className="text-xs font-semibold uppercase tracking-widest text-white/75">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gold-300 font-bold">{post.category}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl text-white">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/85">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-gold-300" />
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-gold-300" />
            <span>{post.readTime}</span>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="max-w-4xl">
          <ImagePlaceholder
            name={post.image}
            className="aspect-[16/9] overflow-hidden rounded-2xl"
            label="Hotel Amil · Rajapalayam"
          />
          <div className="prose-maroon mx-auto mt-8 space-y-5">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-maroon-900/90">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/rooms">Book Your Stay</Button>
            <Button href="/blog" variant="outline">
              More Articles
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-maroon-50 py-12">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-maroon-900">Related reads</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-maroon-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <ImagePlaceholder name={p.image} className="aspect-[16/9]" />
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">{p.category}</p>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-maroon-900 group-hover:text-maroon-700">
                    {p.title}
                  </h3>
                  <p className="mt-auto pt-2 text-xs text-muted">{p.date} · {p.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}