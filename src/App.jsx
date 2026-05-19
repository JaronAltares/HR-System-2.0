import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import DeletedItems from './pages/DeletedItems';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* ===================== PUBLIC ROUTES ===================== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ===================== PROTECTED ROUTES ===================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            
            <Route path="/" element={
              <>
                {/* Your Original Vite Template Content - UNCHANGED */}
                <section id="center">
                  <div className="hero">
                    <img src={heroImg} className="base" width="170" height="179" alt="" />
                    <img src={reactLogo} className="framework" alt="React logo" />
                    <img src={viteLogo} className="vite" alt="Vite logo" />
                  </div>
                  <div>
                    <h1>Get started</h1>
                    <p>
                      Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="counter"
                    onClick={() => setCount((count) => count + 1)}
                  >
                    Count is {count}
                  </button>
                </section>

                <div className="ticks"></div>

                <section id="next-steps">
                  <div id="docs">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#documentation-icon"></use>
                    </svg>
                    <h2>Documentation</h2>
                    <p>Your questions, answered</p>
                    <ul>
                      <li>
                        <a href="https://vite.dev/" target="_blank">
                          <img className="logo" src={viteLogo} alt="" />
                          Explore Vite
                        </a>
                      </li>
                      <li>
                        <a href="https://react.dev/" target="_blank">
                          <img className="button-icon" src={reactLogo} alt="" />
                          Learn more
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div id="social">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#social-icon"></use>
                    </svg>
                    <h2>Connect with us</h2>
                    <p>Join the Vite community</p>
                    <ul>
                      <li>
                        <a href="https://github.com/vitejs/vite" target="_blank">
                          <svg className="button-icon" role="presentation" aria-hidden="true">
                            <use href="/icons.svg#github-icon"></use>
                          </svg>
                          GitHub
                        </a>
                      </li>
                      <li>
                        <a href="https://chat.vite.dev/" target="_blank">
                          <svg className="button-icon" role="presentation" aria-hidden="true">
                            <use href="/icons.svg#discord-icon"></use>
                          </svg>
                          Discord
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/vite_js" target="_blank">
                          <svg className="button-icon" role="presentation" aria-hidden="true">
                            <use href="/icons.svg#x-icon"></use>
                          </svg>
                          X.com
                        </a>
                      </li>
                      <li>
                        <a href="https://bsky.app/profile/vite.dev" target="_blank">
                          <svg className="button-icon" role="presentation" aria-hidden="true">
                            <use href="/icons.svg#bluesky-icon"></use>
                          </svg>
                          Bluesky
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="ticks"></div>
                <section id="spacer"></section>
              </>
            } />

            {/* Real HR Module Pages */}
            <Route path="/employees" element={<Employees />} />
            <Route path="/jobhistory" element={<JobHistory />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/deleted-items" element={<DeletedItems />} />

          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App