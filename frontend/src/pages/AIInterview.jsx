import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { startSession, submitAnswer, completeSession } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const ROLES = ['Backend Developer','Frontend Developer','Full Stack Developer','Data Scientist','DevOps Engineer','ML Engineer','Mobile Developer','Cloud Engineer']
const EXP   = ['Fresher (0-1 yr)','Junior (1-2 yrs)','Mid-level (2-4 yrs)','Senior (4+ yrs)']

export default function AIInterview() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const fileRef = useRef(); const timerRef = useRef(); const recognitionRef = useRef()
  const [phase, setPhase]       = useState('setup')
  const [mode, setMode]         = useState('technical')
  const [role, setRole]         = useState(ROLES[0])
  const [exp, setExp]           = useState(EXP[0])
  const [resumeFile, setResumeFile] = useState(null)
  const [session, setSession]   = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer]     = useState('')
  const [timer, setTimer]       = useState(60)
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  useEffect(()=>{
    if(phase!=='interview') return
    clearInterval(timerRef.current); setTimer(60)
    timerRef.current = setInterval(()=>{ setTimer(t=>{ if(t<=1){clearInterval(timerRef.current);handleSubmit(true);return 60} return t-1 }) },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase,currentQ])

  const handleStart = async () => {
    setError(''); setLoading(true)
    try {
      const fd = new FormData(); fd.append('role',role); fd.append('experience',exp); fd.append('mode',mode)
      if(resumeFile) fd.append('resume',resumeFile)
      const res = await startSession(fd); setSession(res.data.session); await refreshUser(); setPhase('interview')
    } catch(err){ setError(err.response?.data?.message||'Failed to start session.') } finally{ setLoading(false) }
  }

  const handleSubmit = async (auto=false) => {
    const ans = answer.trim()
    if(!ans&&!auto) return
    clearInterval(timerRef.current)
    if(isListening){ recognitionRef.current?.stop(); setIsListening(false) }
    setSubmitting(true)
    try {
      const res = await submitAnswer(session._id,{questionIndex:currentQ,userAnswer:ans||'(No answer provided)'})
      setSession(res.data.session); setAnswer('')
      if(currentQ+1>=session.questions.length){ const done=await completeSession(session._id); navigate(`/report/${done.data.session._id}`) }
      else{ setCurrentQ(q=>q+1) }
    } catch{ setError('Failed to submit. Try again.') } finally{ setSubmitting(false) }
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition
    if(!SR){ alert('Voice requires Chrome.'); return }
    if(isListening){ recognitionRef.current?.stop(); setIsListening(false); return }
    const r = new SR(); r.continuous=true; r.interimResults=true
    r.onresult=e=>{ setAnswer(Array.from(e.results).map(x=>x[0].transcript).join('')) }
    r.onend=()=>setIsListening(false); r.start(); recognitionRef.current=r; setIsListening(true)
  }

  const timerPct = timer/60; const circumference = 2*Math.PI*28
  const timerColor = timer>30?'#10b981':timer>10?'#f59e0b':'#ef4444'

  if(phase==='setup') return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}} style={{ width:'100%', maxWidth:520 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ fontSize:40, fontWeight:900, color:'#0f172a', letterSpacing:-1, marginBottom:8 }}>Start <span style={{ color:'#10b981' }}>AI Interview</span></h1>
          <p style={{ fontSize:16, color:'#64748b' }}>Configure your session and let AI ask the questions</p>
        </div>
        <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:24, padding:36, boxShadow:'0 8px 32px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:22 }}>
          <div>
            <label style={{ fontSize:14, fontWeight:700, color:'#374151', display:'block', marginBottom:10 }}>Interview Mode</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {['technical','hr'].map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  style={{ padding:'13px 0', borderRadius:14, border:mode===m?'2px solid #10b981':'1.5px solid #e2e8f0', background:mode===m?'#f0fdf4':'#f8fafc', color:mode===m?'#16a34a':'#64748b', fontSize:15, fontWeight:mode===m?800:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
                  {m==='hr'?'🤝 HR Interview':'⚙️ Technical Mode'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:14, fontWeight:700, color:'#374151', display:'block', marginBottom:10 }}>Job Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="dark-input" style={{ cursor:'pointer' }}>
              {ROLES.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:14, fontWeight:700, color:'#374151', display:'block', marginBottom:10 }}>Experience Level</label>
            <select value={exp} onChange={e=>setExp(e.target.value)} className="dark-input" style={{ cursor:'pointer' }}>
              {EXP.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:14, fontWeight:700, color:'#374151', display:'block', marginBottom:10 }}>
              Upload Resume <span style={{ color:'#94a3b8', fontWeight:400, fontSize:13 }}>(optional — for personalized questions)</span>
            </label>
            <label style={{ display:'block', border:`2px dashed ${resumeFile?'#10b981':'#e2e8f0'}`, borderRadius:14, padding:'16px', textAlign:'center', cursor:'pointer', background:resumeFile?'#f0fdf4':'#f8fafc', transition:'all 0.2s' }}>
              <input type="file" accept=".pdf" hidden ref={fileRef} onChange={e=>setResumeFile(e.target.files[0])}/>
              <p style={{ fontSize:14, color:resumeFile?'#16a34a':'#64748b', fontWeight:resumeFile?700:400 }}>{resumeFile?`✓ ${resumeFile.name}`:'📄 Click to upload PDF resume'}</p>
            </label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <motion.button className="btn-green" onClick={handleStart} disabled={loading} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            style={{ width:'100%', padding:'16px 0', fontSize:16, borderRadius:14, marginTop:4 }}>
            {loading?'⏳ Setting up your interview...':'🎙️ Start Interview — 5 credits'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )

  const question = session?.questions?.[currentQ]

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#ecfdf5 0%,#f0fdf9 40%,#f8faff 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'230px 1fr', gap:20, width:'100%', maxWidth:760 }}>

        {/* Left — avatar + timer */}
        <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}}
          style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:22, padding:20, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ width:'100%', aspectRatio:'1', borderRadius:16, background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:72, overflow:'hidden' }}>👩‍💼</div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:14 }}>
              <span style={{ color:'#64748b' }}>Interview Status</span>
              <span style={{ color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
                <span className="live-dot"/>{isListening?'Listening':'Ready'}
              </span>
            </div>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
              <div style={{ position:'relative', width:78, height:78 }}>
                <svg width="78" height="78" viewBox="0 0 78 78" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="39" cy="39" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6"/>
                  <motion.circle cx="39" cy="39" r="28" fill="none" stroke={timerColor} strokeWidth="6"
                    strokeDasharray={circumference} strokeDashoffset={circumference*(1-timerPct)} strokeLinecap="round"
                    animate={{ strokeDashoffset:circumference*(1-timerPct), stroke:timerColor }} transition={{ duration:1, ease:'linear' }}/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:18, fontWeight:900, color:timerColor }}>{timer}s</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-around', textAlign:'center' }}>
              <div><p style={{ fontSize:24, fontWeight:900, color:'#0f172a' }}>{currentQ+1}</p><p style={{ fontSize:11, color:'#94a3b8' }}>Current Question</p></div>
              <div style={{ width:1, background:'#f1f5f9' }}/>
              <div><p style={{ fontSize:24, fontWeight:900, color:'#0f172a' }}>{session?.questions?.length}</p><p style={{ fontSize:11, color:'#94a3b8' }}>Total Questions</p></div>
            </div>
          </div>
        </motion.div>

        {/* Right — question + answer */}
        <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}}
          style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:22, padding:26, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:18, fontWeight:900, color:'#10b981', letterSpacing:-0.3 }}>AI Smart Interview</span>
            <span style={{ fontSize:13, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', padding:'4px 14px', borderRadius:20, fontWeight:600 }}>{mode==='hr'?'HR Mode':'Technical Mode'}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.3}}
              style={{ background:'#f8fafc', borderRadius:14, padding:'16px 18px' }}>
              <p style={{ fontSize:13, color:'#94a3b8', marginBottom:8, fontWeight:600 }}>Question {currentQ+1} of {session?.questions?.length}</p>
              <p style={{ fontSize:16, fontWeight:700, color:'#0f172a', lineHeight:1.6 }}>{question}</p>
            </motion.div>
          </AnimatePresence>

          <textarea value={answer} onChange={e=>setAnswer(e.target.value)}
            placeholder="Your answer will appear here as you speak, or type directly..."
            style={{ flex:1, minHeight:180, border:'1.5px solid #e2e8f0', borderRadius:14, padding:'16px 18px', fontSize:15, color:'#0f172a', resize:'none', fontFamily:'inherit', outline:'none', lineHeight:1.6, transition:'border-color 0.2s' }}
            onFocus={e=>e.target.style.borderColor='#10b981'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>

          {error && <div className="form-error" style={{ fontSize:13 }}>{error}</div>}

          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <motion.button onClick={toggleVoice} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              style={{ width:48, height:48, borderRadius:'50%', background:isListening?'#ef4444':'#0f172a', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:20, flexShrink:0 }}>
              🎤
            </motion.button>
            <motion.button onClick={()=>handleSubmit(false)} disabled={submitting||!answer.trim()} whileHover={!submitting&&answer.trim()?{scale:1.02}:{}} whileTap={{scale:0.97}}
              style={{ flex:1, background:'#10b981', border:'none', color:'#fff', padding:'15px 0', borderRadius:14, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'inherit', opacity:submitting||!answer.trim()?0.5:1, boxShadow:'0 4px 14px rgba(16,185,129,0.35)' }}>
              {submitting?'Evaluating answer...':currentQ+1===session?.questions?.length?'Submit & Finish':'Submit Answer →'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
