#!/usr/bin/env bash
set -euo pipefail

API_KEY="${MMHOW_API_KEY:?MMHOW_API_KEY required}"
BASE="${MMHOW_API_BASE:-https://www.mmhow.com}"

upload_and_patch() {
  local article_id="$1"
  local image_url="$2"
  local alt="$3"
  local tmp="/tmp/cover-article-${article_id}.jpg"

  echo "=== Article #${article_id} ==="
  /usr/bin/curl -sSL --max-time 60 -H "User-Agent: MMHow-cover-bot/1.0" -o "$tmp" "${image_url}"

  if ! file "$tmp" | grep -qE 'JPEG|PNG|WebP'; then
    echo "  ERROR: download is not an image ($(file -b "$tmp"))" >&2
    exit 1
  fi

  media_json=$(/usr/bin/curl -sS --max-time 60 -X POST "${BASE}/api/media" \
    -H "Authorization: users API-Key ${API_KEY}" \
    -F "file=@${tmp};type=image/jpeg;filename=cover-article-${article_id}.jpg" \
    -F "alt=${alt}" \
    -F "_payload={\"alt\":\"${alt}\"}")

  media_id=$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d['doc']['id'])" <<< "$media_json" 2>/dev/null) || {
    echo "  media upload failed: $media_json" >&2
    exit 1
  }
  echo "  uploaded media #${media_id}"

  patch_json=$(/usr/bin/curl -sS --max-time 60 -X PATCH "${BASE}/api/articles/${article_id}" \
    -H "Authorization: users API-Key ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"featuredImage\": ${media_id}}")

  slug=$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d['doc']['slug'])" <<< "$patch_json" 2>/dev/null) || {
    echo "  patch failed: $patch_json" >&2
    exit 1
  }
  echo "  patched featuredImage → ${slug}"
  echo
}

upload_and_patch 2 \
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80" \
  "Laptop workspace for AI side hustle income"

upload_and_patch 3 \
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1600&q=80" \
  "Social media apps for Douyin and Xiaohongshu monetization"

upload_and_patch 4 \
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80" \
  "Small business owner managing dropshipping orders"

upload_and_patch 5 \
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80" \
  "Analytics dashboard for digital product side hustles"

upload_and_patch 6 \
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80" \
  "Freelancers collaborating on remote work projects"

upload_and_patch 7 \
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1600&q=80" \
  "Home office setup for work-from-home side income"

upload_and_patch 8 \
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80" \
  "Students learning side hustle skills on laptop"

upload_and_patch 9 \
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80" \
  "Financial analytics dashboard for index fund investing"

upload_and_patch 10 \
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80" \
  "Team collaborating on online course and knowledge products"

echo "Done. All 9 covers uploaded."
