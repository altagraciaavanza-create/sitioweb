CREATE TABLE "brand_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"colors" jsonb NOT NULL,
	"font_family" text DEFAULT 'inter' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "active_brand_theme_id" uuid;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_active_brand_theme_id_brand_themes_id_fk" FOREIGN KEY ("active_brand_theme_id") REFERENCES "public"."brand_themes"("id") ON DELETE set null ON UPDATE no action;