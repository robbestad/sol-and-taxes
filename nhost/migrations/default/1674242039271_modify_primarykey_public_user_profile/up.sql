BEGIN TRANSACTION;
ALTER TABLE "public"."user_profile" DROP CONSTRAINT "user_profile_pkey";

ALTER TABLE "public"."user_profile"
    ADD CONSTRAINT "user_profile_pkey" PRIMARY KEY ("wallet_address");
COMMIT TRANSACTION;
