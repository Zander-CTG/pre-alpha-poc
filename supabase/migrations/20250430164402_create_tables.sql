CREATE TABLE IF NOT EXISTS prealpha_image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  visible_text TEXT[] NOT NULL,
  search_vector TSVECTOR
);

COMMENT ON TABLE prealpha_image_metadata IS 'Metadata for images uploaded by users.';
COMMENT ON COLUMN prealpha_image_metadata.id IS 'Unique identifier for the image metadata.';
COMMENT ON COLUMN prealpha_image_metadata.user_id IS 'User who uploaded the image.';
COMMENT ON COLUMN prealpha_image_metadata.created_at IS 'Timestamp when the image metadata was created.';
COMMENT ON COLUMN prealpha_image_metadata.updated_at IS 'Timestamp when the image metadata was last updated.';
COMMENT ON COLUMN prealpha_image_metadata.visible_text IS 'Text that is visible in the image, extracted for search purposes.';
COMMENT ON COLUMN prealpha_image_metadata.search_vector IS 'Search vector for full-text search capabilities.';

CREATE TABLE IF NOT EXISTS prealpha_prompt_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_metadata_id UUID NOT NULL REFERENCES prealpha_image_metadata(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  request_duration INTEGER NOT NULL,
  response JSONB NOT NULL
);

COMMENT ON TABLE prealpha_prompt_metadata IS 'Metadata for prompts associated with images.';
COMMENT ON COLUMN prealpha_prompt_metadata.id IS 'Unique identifier for the prompt metadata.';
COMMENT ON COLUMN prealpha_prompt_metadata.image_metadata_id IS 'Reference to the image metadata this prompt is associated with.';
COMMENT ON COLUMN prealpha_prompt_metadata.created_at IS 'Timestamp when the prompt metadata was created.';
COMMENT ON COLUMN prealpha_prompt_metadata.request_duration IS 'Duration of the request in milliseconds.';
COMMENT ON COLUMN prealpha_prompt_metadata.response IS 'Response from the prompt, stored as JSONB for flexibility.';

CREATE TABLE IF NOT EXISTS prealpha_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_metadata_id UUID NOT NULL REFERENCES prealpha_image_metadata(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  label TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  bounding_box NUMERIC[4] NOT NULL,
  price_range NUMERIC[2] NOT NULL,
  search_vector TSVECTOR
);

COMMENT ON TABLE prealpha_items IS 'Items associated with images.';
COMMENT ON COLUMN prealpha_items.id IS 'Unique identifier for the item.';
COMMENT ON COLUMN prealpha_items.image_metadata_id IS 'Reference to the image metadata this item is associated with.';
COMMENT ON COLUMN prealpha_items.user_id IS 'User who uploaded the original image.';
COMMENT ON COLUMN prealpha_items.created_at IS 'Timestamp when the item was created.';
COMMENT ON COLUMN prealpha_items.updated_at IS 'Timestamp when the item was last updated.';
COMMENT ON COLUMN prealpha_items.label IS 'Label of the item.';
COMMENT ON COLUMN prealpha_items.brand IS 'Brand of the item.';
COMMENT ON COLUMN prealpha_items.description IS 'Description of the item.';
COMMENT ON COLUMN prealpha_items.categories IS 'Categories associated with the item.';
COMMENT ON COLUMN prealpha_items.bounding_box IS 'Bounding box coordinates for the item in the image.';
COMMENT ON COLUMN prealpha_items.price_range IS 'Price range of the item.';
COMMENT ON COLUMN prealpha_items.search_vector IS 'Search vector for full-text search capabilities.';
