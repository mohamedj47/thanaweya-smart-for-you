
import React, { useState, useEffect } from 'react';
import { Lock, Key, Copy, CheckCircle, Smartphone, Send, AlertTriangle, Unlock, Sparkles, Package, BadgePercent } from 'lucide-react';

// --- إعدادات المدير ---
const SALT = "SMART_EDU_EGYPT_2026"; 
const MASTER_KEY = "MY-KIDS-VIP-2026"; 
const PHONE_NUMBER = "201221746554"; // رقمك مع كود مصر

export const SubscriptionModal: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'trial' | 'expired' | 'activated'>('loading');
  const [daysLeft, setDaysLeft] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Force redraw
    checkSubscription();
  }, []);

  useEffect(() => {
     // LOCK BODY SCROLL IF EXPIRED
     if (status === 'expired') {
         document.body.style.overflow = 'hidden';
     } else {
         document.body.style.overflow = 'unset';
     }
     return () => { document.body.style.overflow = 'unset'; }
  }, [status]);

  const checkSubscription = () => {
    const isActivated = localStorage.getItem('app_activated') === 'true';
    if (isActivated) {
      setStatus('activated');
      return;
    }

    let storedId = localStorage.getItem('device_id');
    if (!storedId) {
      storedId = 'ID-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('device_id', storedId);
    }
    setDeviceId(storedId);

    const startDateStr = localStorage.getItem('trial_start_date');
    let startDate = new Date();
    if (!startDateStr) {
      localStorage.setItem('trial_start_date', startDate.toISOString());
    } else {
      startDate = new Date(startDateStr);
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const remaining = 7 - diffDays;

    if (remaining <= 0) {
      setStatus('expired');
      setDaysLeft(0);
    } else {
      setStatus('trial');
      setDaysLeft(remaining);
    }
  };

  const handleActivate = () => {
    const code = inputCode.trim();
    const expectedCode = btoa(deviceId + SALT).substring(0, 12);

    if (code === MASTER_KEY) {
      localStorage.setItem('app_activated', 'true');
      setStatus('activated');
      alert("تم تفعيل النسخة الخاصة للعائلة (VIP)! 👑❤️");
      window.location.reload(); 
    } else if (code === expectedCode) {
      localStorage.setItem('app_activated', 'true');
      setStatus('activated');
      alert("تم التفعيل بنجاح! 🚀");
      window.location.reload(); 
    } else {
      setError("كود التفعيل غير صحيح.");
    }
  };
  
  const devUnlock = () => {
      localStorage.setItem('app_activated', 'true');
      window.location.reload();
  };

  const handlePlanClick = (planName: string, price: string) => {
    const message = `مرحباً مستر، أريد تفعيل اشتراك تطبيق 'المعلم الذكي'.%0aرقم جهازي هو: ${deviceId}%0aلقد اخترت: ${planName} (${price}).`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  const handleWhatsAppClick = () => {
    const message = `مرحباً مستر، أريد تفعيل اشتراك تطبيق 'المعلم الذكي'.%0aرقم جهازي هو: ${deviceId}%0aلقد قمت بتحويل مبلغ الاشتراك (حدد: مادة 100ج / باقة 500ج).`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  if (status !== 'expired') return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 font-sans dir-rtl text-right overflow-hidden" dir="rtl">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300 relative">
        
        {/* Hidden Dev Button */}
        <button onClick={devUnlock} className="absolute top-2 left-2 opacity-0 w-10 h-10 z-50"></button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-white p-5 text-center border-b border-red-100">
           <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3 shadow-sm animate-bounce">
             <Lock className="text-red-600 w-7 h-7" />
           </div>
           <h2 className="text-xl font-black text-slate-800">انتهت الفترة التجريبية</h2>
           <p className="text-sm text-slate-600 font-medium mt-1">استثمر في مستقبلك واشترك الآن لمتابعة الدروس</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
           
           {/* New Pricing Layout */}
           <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-center gap-2 mb-3">
                 <BadgePercent className="text-indigo-600 w-5 h-5" />
                 <span className="text-sm font-bold text-indigo-800">باقات الاشتراك المتاحة</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 {/* Single Subject */}
                 <button 
                    onClick={() => handlePlanClick('المادة الواحدة', '100ج')}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center hover:border-indigo-500 hover:ring-2 hover:ring-indigo-200 transition-all active:scale-95"
                 >
                    <p className="text-xs text-slate-500 font-bold mb-1">المادة الواحدة</p>
                    <p className="text-2xl font-black text-indigo-600">100<span className="text-xs text-slate-400 font-medium mr-1">ج.م</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">ترم كامل</p>
                 </button>

                 {/* Full Bundle */}
                 <button 
                    onClick={() => handlePlanClick('باقة الصف كاملة', '500ج')}
                    className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl shadow-md text-center text-white relative overflow-hidden transform hover:scale-105 transition-all duration-200 active:scale-95"
                 >
                    <div className="absolute top-0 right-0 bg-yellow-400 text-indigo-900 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">توفير ضخم</div>
                    <p className="text-xs text-indigo-100 font-bold mb-1">باقة الصف كاملة</p>
                    <p className="text-2xl font-black text-white">500<span className="text-xs text-indigo-200 font-medium mr-1">ج.م</span></p>
                    <p className="text-[10px] text-indigo-200 mt-1">كل المواد (ترم كامل)</p>
                 </button>
              </div>
           </div>

           {/* Device ID */}
           <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 border-dashed">
              <span className="text-xs text-slate-500 font-bold">رقم جهازك (مطلوب للتفعيل)</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm w-full justify-between">
                 <code className="text-sm font-mono font-black text-slate-700 tracking-widest select-all">{deviceId}</code>
                 <button 
                   onClick={() => navigator.clipboard.writeText(deviceId)}
                   className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors"
                   title="نسخ"
                 >
                    <Copy size={16} />
                 </button>
              </div>
           </div>

           {/* Actions */}
           <div className="space-y-3 pt-2">
              <button 
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
              >
                <Send size={20} />
                <span>إرسال صورة التحويل (واتساب)</span>
              </button>
              
              <div className="relative">
                 <input 
                   type="text" 
                   value={inputCode}
                   onChange={(e) => setInputCode(e.target.value)}
                   className="block w-full pl-3 pr-3 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center font-mono text-lg placeholder:text-slate-400 placeholder:text-sm placeholder:font-sans"
                   placeholder="أدخل كود التفعيل هنا"
                 />
              </div>
              
              <button 
                onClick={handleActivate}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                تفعيل الاشتراك
              </button>
           </div>
           
           {error && (
                <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg animate-pulse border border-red-100">
                    {error}
                </div>
           )}
        </div>
      </div>
    </div>
  );
};
