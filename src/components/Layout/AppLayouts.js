import React from 'react'
import 'modern-normalize/modern-normalize.css'
import { Nav, UserNav } from '../Nav'
import '../../assets/scss/styles.scss'
import Footer from '../Pages/Footer'
import favicon from '../../assets/images/favicon.ico'
import Helmet from 'react-helmet'

export function LoginLayout({ children }) {
  return <>
      <Helmet>
        <link rel="icon" href={favicon} />
      </Helmet>
      <Nav />
      <main>{children}</main>
      <Footer/>
  </>
}

export function PrivateLayout({ children }) {
  return <>
      <Helmet>
        <link rel="icon" href={favicon} />
      </Helmet>
      <UserNav />
      <main>{children}</main>
      <Footer/>
  </>
}

export function AppContent({ children }) {
  return <>
    <div className="app-content-100">
      <div>{children}</div>
    </div>
  </>
}
