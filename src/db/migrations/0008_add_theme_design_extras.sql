ALTER TABLE "brand_themes" ADD COLUMN "shape" text DEFAULT 'soft' NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_themes" ADD COLUMN "shadow_style" text DEFAULT 'subtle' NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_themes" ADD COLUMN "type_scale" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_themes" ADD COLUMN "density" real DEFAULT 0.25 NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_themes" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "brand_themes" ADD COLUMN "header_display" text DEFAULT 'name' NOT NULL;