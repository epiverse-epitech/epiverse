#!/usr/bin/env bash
# Fail-closed vulnerability scan. Keep ALL findings visible while blocking any
# CRITICAL vulnerability and any HIGH/CRITICAL finding with an available fix.
# Unfixed HIGHs must be triaged and accepted before a production release.
set -euo pipefail

IMAGE="${1:?Usage: trivy-image-gate.sh <local-image-tag>}"
TRIVY_IMAGE="aquasec/trivy@sha256:be1190afcb28352bfddc4ddeb71470835d16462af68d310f9f4bca710961a41e"
report="$(mktemp)"
trap 'rm -f "$report"' EXIT

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  "$TRIVY_IMAGE" image --scanners vuln --vuln-type os,library \
  --severity HIGH,CRITICAL --exit-code 0 --format json --no-progress "$IMAGE" >"$report"

# Missing or invalid output must never make CI pass silently.
jq -e 'type == "object" and (.Results | type == "array")' "$report" >/dev/null
total="$(jq '[.Results[]?.Vulnerabilities[]?] | length' "$report")"
critical="$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "CRITICAL")] | length' "$report")"
fixable="$(jq '[.Results[]?.Vulnerabilities[]? | select(
  (.Severity == "HIGH" or .Severity == "CRITICAL") and
  ((.FixedVersion // "") | length > 0)
)] | length' "$report")"
unfixed="$(jq '[.Results[]?.Vulnerabilities[]? | select(
  .Severity == "HIGH" and ((.FixedVersion // "") | length == 0)
)] | length' "$report")"
unique="$(jq '[.Results[]?.Vulnerabilities[]?.VulnerabilityID] | unique | length' "$report")"

echo "[Trivy] Image: $IMAGE; occurrences HIGH/CRITICAL: $total; distinct IDs: $unique"
echo "[Trivy] CRITICAL (all statuses): $critical; HIGH/CRITICAL with fixed version: $fixable; HIGH without fix: $unfixed"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### Trivy — \`$IMAGE\`"
    echo ""
    echo "| Mesure | Nombre |"
    echo "|---|---:|"
    echo "| Occurrences HIGH et CRITICAL | $total |"
    echo "| Identifiants de vulnérabilité distincts | $unique |"
    echo "| CRITICAL (bloquantes avec ou sans patch) | $critical |"
    echo "| HIGH/CRITICAL avec version corrigée (bloquantes) | $fixable |"
    echo "| HIGH sans patch publié (revue nécessaire) | $unfixed |"
    echo ""
    echo "**Les alertes HIGH sans correctif restent ouvertes et nécessitent une acceptation du risque avant production.**"
    echo ""
    echo "<details><summary>Identifiants CVE/GHSA signalés (50 premiers)</summary>"
    echo ""
    echo '~~~text'
    jq -r '[.Results[]?.Vulnerabilities[]? |
      "\(.VulnerabilityID) \(.Severity) \(.PkgName) \(.InstalledVersion) -> \(.FixedVersion // "no-fix")"
    ] | unique | .[:50][]' "$report"
    echo '~~~'
    echo "</details>"
  } >> "$GITHUB_STEP_SUMMARY"
fi

# Full findings stay in the job log. A nonzero exit is intentional.
jq -r '.Results[]? | .Target as $t | .Vulnerabilities[]? |
  "\($t) \(.VulnerabilityID) \(.Severity) \(.Status // "unknown") \(.PkgName) \(.InstalledVersion) -> \(.FixedVersion // "no-fix")"' "$report"

if (( critical > 0 || fixable > 0 )); then
  echo "::error::Blocking image vulnerabilities: CRITICAL=$critical, fixable HIGH/CRITICAL=$fixable"
  exit 1
fi
if (( unfixed > 0 )); then
  echo "::warning::$unfixed HIGH findings remain without upstream fix; human/AI risk assessment required before production."
fi
