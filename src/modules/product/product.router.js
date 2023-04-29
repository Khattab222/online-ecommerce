import { Router } from "express";
import auth from "../../middleware/auth.js";
import * as controller from "./product.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { productEndPoints } from "./product.endPoint.js";
import { validation } from "../../middleware/validation.js";
import {
  addProductSchema,
  updateProductSchema,
  wishList,
} from "./product.validation.js";
import reviewsRouter from "../reviews/reviews.router.js";
const router = Router();

router.use("/:productId/review", reviewsRouter);

router.post(
  "/",
  auth(productEndPoints.CREAT_PRODUCT),
  fileUpload({}).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 2 },
  ]),
  validation(addProductSchema),
  asyncHandler(controller.adProduct)
);

router.put(
  "/:productId",
  auth(productEndPoints.CREAT_PRODUCT),
  fileUpload({}).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 2 },
  ]),
  validation(updateProductSchema),
  asyncHandler(controller.updateProduct)
);
router.patch(
  "/:productId/wishlist",
  auth(productEndPoints.wishList),
  validation(wishList),
  asyncHandler(controller.addToWishList)
);
router.patch(
  "/:productId/wishlist",
  auth(productEndPoints.wishList),
  validation(wishList),
  asyncHandler(controller.removefromWishList)
);
router.patch(
  "/:productId/wishlist/remove",
  auth(productEndPoints.wishList),
  validation(wishList),
  asyncHandler(controller.removefromWishList)
);



router.get("/", asyncHandler(controller.productList));

export default router;
