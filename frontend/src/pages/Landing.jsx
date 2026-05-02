import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
})

const STEPS = [
  { step: 'STEP 1', title: 'Role & Experience Selection', desc: 'AI adjusts difficulty based on selected job role.', emoji: '🎯' },
  { step: 'STEP 2', title: 'Smart Voice Interview',       desc: 'Dynamic follow-up questions based on your answers.', emoji: '🎙️', featured: true },
  { step: 'STEP 3', title: 'Timer Based Simulation',      desc: 'Real interview pressure with time tracking.', emoji: '⏱️' },
]

const FEATURES = [
  { title: 'AI Answer Evaluation',   desc: 'Scores communication, technical accuracy and confidence.', emoji: '🤖' },
  { title: 'Resume Based Interview', desc: 'Project-specific questions based on uploaded resume.', emoji: '📄' },
  { title: 'Downloadable PDF Report',desc: 'Detailed strengths, weaknesses and improvement insights.', emoji: '📊' },
  { title: 'History & Analytics',    desc: 'Track progress with performance graphs and topic analysis.', emoji: '📈' },
  { title: 'Skill Gap Detection',    desc: 'Instant analysis of missing skills vs job requirements.', emoji: '🔍' },
  { title: 'ATS Resume Generator',   desc: 'Download an AI-optimized ATS-friendly resume PDF instantly.', emoji: '✍️' },
]

const MODES = [
  { title: 'HR Interview Mode',    desc: 'Behavioral and communication based evaluation.', emoji: '🤝' },
  { title: 'Technical Mode',       desc: 'Deep technical questioning based on selected role.', emoji: '⚙️' },
  { title: 'Confidence Detection', desc: 'Basic tone and voice analysis insights.', emoji: '🎯' },
  { title: 'Credits System',       desc: 'Unlock premium interview sessions easily.', emoji: '💳' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <motion.div {...fadeUp(0)}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: '6px 20px', fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#10b981', fontSize: 14 }}>✦</span>
            AI Powered Smart Interview Platform
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, color: '#0f172a', letterSpacing: -2, marginBottom: 20 }}>
          Practice Interviews with<br />
          <span style={{ color: '#10b981', display: 'inline-block', background: 'rgba(16,185,129,0.08)', borderRadius: 16, padding: '0 16px' }}>
            AI Intelligence
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Role-based mock interviews with smart follow-ups, adaptive difficulty and real-time performance evaluation.
        </motion.p>

        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => navigate(user ? '/interview' : '/register')}>
            Start Interview
          </button>
          <button className="btn-outline" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => navigate(user ? '/plan' : '/register')}>
            Create Interview Plan
          </button>
          {user && (
            <button className="btn-green" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          )}
        </motion.div>
      </section>

      {/* ── STEPS ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 28px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {STEPS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
              style={{
                background: '#fff', borderRadius: 24,
                padding: '32px 26px', textAlign: 'center',
                border: s.featured ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.07)',
                boxShadow: s.featured ? '0 8px 32px rgba(16,185,129,0.15)' : '0 4px 16px rgba(0,0,0,0.06)',
                position: 'relative',
                transform: s.featured ? 'scale(1.03)' : 'scale(1)',
              }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.1em', marginBottom: 16 }}>{s.step}</div>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: s.featured ? 'rgba(16,185,129,0.12)' : '#f8fafc', border: s.featured ? '2px solid rgba(16,185,129,0.3)' : '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 28 }}>
                {s.emoji}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ADVANCED AI CAPABILITIES ──────────────────────────────────────── */}
      <section style={{ padding: '60px 28px 80px', background: '#fff' }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }} style={{ textAlign:'center', marginBottom:48 }}>
          <h2 className="section-title">Advanced AI <span>Capabilities</span></h2>
          <p className="section-sub" style={{ marginTop:8 }}>Everything you need to land your dream job</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 960, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:32 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:i*0.08, ease:[0.22,1,0.36,1] }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:20, padding:'28px 24px', display:'flex', gap:20, alignItems:'flex-start', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', cursor:'default' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'#f8fafc', border:'1px solid rgba(0,0,0,0.07)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:26 }}>{f.emoji}</div>
              <div>
                <h3 style={{ fontSize:17, fontWeight:700, color:'#0f172a', marginBottom:7 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MULTIPLE INTERVIEW MODES ───────────────────────────────────────── */}
      <section style={{ padding: '80px 28px', background: '#f5f5f0' }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }} style={{ textAlign:'center', marginBottom:48 }}>
          <h2 className="section-title">Multiple Interview <span>Modes</span></h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:960, margin:'0 auto' }}>
          {MODES.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:32 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:i*0.08, ease:[0.22,1,0.36,1] }}
              whileHover={{ y:-4, boxShadow:'0 12px 40px rgba(0,0,0,0.1)' }}
              style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:22, padding:'32px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', cursor:'default' }}>
              <div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', marginBottom:8 }}>{m.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6, maxWidth:260 }}>{m.desc}</p>
              </div>
              <div style={{ width:64, height:64, borderRadius:16, background:'#f8fafc', border:'1px solid rgba(0,0,0,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>{m.emoji}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:'40px 28px 60px', background:'#fff' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            style={{ background:'#f8fafc', border:'1px solid rgba(0,0,0,0.07)', borderRadius:22, padding:'28px 32px', display:'flex', alignItems:'center', gap:18 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"/></svg>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'#0f172a' }}>HireMind.AI</div>
              <div style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>AI-powered interview preparation platform designed to improve communication skills, technical depth and professional confidence.</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
