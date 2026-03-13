// import { useNavigate } from 'react-router-dom'
// import { Rocket, MapPin, Users, FileText, GitBranch, Star, ArrowRight, CheckCircle2 } from 'lucide-react'
// import PrimaryButton from '../components/PrimaryButton'

// const FEATURES = [
//   { icon: MapPin,       text: 'On-campus placement strategy' },
//   { icon: GitBranch,    text: 'Off-campus roadmap' },
//   { icon: FileText,     text: 'Resume review' },
//   { icon: Users,        text: 'Referral guidance' },
// ]

// const TESTIMONIALS = [
//   { name: 'Priya M.', company: 'Google', text: 'Got my dream offer after just 2 sessions. Life-changing!' },
//   { name: 'Arjun K.', company: 'Microsoft', text: 'The referral strategy actually works. Highly recommend.' },
//   { name: 'Sneha R.', company: 'Amazon', text: 'Resume went from ignored to shortlisted in 1 week.' },
// ]

// export default function LandingPage() {
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Nav */}
//       <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
//         <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
//           <span className="font-bold text-primary-600 text-lg tracking-tight">Guideup</span>
//           <button
//             onClick={() => navigate('/sessions')}
//             className="text-sm font-semibold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all"
//           >
//             Book Now <ArrowRight className="w-4 h-4" />
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-lg mx-auto px-4">
//         {/* Hero */}
//         <section className="pt-12 pb-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
//             <Star className="w-3.5 h-3.5 fill-primary-500" />
//             500+ students placed successfully
//           </div>
//           <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
//             Get Placed in{' '}
//             <span className="text-primary-500">Top Companies</span>{' '}
//             <span>🚀</span>
//           </h1>
//           <p className="text-gray-500 text-lg leading-relaxed mb-8">
//             1:1 placement mentorship sessions with industry experts who've been there.
//           </p>
//           <PrimaryButton onClick={() => navigate('/sessions')} className="max-w-xs mx-auto text-base">
//             Book a Session
//             <ArrowRight className="w-5 h-5" />
//           </PrimaryButton>
//           <p className="mt-3 text-xs text-gray-400">No commitment • Cancel anytime</p>
//         </section>

//         {/* Social proof stats */}
//         <section className="grid grid-cols-3 gap-3 mb-10">
//           {[
//             { value: '500+', label: 'Students' },
//             { value: '4.9★', label: 'Rating' },
//             { value: '30min', label: 'Sessions' },
//           ].map(s => (
//             <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
//               <div className="text-2xl font-extrabold text-primary-600">{s.value}</div>
//               <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
//             </div>
//           ))}
//         </section>

//         {/* Features */}
//         <section className="mb-10">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">What's covered</h2>
//           <div className="space-y-3">
//             {FEATURES.map(({ icon: Icon, text }) => (
//               <div key={text} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-card">
//                 <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Icon className="w-4.5 h-4.5 text-primary-500" />
//                 </div>
//                 <span className="text-gray-700 font-medium text-sm">{text}</span>
//                 <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="mb-10">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Student stories</h2>
//           <div className="space-y-3">
//             {TESTIMONIALS.map(t => (
//               <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-card">
//                 <p className="text-gray-600 text-sm italic mb-3">"{t.text}"</p>
//                 <div className="flex items-center gap-2">
//                   <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-600">
//                     {t.name[0]}
//                   </div>
//                   <div>
//                     <div className="text-xs font-semibold text-gray-900">{t.name}</div>
//                     <div className="text-xs text-primary-500">{t.company}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* CTA */}
//         <section className="pb-12">
//           <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-center text-white">
//             <Rocket className="w-10 h-10 mx-auto mb-3 opacity-90" />
//             <h3 className="text-xl font-bold mb-2">Ready to get placed?</h3>
//             <p className="text-primary-100 text-sm mb-5">Book your session now. Mentor assigned within 24 hours.</p>
//             <button
//               onClick={() => navigate('/sessions')}
//               className="bg-white text-primary-600 font-bold px-6 h-12 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
//             >
//               Book a Session <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  Code2,
  Brain,
  Boxes,
  GitBranch,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const goToSessions = () => navigate("/sessions");

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="text-xl font-bold text-orange-600">
            Guideup
          </div>

          <button
            onClick={goToSessions}
            className="flex items-center gap-2 font-semibold text-orange-600 hover:gap-3 transition-all"
          >
            Book Session
            <ArrowRight className="w-4 h-4"/>
          </button>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />

        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <div>

            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6">
              <Star className="w-4 h-4 fill-orange-500"/>
              500+ mock interviews conducted
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Practice real
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                technical interviews
              </span>
              before they matter
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Guideup helps students experience real technical interviews 
              with engineers and domain experts — so placements feel familiar, 
              not frightening.
            </p>

            <div className="flex gap-4 flex-wrap">

              <button
                onClick={goToSessions}
                className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
              >
                Book Mock Interview
                <ArrowRight className="w-5 h-5"/>
              </button>

              <div className="text-sm text-gray-500 flex items-center">
                For 1st year → M.Tech students
              </div>

            </div>

          </div>


          {/* FLOATING STATS */}
          <div className="grid grid-cols-2 gap-6">

            {[
              { value: "500+", label: "Sessions" },
              { value: "20+", label: "Colleges" },
              { value: "4.9★", label: "Rating" },
              { value: "4 Domains", label: "Technical Areas" },
            ].map((stat, i) => (

              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
              >
                <div className="text-3xl font-bold text-orange-500">
                  {stat.value}
                </div>

                <div className="text-gray-500 text-sm mt-1">
                  {stat.label}
                </div>
              </div>

            ))}

          </div>

        </div>
      </section>


      {/* STORY TIMELINE */}
      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6 text-center mb-16">

          <h2 className="text-3xl font-bold mb-4">
            Why Guideup exists
          </h2>

          <p className="text-gray-600 text-lg">
            Most students learn how interviews work only after losing real opportunities.
          </p>

        </div>

        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          {[
            {
              title: "First Interview",
              text: "Confusion about format, expectations, and question depth."
            },
            {
              title: "Second Interview",
              text: "Realizing the level of preparation required."
            },
            {
              title: "Third Interview",
              text: "Finally understanding how interviews actually work."
            }
          ].map((step,i)=>(
            <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">

              <div className="font-semibold text-orange-500 mb-2">
                {step.title}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {step.text}
              </p>

            </div>
          ))}

        </div>

        <div className="text-center mt-14 text-lg text-gray-700">
          Guideup helps students gain this experience
          <span className="font-semibold"> before real placements begin.</span>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-16">
            How Guideup mock interviews work
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                icon: Rocket,
                title:"Real Interview Simulation",
                text:"Experience a real technical interview environment."
              },
              {
                icon: Users,
                title:"Multi Domain Interview Panel",
                text:"Interviewers from DSA, Development, AI/ML and System Design."
              },
              {
                icon: CheckCircle2,
                title:"Detailed Feedback",
                text:"Clear actionable feedback to improve your preparation."
              }
            ].map((card,i)=>{

              const Icon=card.icon

              return(

                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition"
                >

                  <Icon className="w-8 h-8 text-orange-500 mb-4"/>

                  <h3 className="font-semibold text-lg mb-2">
                    {card.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.text}
                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>


      {/* DOMAINS */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-16">
            Technical domains covered
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {icon:Code2,title:"DSA & Algorithms"},
              {icon:Boxes,title:"Full Stack Development"},
              {icon:Brain,title:"AI / Machine Learning"},
              {icon:GitBranch,title:"System Design"}
            ].map((d,i)=>{

              const Icon=d.icon

              return(

                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition text-center"
                >

                  <Icon className="w-8 h-8 mx-auto text-orange-500 mb-4"/>

                  <div className="font-semibold">
                    {d.title}
                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </section>


      {/* VALUE PROPOSITION */}
      <section className="py-24 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-8">
            Real interview experience shouldn't cost ₹1–2 lakhs
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white p-8 rounded-xl border">

              <div className="font-semibold mb-4 text-gray-800">
                Traditional mentorship programs
              </div>

              <ul className="space-y-2 text-gray-600 text-sm">

                <li>₹1–2 lakh programs</li>
                <li>Long commitments</li>
                <li>Often theoretical</li>

              </ul>

            </div>


            <div className="bg-orange-500 text-white p-8 rounded-xl shadow-lg">

              <div className="font-semibold mb-4">
                Guideup Mock Interviews
              </div>

              <ul className="space-y-2 text-sm">

                <li>Affordable sessions</li>
                <li>Real interview exposure</li>
                <li>Actionable feedback</li>

              </ul>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-r from-orange-500 to-amber-500 text-white">

        <div className="max-w-3xl mx-auto px-6 text-center">

          <Rocket className="w-12 h-12 mx-auto mb-6"/>

          <h2 className="text-4xl font-bold mb-6">
            Prepare for interviews before they begin
          </h2>

          <p className="text-orange-100 mb-8">
            Gain real technical interview experience and approach placements with confidence.
          </p>

          <button
            onClick={goToSessions}
            className="bg-white text-orange-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Book Your Mock Interview
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-gray-500 text-sm">
        Built for students preparing for tech careers
      </footer>

    </div>
  );
}