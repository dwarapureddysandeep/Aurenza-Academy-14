import React from 'react';
import Link from 'next/link';
import { getCertificateByIdAction } from '@/lib/actions';
import { ShieldCheck, XCircle, ArrowLeft, Calendar, Award, User, AwardIcon, FileCheck2 } from 'lucide-react';

interface VerifyCertPageProps {
  params: Promise<{ certId: string }>;
}

export default async function VerifyCertPage({ params }: VerifyCertPageProps) {
  const { certId } = await params;
  const res = await getCertificateByIdAction(certId);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-sectionBg py-16 px-4 font-sans relative">
      {/* Glow highlight effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-white border border-borderLight rounded-[32px] p-8 sm:p-10 shadow-premium relative z-10 space-y-8">
        
        {res.success && res.certificate ? (
          // VALID CERTIFICATE CARD
          <div className="space-y-8">
            <div className="text-center space-y-2 border-b border-borderLight pb-6">
              <div className="inline-flex p-3 bg-successGreen/10 border border-successGreen/20 text-successGreen rounded-full mb-2 shadow-soft animate-pulse">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-textPrimary uppercase tracking-wider heading">
                Credential Verification Successful
              </h1>
              <span className="inline-flex px-3 py-1 bg-successGreen/5 border border-successGreen/15 rounded-full text-[10px] font-black uppercase text-successGreen">
                ✓ Verified Valid
              </span>
            </div>

            {/* Certificate Details */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="p-4 bg-sectionBg border border-borderLight rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-white border border-borderLight rounded-xl text-primary shadow-soft shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Learner Graduate</span>
                  <strong className="text-textPrimary font-extrabold block text-sm heading mt-0.5">{res.certificate.name}</strong>
                </div>
              </div>

              <div className="p-4 bg-sectionBg border border-borderLight rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-white border border-borderLight rounded-xl text-secondary shadow-soft shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Certification Conferred</span>
                  <strong className="text-textPrimary font-extrabold block text-sm heading mt-0.5 line-clamp-1">{res.certificate.courseName}</strong>
                </div>
              </div>

              <div className="p-4 bg-sectionBg border border-borderLight rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-white border border-borderLight rounded-xl text-amber-500 shadow-soft shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Completion Date</span>
                  <strong className="text-textPrimary font-extrabold block text-sm heading mt-0.5">{res.certificate.completionDate}</strong>
                </div>
              </div>

              <div className="p-4 bg-sectionBg border border-borderLight rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-white border border-borderLight rounded-xl text-indigo-500 shadow-soft shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wide">Unique Certificate ID</span>
                  <code className="text-primary font-bold font-mono block text-sm mt-0.5 select-all">{res.certificate.certId}</code>
                </div>
              </div>
            </div>

            {/* Institution Statement */}
            <div className="p-4 bg-sectionBg border border-borderLight rounded-2xl text-[10px] text-textSecondary leading-relaxed text-center font-medium">
              This verification confirms that the individual above completed all coursework, assignments, and exam targets required to receive the official Aurenza Academy certification.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-borderLight">
              <Link
                href="/verify"
                className="flex-1 py-3 px-4 rounded-xl border border-borderLight text-textPrimary hover:bg-sectionBg text-center text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Lookup Another ID
              </Link>
              <Link
                href="/courses"
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-white hover:bg-primaryHover text-center text-xs font-black transition flex items-center justify-center gap-2 shadow-soft"
              >
                Explore Syllabus Catalog
              </Link>
            </div>
          </div>
        ) : (
          // INVALID CERTIFICATE CARD
          <div className="space-y-6 text-center">
            <div className="inline-flex p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full shadow-soft animate-bounce">
              <XCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-textPrimary uppercase tracking-wider heading">
                Invalid Certificate
              </h1>
              <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                The identifier <code className="text-rose-500 font-bold font-mono bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/10 text-xs">{certId}</code> could not be found in Aurenza Academy's certified graduate registry.
              </p>
            </div>

            <div className="p-4 bg-sectionBg border border-rose-500/10 rounded-2xl text-[10px] text-textSecondary leading-relaxed font-semibold">
              ⚠️ Warning: Fake or altered certificate representations violate our policies. If you believe this is a system indexing error, please contact admissions support.
            </div>

            <div className="pt-4 border-t border-borderLight">
              <Link
                href="/verify"
                className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primaryHover text-center text-xs font-black transition flex items-center justify-center gap-2 shadow-soft"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back to Verification Search
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
