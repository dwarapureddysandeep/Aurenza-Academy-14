import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/student', '/trainer', '/checkout'],
    },
    sitemap: 'https://www.aurenzaacademy.com/sitemap.xml',
  };
}
