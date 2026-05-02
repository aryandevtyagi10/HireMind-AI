import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { generatePlan, getAllPlans } from '../services/api'
import { motion } from 'framer-motion'

export default function InterviewPlan() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const fileRef = useRef()
  const [jd, setJd] = useState('')
  const [self, setSelf] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState([])

  useEffect(() => { getAllPlans().then(r=>setRecent(r.data.interviewReports||[])).catch(()=>{}) },[])

  const handleGenerate = async () => {
    if (!jd.trim()) { setError('Job description is required'); return }
    if (!file && !self.trim()) { setError('Please upload a resume or enter a self description'); return }
    setError(''); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('jobDescription', jd)
      if (self) fd.append('selfDescription', self)
      if (file) fd.append('resume', file)
      const res = await generatePlan(fd)
      await refreshUser()
      navigate(`/plan/${res.data.interviewReport._id}`)
    } catch (err) { setError(err.response?.data?.message||'Failed to generate plan.'); setLoading(false) }
  }

  const inputStyle = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:12, color:'#0f172a', padding:'14px 18px', fontSize:15, fontFamily:'inherit', outline:'none', resize:'none', lineHeight:1.6, transition:'border-color 0.2s' }

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <Navbar />
      <div style={{ textAlign:'center', padding:'52px 24px 36px' }}>
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}}
          style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:-1, marginBottom:10 }}>
          Create Your Custom <span style={{ color:'#e91e8c' }}>Interview Plan</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15, duration:0.5}} style={{ fontSize:17, color:'#64748b' }}>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </motion.p>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, gap:20 }}>
          <div className="spinner" style={{ width:56, height:56, borderTopColor:'#e91e8c' }}/>
          <p style={{ color:'#64748b', fontSize:16 }}>✦ Generating your personalized interview strategy... ~30s</p>
        </div>
      ) : (
        <>
          <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1,ease:[0.22,1,0.36,1]}}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:900, margin:'0 auto', padding:'0 28px' }}>

            {/* Left — JD */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:22, padding:26, boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ fontSize:20 }}>💼</span>
                <span style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>Target Job Description</span>
                <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca' }}>REQUIRED</span>
              </div>
              <textarea style={inputStyle} rows={11} placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google...'"} value={jd} onChange={e=>setJd(e.target.value)} maxLength={5000} onFocus={e=>e.target.style.borderColor='#e91e8c'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
              <p style={{ fontSize:12, color:'#94a3b8', textAlign:'right', marginTop:8 }}>{jd.length} / 5000 chars</p>
            </div>

            {/* Right — Profile */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:22, padding:26, boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ fontSize:20 }}>👤</span>
                <span style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>Your Profile</span>
              </div>
              <div style={{ fontSize:13, color:'#64748b', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                Upload Resume
                <span style={{ fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a' }}>BEST RESULTS</span>
              </div>
              <label style={{ display:'block', border:`2px dashed ${file?'#e91e8c':'#e2e8f0'}`, borderRadius:14, padding:'22px 18px', textAlign:'center', cursor:'pointer', marginBottom:16, background:file?'#fdf2f8':'#f8fafc', transition:'all 0.2s' }}>
                <input type="file" accept=".pdf" hidden ref={fileRef} onChange={e=>setFile(e.target.files[0])}/>
                <div style={{ fontSize:28, marginBottom:8 }}>☁️</div>
                <p style={{ fontSize:14, color:file?'#be185d':'#64748b', fontWeight:file?700:400 }}>{file?`✓ ${file.name}`:'Click to upload or drag & drop'}</p>
                <p style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>PDF only · Max 5MB</p>
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'14px 0' }}>
                <div style={{ flex:1, height:1, background:'#e2e8f0' }}/><span style={{ fontSize:13, color:'#94a3b8' }}>OR</span><div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
              </div>
              <p style={{ fontSize:13, color:'#64748b', marginBottom:8, fontWeight:500 }}>Quick Self-Description</p>
              <textarea style={{ ...inputStyle, minHeight:90 }} placeholder="Briefly describe your experience, key skills..." value={self} onChange={e=>setSelf(e.target.value)} onFocus={e=>e.target.style.borderColor='#10b981'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
              <div style={{ marginTop:14, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#1d4ed8', lineHeight:1.5 }}>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.
              </div>
            </div>
          </motion.div>

          {error && <div style={{ maxWidth:900, margin:'14px auto 0', padding:'0 28px' }}><div className="form-error">{error}</div></div>}

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:900, margin:'18px auto 0', padding:'0 28px' }}>
            <span style={{ fontSize:13, color:'#94a3b8' }}>✦ AI-Powered · Approx 30s · Costs 10 credits</span>
            <motion.button className="btn-pink" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={handleGenerate} style={{ fontSize:15, padding:'14px 30px' }}>
              ★ Generate My Interview Strategy
            </motion.button>
          </div>

          {recent.length>0 && (
            <div style={{ maxWidth:900, margin:'36px auto 0', padding:'0 28px 48px' }}>
              <p style={{ fontSize:20, fontWeight:800, color:'#0f172a', marginBottom:16, letterSpacing:-0.3 }}>My Recent Interview Plans</p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {recent.slice(0,4).map(r=>(
                  <motion.div key={r._id} whileHover={{ y:-2, boxShadow:'0 8px 24px rgba(0,0,0,0.08)' }}
                    style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:16, padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', transition:'box-shadow 0.2s' }}
                    onClick={()=>navigate(`/plan/${r._id}`)}>
                    <div>
                      <p style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:4 }}>{r.title}</p>
                      <p style={{ fontSize:13, color:'#94a3b8', marginBottom:4 }}>Generated on {new Date(r.createdAt).toLocaleDateString()}</p>
                      <p style={{ fontSize:13, color:'#e91e8c', fontWeight:700 }}>Match Score: {r.matchScore}%</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:13, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'6px 14px', fontWeight:500 }}>View →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
