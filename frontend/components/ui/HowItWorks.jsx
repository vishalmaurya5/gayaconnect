export default function HowItWorks() {
  const steps = [
    {
      title: "Search or Browse",
      desc: "Find the service you need by searching or exploring our local categories.",
      icon: "🔍"
    },
    {
      title: "Compare & Contact",
      desc: "View ratings, compare offers, and instantly unlock contact details.",
      icon: "📞"
    },
    {
      title: "Get it Done",
      desc: "Connect directly with trusted Gaya professionals and get your work done.",
      icon: "✅"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 text-center mt-8">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-indigo-200">
            {step.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-600 text-sm">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
