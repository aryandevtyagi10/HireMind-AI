import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSession, downloadSessionPdf } from '../services/api'
import { motion } from 'framer-motion'

export default function SessionReport() {
  const { id } = useParams(); const navigate = useNavigate()
  const [session, setSession] = useState(null); const [loading, setLoading] = useState(true); const [dlLoading, setDlLoading] = useState(false)
  useEffect(()=>{ getSession(id).then(r=>setSession(r.data.session)).catch(()=>navigate('/history')).finally(()=>setLoading(false)) },[id])

  const handleDownload = async () => {
    setDlLoading(true)
    try { const res = await downloadSessionPdf(id); const url=URL.createObjectURL(new Blob([res.data],{type:'application/pdf'})); const a=document.createElement('a'); a.href=url; a.download=`hiremind_report_${id}.pdf`; a.click(); URL.revokeObjectURL(url) }
    catch { alert('Download failed') } finally { setDlLoading(false) }
  }

  if (loading) return (<div style={{ minHeight:'100vh', background:'#f5f5f0' }}><Navbar/><div className="loading-screen"><div className="spinner"/></div></div>)

  const { overallScore, confidence, communication, correctness, performanceTrend=[], answers=[], role, mode } = session
  const sc = s=>s>=8?'#10b981':s>=6?'#f59e0b':'#ef4444'
  const verdict = overallScore>=8?'Excellent performance! You are ready.':overallScore>=6?'Needs minor improvement before interviews.':'Needs significant practice.'
  const hint = overallScore>=8?'Outstanding! Polish the details.':overallScore>=6?'Good foundation, refine articulation.':'Focus on technical depth and clarity.'
  const circ = 2*Math.PI*32
  const pts = performanceTrend.length>1 ? performanceTrend.map((v,i)=>{ const x=(i/(performanceTrend.length-1))*300; const y=90-(v/10)*90; return `${x},${y}` }).join(' ') : null

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.07)', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={()=>navigate('/history')} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:24 }}>←</button>
          <div><h1 style={{ fontSize:20, fontWeight:800, color:'#0f172a', letterSpacing:-0.3 }}>Interview Analytics Dashboard</h1><p style={{ fontSize:13, color:'#64748b' }}>AI-powered performance insights · {role} · {mode?.toUpperCase()}</p></div>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleDownload} disabled={dlLoading}
          style={{ background:'#10b981', border:'none', color:'#fff', padding:'11px 24px', borderRadius:50, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(16,185,129,0.3)' }}>
          {dlLoading?'Generating...':'⬇ Download PDF'}
        </motion.button>
      </div>

      <div style={{ maxWidth:980, margin:'0 auto', padding:'28px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.8fr', gap:18, marginBottom:20 }}>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:20, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:13, color:'#94a3b8', textAlign:'center', marginBottom:16 }}>Overall Performance</p>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
              <div style={{ position:'relative', width:88, height:88 }}>
                <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="44" cy="44" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                  <circle cx="44" cy="44" r="32" fill="none" stroke={sc(overallScore)} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ*(1-overallScore/10)} strokeLinecap="round"/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:22, fontWeight:900, color:'#0f172a', letterSpacing:-0.5 }}>{overallScore.toFixed(1)}</span>
                  <span style={{ fontSize:11, color:'#94a3b8' }}>Out of 10</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', textAlign:'center', marginBottom:4 }}>{verdict}</p>
            <p style={{ fontSize:13, color:'#94a3b8', textAlign:'center', marginBottom:20 }}>{hint}</p>
            {[['Confidence',confidence],['Communication',communication],['Correctness',correctness]].map(([l,v])=>(
              <div key={l} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                  <span style={{ color:'#64748b' }}>{l}</span>
                  <span style={{ fontWeight:800, color:'#0f172a' }}>{v.toFixed(1)}</span>
                </div>
                <div style={{ height:7, background:'#f1f5f9', borderRadius:4 }}>
                  <motion.div initial={{width:0}} animate={{width:`${v*10}%`}} transition={{duration:0.8,delay:0.3,ease:[0.22,1,0.36,1]}} style={{ height:'100%', background:sc(v), borderRadius:4 }}/>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:20, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', marginBottom:18, letterSpacing:-0.3 }}>Performance Trend</p>
            {pts ? (
              <svg viewBox="0 0 300 110" style={{ width:'100%', overflow:'visible' }}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient></defs>
                {[0,25,50,75,100].map(p=><line key={p} x1="0" y1={90-(p/100)*90} x2="300" y2={90-(p/100)*90} stroke="#f1f5f9" strokeWidth="1"/>)}
                <polyline points={pts+` 300,90 0,90`} fill="url(#pg)" stroke="none"/>
                <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round"/>
                {performanceTrend.map((v,i)=>{const x=(i/(performanceTrend.length-1))*300,y=90-(v/10)*90;return<circle key={i} cx={x} cy={y} r="5" fill="#10b981"/>})}
                {performanceTrend.map((_,i)=><text key={i} x={(i/(performanceTrend.length-1))*300} y={107} fontSize="11" fill="#94a3b8" textAnchor="middle">Q{i+1}</text>)}
              </svg>
            ) : <p style={{ color:'#94a3b8', textAlign:'center', padding:'30px 0' }}>Not enough data for trend</p>}
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:20, padding:26, boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#0f172a', marginBottom:20, letterSpacing:-0.3 }}>Question Breakdown</h2>
          {answers.length===0 ? <p style={{ color:'#94a3b8', textAlign:'center', padding:'20px 0' }}>No answers recorded.</p> :
            answers.map((a,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                style={{ border:'1px solid rgba(0,0,0,0.07)', borderRadius:16, padding:18, marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:13, color:'#94a3b8', fontWeight:600 }}>Question {i+1}</span>
                  <span style={{ background:a.score>=8?'#dcfce7':a.score>=6?'#fef3c7':'#fef2f2', color:a.score>=8?'#16a34a':a.score>=6?'#d97706':'#dc2626', fontSize:13, fontWeight:800, padding:'4px 12px', borderRadius:20 }}>{a.score}/10</span>
                </div>
                <p style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:10, lineHeight:1.5 }}>{a.question}</p>
                {a.userAnswer && <p style={{ fontSize:13, color:'#64748b', marginBottom:12, lineHeight:1.6, background:'#f8fafc', padding:'10px 14px', borderRadius:10 }}><strong style={{ color:'#374151' }}>Your answer: </strong>{a.userAnswer}</p>}
                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'12px 16px' }}>
                  <p style={{ fontSize:12, color:'#16a34a', fontWeight:800, marginBottom:5 }}>AI Feedback</p>
                  <p style={{ fontSize:14, color:'#374151' }}>{a.feedback}</p>
                </div>
              </motion.div>
            ))
          }
        </motion.div>
      </div>
    </div>
  )
}
