"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VodModule = void 0;
const common_1 = require("@nestjs/common");
const vod_controller_1 = require("./vod.controller");
const vod_service_1 = require("./vod.service");
const tv_module_1 = require("../tv/tv.module");
let VodModule = class VodModule {
};
exports.VodModule = VodModule;
exports.VodModule = VodModule = __decorate([
    (0, common_1.Module)({
        imports: [tv_module_1.TvModule],
        controllers: [vod_controller_1.VodController],
        providers: [vod_service_1.VodService],
        exports: [vod_service_1.VodService],
    })
], VodModule);
//# sourceMappingURL=vod.module.js.map