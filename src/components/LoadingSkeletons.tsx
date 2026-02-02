import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-muted/60',
      className
    )}
  />
);

export const CardSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn('rounded-lg border border-border/50 bg-card p-6 shadow-card', className)}>
    <div className="space-y-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  </div>
);

export const ImageSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn('rounded-lg overflow-hidden', className)}>
    <Skeleton className="aspect-square w-full" />
  </div>
);

export const TextSkeleton = ({ lines = 3, className }: SkeletonProps & { lines?: number }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )} 
      />
    ))}
  </div>
);

export const StatSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn('text-center space-y-2 p-4', className)}>
    <Skeleton className="h-10 w-20 mx-auto" />
    <Skeleton className="h-4 w-16 mx-auto" />
  </div>
);

export const AvatarSkeleton = ({ size = 'md', className }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />;
};

export const ButtonSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={cn('h-10 w-24 rounded-md', className)} />
);

export const BadgeSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={cn('h-6 w-16 rounded-full', className)} />
);

export const TableRowSkeleton = ({ columns = 4, className }: SkeletonProps & { columns?: number }) => (
  <div className={cn('flex items-center gap-4 p-4 border-b border-border/50', className)}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="h-4 flex-1" />
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <BadgeSkeleton />
        <ButtonSkeleton />
      </div>
    </div>
    
    {/* Stats row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
    
    {/* Main content */}
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
);

export const FeatureGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
