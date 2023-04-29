import { systemRoles } from "../../utils/systemRoles.js";

export const CategoryEndPoints = {
    CREAT_CATEGORY:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
    UPDATE_CATEGORY:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
}