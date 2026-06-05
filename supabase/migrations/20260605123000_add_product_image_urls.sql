-- Add multi-image support for product kits
ALTER TABLE public.products
ADD COLUMN image_urls text[];
