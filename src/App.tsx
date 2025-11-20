import React from 'react'
import { RouterProvider } from 'react-router'
import routes from './routes'
import { MovieProvider } from './context/MovieContext'

function App() {
  return (
    <MovieProvider>
      <RouterProvider router={routes} />
    </MovieProvider>
  )
}

export default App
