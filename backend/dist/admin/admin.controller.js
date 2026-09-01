"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const throttler_1 = require("@nestjs/throttler");
const path_1 = require("path");
const fs = require("fs");
let AdminController = class AdminController {
    getAdminRootNoSlash(req, res) {
        if (!req.originalUrl.endsWith('/')) {
            return res.redirect('/admin/');
        }
        return this.serveFile('index.html', res);
    }
    getAdminAsset(req, res) {
        let relPath = req.params[0] || '';
        if (!relPath || relPath === '') {
            relPath = 'index.html';
        }
        return this.serveFile(relPath, res);
    }
    serveFile(relPath, res) {
        const possiblePaths = [
            (0, path_1.join)(__dirname, '..', 'admin_public'),
            (0, path_1.join)(__dirname, '..', '..', 'admin_public'),
            (0, path_1.join)(__dirname, '..', '..', 'dist', 'admin_public'),
            (0, path_1.join)(process.cwd(), 'backend', 'admin_public'),
            (0, path_1.join)(process.cwd(), 'apps', 'admin-panel', 'dist'),
        ];
        let adminDistPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p) && fs.existsSync((0, path_1.join)(p, 'index.html'))) {
                adminDistPath = p;
                break;
            }
        }
        if (!adminDistPath) {
            return res.status(404).send('Admin panel dist not found on server.');
        }
        const filePath = (0, path_1.join)(adminDistPath, relPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }
        else {
            return res.sendFile((0, path_1.join)(adminDistPath, 'index.html'));
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAdminRootNoSlash", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin/*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAdminAsset", null);
exports.AdminController = AdminController = __decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Controller)()
], AdminController);
//# sourceMappingURL=admin.controller.js.map