import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/theme-provider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import PhonesPage from './features/phones/PhonesPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage.tsx';
import AccessoriesPage from './features/accessories/AccessoriesPage.tsx';
import TabletsPage from './features/tablets/TabletsPage.tsx';
import { FavouritesPage } from './features/favourites/FavouritesPage.tsx';
import { CartPage } from './features/cart/CartPage.tsx';
import { PageNotFound } from './features/pageNotFound/pageNotFound.tsx';


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
        element: <PhonesPage />,
      },
      {
        path: '/tablets',
        element: <TabletsPage />,
      },
      {
        path: '/accessories',
        element: <AccessoriesPage />,
      },
      {
        path: '/favourites',
        element: <FavouritesPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      }
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
