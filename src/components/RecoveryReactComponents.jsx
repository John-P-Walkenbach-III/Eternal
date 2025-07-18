// Great! Below are **7 React components**—one for each re-entry/recovery reading. Each one is structured with a title, a reading/reflection message, and two reflection questions. They are styled simply and semantically, but you can customize the look with your site’s CSS or Tailwind.

// ---

// ### ✅ Instructions:

// 1. Place these components in a `RecoveryReadings.jsx` file or separate them into individual files (e.g. `ReadingOne.jsx`, etc.).
// 2. Import and display them on your page, like on your `/recovery` or `/journal` route.
// 3. You can wrap them in an accordion, tabs, or a styled container for a cleaner UX.

// ---

// ### 📂 `RecoveryReadings.jsx`

// ```jsx
// import React from 'react';

// const readings = [
//   {
//     title: "Boundaries Are a Gift",
//     content: "Boundaries are not walls to keep people out, but bridges to help us connect in healthy, respectful ways. In recovery, we learn that saying ‘no’ is not rejection—it’s protection. Every time we honor our emotional, spiritual, and physical space, we affirm our worth.",
//     questions: [
//       "Where in your life do you need clearer boundaries?",
//       "Do you feel guilt when saying no? Why?"
//     ]
//   },
//   {
//     title: "What Is Mine to Carry?",
//     content: "Recovery teaches us to lay down what was never ours to begin with. When we try to manage others’ emotions, fix their mistakes, or take the blame for their choices, we rob them of growth—and burden ourselves. Today, ask: is this mine to carry?",
//     questions: [
//       "Are you carrying someone else's emotional weight today?",
//       "How can you return to your center?"
//     ]
//   },
//   {
//     title: "The Pause That Heals",
//     content: "Before I react, I pause. Before I speak, I breathe. In that sacred space between trigger and response, recovery lives. The old me acted from pain. The new me chooses peace—even if it takes time.",
//     questions: [
//       "What does pausing look like for you in real life?",
//       "How does your body feel when you pause instead of react?"
//     ]
//   },
//   {
//     title: "You Are Not Your Past",
//     content: "Your mistakes are part of your story, not your identity. In recovery, we don’t erase the past—we redeem it. Every scar is a survival mark. Every day you choose healing, you rewrite your name.",
//     questions: [
//       "What part of your past still defines how you see yourself?",
//       "What truth can you speak over that memory today?"
//     ]
//   },
//   {
//     title: "Letting Go Without Giving Up",
//     content: "Letting go doesn’t mean we stop loving—it means we start trusting. We release control so that God, healing, and time can do what we cannot. We surrender—not in defeat, but in wisdom.",
//     questions: [
//       "Who or what do you need to release to God?",
//       "What fears come up when you think about letting go?"
//     ]
//   },
//   {
//     title: "Progress, Not Perfection",
//     content: "We grow in inches, not miles. Some days, just getting out of bed is a win. In recovery, perfection is the enemy of peace. Celebrate the baby steps—they’re building the foundation of a new life.",
//     questions: [
//       "Are you expecting too much of yourself today?",
//       "What small victory can you honor right now?"
//     ]
//   },
//   {
//     title: "Healing in the Light",
//     content: "Shame dies in the light. When we bring our struggles into trusted spaces, healing begins. Secrets lose their power when spoken in grace. Today, tell the truth to someone safe.",
//     questions: [
//       "What’s something you’re hiding that needs healing?",
//       "Who is a safe person you can be honest with?"
//     ]
//   }
// ];

// const RecoveryReadings = () => {
//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-8">
//       {readings.map((reading, index) => (
//         <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-xl font-semibold mb-2">{reading.title}</h2>
//           <p className="text-gray-700 mb-4">{reading.content}</p>
//           <div className="space-y-2">
//             <h3 className="text-sm font-medium text-gray-600">Reflection Questions:</h3>
//             <ul className="list-disc list-inside text-gray-800">
//               {reading.questions.map((q, i) => (
//                 <li key={i}>{q}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RecoveryReadings;
// ```

// ---

// ### ✅ Usage Example

// To use this in your app, just import it and add it to a page:

// ```jsx
// import RecoveryReadings from './components/RecoveryReadings';

// const RecoveryPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <h1 className="text-3xl text-center font-bold pt-8">Recovery Reflections</h1>
//       <RecoveryReadings />
//     </div>
//   );
// };

// export default RecoveryPage;
// ```

// ---

// ### ✅ Optional Enhancements

// * Use [Framer Motion](https://www.framer.com/motion/) for animations when each card loads.
// * Add a search or filter input so users can find reflections by keyword.
// * Store reflections in Firestore and make them dynamic.
// * Add a “Save Reflection” or “Journal Now” button if you're building a journaling feature.

// Would you like me to help you style it like a devotional magazine layout or add dark mode support?
