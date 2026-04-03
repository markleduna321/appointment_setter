export default function VcHeroSection({ onApply }) {
    return (
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white">
            {/* Abstract background circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute top-4 right-1/3 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative px-8 py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Left: text */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Virtual Check Up
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
                        See your doctor<br />
                        <span className="text-sky-200">from the comfort of home.</span>
                    </h1>
                    <p className="text-blue-100 text-base max-w-lg leading-relaxed">
                        Apply for a virtual check up, get approved by our team, and connect with your doctor via HD video — no travel, no waiting rooms.
                    </p>

                    {onApply && (
                        <button
                            onClick={onApply}
                            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 rounded-xl font-bold text-sm shadow-md shadow-black/20 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            Apply Now
                        </button>
                    )}
                </div>

                {/* Right: how it works */}
                <div className="flex-shrink-0 w-full lg:w-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 w-full lg:w-72">
                        <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-4">How it works</p>
                        <ol className="space-y-3">
                            {[
                                { step: '1', text: 'Click "Apply Now" and pick your doctor & schedule' },
                                { step: '2', text: 'Admin reviews and confirms your request' },
                                { step: '3', text: 'Come back here and click "Join Call"' },
                            ].map(({ step, text }) => (
                                <li key={step} className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold flex-shrink-0">
                                        {step}
                                    </span>
                                    <span className="text-sm text-blue-100">{text}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
