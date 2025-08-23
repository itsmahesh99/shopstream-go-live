import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks
          'auth-pages': [
            './src/pages/LoginPage.tsx',
            './src/pages/RoleSelectionPage.tsx',
            './src/pages/CustomerSignupPage.tsx',
            './src/pages/WholesalerSignupPage.tsx',
            './src/pages/InfluencerSignupPage.tsx',
            './src/pages/ForgotPasswordPage.tsx'
          ],
          'dashboard-pages': [
            './src/pages/CustomerDashboard.tsx',
            './src/pages/WholesalerDashboard.tsx',
            './src/pages/InfluencerDashboard.tsx'
          ],
          'shop-pages': [
            './src/pages/ShopPage.tsx',
            './src/pages/ProductPage.tsx',
            './src/pages/CartPage.tsx',
            './src/pages/ClothingPage.tsx'
          ],
          'live-pages': [
            './src/pages/LiveStreamPage.tsx',
            './src/pages/LiveStreamPageNew.tsx',
            './src/pages/PlayPage.tsx',
            './src/pages/PlayPageNew.tsx',
            './src/pages/KeinLivePage.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
}));
