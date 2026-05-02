import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getAllPlans, getAllSessions } from '../services/api'
import { motion } from 'framer-motion'

const fadeUp = (delay=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay,ease:[0.22,1,0.36,1]} })

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllPlans(), getAllSessions()])
      .then(([p,s]) => { setPlans(p.data.interviewReports||[]); setSessions(s.data.sessions||[]) })
      .catch(()=>{}).finally(()=>setLoading(false))
  },[])

  const allActivity = [...plans.map(p=>({...p,kind:'plan'})),...sessions.map(s=>({...s,kind:'session'}))]
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6)
  const completed = sessions.filter(s=>s.status==='completed')
  const bestScore = completed.length ? Math.max(...completed.map(s=>s.overallScore||0)).toFixed(1) : '—'

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <Navbar />
      <div style={{ maxWidth:960, margin:'0 auto', padding:'44px 28px' }}>
        <motion.div {...fadeUp(0)} style={{ marginBottom:36 }}>
          <p style={{ fontSize:16, color:'#64748b', marginBottom:6 }}>Good to see you,</p>
          <h1 style={{ fontSize:40, fontWeight:900, color:'#0f172a', letterSpacing:-1 }}>{user?.username} 👋</h1>
        </motion.div>

        {/* Main cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
          <motion.div {...fadeUp(0.1)} whileHover={{ y:-4, boxShadow:'0 16px 48px rgba(16,185,129,0.15)' }}
            style={{ background:'#fff', border:'2px solid #10b981', borderRadius:22, padding:30, cursor:'pointer', boxShadow:'0 4px 16px rgba(16,185,129,0.1)', transition:'box-shadow 0.2s' }}
            onClick={() => navigate('/plan')}>
            <div style={{ fontSize:36, marginBottom:14 }}>📋</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#0f172a', marginBottom:8, letterSpacing:-0.3 }}>Interview Plan</h3>
            <p style={{ fontSize:14, color:'#64748b', marginBottom:24, lineHeight:1.7 }}>Upload your resume, paste a job description, get tailored questions, skill gap analysis and an ATS-optimized resume.</p>
            <button className="btn-green" style={{ width:'100%', padding:'13px 0', fontSize:15, borderRadius:12 }}>Create Plan →</button>
          </motion.div>

          <motion.div {...fadeUp(0.15)} whileHover={{ y:-4, boxShadow:'0 16px 48px rgba(0,0,0,0.08)' }}
            style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:22, padding:30, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s' }}
            onClick={() => navigate('/interview')}>
            <div style={{ fontSize:36, marginBottom:14 }}>🎙️</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#0f172a', marginBottom:8, letterSpacing:-0.3 }}>AI Interview Session</h3>
            <p style={{ fontSize:14, color:'#64748b', marginBottom:24, lineHeight:1.7 }}>Live voice interview with a 60s timer per question, real-time AI scoring, and detailed feedback report.</p>
            <button className="btn-primary" style={{ width:'100%', padding:'13px 0', fontSize:15, borderRadius:12 }}>Start Session →</button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div {...fadeUp(0.2)} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
          {[{label:'Plans Generated',value:plans.length},{label:'Sessions Done',value:completed.length},{label:'Best Score',value:bestScore,green:true}].map((s,i)=>(
            <div key={i} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:18, padding:'22px 24px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize:32, fontWeight:900, color:s.green?'#10b981':'#0f172a', marginBottom:4, letterSpacing:-1 }}>{s.value}</p>
              <p style={{ fontSize:14, color:'#64748b' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick links */}
        <motion.div {...fadeUp(0.25)} style={{ display:'flex', gap:12, marginBottom:28 }}>
          {[['📜 View History','/history'],['💰 Buy Credits','/pricing']].map(([l,p],i)=>(
            <button key={i} className="btn-outline" style={{ fontSize:14, padding:'10px 22px', borderRadius:50 }} onClick={()=>navigate(p)}>{l}</button>
          ))}
        </motion.div>

        {/* Recent activity */}
        <motion.div {...fadeUp(0.3)} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:22, padding:28, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:22, letterSpacing:-0.3 }}>Recent Activity</p>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:28 }}><div className="spinner"/></div>
          ) : allActivity.length===0 ? (
            <p style={{ fontSize:15, color:'#94a3b8', textAlign:'center', padding:'28px 0' }}>No activity yet. Create your first interview plan!</p>
          ) : allActivity.map((item,i)=>(
            <motion.div key={i} whileHover={{ backgroundColor:'#f8fafc' }}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:i<allActivity.length-1?'1px solid #f1f5f9':'none', cursor:'pointer', borderRadius:8, transition:'background 0.15s' }}
              onClick={()=>navigate(item.kind==='plan'?`/plan/${item._id}`:`/report/${item._id}`)}>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:4 }}>{item.title||item.role}</p>
                <p style={{ fontSize:12, color:'#94a3b8' }}>{item.kind==='plan'?'Interview Plan':`AI Session · ${item.mode?.toUpperCase()}`} · {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {item.kind==='plan' && <span className="pill pill-pink">{item.matchScore}% match</span>}
                {item.kind==='session' && <span className={`pill ${item.status==='completed'?'pill-green':'pill-amber'}`}>{item.status==='completed'?`${item.overallScore}/10`:'Incomplete'}</span>}
                <span style={{ color:'#cbd5e1', fontSize:22 }}>›</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
