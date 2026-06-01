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

const basename =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL.replace(/\/$/, '')
    : '';

function App() {
  useLenis();
  const [logoReady, setLogoReady] = useState(false);

  return (
    <IntroContext.Provider value={{ logoReady }}>
    <Router basename={basename}>
      <IntroAnimation onReveal={() => setLogoReady(true)} />
      <ScrollToTop />
      <Routes>
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
    </IntroContext.Provider>
  );
}

export default App;
