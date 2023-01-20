alter table "public"."transaction" drop constraint "transaction_pkey";
alter table "public"."transaction"
    add constraint "transaction_pkey"
    primary key ("user_id", "signature");
