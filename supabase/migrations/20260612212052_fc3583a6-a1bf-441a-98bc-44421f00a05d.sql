UPDATE public.products
SET
  name = 'Date Night Box for Couples UK | Rewindd Date Night Kit',
  tagline = 'A romantic at-home experience designed to help busy couples reconnect.',
  description = E'Still love each other, but struggling to find time for each other?\n\nYou''re not alone.\n\nBetween work, children, responsibilities and everyday life, quality time often becomes the thing couples keep postponing.\n\nRewindd is a date night box designed to help couples reconnect from the comfort of home.\n\nNo babysitter.\nNo restaurant booking.\nNo complicated planning.\n\nJust one intentional evening filled with meaningful conversation, connection and quality time together.\n\nLight the candle.\nOpen the cards.\nPut your phones away.\n\nThis is your invitation to find each other again.',
  items_included = '[
    "30 conversation cards designed to spark meaningful connection",
    "Vanilla candle to help you slow down and set the mood for your evening",
    "Curated Spotify playlist to help set the mood for your evening",
    "Massage oil for a moment of closeness and intentional touch",
    "Satin eye mask for the closing reflection ritual",
    "Date Night Ritual Guide to lead you through the experience",
    "Premium gift box designed to be kept and reused"
  ]'::jsonb,
  price_cents = 4000,
  currency = 'gbp'
WHERE slug = 'rewindd-ritual-kit';