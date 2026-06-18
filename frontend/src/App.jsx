import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import ScrollToTop from './components/ScrollToTop';
import IntroAnimation from './components/IntroAnimation';
import { IntroContext } from './context/introContext';
import useLenis from './hooks/useLenis';
import Landingpage from './pages/Landing/Landingpage';
import Contact from './pages/Contact';
import About from './pages/about';
import Products from './pages/products';
import Portfolio from './pages/portfolio';
import Notices from './pages/notices';
import FAQ from './components/FAQ';
import HelpCenter from './components/HelpCenter';
import Support from './components/Support';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import AuthProvider from './components/admin/AuthProvider';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import ResetPassword from './pages/admin/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';

const basename =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL.replace(/\/$/, '')
    : '';

function App() {
  useLenis();
  const [logoReady, setLogoReady] = useState(false);

  // The intro animation only belongs on the public marketing site, not the
  // admin panel / auth pages. It plays once per page load, so reading the path
  // here is fine.
  const path = window.location.pathname.replace(basename, '');
  const isAdmin =
    path.startsWith('/admin') ||
    path.startsWith('/portal') ||
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/reset');

  return (
    <IntroContext.Provider value={{ logoReady }}>
    <AuthProvider>
    <Router basename={basename}>
      {!isAdmin && <IntroAnimation onReveal={() => setLogoReady(true)} />}
      <ScrollToTop />
      <Routes>
        {/* ── Admin panel (no public header/footer) ── */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Public marketing site ── */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Landingpage />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/*" element={<Landingpage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
    </IntroContext.Provider>
  );
}

export default App;
