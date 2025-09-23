import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/theme-provider.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import PhonesPage from './features/phones/PhonesPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage.tsx';
import AccessoriesPage from './features/accessories/AccessoriesPage.tsx';
import TabletsPage from './features/tablets/TabletsPage.tsx';
import { FavouritesPage } from './features/favourites/FavouritesPage.tsx';
import ProductPage from './components/ProductPage.tsx';
import { CartPage } from './features/cart/CartPage.tsx';
import { PageNotFound } from './features/pageNotFound/pageNotFound.tsx';
import { ProfilePage } from './features/profile/ProfilePage.tsx';


// Create client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: '/phones',
        children: [
          {
            index: true,
            element: <Navigate to="1" replace={true} />,
          },
          {
            path: ':page',
            element: <PhonesPage />,
          },
        ],
      },

      {
        path: '/tablets',
        children: [
          {
            index: true,
            element: <Navigate to="1" replace={true} />,
          },
          {
            path: ':page',
            element: <TabletsPage />,
          }
        ]
      },

      {
        path: '/accessories',
        children: [
          {
            index: true,
            element: <Navigate to="1" replace={true} />,
          },
          {
            path: ':page',
            element: <AccessoriesPage />,
          }
        ]
      },

      {
        path: '/favourites',
        element: <FavouritesPage />,
      },

      {
        path: '/product/:productId',
        element: <ProductPage />,
      },

      {
        path: '/cart',
        element: <CartPage />,
      },

      {
        path: '/profile',
        element: <ProfilePage />,
      },

      {
        path: '/*',
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
