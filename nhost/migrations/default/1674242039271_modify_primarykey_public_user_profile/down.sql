alter table "public"."user_profile" drop constraint "user_profile_pkey";
alter table "public"."user_profile"
    add constraint "user_profile_pkey"
    primary key ("user_id");
