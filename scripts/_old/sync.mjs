/**
 * Manual Internet Archive Sync CLI Script
 * Run with: node scripts/sync.mjs
 */

const IA_URL = "https://archive.org/advancedsearch.php";

async function runSync() {
  console.log("🎬 Initiating manual sync from Internet Archive Advanced Search...");

  const searchUrl = new URL(IA_URL);
  searchUrl.searchParams.set("q", "collection:(feature_films) AND mediatype:(movies)");
  searchUrl.searchParams.append("fl[]", "identifier");
  searchUrl.searchParams.append("fl[]", "title");
  searchUrl.searchParams.append("fl[]", "description");
  searchUrl.searchParams.append("fl[]", "year");
  searchUrl.searchParams.append("fl[]", "licenseurl");
  searchUrl.searchParams.append("fl[]", "rights");
  searchUrl.searchParams.append("fl[]", "runtime");
  searchUrl.searchParams.append("fl[]", "genre");
  searchUrl.searchParams.append("fl[]", "downloads");
  searchUrl.searchParams.append("sort[]", "downloads desc");
  searchUrl.searchParams.set("rows", "30");
  searchUrl.searchParams.set("output", "json");

  try {
    const res = await fetch(searchUrl.toString(), {
      headers: {
        "User-Agent": "HDMoviesCrawler/1.0 (Manual CLI Test)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Internet Archive: ${res.statusText}`);
    }

    const data = await res.json();
    const docs = data.response?.docs || [];

    console.log(`📡 Retrieved ${docs.length} candidate items from Internet Archive "feature_films" collection.`);

    let qualifying = 0;
    let rejected = 0;

    for (const doc of docs) {
      const licenseurl = (doc.licenseurl || "").toLowerCase();
      const rights = (doc.rights || "").toLowerCase();

      const isPD =
        licenseurl.includes("creativecommons.org/publicdomain/mark/1.0") ||
        licenseurl.includes("creativecommons.org/publicdomain/zero/1.0") ||
        licenseurl.includes("publicdomain") ||
        rights.includes("public domain") ||
        rights.includes("no known copyright");

      const isForbidden =
        rights.includes("all rights reserved") ||
        licenseurl.includes("all rights reserved") ||
        licenseurl.includes("-nc") ||
        licenseurl.includes("/nc") ||
        rights.includes("non-commercial") ||
        rights.includes("noncommercial");

      if (isPD && !isForbidden) {
        qualifying++;
        console.log(`  ✅ [QUALIFIED] "${doc.title}" (${doc.year}) - ID: ${doc.identifier}`);
      } else {
        rejected++;
        const reason = isForbidden ? "Forbidden (Copyright or Non-Commercial NC)" : "Unverified licensing";
        console.log(`  ❌ [REJECTED - ${reason}] "${doc.title}" (${doc.year})`);
      }
    }

    console.log("\n📊 Summary:");
    console.log(`  - Total Processed: ${docs.length}`);
    console.log(`  - Verified Public Domain: ${qualifying}`);
    console.log(`  - Rejected (Ambiguous or Copyrighted): ${rejected}`);
    console.log("\n✨ Sync test completed successfully. To run live sync against your database, call /api/cron/sync-films or deploy to Vercel.");
  } catch (err) {
    console.error("❌ Sync error:", err);
  }
}

runSync();
