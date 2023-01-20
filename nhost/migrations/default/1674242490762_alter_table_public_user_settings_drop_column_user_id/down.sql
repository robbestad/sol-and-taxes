alter table "public"."user_settings" alter column "user_id" drop not null;
alter table "public"."user_settings" add column "user_id" uuid;
