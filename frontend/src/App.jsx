import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import ScrollToTop from './components/ScrollToTop';
import Landingpage from './pages/Landing/Landingpage';
import Contact from './pages/Contact';
import About from './pages/about';
import Portfolio from './pages/portfolio';
import FAQ from './components/FAQ';
import HelpCenter from './components/HelpCenter';
import Support from './components/Support';
import Privacy from './components/Privacy';
import Terms from './components/Terms';

const basename =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL.replace(/\/$/, '')
    : '';

function App() {
  return (
    <Router basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Landingpage />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
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
  );
}

export default App;
