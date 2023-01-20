alter table "public"."user_profile" alter column "user_id" drop not null;
alter table "public"."user_profile" add column "user_id" uuid;
