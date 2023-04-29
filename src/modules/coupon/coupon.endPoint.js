import { systemRoles } from "../../utils/systemRoles.js";





export const couponEndPoints = {
    CREAT_COUPON:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
    UPDATE_COUPON:[systemRoles.ADMIN,systemRoles.SUBER_ADMIN],
}