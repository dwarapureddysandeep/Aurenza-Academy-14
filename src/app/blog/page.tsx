import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Eye, Clock, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

export const revalidate = 60; // Revalidate dynamic blog list every minute

export const metadata = {
  title: "Career Insights & Technology Blogs - Aurenza Academy",
  description: "Stay ahead with industry newsletters. Technical migration logs, roadmap guides, salary benchmarks and upskilling recommendations."
};

export default async function BlogHubPage() {
  // Query all blogs
  const blogs = await db.blog.findMany();

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans relative py-16">
      
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <BookOpen className="w-3.5 h-3.5" /> Career Newsletters
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
            Aurenza Academy <span className="text-gradient-purple-pink">Insights Blog</span>
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            Read engineering migration guides, salary pivots breakdowns, and study tips written by active tech directors and B2B trainers.
          </p>
        </div>

        {/* Featured blog showcase (if database has entries) */}
        {blogs.length > 0 && (
          <div className="bg-white border border-borderLight rounded-[32px] overflow-hidden shadow-soft p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2 h-64 sm:h-80 rounded-[24px] bg-neutral-100 overflow-hidden border border-borderLight relative">
              <img 
                src={blogs[0].image} 
                alt={blogs[0].title}
                className="w-full h-full object-cover"
              />
              <span className="absolute left-4 top-4 px-3 py-1 rounded bg-white text-[9px] font-extrabold text-primary uppercase border border-borderLight tracking-widest">
                FEATURED
              </span>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-0.5 rounded-full">
                {blogs[0].category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary heading leading-tight hover:text-primary transition">
                <Link href={`/blog/${blogs[0].slug}`}>{blogs[0].title}</Link>
              </h2>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed line-clamp-3">
                {blogs[0].content}
              </p>
              
              <div className="pt-4 border-t border-borderLight flex items-center justify-between text-[11px] font-bold text-textSecondary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-primary" /> {blogs[0].views} Views</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> 5 min read</span>
                </div>
                <Link href={`/blog/${blogs[0].slug}`} className="text-primary hover:underline flex items-center gap-0.5">
                  Read Full Post <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex justify-center gap-3 border-b border-borderLight pb-4 max-w-2xl mx-auto text-xs font-bold text-textSecondary">
          <span className="text-primary border-b-2 border-primary px-3 py-1 cursor-default">All Articles</span>
          <span className="px-3 py-1 hover:text-primary cursor-pointer transition">Software Engineering</span>
          <span className="px-3 py-1 hover:text-primary cursor-pointer transition">AI Technology</span>
          <span className="px-3 py-1 hover:text-primary cursor-pointer transition">Agile & Scrum</span>
        </div>

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.slice(0).map((blog: any) => (
            <article 
              key={blog.id}
              className="group premium-glass-card overflow-hidden flex flex-col justify-between h-[420px] p-4.5 hover:-translate-y-1 transition duration-300 bg-white"
            >
              <div className="space-y-4">
                {/* Blog Image */}
                <div className="h-40 rounded-[18px] bg-neutral-100 overflow-hidden border border-borderLight relative">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 px-2 py-0.5 rounded bg-white text-[8px] font-bold text-primary uppercase border border-borderLight tracking-widest">
                    {blog.category}
                  </span>
                </div>

                {/* Text details */}
                <div className="space-y-2">
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-sm sm:text-base font-extrabold text-textPrimary group-hover:text-primary transition line-clamp-2 leading-snug heading">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-textSecondary line-clamp-2 leading-relaxed">
                    {blog.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-borderLight pt-3.5 mt-4 text-[10px] text-textSecondary font-bold">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-primary" /> {blog.views} Views</span>
                <Link href={`/blog/${blog.slug}`} className="text-primary hover:underline flex items-center gap-0.5">
                  Read Article <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
