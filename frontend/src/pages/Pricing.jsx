import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { createOrder, verifyPayment } from '../services/api'
import { motion } from 'framer-motion'

const PLANS = [
  { id:'free', name:'Free', price:'₹0', credits:100, tag:'Default', desc:'Perfect for beginners starting interview preparation.', features:['100 AI Interview Credits','Basic Performance Report','Voice Interview Access','Limited History Tracking'], btn:null },
  { id:'starter', name:'Starter Pack', price:'₹100', credits:150, desc:'Great for focused practice and skill improvement.', features:['150 AI Interview Credits','Detailed AI Feedback','Performance Analytics','Full Interview History'], btn:'outline' },
  { id:'pro', name:'Pro Pack', price:'₹500', credits:650, tag:'Best Value', featured:true, desc:'Best value for serious job preparation.', features:['650 AI Interview Credits','Advanced AI Feedback','Skill Trend Analysis','Priority AI Processing'], btn:'filled' },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const handlePurchase = async (plan) => {
    if (!user) { navigate('/login'); return }
    try {
      const orderRes = await createOrder(plan.id)
      const { orderId, amount, currency } = orderRes.data
      const options = { key:import.meta.env.VITE_RAZORPAY_KEY_ID, amount, currency, name:'HireMind.AI', description:`${plan.name} — ${plan.credits} Credits`, order_id:orderId,
        handler: async (response) => {
          try { await verifyPayment({...response, plan:plan.id}); await refreshUser(); alert(`✅ Payment successful! ${plan.credits} credits added.`); navigate('/dashboard') }
          catch { alert('Payment verification failed.') }
        }, prefill:{ email:user?.email }, theme:{ color:'#10b981' } }
      const rzp = new window.Razorpay(options); rzp.open()
    } catch (err) { alert(err.response?.data?.message||'Payment failed.') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f0' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'52px 28px 60px' }}>
        <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={()=>navigate(-1)} style={{ background:'none', border:'none', color:'#64748b', fontSize:15, cursor:'pointer', marginBottom:32, display:'flex', alignItems:'center', gap:6 }}>← Back</motion.button>
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}} style={{ textAlign:'center', marginBottom:48 }}>
          <h1 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:-1, marginBottom:10 }}>Choose Your Plan</h1>
          <p style={{ fontSize:17, color:'#64748b' }}>Flexible pricing to match your interview preparation goals.</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:40 }}>
          {PLANS.map((plan,i)=>(
            <motion.div key={plan.id} initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.1,ease:[0.22,1,0.36,1]}}
              whileHover={{ y:-6, boxShadow:plan.featured?'0 20px 60px rgba(16,185,129,0.2)':'0 20px 60px rgba(0,0,0,0.1)' }}
              style={{ background:'#fff', borderRadius:24, padding:30, position:'relative', border:plan.featured?'2px solid #10b981':'1px solid rgba(0,0,0,0.07)', boxShadow:plan.featured?'0 8px 32px rgba(16,185,129,0.12)':'0 4px 16px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s' }}>
              {plan.tag && <span style={{ position:'absolute', top:16, right:16, fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:20, background:plan.featured?'#10b981':'#f1f5f9', color:plan.featured?'#fff':'#64748b' }}>{plan.tag}</span>}
              <h2 style={{ fontSize:19, fontWeight:800, color:'#0f172a', marginBottom:8, letterSpacing:-0.3 }}>{plan.name}</h2>
              <p style={{ fontSize:36, fontWeight:900, color:'#10b981', marginBottom:4, letterSpacing:-1 }}>{plan.price}</p>
              <p style={{ fontSize:14, color:'#94a3b8', marginBottom:12 }}>{plan.credits} Credits</p>
              <p style={{ fontSize:14, color:'#64748b', marginBottom:22, lineHeight:1.6 }}>{plan.desc}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:26 }}>
                {plan.features.map(f=>(
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:'#374151' }}>
                    <span style={{ color:'#10b981', fontSize:17, fontWeight:700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {plan.btn==='filled' && <button className="btn-green" style={{ width:'100%', padding:'13px 0', fontSize:15, borderRadius:14 }} onClick={()=>handlePurchase(plan)}>Select Plan</button>}
              {plan.btn==='outline' && <button className="btn-outline" style={{ width:'100%', padding:'13px 0', fontSize:15, borderRadius:14 }} onClick={()=>handlePurchase(plan)}>Select Plan</button>}
              {!plan.btn && <div style={{ padding:'13px 0', textAlign:'center', fontSize:14, color:'#94a3b8', borderTop:'1px solid #f1f5f9' }}>Current Plan</div>}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.4}} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:20, padding:'26px 30px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize:17, fontWeight:800, color:'#0f172a', marginBottom:18, letterSpacing:-0.3 }}>Credit Usage Guide</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['Generate Interview Plan','10 credits'],['Download ATS Resume PDF','5 credits'],['Start AI Interview Session','5 credits'],['Download Session PDF Report','Free']].map(([action,cost])=>(
              <div key={action} style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#64748b', padding:'12px 16px', background:'#f8fafc', borderRadius:12, border:'1px solid #e2e8f0' }}>
                <span>{action}</span>
                <span style={{ color:'#10b981', fontWeight:700 }}>{cost}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
