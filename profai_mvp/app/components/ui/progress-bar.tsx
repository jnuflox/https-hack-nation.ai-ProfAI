'use client';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  progress, 
  className = "", 
  color = 'blue',
  size = 'md' 
}: Readonly<ProgressBarProps>) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}
