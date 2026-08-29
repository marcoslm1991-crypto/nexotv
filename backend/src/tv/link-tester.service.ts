import { Injectable, Logger } from '@nestjs/common';
import * as dns from 'dns';
import { StreamFormat, StreamStatus, StreamTestResultDto } from '../common/types';

@Injectable()
export class LinkTesterService {
  private readonly logger = new Logger(LinkTesterService.name);

  // Private / Internal IP subnets to block for SSRF prevention
  private isPrivateIp(ip: string): boolean {
    if (!ip) return true;

    // IPv6 loopback / local
    if (ip === '::1' || ip === '::' || ip.startsWith('fe80:')) return true;

    // Standard IPv4 checks
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p))) return false;

    const [a, b] = parts;
    if (a === 127) return true; // 127.0.0.0/8 Loopback
    if (a === 10) return true; // 10.0.0.0/8 Private
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 Private
    if (a === 192 && b === 168) return true; // 192.168.0.0/16 Private
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 Link-local
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT

    return false;
  }

  /**
   * Safe URL validation preventing SSRF attacks
   */
  async validateAndFilterUrl(urlStr: string): Promise<{ valid: boolean; reason?: string; parsedUrl?: URL }> {
    try {
      const parsedUrl = new URL(urlStr);

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return { valid: false, reason: 'Protocolo no permitido. Debe ser http:// o https://' };
      }

      const hostname = parsedUrl.hostname.toLowerCase();

      if (hostname === 'localhost' || hostname === 'loopback' || hostname === '0.0.0.0') {
        return { valid: false, reason: 'Acceso restringido a nombres de host locales o privados.' };
      }

      // Check if hostname is directly an IP
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        if (this.isPrivateIp(hostname)) {
          return { valid: false, reason: 'Acceso denegado: La IP ingresada pertenece a una red privada o reservada (SSRF Protection).' };
        }
      } else {
        // DNS Lookup to prevent DNS Rebinding / hidden local IP resolution
        try {
          const lookup = await dns.promises.lookup(hostname);
          if (lookup?.address && this.isPrivateIp(lookup.address)) {
            return { valid: false, reason: `Acceso denegado: El dominio resuelve a una IP interna (${lookup.address}).` };
          }
        } catch (dnsErr) {
          return { valid: false, reason: `Error al resolver el nombre de dominio (${hostname}).` };
        }
      }

      return { valid: true, parsedUrl };
    } catch (err: any) {
      return { valid: false, reason: 'URL malformada o inválida.' };
    }
  }

  /**
   * Detect stream format from extension or Content-Type header
   */
  detectFormat(urlStr: string, contentType?: string | null): StreamFormat {
    const lowerUrl = urlStr.toLowerCase();
    const lowerType = (contentType || '').toLowerCase();

    if (lowerUrl.includes('.m3u8') || lowerType.includes('mpegurl') || lowerType.includes('x-mpegurl')) {
      return 'HLS';
    }
    if (lowerUrl.includes('.mpd') || lowerType.includes('dash+xml')) {
      return 'DASH';
    }
    if (lowerUrl.endsWith('.mp4') || lowerType.includes('video/mp4')) {
      return 'MP4';
    }
    if (lowerUrl.endsWith('.webm') || lowerType.includes('video/webm')) {
      return 'WEBM';
    }
    return 'CUSTOM';
  }

  /**
   * Execute technical link test
   */
  async testLink(urlStr: string, preferredFormat?: StreamFormat): Promise<StreamTestResultDto> {
    const startTime = Date.now();

    // 1. SSRF and URL validation
    const filterResult = await this.validateAndFilterUrl(urlStr);
    if (!filterResult.valid) {
      return {
        url: urlStr,
        is_working: false,
        http_code: 400,
        response_time_ms: Date.now() - startTime,
        format: preferredFormat || 'CUSTOM',
        status: 'UNAVAILABLE',
        checked_at: new Date().toISOString(),
        error_message: filterResult.reason || 'URL no permitida por políticas de seguridad.',
      };
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000); // 5 seconds timeout

    try {
      // Try HEAD request first for fast verification
      let response: Response;
      try {
        response = await fetch(urlStr, {
          method: 'HEAD',
          signal: abortController.signal,
          headers: {
            'User-Agent': 'NexoTV-StreamCheck/1.0',
          },
        });
      } catch {
        // Fallback to GET with partial range
        response = await fetch(urlStr, {
          method: 'GET',
          signal: abortController.signal,
          headers: {
            'User-Agent': 'NexoTV-StreamCheck/1.0',
            Range: 'bytes=0-1024',
          },
        });
      }

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const contentType = response.headers.get('content-type');
      const detectedFormat = preferredFormat || this.detectFormat(urlStr, contentType);
      const isWorking = response.status >= 200 && response.status < 400;

      let status: StreamStatus = 'WORKING';
      if (!isWorking) {
        status = response.status === 404 ? 'UNAVAILABLE' : 'ERROR';
      }

      return {
        url: urlStr,
        is_working: isWorking,
        http_code: response.status,
        response_time_ms: responseTime,
        format: detectedFormat,
        status: status,
        checked_at: new Date().toISOString(),
        error_message: isWorking ? undefined : `El servidor respondió con código HTTP ${response.status} ${response.statusText}`,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const isTimeout = error.name === 'AbortError';
      const errMsg = isTimeout ? 'Tiempo de espera agotado (Timeout > 5s).' : (error.message || 'Error de conexión.');

      return {
        url: urlStr,
        is_working: false,
        http_code: isTimeout ? 408 : 503,
        response_time_ms: responseTime,
        format: preferredFormat || this.detectFormat(urlStr),
        status: 'ERROR',
        checked_at: new Date().toISOString(),
        error_message: errMsg,
      };
    }
  }
}
