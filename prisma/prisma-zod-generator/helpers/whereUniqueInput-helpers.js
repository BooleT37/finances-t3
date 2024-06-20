"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeOptionalToRequiredFields = void 0;
function changeOptionalToRequiredFields(inputObjectTypes) {
    inputObjectTypes.map((item) => {
        var _a;
        if (item.name.includes('WhereUniqueInput') &&
            ((_a = item.constraints.fields) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            item.fields = item.fields.map((subItem) => {
                var _a;
                if ((_a = item.constraints.fields) === null || _a === void 0 ? void 0 : _a.includes(subItem.name)) {
                    subItem.isRequired = true;
                    return subItem;
                }
                return subItem;
            });
        }
        return item;
    });
}
exports.changeOptionalToRequiredFields = changeOptionalToRequiredFields;
//# sourceMappingURL=whereUniqueInput-helpers.js.map