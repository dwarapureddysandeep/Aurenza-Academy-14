import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aurenzaacademy.com';

  let courses: any[] = [];
  try {
    courses = await db.course.findMany();
  } catch (e) {
    console.error('[Sitemap] Failed to fetch courses from database, using empty list.');
  }

  const courseUrls = (courses || []).map((course: any) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(),
  }));

  // Static URLs
  const staticUrls = [
    '',
    '/about',
    '/contact',
    '/courses',
    '/why-us',
    '/corporate',
    '/verify',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...courseUrls];
}
