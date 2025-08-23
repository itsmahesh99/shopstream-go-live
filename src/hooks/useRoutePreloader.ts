import { useEffect } from 'react';

// Preload critical routes for better performance
const useRoutePreloader = () => {
  useEffect(() => {
    // Preload common routes that users are likely to visit
    const routesToPreload = [
      () => import('../pages/ShopPage'),
      () => import('../pages/CartPage'),
      () => import('../pages/ProfilePage'),
      () => import('../pages/ClothingPage'),
    ];

    // Preload with delay to not block initial rendering
    const timeoutId = setTimeout(() => {
      routesToPreload.forEach(route => {
        route().catch(() => {
          // Silently fail if preload doesn't work
        });
      });
    }, 2000); // Preload after 2 seconds

    return () => clearTimeout(timeoutId);
  }, []);
};

export default useRoutePreloader;
