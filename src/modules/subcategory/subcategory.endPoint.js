import { systemRoles } from "../../utils/systemRoles.js";


export const subCategoryEndPoints = {
    CREAT_SUB_CATEGORY:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
    UPDATE_SUB_CATEGORY:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
}