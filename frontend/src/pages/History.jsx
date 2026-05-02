import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllPlans, getAllSessions } from '../services/api'
import { motion } from 'framer-motion'

export default function History() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('sessions')
  const [plans, setPlans] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    Promise.all([getAllPlans(),getAllSessions()])
      .then(([p,s])=>{setPlans(p.data.interviewReports||[]);setSessions(s.data.sessions||[])})
      .catch(()=>{}).finally(()=>setLoading(false))
  },[])

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <Navbar />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'44px 28px' }}>
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:36 }}>
          <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'none', color:'#94a3b8', fontSize:26, cursor:'pointer', lineHeight:1 }}>←</button>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, color:'#0f172a', letterSpacing:-0.5 }}>Interview History</h1>
            <p style={{ fontSize:15, color:'#64748b', marginTop:4 }}>Track your past interviews and performance reports</p>
          </div>
        </motion.div>

        <div style={{ display:'flex', gap:10, marginBottom:28 }}>
          {[['sessions','🎙️ AI Sessions'],['plans','📋 Interview Plans']].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{ padding:'11px 26px', borderRadius:50, border:tab===k?'1.5px solid #10b981':'1.5px solid rgba(0,0,0,0.1)', background:tab===k?'#10b981':'#fff', color:tab===k?'#fff':'#64748b', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', boxShadow:tab===k?'0 4px 14px rgba(16,185,129,0.25)':'0 2px 8px rgba(0,0,0,0.04)' }}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        ) : tab==='sessions' ? (
          sessions.length===0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:60, marginBottom:18 }}>🎙️</div>
              <p style={{ color:'#94a3b8', fontSize:17, marginBottom:20 }}>No AI sessions yet.</p>
              <button className="btn-green" onClick={()=>navigate('/interview')}>Start Your First Session</button>
            </div>
          ) : sessions.map((s,i)=>(
            <motion.div key={s._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:i*0.06}}
              whileHover={{ y:-3, boxShadow:'0 12px 36px rgba(0,0,0,0.09)' }}
              style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:18, padding:'22px 26px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:14, transition:'box-shadow 0.2s' }}
              onClick={()=>s.status==='completed'&&navigate(`/report/${s._id}`)}>
              <div>
                <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', marginBottom:5, letterSpacing:-0.3 }}>{s.role}</p>
                <p style={{ fontSize:13, color:'#94a3b8', marginBottom:10 }}>{s.experience} · {s.mode?.toUpperCase()} Mode · {new Date(s.createdAt).toLocaleDateString()}</p>
                <span className={`pill ${s.status==='completed'?'pill-green':'pill-amber'}`}>{s.status==='completed'?'Completed':'Incomplete'}</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:28, fontWeight:900, letterSpacing:-1, color:s.overallScore>=7?'#10b981':s.overallScore>=5?'#f59e0b':'#ef4444' }}>
                  {s.status==='completed'?`${s.overallScore.toFixed(1)}/10`:'—'}
                </p>
                <p style={{ fontSize:12, color:'#94a3b8' }}>Overall Score</p>
              </div>
            </motion.div>
          ))
        ) : (
          plans.length===0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:60, marginBottom:18 }}>📋</div>
              <p style={{ color:'#94a3b8', fontSize:17, marginBottom:20 }}>No interview plans yet.</p>
              <button className="btn-pink" onClick={()=>navigate('/plan')}>Create Your First Plan</button>
            </div>
          ) : plans.map((p,i)=>(
            <motion.div key={p._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:i*0.06}}
              whileHover={{ y:-3, boxShadow:'0 12px 36px rgba(0,0,0,0.09)' }}
              style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:18, padding:'22px 26px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:14, transition:'box-shadow 0.2s' }}
              onClick={()=>navigate(`/plan/${p._id}`)}>
              <div>
                <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', marginBottom:5, letterSpacing:-0.3 }}>{p.title}</p>
                <p style={{ fontSize:13, color:'#94a3b8', marginBottom:10 }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                <span className="pill pill-pink">Match Score: {p.matchScore}%</span>
              </div>
              <span style={{ color:'#cbd5e1', fontSize:26 }}>›</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
