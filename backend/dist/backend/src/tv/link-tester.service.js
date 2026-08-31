"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LinkTesterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkTesterService = void 0;
const common_1 = require("@nestjs/common");
const dns = require("dns");
let LinkTesterService = LinkTesterService_1 = class LinkTesterService {
    constructor() {
        this.logger = new common_1.Logger(LinkTesterService_1.name);
    }
    isPrivateIp(ip) {
        if (!ip)
            return true;
        if (ip === '::1' || ip === '::' || ip.startsWith('fe80:'))
            return true;
        const parts = ip.split('.').map((p) => parseInt(p, 10));
        if (parts.length !== 4 || parts.some((p) => isNaN(p)))
            return false;
        const [a, b] = parts;
        if (a === 127)
            return true;
        if (a === 10)
            return true;
        if (a === 172 && b >= 16 && b <= 31)
            return true;
        if (a === 192 && b === 168)
            return true;
        if (a === 169 && b === 254)
            return true;
        if (a === 0)
            return true;
        if (a === 100 && b >= 64 && b <= 127)
            return true;
        return false;
    }
    async validateAndFilterUrl(urlStr) {
        try {
            const parsedUrl = new URL(urlStr);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                return { valid: false, reason: 'Protocolo no permitido. Debe ser http:// o https://' };
            }
            const hostname = parsedUrl.hostname.toLowerCase();
            if (hostname === 'localhost' || hostname === 'loopback' || hostname === '0.0.0.0') {
                return { valid: false, reason: 'Acceso restringido a nombres de host locales o privados.' };
            }
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                if (this.isPrivateIp(hostname)) {
                    return { valid: false, reason: 'Acceso denegado: La IP ingresada pertenece a una red privada o reservada (SSRF Protection).' };
                }
            }
            else {
                try {
                    const lookup = await dns.promises.lookup(hostname);
                    if (lookup?.address && this.isPrivateIp(lookup.address)) {
                        return { valid: false, reason: `Acceso denegado: El dominio resuelve a una IP interna (${lookup.address}).` };
                    }
                }
                catch (dnsErr) {
                    return { valid: false, reason: `Error al resolver el nombre de dominio (${hostname}).` };
                }
            }
            return { valid: true, parsedUrl };
        }
        catch (err) {
            return { valid: false, reason: 'URL malformada o inválida.' };
        }
    }
    detectFormat(urlStr, contentType) {
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
    async testLink(urlStr, preferredFormat) {
        const startTime = Date.now();
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
        const timeoutId = setTimeout(() => abortController.abort(), 5000);
        try {
            let response;
            try {
                response = await fetch(urlStr, {
                    method: 'HEAD',
                    signal: abortController.signal,
                    headers: {
                        'User-Agent': 'NexoTV-StreamCheck/1.0',
                    },
                });
            }
            catch {
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
            let status = 'WORKING';
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
        }
        catch (error) {
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
};
exports.LinkTesterService = LinkTesterService;
exports.LinkTesterService = LinkTesterService = LinkTesterService_1 = __decorate([
    (0, common_1.Injectable)()
], LinkTesterService);
//# sourceMappingURL=link-tester.service.js.map