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
exports.VodController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const vod_service_1 = require("./vod.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const vod_dto_1 = require("./dto/vod.dto");
const tv_dto_1 = require("../tv/dto/tv.dto");
let VodController = class VodController {
    constructor(vodService) {
        this.vodService = vodService;
    }
    async getMoviesFeed() {
        return this.vodService.getMoviesFeed();
    }
    async getSeriesFeed() {
        return this.vodService.getSeriesFeed();
    }
    async getFullStats() {
        return this.vodService.getFullStats();
    }
    async getMovies(search, categoryId, genre, year, isActive, hasErrors, noSources) {
        return this.vodService.getMovies({
            search,
            categoryId,
            genre,
            year: year ? parseInt(year, 10) : undefined,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            hasErrors: hasErrors === 'true',
            noSources: noSources === 'true',
        });
    }
    async createMovie(dto) {
        return this.vodService.createMovie(dto);
    }
    async updateMovie(id, dto) {
        return this.vodService.updateMovie(id, dto);
    }
    async deleteMovie(id) {
        return this.vodService.deleteMovie(id);
    }
    async addMovieSource(req, dto) {
        return this.vodService.addMovieSource(dto, req.user?.id);
    }
    async updateMovieSource(id, dto) {
        return this.vodService.updateMovieSource(id, dto);
    }
    async deleteMovieSource(id) {
        return this.vodService.deleteMovieSource(id);
    }
    async testMovieSource(dto) {
        return this.vodService.testMovieSource(dto.source_id || '', dto.url, dto.format);
    }
    async getSeries(search, categoryId, genre, isActive, noEpisodes) {
        return this.vodService.getSeries({
            search,
            categoryId,
            genre,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            noEpisodes: noEpisodes === 'true',
        });
    }
    async createSeries(dto) {
        return this.vodService.createSeries(dto);
    }
    async updateSeries(id, dto) {
        return this.vodService.updateSeries(id, dto);
    }
    async deleteSeries(id) {
        return this.vodService.deleteSeries(id);
    }
    async addSeason(dto) {
        return this.vodService.addSeason(dto);
    }
    async updateSeason(id, dto) {
        return this.vodService.updateSeason(id, dto);
    }
    async deleteSeason(id) {
        return this.vodService.deleteSeason(id);
    }
    async addEpisode(dto) {
        return this.vodService.addEpisode(dto);
    }
    async updateEpisode(id, dto) {
        return this.vodService.updateEpisode(id, dto);
    }
    async deleteEpisode(id) {
        return this.vodService.deleteEpisode(id);
    }
    async addEpisodeSource(req, dto) {
        return this.vodService.addEpisodeSource(dto, req.user?.id);
    }
    async updateEpisodeSource(id, dto) {
        return this.vodService.updateEpisodeSource(id, dto);
    }
    async deleteEpisodeSource(id) {
        return this.vodService.deleteEpisodeSource(id);
    }
    async testEpisodeSource(dto) {
        return this.vodService.testEpisodeSource(dto.source_id || '', dto.url, dto.format);
    }
};
exports.VodController = VodController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('movies/feed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VodController.prototype, "getMoviesFeed", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('series/feed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VodController.prototype, "getSeriesFeed", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VodController.prototype, "getFullStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/movies'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category_id')),
    __param(2, (0, common_1.Query)('genre')),
    __param(3, (0, common_1.Query)('year')),
    __param(4, (0, common_1.Query)('is_active')),
    __param(5, (0, common_1.Query)('has_errors')),
    __param(6, (0, common_1.Query)('no_sources')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "getMovies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/movies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vod_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "createMovie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/movies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateMovieDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateMovie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/movies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteMovie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/movies/sources'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vod_dto_1.CreateMovieSourceDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "addMovieSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/movies/sources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateMovieSourceDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateMovieSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/movies/sources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteMovieSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/movies/sources/test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.TestLinkDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "testMovieSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/series'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category_id')),
    __param(2, (0, common_1.Query)('genre')),
    __param(3, (0, common_1.Query)('is_active')),
    __param(4, (0, common_1.Query)('no_episodes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "getSeries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/series'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vod_dto_1.CreateSeriesDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "createSeries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/series/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateSeriesDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateSeries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/series/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteSeries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/seasons'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vod_dto_1.CreateSeasonDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "addSeason", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/seasons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateSeasonDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateSeason", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/seasons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteSeason", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/episodes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vod_dto_1.CreateEpisodeDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "addEpisode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/episodes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateEpisodeDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateEpisode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/episodes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteEpisode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/episodes/sources'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vod_dto_1.CreateEpisodeSourceDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "addEpisodeSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Put)('admin/episodes/sources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vod_dto_1.UpdateEpisodeSourceDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "updateEpisodeSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)('admin/episodes/sources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "deleteEpisodeSource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('admin/episodes/sources/test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tv_dto_1.TestLinkDto]),
    __metadata("design:returntype", Promise)
], VodController.prototype, "testEpisodeSource", null);
exports.VodController = VodController = __decorate([
    (0, common_1.Controller)('vod'),
    __metadata("design:paramtypes", [vod_service_1.VodService])
], VodController);
//# sourceMappingURL=vod.controller.js.map