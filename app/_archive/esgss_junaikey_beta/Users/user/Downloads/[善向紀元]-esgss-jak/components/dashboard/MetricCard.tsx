// 指標卡片組件
import React, { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  CheckCircle, Clock, Target, Zap
} from 'lucide-react';
import { MetricData, FORMAT_OPTIONS } from './types';

interface MetricCardProps {
  data: MetricData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showTrend?: boolean;
  showTarget?: boolean;
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  data,
  size = 'md',
  variant = 'default',
  showTrend = true,
  showTarget = false,
  showProgress = false,
  animated = true,
  className = '',
  onClick
}) => {
  const formattedValue = useMemo(() => {
    if (!data.value) return 'N/A';

    const formatKey = (data.format || 'number') as keyof typeof FORMAT_OPTIONS;
    const options = formatKey in FORMAT_OPTIONS ? FORMAT_OPTIONS[formatKey] : undefined;
    if (!options) return String(data.value);

    switch (data.format) {
      case 'currency': {
        const options = FORMAT_OPTIONS.currency;
        return new Intl.NumberFormat(options.locale, {
          style: options.style,
          currency: options.currency,
          minimumFractionDigits: data.precision || options.minimumFractionDigits,
          maximumFractionDigits: data.precision || options.maximumFractionDigits
        }).format(Number(data.value));
      }

      case 'percentage': {
        const options = FORMAT_OPTIONS.percentage;
        return new Intl.NumberFormat(options.locale, {
          style: options.style,
          minimumFractionDigits: data.precision || options.minimumFractionDigits,
          maximumFractionDigits: data.precision || options.maximumFractionDigits
        }).format(Number(data.value) / 100);
      }

      case 'number':
      default: {
        const options = FORMAT_OPTIONS.number;
        return new Intl.NumberFormat(options.locale, {
          minimumFractionDigits: data.precision || options.minimumFractionDigits,
          maximumFractionDigits: data.precision || options.maximumFractionDigits
        }).format(Number(data.value));
      }
    }
  }, [data.value, data.format, data.precision]);

  const trendIcon = useMemo(() => {
    if (!showTrend || !data.trend) return null;

    const iconProps = {
      className: `w-4 h-4 ${animated ? 'transition-all duration-300' : ''}`
    };

    switch (data.trend) {
      case 'up':
        return <TrendingUp {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'down':
        return <TrendingDown {...iconProps} className={`${iconProps.className} text-red-600`} />;
      case 'stable':
        return <Minus {...iconProps} className={`${iconProps.className} text-gray-500`} />;
      default:
        return null;
    }
  }, [data.trend, showTrend, animated]);

  const trendColor = useMemo(() => {
    if (!data.trend) return 'text-gray-600';

    switch (data.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  }, [data.trend]);

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    compact: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    featured: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-lg',
    minimal: 'bg-transparent border-0 shadow-none'
  };

  const progressPercentage = useMemo(() => {
    if (!showProgress || !data.previousValue) return 0;
    const current = Number(data.value);
    const previous = Number(data.previousValue);
    if (previous === 0) return 100;
    return Math.min(100, Math.max(0, (current / previous) * 100));
  }, [data.value, data.previousValue, showProgress]);

  const getStatusIcon = () => {
    if (!data.metadata?.status) return null;

    switch (data.metadata.status) {
      case 'good':
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const renderCompactVariant = () => (
    <div className={`
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${animated ? 'transition-all duration-200 hover:shadow-md' : ''}
      ${onClick ? 'cursor-pointer hover:scale-105' : ''}
      ${className}
      rounded-lg
    `} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data.icon && (
            <div className="p-1 rounded bg-gray-100 dark:bg-gray-700">
              <span className="text-lg">{data.icon}</span>
            </div>
          )}
          <div>
            <div className={`font-medium text-gray-900 dark:text-white ${titleSizeClasses[size]}`}>
              {data.label}
            </div>
            <div className={`font-bold text-gray-900 dark:text-white ${valueSizeClasses[size]}`}>
              {formattedValue}
              {data.unit && <span className="text-sm ml-1 text-gray-500">{data.unit}</span>}
            </div>
          </div>
        </div>

        {showTrend && trendIcon && (
          <div className="flex items-center gap-1">
            {trendIcon}
            {data.changePercent !== undefined && (
              <span className={`text-sm font-medium ${trendColor}`}>
                {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDefaultVariant = () => (
    <div className={`
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${animated ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
      rounded-xl
    `} onClick={onClick}>
      {/* 卡片標題 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {data.icon && (
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <span className="text-xl">{data.icon}</span>
            </div>
          )}
          <div>
            <h3 className={`font-semibold text-gray-900 dark:text-white ${titleSizeClasses[size]}`}>
              {data.label}
            </h3>
            {data.subValue && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.subValue}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {showTrend && trendIcon && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${data.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              data.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
              {trendIcon}
              {data.changePercent !== undefined && (
                <span>{data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 主要數值 */}
      <div className="mb-4">
        <div className={`font-bold text-gray-900 dark:text-white ${valueSizeClasses[size]}`}>
          {formattedValue}
          {data.unit && <span className="text-lg ml-1 text-gray-500">{data.unit}</span>}
        </div>

        {data.previousValue && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            上期: {typeof data.previousValue === 'number' ?
              new Intl.NumberFormat('zh-TW').format(data.previousValue) :
              data.previousValue}
          </div>
        )}
      </div>

      {/* 進度條 */}
      {showProgress && progressPercentage > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>進度</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${progressPercentage >= 100 ? 'bg-green-600' :
                progressPercentage >= 75 ? 'bg-blue-600' :
                  progressPercentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* 目標比較 */}
      {showTarget && data.metadata?.target && (
        <div className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            目標: {typeof data.metadata.target === 'number' ?
              new Intl.NumberFormat('zh-TW').format(data.metadata.target) :
              data.metadata.target}
          </span>
          <span className={`font-medium ${Number(data.value) >= Number(data.metadata.target) ?
            'text-green-600' : 'text-red-600'
            }`}>
            ({Number(data.value) >= Number(data.metadata.target) ? '已達成' : '未達成'})
          </span>
        </div>
      )}

      {/* 其他元數據 */}
      {data.metadata && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            {data.metadata.lastUpdated && (
              <div>
                更新時間: {new Date(data.metadata.lastUpdated).toLocaleString('zh-TW')}
              </div>
            )}
            {data.metadata.dataSource && (
              <div>
                數據來源: {data.metadata.dataSource}
              </div>
            )}
            {data.metadata.confidence && (
              <div>
                置信度: {(data.metadata.confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderFeaturedVariant = () => (
    <div className={`
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${animated ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-2' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
      rounded-2xl relative overflow-hidden
    `} onClick={onClick}>
      {/* 背景漸層動畫 */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse" />
      )}

      <div className="relative z-10">
        {/* 主要數值 */}
        <div className="text-center mb-6">
          <div className={`font-bold text-white ${valueSizeClasses[size]} mb-2`}>
            {formattedValue}
            {data.unit && <span className="text-lg ml-1 opacity-80">{data.unit}</span>}
          </div>

          <h3 className={`font-semibold text-white/90 ${titleSizeClasses[size]} mb-1`}>
            {data.label}
          </h3>

          {data.subValue && (
            <p className="text-white/70 text-sm">
              {data.subValue}
            </p>
          )}
        </div>

        {/* 趨勢指示器 */}
        {showTrend && trendIcon && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm ${trendColor}`}>
              {trendIcon}
              {data.changePercent !== undefined && (
                <span className="text-sm font-medium">
                  {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* 狀態指示器 */}
        <div className="flex items-center justify-center gap-4 text-white/80">
          {getStatusIcon()}
          {data.metadata?.performance && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm">{data.metadata.performance}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalVariant = () => (
    <div className={`
      ${variantClasses[variant]}
      ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
      ${className}
      p-3 rounded-lg
    `} onClick={onClick}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {data.label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formattedValue}
          </span>
          {trendIcon}
        </div>
      </div>
    </div>
  );

  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'featured':
      return renderFeaturedVariant();
    case 'minimal':
      return renderMinimalVariant();
    case 'default':
    default:
      return renderDefaultVariant();
  }
};