import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export const MainLayout = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="text-primary flex min-h-screen flex-col bg-white font-sans antialiased">
      <Navbar />
      <main className="relative grow">
        {navigation.state === 'loading' && (
          <div
            className="fixed top-0 left-0 z-[60] h-1 w-full animate-pulse bg-black"
            role="status"
            aria-label="页面加载中"
          />
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
