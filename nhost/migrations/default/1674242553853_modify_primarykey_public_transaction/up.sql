BEGIN TRANSACTION;
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_pkey";

ALTER TABLE "public"."transaction"
    ADD CONSTRAINT "transaction_pkey" PRIMARY KEY ("wallet_address", "signature");
COMMIT TRANSACTION;
