/**
 * Supabase Edge Function: Scheduled Scan Runner
 *
 * Invoked by pg_cron or external scheduler to re-scan monitored sites.
 * Runs weekly by default. Each invocation picks up sites due for re-scan.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getNextScanDate(frequency: string, lastScanned: string | null): Date {
  const now = new Date();
  if (!lastScanned) return now;

  const last = new Date(lastScanned);
  switch (frequency) {
    case 'daily':
      last.setDate(last.getDate() + 1);
      break;
    case 'weekly':
      last.setDate(last.getDate() + 7);
      break;
    case 'monthly':
      last.setMonth(last.getMonth() + 1);
      break;
  }
  return last;
}

Deno.serve(async (_req: Request) => {
  try {
    // Get sites due for scanning
    const { data: sites, error } = await supabase
      .from('monitored_sites')
      .select('*')
      .eq('is_active', true);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const now = new Date();
    let scanned = 0;
    let skipped = 0;

    for (const site of sites || []) {
      const nextScan = getNextScanDate(site.scan_frequency, site.last_scanned_at);

      if (nextScan <= now) {
        // Scan this site
        try {
          const scanRes = await fetch(`${Deno.env.get('APP_URL')}/api/scan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              url: site.url,
              max_pages: 5,
              wcag_level: 'AA',
            }),
          });

          if (scanRes.ok) {
            const { scan_id } = await scanRes.json();

            // Update last scan info
            await supabase
              .from('monitored_sites')
              .update({
                last_scan_id: scan_id,
                last_scanned_at: now.toISOString(),
              })
              .eq('id', site.id);

            scanned++;
          }
        } catch (err) {
          console.error(`Failed to scan ${site.url}:`, err);
        }
      } else {
        skipped++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scanned,
        skipped,
        total: (sites || []).length,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500 }
    );
  }
});
