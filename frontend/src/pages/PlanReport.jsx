import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPlanById, downloadResumePdf } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const NAV = [
  { id:'technical',  label:'Technical Questions',  icon:'</>' },
  { id:'behavioral', label:'Behavioral Questions',  icon:'💬' },
  { id:'roadmap',    label:'Road Map',              icon:'🗺️' },
]

function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:index*0.06}}
      style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14, overflow:'hidden', marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 20px', cursor:'pointer' }} onClick={()=>setOpen(o=>!o)}>
        <span style={{ fontSize:12, fontWeight:800, color:'#4f46e5', minWidth:28, paddingTop:2 }}>Q{index+1}</span>
        <p style={{ fontSize:15, color:'#0f172a', lineHeight:1.6, flex:1, fontWeight:500 }}>{item.question}</p>
        <span style={{ color:'#94a3b8', fontSize:18, transform:open?'rotate(90deg)':'none', transition:'transform 0.2s', flexShrink:0 }}>›</span>
      </div>
      {open && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} style={{ padding:'0 20px 20px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:12, padding:'12px 16px' }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#4f46e5', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Intention</p>
            <p style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{item.intention}</p>
          </div>
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'12px 16px' }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#16a34a', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Model Answer</p>
            <p style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{item.answer}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function RoadMapDay({ day, i }) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
      style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'18px 22px', marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
        <span style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'4px 14px', fontSize:13, fontWeight:800, color:'#16a34a' }}>Day {day.day}</span>
        <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>{day.focus}</h3>
      </div>
      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
        {day.tasks.map((task,j)=>(
          <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'#374151', lineHeight:1.6 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', flexShrink:0, marginTop:7 }}/>
            {task}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function PlanReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav] = useState('technical')
  const [downloading, setDownloading] = useState(false)

  useEffect(()=>{ getPlanById(id).then(r=>setReport(r.data.interviewReport)).catch(()=>navigate('/plan')).finally(()=>setLoading(false)) },[id])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await downloadResumePdf(id)
      const url = URL.createObjectURL(new Blob([res.data],{type:'application/pdf'}))
      const a = document.createElement('a'); a.href=url; a.download=`hiremind_resume_${id}.pdf`; a.click(); URL.revokeObjectURL(url)
      await refreshUser()
    } catch (err) { alert(err.response?.data?.message||'Download failed') }
    finally { setDownloading(false) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <Navbar /><div className="loading-screen"><div className="spinner"/><p style={{ color:'#64748b', fontSize:16 }}>Loading your interview plan...</p></div>
    </div>
  )

  const scoreColor = report.matchScore>=80?'#10b981':report.matchScore>=60?'#f59e0b':'#ef4444'

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div style={{ display:'flex', flex:1, maxWidth:'100%', margin:'0 auto', width:'100%' }}>

        {/* Left nav */}
        <div style={{ width:240, flexShrink:0, background:'#fff', borderRight:'1px solid rgba(0,0,0,0.07)', padding:'28px 0', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'calc(100vh - 68px)' }}>
          <div>
            <p style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#94a3b8', padding:'0 20px', marginBottom:12 }}>Sections</p>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setActiveNav(n.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'13px 20px', background:activeNav===n.id?'#f0fdf4':'transparent', borderRight:activeNav===n.id?'3px solid #10b981':'3px solid transparent', border:'none', color:activeNav===n.id?'#16a34a':'#64748b', fontSize:15, fontWeight:activeNav===n.id?700:400, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.15s' }}>
                <span style={{ fontSize:16 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div style={{ padding:'0 16px 24px' }}>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={handleDownload} disabled={downloading}
              style={{ width:'100%', background:'#e91e8c', border:'none', color:'#fff', borderRadius:50, padding:'13px 0', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(233,30,140,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              {downloading?'⏳ Generating...':'★ Download Resume'}
            </motion.button>
            <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:6 }}>Costs 5 credits</p>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:'28px 32px', overflowY:'auto' }}>
          {activeNav==='technical' && (
            <section>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:-0.5 }}>Technical Questions</h2>
                <span style={{ background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:20, padding:'4px 14px', fontSize:13, color:'#64748b', fontWeight:600 }}>{report.technicalQuestions.length} questions</span>
              </div>
              {report.technicalQuestions.map((q,i)=><QuestionCard key={i} item={q} index={i}/>)}
            </section>
          )}
          {activeNav==='behavioral' && (
            <section>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:-0.5 }}>Behavioral Questions</h2>
                <span style={{ background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:20, padding:'4px 14px', fontSize:13, color:'#64748b', fontWeight:600 }}>{report.behavioralQuestions.length} questions</span>
              </div>
              {report.behavioralQuestions.map((q,i)=><QuestionCard key={i} item={q} index={i}/>)}
            </section>
          )}
          {activeNav==='roadmap' && (
            <section>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:-0.5 }}>Preparation Road Map</h2>
                <span style={{ background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:20, padding:'4px 14px', fontSize:13, color:'#64748b', fontWeight:600 }}>{report.preparationPlan.length}-day plan</span>
              </div>
              {report.preparationPlan.map((day,i)=><RoadMapDay key={day.day} day={day} i={i}/>)}
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width:220, flexShrink:0, background:'#fff', borderLeft:'1px solid rgba(0,0,0,0.07)', padding:'28px 18px' }}>
          <p style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#94a3b8', textAlign:'center', marginBottom:14 }}>Match Score</p>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
            <div style={{ position:'relative', width:96, height:96 }}>
              <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                <circle cx="48" cy="48" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                  strokeDasharray={`${2*Math.PI*40}`} strokeDashoffset={`${2*Math.PI*40*(1-report.matchScore/100)}`} strokeLinecap="round"/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:24, fontWeight:900, color:'#0f172a' }}>{report.matchScore}</span>
                <span style={{ fontSize:12, color:'#94a3b8' }}>%</span>
              </div>
            </div>
          </div>
          <p style={{ textAlign:'center', fontSize:13, color:scoreColor, marginBottom:20, fontWeight:700 }}>
            {report.matchScore>=80?'Excellent match!':report.matchScore>=60?'Strong match for this role':'Needs improvement'}
          </p>
          <div style={{ height:1, background:'#f1f5f9', marginBottom:18 }}/>
          <p style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#94a3b8', marginBottom:12 }}>Skill Gaps</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {report.skillGaps.map((g,i)=>(
              <span key={i} style={{ fontSize:12, padding:'5px 12px', borderRadius:10, fontWeight:600, background:g.severity==='high'?'#fef2f2':g.severity==='medium'?'#fef3c7':'#eef2ff', color:g.severity==='high'?'#dc2626':g.severity==='medium'?'#d97706':'#4f46e5', border:`1px solid ${g.severity==='high'?'#fecaca':g.severity==='medium'?'#fde68a':'#c7d2fe'}` }}>
                {g.skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
