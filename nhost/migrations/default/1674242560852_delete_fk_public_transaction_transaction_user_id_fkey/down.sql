alter table "public"."transaction"
  add constraint "transaction_user_id_fkey"
  foreign key ("user_id")
  references "auth"."users"
  ("id") on update cascade on delete cascade;
