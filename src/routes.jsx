import { createBrowserRouter } from 'react-router'

const routes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
])

export default routes
