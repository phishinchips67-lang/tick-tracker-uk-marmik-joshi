export const metadata = {
  title: 'Prevent tick bites | Tick Tracker',
}

export default function PreventionPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-sm border">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Prevent tick bites</h1>
      
      <ul className="space-y-4 text-gray-700 list-disc pl-5">
        <li><strong>Stick to paths:</strong> Avoid walking through long grass where ticks wait for hosts.</li>
        <li><strong>Cover up:</strong> Tuck your trousers into your socks and wear light-coloured clothing so ticks are easier to spot.</li>
        <li><strong>Use repellent:</strong> Apply insect repellent containing DEET to exposed skin.</li>
        <li><strong>Check yourself:</strong> Check yourself, children, and pets within 2 hours of a walk.</li>
        <li><strong>Remove correctly:</strong> Remove ticks with fine tweezers — grip close to the skin and pull steadily. Do not twist or jerk.</li>
        <li><strong>See a GP:</strong> If you get a bullseye rash or flu-like symptoms after a bite, contact your doctor immediately.</li>
      </ul>
    </div>
  )
}