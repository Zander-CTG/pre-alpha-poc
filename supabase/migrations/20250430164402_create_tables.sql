CREATE TABLE IF NOT EXISTS image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  visible_text TEXT[],
  search_vector TSVECTOR
);

COMMENT ON TABLE image_metadata IS 'Metadata for images uploaded by users.';
COMMENT ON COLUMN image_metadata.id IS 'Unique identifier for the image metadata.';
COMMENT ON COLUMN image_metadata.user_id IS 'User who uploaded the image.';
COMMENT ON COLUMN image_metadata.created_at IS 'Timestamp when the image metadata was created.';
COMMENT ON COLUMN image_metadata.updated_at IS 'Timestamp when the image metadata was last updated.';
COMMENT ON COLUMN image_metadata.visible_text IS 'Text that is visible in the image, extracted for search purposes.';
COMMENT ON COLUMN image_metadata.search_vector IS 'Search vector for full-text search capabilities.';

CREATE OR REPLACE FUNCTION image_metadata_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector = to_tsvector('english', COALESCE(array_to_string(NEW.visible_text, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER image_metadata_search_vector_update_trigger
BEFORE INSERT OR UPDATE ON image_metadata
FOR EACH ROW EXECUTE FUNCTION image_metadata_search_vector_update();

CREATE INDEX image_metadata_search_vector_idx ON image_metadata USING GIN (search_vector);

COMMENT ON FUNCTION image_metadata_search_vector_update() IS 'Updates image_metadata table search_vector column with vectors from visible_text.';

CREATE TABLE IF NOT EXISTS prompt_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_metadata_id UUID NOT NULL REFERENCES image_metadata(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  request_duration INTEGER,
  response JSONB
);

COMMENT ON TABLE prompt_metadata IS 'Metadata for prompts associated with images.';
COMMENT ON COLUMN prompt_metadata.id IS 'Unique identifier for the prompt metadata.';
COMMENT ON COLUMN prompt_metadata.image_metadata_id IS 'Reference to the image metadata this prompt is associated with.';
COMMENT ON COLUMN prompt_metadata.created_at IS 'Timestamp when the prompt metadata was created.';
COMMENT ON COLUMN prompt_metadata.request_duration IS 'Duration of the request in milliseconds.';
COMMENT ON COLUMN prompt_metadata.response IS 'Response from the prompt, stored as JSONB for flexibility.';

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_metadata_id UUID NOT NULL REFERENCES image_metadata(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  label TEXT,
  brand TEXT,
  description TEXT,
  categories TEXT[],
  bounding_box NUMERIC[4] NOT NULL,
  price_range NUMERIC[2] NOT NULL,
  search_vector TSVECTOR
);

COMMENT ON TABLE items IS 'Items associated with images.';
COMMENT ON COLUMN items.id IS 'Unique identifier for the item.';
COMMENT ON COLUMN items.image_metadata_id IS 'Reference to the image metadata this item is associated with.';
COMMENT ON COLUMN items.user_id IS 'User who uploaded the original image.';
COMMENT ON COLUMN items.created_at IS 'Timestamp when the item was created.';
COMMENT ON COLUMN items.updated_at IS 'Timestamp when the item was last updated.';
COMMENT ON COLUMN items.label IS 'Label of the item.';
COMMENT ON COLUMN items.brand IS 'Brand of the item.';
COMMENT ON COLUMN items.description IS 'Description of the item.';
COMMENT ON COLUMN items.categories IS 'Categories associated with the item.';
COMMENT ON COLUMN items.bounding_box IS 'Bounding box coordinates for the item in the image.';
COMMENT ON COLUMN items.price_range IS 'Price range of the item.';
COMMENT ON COLUMN items.search_vector IS 'Search vector for full-text search capabilities.';

CREATE OR REPLACE FUNCTION items_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector =
    setweight(to_tsvector('english', COALESCE(NEW.label, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.categories, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_search_vector_update_trigger
BEFORE INSERT OR UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION items_search_vector_update();

CREATE INDEX items_search_vector_idx ON items USING GIN (search_vector);

COMMENT ON FUNCTION items_search_vector_update() IS 'Updates items table search_vector column with weighted vectors from text columns.';
