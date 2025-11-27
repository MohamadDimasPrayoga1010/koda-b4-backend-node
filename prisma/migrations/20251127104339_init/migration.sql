/*
  Warnings:

  - You are about to drop the column `productId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `forgot_password` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_promos` table. All the data in the column will be lost.
  - You are about to drop the column `promoId` on the `product_promos` table. All the data in the column will be lost.
  - The primary key for the `product_sizes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `product_sizes` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `product_sizes` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `product_variants` table. All the data in the column will be lost.
  - The primary key for the `products_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `products_categories` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `products_categories` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profile` table. All the data in the column will be lost.
  - The primary key for the `recommended_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `recommended_products` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedId` on the `recommended_products` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `shippingId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `forgot_password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `product_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promo_id` to the `product_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `product_sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_id` to the `product_sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_id` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `products_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `products_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `recommended_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommended_id` to the `recommended_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_carts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER,
    "variant_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "carts_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "carts_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_carts" ("created_at", "id", "quantity", "updated_at") SELECT "created_at", "id", "quantity", "updated_at" FROM "carts";
DROP TABLE "carts";
ALTER TABLE "new_carts" RENAME TO "carts";
CREATE TABLE "new_forgot_password" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forgot_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_forgot_password" ("created_at", "expires_at", "id", "token") SELECT "created_at", "expires_at", "id", "token" FROM "forgot_password";
DROP TABLE "forgot_password";
ALTER TABLE "new_forgot_password" RENAME TO "forgot_password";
CREATE UNIQUE INDEX "forgot_password_user_id_key" ON "forgot_password"("user_id");
CREATE TABLE "new_product_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER,
    "image" TEXT,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product_images" ("deleted_at", "id", "image", "updated_at") SELECT "deleted_at", "id", "image", "updated_at" FROM "product_images";
DROP TABLE "product_images";
ALTER TABLE "new_product_images" RENAME TO "product_images";
CREATE TABLE "new_product_promos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "promo_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    CONSTRAINT "product_promos_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_promos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product_promos" ("id") SELECT "id" FROM "product_promos";
DROP TABLE "product_promos";
ALTER TABLE "new_product_promos" RENAME TO "product_promos";
CREATE TABLE "new_product_sizes" (
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,

    PRIMARY KEY ("product_id", "size_id"),
    CONSTRAINT "product_sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_sizes_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "product_sizes";
ALTER TABLE "new_product_sizes" RENAME TO "product_sizes";
CREATE TABLE "new_product_variants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_variants_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product_variants" ("created_at", "id", "updated_at") SELECT "created_at", "id", "updated_at" FROM "product_variants";
DROP TABLE "product_variants";
ALTER TABLE "new_product_variants" RENAME TO "product_variants";
CREATE TABLE "new_products_categories" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    PRIMARY KEY ("product_id", "category_id"),
    CONSTRAINT "products_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "products_categories";
ALTER TABLE "new_products_categories" RENAME TO "products_categories";
CREATE TABLE "new_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profile" ("address", "created_at", "id", "image", "phone", "updated_at") SELECT "address", "created_at", "id", "image", "phone", "updated_at" FROM "profile";
DROP TABLE "profile";
ALTER TABLE "new_profile" RENAME TO "profile";
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");
CREATE TABLE "new_recommended_products" (
    "product_id" INTEGER NOT NULL,
    "recommended_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("product_id", "recommended_id"),
    CONSTRAINT "recommended_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recommended_products_recommended_id_fkey" FOREIGN KEY ("recommended_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recommended_products" ("created_at") SELECT "created_at" FROM "recommended_products";
DROP TABLE "recommended_products";
ALTER TABLE "new_recommended_products" RENAME TO "recommended_products";
CREATE TABLE "new_transaction_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER,
    "size_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "subtotal" REAL NOT NULL,
    CONSTRAINT "transaction_items_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transaction_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transaction_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transaction_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transaction_items" ("id", "quantity", "subtotal") SELECT "id", "quantity", "subtotal" FROM "transaction_items";
DROP TABLE "transaction_items";
ALTER TABLE "new_transaction_items" RENAME TO "transaction_items";
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "fullname" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "payment_method_id" INTEGER NOT NULL,
    "shipping_id" INTEGER NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "shippings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("address", "created_at", "email", "fullname", "id", "invoice_number", "phone", "status", "total", "updated_at") SELECT "address", "created_at", "email", "fullname", "id", "invoice_number", "phone", "status", "total", "updated_at" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE UNIQUE INDEX "transactions_invoice_number_key" ON "transactions"("invoice_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
