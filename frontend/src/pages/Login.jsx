import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login({ email, password }); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'24px 32px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
        </div>
        <span style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>HireMind<span style={{ color:'#10b981' }}>.AI</span></span>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 24px' }}>
        <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} style={{ width:'100%', maxWidth:440 }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ width:64, height:64, borderRadius:18, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 24px rgba(15,23,42,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#0f172a', letterSpacing:-0.5, marginBottom:8 }}>Welcome back to <span style={{ color:'#10b981' }}>HireMind.AI</span></h1>
            <p style={{ fontSize:16, color:'#64748b' }}>Sign in to continue your interview prep</p>
          </div>

          <div style={{ background:'#fff', borderRadius:24, padding:36, border:'1px solid rgba(0,0,0,0.07)', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
            {error && <div className="form-error" style={{ marginBottom:20 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <label style={{ fontSize:14, fontWeight:600, color:'#374151', display:'block', marginBottom:8 }}>Email</label>
                <input type="email" className="dark-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize:14, fontWeight:600, color:'#374151', display:'block', marginBottom:8 }}>Password</label>
                <input type="password" className="dark-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn-green" type="submit" disabled={loading} style={{ width:'100%', padding:'16px 0', fontSize:16, marginTop:6, borderRadius:14 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p style={{ textAlign:'center', marginTop:22, fontSize:14, color:'#94a3b8' }}>
              Don't have an account? <Link to="/register" style={{ color:'#10b981', textDecoration:'none', fontWeight:700 }}>Register</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
