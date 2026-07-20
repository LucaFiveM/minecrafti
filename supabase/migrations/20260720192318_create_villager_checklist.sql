/*
# Create villager_checklist table (single-tenant, no auth)

1. New Tables
- `villager_checklist`
  - `id` (uuid, primary key)
  - `item_key` (text, unique, not null) — stable identifier for a checklist row,
    e.g. "looting_3", "mending_1", "sharpness_5". Identifies one enchantment
    at a specific level the player may have obtained from a librarian.
  - `label` (text, not null) — human-readable label shown in the UI.
  - `checked` (boolean, not null, default false) — whether the villager/trade
    has been obtained yet.
  - `note` (text, nullable) — optional free-text note the user can attach.
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `villager_checklist`.
- Allow anon + authenticated full CRUD because the checklist is intentionally
  shared/public across all visitors of the GitHub Pages site (no sign-in).
*/

CREATE TABLE IF NOT EXISTS villager_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text UNIQUE NOT NULL,
  label text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  note text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE villager_checklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_checklist" ON villager_checklist;
CREATE POLICY "anon_select_checklist" ON villager_checklist FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_checklist" ON villager_checklist;
CREATE POLICY "anon_insert_checklist" ON villager_checklist FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_checklist" ON villager_checklist;
CREATE POLICY "anon_update_checklist" ON villager_checklist FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_checklist" ON villager_checklist;
CREATE POLICY "anon_delete_checklist" ON villager_checklist FOR DELETE
  TO anon, authenticated USING (true);
