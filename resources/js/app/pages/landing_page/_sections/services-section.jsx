import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { get_services_service } from '../../../services/service-service';
import { getServiceIcon } from '../../../utils/service-icons';

export default function ServicesSection() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await get_services_service({});
                if (mounted) setServices(data || []);
            } catch (err) {
                if (mounted) setServices([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const preview = services.slice(0, 6);

    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-3">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Comprehensive Medical Care
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        From routine check-ups to specialized treatments — book any service
                        instantly and get expert care right when you need it.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(loading ? Array.from({ length: 6 }) : preview).map((s, idx) => {
                        const isPlaceholder = loading;
                        const name = isPlaceholder ? `Loading ${idx + 1}` : s.name;
                        const desc = isPlaceholder ? '' : (s.description ?? '');
                        const category = isPlaceholder ? '' : (s.category ?? '');
                        const { emoji, bg } = getServiceIcon(category);
                        const accent = 'text-blue-600';

                        return (
                            <div
                                key={isPlaceholder ? `ph-${idx}` : (s.id ?? name)}
                                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image / Banner */}
                                <div className="relative h-44 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {!isPlaceholder && s.image
                                        ? <img src={s.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        : (
                                            <div className={`absolute top-3 left-3 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${bg}`}>
                                                {emoji}
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Body */}
                                <div className="p-5">
                                    <h3 className={`text-base font-bold ${accent} mb-1`}>{name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                                    <Link
                                        href="/appointments/new"
                                        className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent} hover:gap-2.5 transition-all`}
                                    >
                                        Book Now <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* More services link */}
                <div className="text-center mt-10">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                    >
                        View All Services <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
