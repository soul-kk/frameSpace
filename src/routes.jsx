import { createBrowserRouter } from 'react-router'
import { MainLayout } from './layout/MainLayout.tsx'
import { Home } from './pages/Home'
import { MovieList } from './pages/MovieList'
import { MovieDetail } from './pages/MovieDetail'
import { UploadPage } from './pages/Upload'
import { Gallery } from './pages/Gallery'
import Test from './pages/Test.tsx'

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
        path: '/test',
        element: <Test />,
      },
      {
        path: '/detail/:id',
        element: <MovieDetail />,
      },
      // {
      //   path: '/upload',
      //   element: <UploadPage />,
      // },
      {
        path: '/gallery',
        element: <Gallery />,
      },
    ],
  },
])

export default routes
