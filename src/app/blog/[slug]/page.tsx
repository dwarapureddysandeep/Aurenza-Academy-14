import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ChevronRight, ArrowLeft, Eye, Clock, Calendar, Sparkles, BookOpen, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch blog details
  const blog = await db.blog.findUnique({
    where: { slug }
  });

  if (!blog) {
    notFound();
  }

  // Increment views count in database (simulated client click/server increment)
  try {
    await db.blog.update({
      where: { id: blog.id },
      data: { views: blog.views + 1 }
    });
  } catch (e) {
    // Ignore updates during static build triggers
  }

  // 2. Fetch related courses for the sidebar conversion card
  const courses = await db.course.findMany();
  // Try to find a course whose category matches the blog's category, or default to Java
  const matchedCourse = courses.find((c: any) => 
    c.name.toLowerCase().includes(blog.category.split(' ')[0].toLowerCase())
  ) || courses[0];

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans relative py-12">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Breadcrumbs and back button */}
        <div className="flex justify-between items-center text-xs font-bold text-textSecondary uppercase tracking-wider">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-primary transition">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span className="text-neutral-400">/</span>
            <Link href="/blog" className="hover:text-primary transition">Blog</Link>
            <span className="text-neutral-400">/</span>
            <span className="text-textPrimary truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        {/* Main Post Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column - Article Content */}
          <article className="lg:col-span-8 space-y-6 bg-white border border-borderLight p-6 sm:p-10 rounded-[32px] shadow-soft">
            
            {/* Meta headers */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-0.5 rounded-full">
                {blog.category}
              </span>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C182F] leading-tight heading">
                {blog.title}
              </h1>

              <div className="flex flex-wrap gap-4 items-center pt-2 text-[11px] font-bold text-textSecondary border-b border-borderLight pb-4">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-primary" /> {blog.views} Views</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> 5 min read</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" /> June 2026</span>
              </div>
            </div>

            {/* Post Banner */}
            <div className="h-64 sm:h-96 rounded-[24px] overflow-hidden border border-borderLight bg-neutral-100">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Rich Content */}
            <div className="text-xs sm:text-sm text-textSecondary leading-relaxed space-y-6 pt-4 font-medium font-sans">
              <p className="first-letter:text-4xl first-letter:font-black first-letter:text-primary first-letter:mr-2 first-letter:float-left">
                {blog.content}
              </p>
              <p>
                Aurenza Academy's engineering mentors advocate that adopting modern development frameworks (e.g. Next.js 15 Server Components and Spring Boot REST structures) is critical to maintaining zero cold start latencies. By modularizing core business objects and executing daily CI/CD scripts, full-stack engineers can guarantee 99.9% uptime deployment metrics in corporate environments.
              </p>
              <blockquote className="border-l-4 border-primary p-4 rounded bg-primary/5 italic font-semibold text-textPrimary leading-relaxed">
                "Theory is the foundation, but deployment is the metric of success. The developer who can code high-throughput APIs is valuable, but the architect who designs elastic structures is indispensable."
              </blockquote>
              <p>
                In the upcoming live cohort modules, we will dive deep into these strategies. Registered learners undergo live sandbox evaluations, mock interview preparations, and profile reviews by tech directors.
              </p>
            </div>

            {/* Tags footer */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-borderLight flex flex-wrap gap-2">
                {blog.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-borderLight text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share links */}
            <div className="pt-6 border-t border-borderLight flex items-center justify-between">
              <span className="text-xs font-bold text-textSecondary flex items-center gap-1.5"><Share2 className="w-4 h-4 text-primary" /> Share Article:</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-borderLight hover:bg-neutral-50 transition text-[#0077b5]" title="Share on LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full border border-borderLight hover:bg-neutral-50 transition text-[#1da1f2]" title="Share on Twitter">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full border border-borderLight hover:bg-neutral-50 transition text-[#1877f2]" title="Share on Facebook">
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>

          </article>

          {/* Right Column - Recommended Course & CTAs */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Recommended Certification Card */}
            {matchedCourse && (
              <div className="bg-gradient-to-br from-[#0C182F] to-[#0E061A] text-white p-6 rounded-[28px] border border-white/[0.08] relative overflow-hidden shadow-premium space-y-5">
                {/* Glow backdrop bubble */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full filter blur-[45px]"></div>
                
                <div className="space-y-1.5 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-[9px] font-bold text-primary uppercase tracking-widest leading-none">
                    <Sparkles className="w-3 h-3 text-primary" /> RECOMMENDED PATHWAY
                  </span>
                  <h4 className="text-md sm:text-lg font-extrabold heading tracking-tight pt-1 leading-snug">{matchedCourse.name}</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                    Master these skills live with active tech directors. Get referred directly to our 500+ corporate hiring partners.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center relative z-10">
                  <div className="space-y-1 text-xs">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Duration</span>
                    <strong className="block text-white font-black">{matchedCourse.duration}</strong>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide block">Fee Starting From</span>
                    <strong className="block text-successGreen font-black text-sm">₹{matchedCourse.price.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <Link 
                    href={`/courses/${matchedCourse.slug}`}
                    className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:shadow-neonPurple transition text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center"
                  >
                    View Certification Details <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                  
                  <Link 
                    href={`/checkout/${matchedCourse.id}`}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center block"
                  >
                    Direct Checkout
                  </Link>
                </div>
              </div>
            )}

            {/* Newsletter Subscription Box */}
            <div className="bg-white border border-borderLight p-6 rounded-[28px] space-y-4 shadow-soft">
              <h4 className="font-extrabold text-sm text-textPrimary heading flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> Weekly Newsletter</h4>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                Join 50k+ software engineers. Receive weekly migration checklists, upskilling guides, and salary survey releases.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter subscribed successfully!'); }} className="space-y-2 text-xs">
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com"
                  className="w-full glass-input"
                />
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primaryHover text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition text-center"
                >
                  Subscribe Free
                </button>
              </form>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
