import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Translate from './pages/Translate'
import About from './pages/About'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="translate" element={<Translate />} />
          <Route path="about" element={<About />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App