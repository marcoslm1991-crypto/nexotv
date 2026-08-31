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
exports.StreamsController = void 0;
const common_1 = require("@nestjs/common");
const streams_service_1 = require("./streams.service");
const authorize_stream_dto_1 = require("./dto/authorize-stream.dto");
const heartbeat_stream_dto_1 = require("./dto/heartbeat-stream.dto");
const stop_stream_dto_1 = require("./dto/stop-stream.dto");
let StreamsController = class StreamsController {
    constructor(streamsService) {
        this.streamsService = streamsService;
    }
    async authorizeStream(req, dto) {
        return this.streamsService.authorizeStream(req.user.id, dto);
    }
    async heartbeat(req, dto) {
        return this.streamsService.heartbeat(req.user.id, dto);
    }
    async stopStream(req, dto) {
        return this.streamsService.stopStream(req.user.id, dto);
    }
    async getActiveStreams(req) {
        return this.streamsService.getActiveStreamsForUser(req.user.id);
    }
};
exports.StreamsController = StreamsController;
__decorate([
    (0, common_1.Post)('authorize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, authorize_stream_dto_1.AuthorizeStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "authorizeStream", null);
__decorate([
    (0, common_1.Post)('heartbeat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, heartbeat_stream_dto_1.HeartbeatStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "heartbeat", null);
__decorate([
    (0, common_1.Post)('stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, stop_stream_dto_1.StopStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "stopStream", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "getActiveStreams", null);
exports.StreamsController = StreamsController = __decorate([
    (0, common_1.Controller)('streams'),
    __metadata("design:paramtypes", [streams_service_1.StreamsService])
], StreamsController);
//# sourceMappingURL=streams.controller.js.map