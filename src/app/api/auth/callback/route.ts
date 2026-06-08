import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const errorMsg = searchParams.get('error_description') || searchParams.get('error');
  
  if (errorMsg) {
    console.error('[Google OAuth Callback] Redirected with error:', errorMsg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }
  
  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[Google OAuth Callback] Code exchange error:', error);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
      
      if (data?.user) {
        const email = data.user.email;
        
        if (!email) {
          return NextResponse.redirect(`${origin}/login?error=No email returned from Google`);
        }
        
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split('@')[0];
        
        // Resolve user in our Prisma database
        let user = await db.user.findUnique({
          where: { email: email.toLowerCase() }
        });
        
        if (!user) {
          // Create new user as STUDENT
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
            
          user = await db.user.create({
            data: {
              name,
              email: email.toLowerCase(),
              password: "oauth_google_no_password",
              phone: data.user.phone || "",
              role: "STUDENT",
              avatar: initials || "G",
              bio: "Enrolled via Google Sign-In",
              permissions: []
            }
          });
        }
        
        // Sign session token
        const token = signToken({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        });
        
        // Set the session cookie
        cookieStore.set('aurenza_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/'
        });
        
        // Redirect based on user role
        let targetPath = '/student';
        if (user.role === 'ADMIN') {
          targetPath = '/admin';
        } else if (user.role === 'TRAINER') {
          targetPath = '/trainer';
        }
        
        return NextResponse.redirect(`${origin}${targetPath}`);
      }
    } catch (err: any) {
      console.error('[Google OAuth Callback] Unexpected error:', err);
      return NextResponse.redirect(`${origin}/login?error=Unexpected auth error`);
    }
  }
  
  return NextResponse.redirect(`${origin}/login?error=No code provided`);
}
