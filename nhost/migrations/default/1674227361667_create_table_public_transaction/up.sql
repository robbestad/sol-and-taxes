CREATE TABLE "public"."transaction" ("user_id" uuid NOT NULL, "signature" text NOT NULL, "description" text NOT NULL, "type" text NOT NULL, "source" text NOT NULL, "fee" bigint NOT NULL, "fee_payer" text NOT NULL, "slot" bigint NOT NULL, "timestamp" bigint NOT NULL, "native_transfers" jsonb NOT NULL, "token_transfers" jsonb NOT NULL, "account_data" jsonb NOT NULL, "transaction_error" jsonb NOT NULL, "instructions" jsonb NOT NULL, "events" jsonb NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id","signature") , FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_transaction_updated_at"
BEFORE UPDATE ON "public"."transaction"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_transaction_updated_at" ON "public"."transaction" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
