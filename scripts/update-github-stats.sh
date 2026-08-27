#!/usr/bin/env bash
set -euo pipefail

ORG="${GITHUB_ORG:-ansible-tmm}"
OUTPUT="${1:-data/github-stats.json}"

repos_json="$(gh api "/orgs/${ORG}/repos?per_page=100&type=public" --paginate)"
repos="$(echo "${repos_json}" | jq -s 'add')"

repositories="$(echo "${repos}" | jq 'length')"
stars="$(echo "${repos}" | jq '[.[].stargazers_count] | add // 0')"
forks="$(echo "${repos}" | jq '[.[].forks_count] | add // 0')"
recent_repos="$(echo "${repos}" | jq 'sort_by(.pushed_at) | reverse | .[0:3] | map({name, url: .html_url, pushed_at})')"

commits="$(gh api search/commits \
  --method GET \
  -f q="org:${ORG} committer-date:>2020-01-01" \
  -f per_page=1 \
  --jq '.total_count')"

pull_requests="$(gh api search/issues \
  --method GET \
  -f q="org:${ORG} type:pr" \
  -f per_page=1 \
  --jq '.total_count')"

merged_pull_requests="$(gh api search/issues \
  --method GET \
  -f q="org:${ORG} type:pr is:merged" \
  -f per_page=1 \
  --jq '.total_count')"

mkdir -p "$(dirname "${OUTPUT}")"

jq -n \
  --arg org "${ORG}" \
  --arg updated_at "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  --argjson repositories "${repositories}" \
  --argjson stars "${stars}" \
  --argjson forks "${forks}" \
  --argjson commits "${commits}" \
  --argjson pull_requests "${pull_requests}" \
  --argjson merged_pull_requests "${merged_pull_requests}" \
  --argjson recent_repos "${recent_repos}" \
  '{
    org: $org,
    updated_at: $updated_at,
    repositories: $repositories,
    stars: $stars,
    forks: $forks,
    commits: $commits,
    pull_requests: $pull_requests,
    merged_pull_requests: $merged_pull_requests,
    recent_repos: $recent_repos
  }' > "${OUTPUT}"

echo "Wrote ${OUTPUT}"
