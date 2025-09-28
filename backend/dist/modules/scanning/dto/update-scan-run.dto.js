"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScanRunDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_scan_run_dto_1 = require("./create-scan-run.dto");
class UpdateScanRunDto extends (0, swagger_1.PartialType)(create_scan_run_dto_1.CreateScanRunDto) {
}
exports.UpdateScanRunDto = UpdateScanRunDto;
//# sourceMappingURL=update-scan-run.dto.js.map