'use client';

import { motion } from 'framer-motion';
import { useSanity, queries } from '@/hooks/useSanity';
import { ServiceSkeleton } from '@/components/ui/Skeleton';
import { Clock, Check } from 'lucide-react';
import type { Service } from '@/types/sanity.types';
import { cn } from '@/lib/utils';

export function Services() {
  const { data: services, loading, error } = useSanity<Service[]>({
    query: queries.services,
  });

  if (loading) return <ServiceSkeleton />;
  
  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Failed to load services</p>
      </div>
    );
  }

  const beauticianServices = services?.filter(s => s.serviceType === 'beautician');
  const trainingServices = services?.filter(s => s.serviceType === 'training');

  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-6xl text-white mb-6">
            Services
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Curated experiences designed to transform and elevate
          </p>
        </motion.div>

        {/* Beautician Services */}
        {beauticianServices && beauticianServices.length > 0 && (
          <div className="mb-20">
            <h3 className="font-display text-3xl text-beautician-primary mb-8 text-center">
              Beautician Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beauticianServices.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} theme="beautician" />
              ))}
            </div>
          </div>
        )}

        {/* Training Services */}
        {trainingServices && trainingServices.length > 0 && (
          <div>
            <h3 className="font-display text-3xl text-barista-accent mb-8 text-center">
              Training Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingServices.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} theme="barista" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ 
  service, 
  index, 
  theme 
}: { 
  service: Service; 
  index: number; 
  theme: 'beautician' | 'barista';
}) {
  const isBeautician = theme === 'beautician';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02]',
        isBeautician 
          ? 'bg-[#1A1512]/50 border-[#C9A87C]/20 hover:border-[#C9A87C]/50' 
          : 'bg-[#2C1810]/50 border-[#D7A86E]/20 hover:border-[#D7A86E]/50'
      )}
    >
      {service.featured && (
        <span className={cn(
          'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
          isBeautician ? 'bg-[#C9A87C] text-[#1A1512]' : 'bg-[#D7A86E] text-[#2C1810]'
        )}>
          Featured
        </span>
      )}

      <div className="mb-6">
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
          isBeautician ? 'bg-[#C9A87C]/20' : 'bg-[#D7A86E]/20'
        )}>
          <span className="text-2xl">{service.icon || (isBeautician ? '✨' : '☕')}</span>
        </div>
        <h4 className="font-display text-2xl text-white mb-2">{service.title}</h4>
        <p className="text-white/60 text-sm leading-relaxed">{service.shortDescription}</p>
      </div>

      {service.duration && (
        <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>{service.duration}</span>
        </div>
      )}

      {service.pricing && (
        <div className="mb-6">
          <span className={cn(
            'text-2xl font-bold',
            isBeautician ? 'text-[#C9A87C]' : 'text-[#D7A86E]'
          )}>
            {service.pricing.displayText}
          </span>
        </div>
      )}

      {service.features && service.features.length > 0 && (
        <ul className="space-y-2 mb-8">
          {service.features.slice(0, 4).map((feature: {feature: string}, i: number) => (
            <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
              <Check className={cn(
                'w-4 h-4 shrink-0 mt-0.5',
                isBeautician ? 'text-[#C9A87C]' : 'text-[#D7A86E]'
              )} />
              <span>{feature.feature}</span>
            </li>
          ))}
        </ul>
      )}

      <button className={cn(
        'w-full py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300',
        isBeautician 
          ? 'bg-[#C9A87C] text-[#1A1512] hover:bg-white' 
          : 'bg-[#D7A86E] text-[#2C1810] hover:bg-white'
      )}>
        {service.ctaText || 'Book Now'}
      </button>
    </motion.div>
  );
}