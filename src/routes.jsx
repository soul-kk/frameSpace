import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layout/MainLayout';
import { Home } from './pages/Home';
import { MovieList } from './pages/MovieList';
import { MovieDetail } from './pages/MovieDetail';
import { UploadPage } from './pages/Upload';

const routes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/list',
        element: <MovieList />,
      },
      {
        path: '/detail/:id',
        element: <MovieDetail />,
      },
      {
        path: '/upload',
        element: <UploadPage />,
      },
    ],
  },
]);

export default routes;
