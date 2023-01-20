BEGIN TRANSACTION;
ALTER TABLE "public"."user_settings" DROP CONSTRAINT "user_settings_pkey";

ALTER TABLE "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("wallet_address");
COMMIT TRANSACTION;
