export interface TelemetryMetric {
  id: string;
  type: 'wallet_connect' | 'contract_invocation' | 'error' | 'page_view';
  name: string;
  details?: Record<string, unknown>;
  timestamp: number;
  walletAddress?: string;
  latencyMs?: number;
}

class MonitoringService {
  private metrics: TelemetryMetric[] = [];
  private readonly maxLogs = 500;

  /**
   * Track user wallet interaction or contract invocation
   */
  public trackMetric(metric: Omit<TelemetryMetric, 'id' | 'timestamp'>): void {
    const entry: TelemetryMetric = {
      ...metric,
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
    };

    this.metrics.unshift(entry);
    if (this.metrics.length > this.maxLogs) {
      this.metrics.pop();
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('app_telemetry_logs', JSON.stringify(this.metrics.slice(0, 50)));
      } catch {
        // Ignore storage errors
      }
    }
  }

  /**
   * Get aggregated telemetry stats
   */
  public getStats() {
    const totalCalls = this.metrics.filter((m) => m.type === 'contract_invocation').length;
    const walletConnects = this.metrics.filter((m) => m.type === 'wallet_connect').length;
    const errors = this.metrics.filter((m) => m.type === 'error').length;
    const avgLatency =
      this.metrics.reduce((acc, m) => acc + (m.latencyMs || 0), 0) / (this.metrics.length || 1);

    return {
      totalCalls,
      walletConnects,
      errors,
      avgLatencyMs: Math.round(avgLatency),
      successRate: totalCalls > 0 ? (((totalCalls - errors) / totalCalls) * 100).toFixed(1) + '%' : '100%',
    };
  }

  public getRecentLogs(): TelemetryMetric[] {
    return this.metrics.slice(0, 20);
  }
}

export const monitoring = new MonitoringService();
