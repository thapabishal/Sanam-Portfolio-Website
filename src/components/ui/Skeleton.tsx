import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-white/10 rounded-lg',
            className
          )}
        />
      ))}
    </>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="aspect-[4/5]" count={6} />
    </div>
  );
}

export function ServiceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-8 rounded-2xl bg-white/5">
          <Skeleton className="h-4 w-full mb-4" count={3} />
          <div className="flex items-center gap-4 mt-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-6">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="flex-1 pt-2">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}