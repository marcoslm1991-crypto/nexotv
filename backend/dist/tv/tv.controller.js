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
exports.TvController = void 0;
const common_1 = require("@nestjs/common");
const tv_service_1 = require("./tv.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const tv_dto_1 = require("./dto/tv.dto");
let TvController = class TvController {
    constructor(tvService) {
        this.tvService = tvService;
    }
    async getLiveFeed() {
        return this.tvService.getLiveFeed();
    }
    async getStats() {
        return this.tvService.getStats();
    }
    async getCategories() {
        return this.tvService.getCategories();
    }
    async createCategory(dto) {
        return this.tvService.createCategory(dto);
    }
    async updateCategory(id, dto) {
        return this.tvService.updateCategory(id, dto);
    }
    async deleteCategory(id) {
        return this.tvService.deleteCategory(id);
    }
    async getChannels(search, categoryId, isActive, format, hasErrors, noSources) {
        return this.tvService.getChannels({
            search,
            categoryId,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            format,
            hasErrors: hasErrors === 'true',
            noSources: noSources === 'true',
        });
    }
    async createChannel(dto) {
        return this.tvService.createChannel(dto);
    }
    async updateChannel(id, dto) {
        return this.tvService.updateChannel(id, dto);
    }
    async deleteChannel(id) {
        return this.tvService.deleteChannel(id);
    }
    async addSource(req, dto) {
        return this.tvService.addSource(dto, req.user?.id);
    }
    async updateSource(dto, id) {
        return this.tvService.updateSource(id, dto);
    }
    async deleteSource(id) {
        return this.tvService.deleteSource(id);
    }
    async quickSwitchSource(req, dto) {
        return this.tvService.quickSwitchSource(dto, req.user?.id);
    }
    async testLink(dto) {
        return this.tvService.testLink(dto);
    }
};
exports.TvController = TvController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TvController.prototype, "getLiveFeed", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TvController.prototype, "getStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TvController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "createCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)('admin/categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tv_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "updateCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('admin/categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "deleteCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin/channels'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category_id')),
    __param(2, (0, common_1.Query)('is_active')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Query)('has_errors')),
    __param(5, (0, common_1.Query)('no_sources')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "getChannels", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/channels'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "createChannel", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)('admin/channels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tv_dto_1.UpdateChannelDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "updateChannel", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('admin/channels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "deleteChannel", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/sources'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tv_dto_1.CreateChannelSourceDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "addSource", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)('admin/sources/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.UpdateChannelSourceDto, String]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "updateSource", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('admin/sources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "deleteSource", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/sources/quick-switch'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tv_dto_1.QuickSwitchSourceDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "quickSwitchSource", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/sources/test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.TestLinkDto]),
    __metadata("design:returntype", Promise)
], TvController.prototype, "testLink", null);
exports.TvController = TvController = __decorate([
    (0, common_1.Controller)('tv'),
    __metadata("design:paramtypes", [tv_service_1.TvService])
], TvController);
//# sourceMappingURL=tv.controller.js.map