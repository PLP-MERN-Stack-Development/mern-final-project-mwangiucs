import React from 'react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">About Our AI LMS</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">We combine modern pedagogy with AI to deliver personalized learning paths, adaptive assessments, and insightful progress tracking.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-xl border p-6 bg-white">
          <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
          <p className="text-gray-600">Empower learners with accessible, personalized, and engaging education at scale.</p>
        </div>
        <div className="rounded-xl border p-6 bg-white">
          <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
          <p className="text-gray-600">A world where every student has a guided path to mastery powered by AI.</p>
        </div>
        <div className="rounded-xl border p-6 bg-white">
          <h3 className="font-semibold text-lg mb-2">AI Benefits</h3>
          <p className="text-gray-600">Smart recommendations, instant feedback, and tailored study plans.</p>
        </div>
      </section>
    </div>
  );
}


