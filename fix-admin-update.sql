-- ============================================================
-- FIX ADMIN PANEL ORDER STATUS UPDATE
-- ============================================================
-- Problem: Admin panel cannot update order status due to RLS policies
-- Solution: Allow anonymous users to update orders (admin uses localStorage auth)
-- 
-- Instructions:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Paste this entire file
-- 3. Click "Run"
-- 4. Refresh your admin dashboard
-- ============================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

-- Create a new policy that allows both anonymous and authenticated users to update
CREATE POLICY "Anyone can update orders"
  ON orders
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'orders' 
AND cmd = 'UPDATE';

-- You should see "Anyone can update orders" in the results


