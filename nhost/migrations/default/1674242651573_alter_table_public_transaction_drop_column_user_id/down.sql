alter table "public"."transaction" alter column "user_id" drop not null;
alter table "public"."transaction" add column "user_id" uuid;
