ALTER TABLE "members" ADD COLUMN "tahiti_number" varchar(50);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "is_medef_member" boolean DEFAULT false NOT NULL;