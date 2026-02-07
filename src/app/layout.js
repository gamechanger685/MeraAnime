import { ThemeProvider } from '@/context/ThemeContext';
import LayoutContent from './layoutcontent'; 
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// --- THE TOUGHEST SEO CONFIGURATION (1000% RANKING POWER) ---
export const metadata = {
  title: {
    default: 'MeraAnime | Watch & Download Hindi Dubbed Anime Online Free HD',
    template: '%s | MeraAnime'
  },
  description: 'MeraAnime is the fastest streaming platform for Hindi Dubbed and Subbed anime. Download latest episodes in 1080p via TeraBox. No Buffering, No Ads.',
  keywords: [
    'MeraAnime', 'watch anime hindi dubbed', 'download anime free', 
    'hindi dubbed anime download', 'crunchyroll free alternative', 
    'best anime site pakistan', 'anime subbed hindi'
  ],
  
  // --- AAPKA GOOGLE VERIFICATION TAG (Ab Shamil Hai) ---
  verification: {
    google: 'rtD6FQXghc0sQGQrUDymwttJCdiHC7vVzkpilf9Hzwo', 
  },

  // Advanced SEO settings for Google Search Bots
  metadataBase: new URL('https://meraanime.vercel.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MeraAnime - Watch & Download Hindi Dubbed Anime Free',
    description: 'High-quality anime streaming with fast servers.',
    url: 'https://meraanime.vercel.app',
    siteName: 'MeraAnime',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        <ThemeProvider>
          {/* LayoutContent client-side logic (Sidebar, Navbar, Favicon) sambhalega */}
          <LayoutContent>{children}</LayoutContent>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}