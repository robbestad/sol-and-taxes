CREATE TABLE "public"."user_settings" ("user_id" uuid NOT NULL, PRIMARY KEY ("user_id") , FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE cascade ON DELETE cascade);
