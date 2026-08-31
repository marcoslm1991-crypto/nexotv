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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
const m3u_parser_service_1 = require("./m3u-parser.service");
const save_progress_dto_1 = require("./dto/save-progress.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let ContentController = class ContentController {
    constructor(contentService, m3uParserService) {
        this.contentService = contentService;
        this.m3uParserService = m3uParserService;
    }
    async saveProgress(req, dto) {
        return this.contentService.saveProgress(req.user.id, dto);
    }
    async getProgress(req, profileId, contentId) {
        return this.contentService.getProgress(req.user.id, profileId, contentId);
    }
    async getChannels() {
        return this.contentService.getChannels();
    }
    async importM3u(m3uText) {
        return this.m3uParserService.importM3uToSupabase(m3uText);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Post)('progress'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, save_progress_dto_1.SaveProgressDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "saveProgress", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('profile_id')),
    __param(2, (0, common_1.Query)('content_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getProgress", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('channels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getChannels", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('import-m3u'),
    __param(0, (0, common_1.Body)('m3u_text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "importM3u", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('content'),
    __metadata("design:paramtypes", [content_service_1.ContentService,
        m3u_parser_service_1.M3uParserService])
], ContentController);
//# sourceMappingURL=content.controller.js.map