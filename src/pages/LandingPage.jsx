// import { useNavigate } from "react-router-dom";
// import {
//   Rocket,
//   Users,
//   Star,
//   ArrowRight,
//   CheckCircle2,
//   Code2,
//   Brain,
//   Boxes,
//   GitBranch,
// } from "lucide-react";

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const goToSessions = () => navigate("/sessions");

//   return (
//     <div className="min-h-screen bg-white text-gray-900 overflow-hidden">

//       {/* NAVBAR */}
//       <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

//           <div className="text-xl font-bold text-orange-600">
//             Guideup
//           </div>

//           <button
//             onClick={goToSessions}
//             className="flex items-center gap-2 font-semibold text-orange-600 hover:gap-3 transition-all"
//           >
//             Book Session
//             <ArrowRight className="w-4 h-4"/>
//           </button>

//         </div>
//       </nav>

//       {/* HERO */}
//       <section className="relative overflow-hidden">

//         {/* gradient bg */}
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />

//         {/* grid pattern */}
//         <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

//         <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">

//           {/* TEXT */}
//           <div>

//             <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6">
//               <Star className="w-4 h-4 fill-orange-500"/>
//               500+ mock interviews conducted
//             </div>

//             <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
//               Practice real
//               <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
//                 technical interviews
//               </span>
//               before they matter
//             </h1>

//             <p className="text-lg text-gray-600 mb-8 max-w-xl">
//               Guideup helps students experience real technical interviews 
//               with engineers and domain experts — so placements feel familiar, 
//               not frightening.
//             </p>

//             <div className="flex gap-4 flex-wrap">

//               <button
//                 onClick={goToSessions}
//                 className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
//               >
//                 Book Mock Interview
//                 <ArrowRight className="w-5 h-5"/>
//               </button>

//               <div className="text-sm text-gray-500 flex items-center">
//                 For 1st year → M.Tech students
//               </div>

//             </div>

//           </div>


//           {/* FLOATING STATS */}
//           <div className="grid grid-cols-2 gap-6">

//             {[
//               { value: "500+", label: "Sessions" },
//               { value: "20+", label: "Colleges" },
//               { value: "4.9★", label: "Rating" },
//               { value: "4 Domains", label: "Technical Areas" },
//             ].map((stat, i) => (

//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
//               >
//                 <div className="text-3xl font-bold text-orange-500">
//                   {stat.value}
//                 </div>

//                 <div className="text-gray-500 text-sm mt-1">
//                   {stat.label}
//                 </div>
//               </div>

//             ))}

//           </div>

//         </div>
//       </section>


//       {/* STORY TIMELINE */}
//       <section className="py-24">

//         <div className="max-w-5xl mx-auto px-6 text-center mb-16">

//           <h2 className="text-3xl font-bold mb-4">
//             Why Guideup exists
//           </h2>

//           <p className="text-gray-600 text-lg">
//             Most students learn how interviews work only after losing real opportunities.
//           </p>

//         </div>

//         <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-10">

//           {[
//             {
//               title: "First Interview",
//               text: "Confusion about format, expectations, and question depth."
//             },
//             {
//               title: "Second Interview",
//               text: "Realizing the level of preparation required."
//             },
//             {
//               title: "Third Interview",
//               text: "Finally understanding how interviews actually work."
//             }
//           ].map((step,i)=>(
//             <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">

//               <div className="font-semibold text-orange-500 mb-2">
//                 {step.title}
//               </div>

//               <p className="text-gray-600 text-sm leading-relaxed">
//                 {step.text}
//               </p>

//             </div>
//           ))}

//         </div>

//         <div className="text-center mt-14 text-lg text-gray-700">
//           Guideup helps students gain this experience
//           <span className="font-semibold"> before real placements begin.</span>
//         </div>

//       </section>


//       {/* HOW IT WORKS */}
//       <section className="py-24 bg-gray-50">

//         <div className="max-w-7xl mx-auto px-6">

//           <h2 className="text-3xl font-bold text-center mb-16">
//             How Guideup mock interviews work
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8">

//             {[
//               {
//                 icon: Rocket,
//                 title:"Real Interview Simulation",
//                 text:"Experience a real technical interview environment."
//               },
//               {
//                 icon: Users,
//                 title:"Multi Domain Interview Panel",
//                 text:"Interviewers from DSA, Development, AI/ML and System Design."
//               },
//               {
//                 icon: CheckCircle2,
//                 title:"Detailed Feedback",
//                 text:"Clear actionable feedback to improve your preparation."
//               }
//             ].map((card,i)=>{

//               const Icon=card.icon

//               return(

//                 <div
//                   key={i}
//                   className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition"
//                 >

//                   <Icon className="w-8 h-8 text-orange-500 mb-4"/>

//                   <h3 className="font-semibold text-lg mb-2">
//                     {card.title}
//                   </h3>

//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     {card.text}
//                   </p>

//                 </div>

//               )

//             })}

//           </div>

//         </div>

//       </section>


//       {/* DOMAINS */}
//       <section className="py-24">

//         <div className="max-w-7xl mx-auto px-6">

//           <h2 className="text-3xl font-bold text-center mb-16">
//             Technical domains covered
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

//             {[
//               {icon:Code2,title:"DSA & Algorithms"},
//               {icon:Boxes,title:"Full Stack Development"},
//               {icon:Brain,title:"AI / Machine Learning"},
//               {icon:GitBranch,title:"System Design"}
//             ].map((d,i)=>{

//               const Icon=d.icon

//               return(

//                 <div
//                   key={i}
//                   className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition text-center"
//                 >

//                   <Icon className="w-8 h-8 mx-auto text-orange-500 mb-4"/>

//                   <div className="font-semibold">
//                     {d.title}
//                   </div>

//                 </div>

//               )

//             })}

//           </div>

//         </div>

//       </section>


//       {/* VALUE PROPOSITION */}
//       <section className="py-24 bg-gray-50">

//         <div className="max-w-6xl mx-auto px-6 text-center">

//           <h2 className="text-3xl font-bold mb-8">
//             Real interview experience shouldn't cost ₹1–2 lakhs
//           </h2>

//           <div className="grid md:grid-cols-2 gap-8">

//             <div className="bg-white p-8 rounded-xl border">

//               <div className="font-semibold mb-4 text-gray-800">
//                 Traditional mentorship programs
//               </div>

//               <ul className="space-y-2 text-gray-600 text-sm">

//                 <li>₹1–2 lakh programs</li>
//                 <li>Long commitments</li>
//                 <li>Often theoretical</li>

//               </ul>

//             </div>


//             <div className="bg-orange-500 text-white p-8 rounded-xl shadow-lg">

//               <div className="font-semibold mb-4">
//                 Guideup Mock Interviews
//               </div>

//               <ul className="space-y-2 text-sm">

//                 <li>Affordable sessions</li>
//                 <li>Real interview exposure</li>
//                 <li>Actionable feedback</li>

//               </ul>

//             </div>

//           </div>

//         </div>

//       </section>


//       {/* FINAL CTA */}
//       <section className="py-28 bg-gradient-to-r from-orange-500 to-amber-500 text-white">

//         <div className="max-w-3xl mx-auto px-6 text-center">

//           <Rocket className="w-12 h-12 mx-auto mb-6"/>

//           <h2 className="text-4xl font-bold mb-6">
//             Prepare for interviews before they begin
//           </h2>

//           <p className="text-orange-100 mb-8">
//             Gain real technical interview experience and approach placements with confidence.
//           </p>

//           <button
//             onClick={goToSessions}
//             className="bg-white text-orange-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
//           >
//             Book Your Mock Interview
//           </button>

//         </div>

//       </section>


//       {/* FOOTER */}
//       <footer className="border-t py-6 text-center text-gray-500 text-sm">
//         Built for students preparing for tech careers
//       </footer>

//     </div>
//   );
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

      {/* MOVING STRIP */}
      <div className="w-full overflow-hidden bg-orange-500 text-white py-2">
        <div className="whitespace-nowrap animate-marquee text-sm font-medium">
          Guideup helps students experience real interview environments with expert mentors so you can crack internships and placements with confidence.
          &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp;
          Guideup helps students experience real interview environments with expert mentors so you can crack internships and placements with confidence ⭐ Real experts | Real interview questions | Real placement preparation
        </div>
      </div>


      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />

        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

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
                className="
  flex items-center gap-2
  px-8 py-4
  rounded-xl
  font-semibold
  text-white
  bg-gradient-to-r from-orange-400 to-green-400
  hover:from-orange-500 hover:to-green-500
  transition-all duration-300
  animate-ctaGlow
  shadow-md
  "
              >
                Book Mock Interview
                <ArrowRight className="w-5 h-5" />
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
              { value: "40+", label: "Technical Experts" },
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