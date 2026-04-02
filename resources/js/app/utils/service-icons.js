// Map service category → { emoji, bg } for consistent icons across the app
export const CATEGORY_ICONS = {
    'Consultation':   { emoji: '🩺', bg: 'bg-blue-100' },
    'Diagnostic':     { emoji: '🔬', bg: 'bg-cyan-100' },
    'Dental':         { emoji: '🦷', bg: 'bg-teal-100' },
    'Eye Care':       { emoji: '👁️',  bg: 'bg-indigo-100' },
    'Laboratory':     { emoji: '🧪', bg: 'bg-amber-100' },
    'Procedure':      { emoji: '🏥', bg: 'bg-orange-100' },
    'Therapy':        { emoji: '💆', bg: 'bg-green-100' },
    'Vaccination':    { emoji: '💉', bg: 'bg-emerald-100' },
    'Cardiology':     { emoji: '❤️', bg: 'bg-red-100' },
    'General Practice':{ emoji: '🩺', bg: 'bg-blue-100' },
    'Pediatrics':     { emoji: '🧒', bg: 'bg-yellow-100' },
    'Dermatology':    { emoji: '🔬', bg: 'bg-purple-100' },
    'Orthopedics':    { emoji: '🦴', bg: 'bg-gray-100' },
    'OB-GYN':         { emoji: '💊', bg: 'bg-pink-100' },
    'Radiology':      { emoji: '🩻', bg: 'bg-slate-100' },
    'Psychiatry':     { emoji: '🧠', bg: 'bg-violet-100' },
};

export function getServiceIcon(category = '') {
    return CATEGORY_ICONS[category] ?? { emoji: '⚕️', bg: 'bg-blue-50' };
}
