import { ThemeProvider } from '@/context/ThemeContext';
import LayoutContent from './layoutcontent'; 
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// --- TIGHT SEO METADATA (Crunchyroll Level) ---
export const metadata = {
  title: {
    default: 'MeraAnime | Watch & Download Hindi Dubbed Anime Free',
    template: '%s | MeraAnime'
  },
  description: 'MeraAnime is the #1 platform for Hindi Dubbed and Subbed anime. Stream in 1080p, download via TeraBox, and enjoy a lag-free experience.',
  keywords: ['anime hindi dubbed', 'download anime free', 'watch anime online', 'meraanime', 'crunchyroll free alternative'],
  metadataBase: new URL('https://meraanime.vercel.app'),
  
  // --- YAHAN GOOGLE VERIFICATION ADD KI HAI ---
  verification: {
    google: 'googlefe9665bb2b516432', 
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
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
          <LayoutContent>{children}</LayoutContent>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}