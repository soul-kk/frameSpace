import { createBrowserRouter } from 'react-router'
import { MainLayout } from './layout/MainLayout.tsx'

const routes = createBrowserRouter([
  {
    element: <MainLayout />,
    HydrateFallback: () => (
      <div className="p-8 text-center" role="status">
        页面加载中…
      </div>
    ),
    children: [
      {
        path: '/',
        lazy: () =>
          import('./pages/Home').then(({ Home }) => ({ Component: Home })),
      },
      {
        path: '/list',
        lazy: () =>
          import('./pages/MovieList').then(({ MovieList }) => ({
            Component: MovieList,
          })),
      },
      {
        path: '/test',
        lazy: () =>
          import('./pages/Test.tsx').then(({ default: Test }) => ({
            Component: Test,
          })),
      },
      {
        path: '/detail/:id',
        lazy: () =>
          import('./pages/MovieDetail').then(({ MovieDetail }) => ({
            Component: MovieDetail,
          })),
      },
      {
        path: '/gallery',
        lazy: () =>
          import('./pages/Gallery').then(({ Gallery }) => ({
            Component: Gallery,
          })),
      },
    ],
  },
])

export default routes
