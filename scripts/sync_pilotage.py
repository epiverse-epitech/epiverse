#!/usr/bin/env python3
"""Synchroniser jalons GitHub des issues EpiVerse (idempotent, sans suppression)."""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

TOKEN = os.environ["GH_TOKEN"]
REPO = os.environ["GH_REPO"]
API = "https://api.github.com/repos/" + REPO
HEADERS = {
    "Authorization": "Bearer " + TOKEN,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "epiverse-pilotage",
}

MILESTONES = {
    "FU2 - 13 novembre 2026": ("2026-11-13T13:00:00Z", "phase:FU2"),
    "S9 - MVP et integration": ("2026-12-18T13:00:00Z", "phase:S9"),
    "FU3 - 18 decembre 2026": ("2026-12-18T13:00:00Z", "phase:FU3"),
    "S10 - Soutenance 5 fevrier 2027": ("2027-02-05T13:00:00Z", "phase:S10"),
}

def request(method, path, data=None):
    url = API + path
    payload = json.dumps(data).encode("utf-8") if data is not None else None
    headers = dict(HEADERS)
    if payload is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, method=method, headers=headers, data=payload)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        msg = err.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {path}: HTTP {err.code}: {msg[:500]}") from err

def main():
    existing = request("GET", "/milestones?state=all&per_page=100")
    by_name = {item["title"]: item["number"] for item in existing}
    phase_to_milestone = {}
    for title, (due, phase) in MILESTONES.items():
        if title not in by_name:
            created = request("POST", "/milestones", {
                "title": title,
                "description": "Pilotage EpiVerse — jalon conforme au calendrier EPITECH",
                "due_on": due,
            })
            by_name[title] = created["number"]
            print("Milestone cree:", title, by_name[title])
        phase_to_milestone[phase] = by_name[title]

    issues = request("GET", "/issues?state=open&per_page=100")
    changed = 0
    for item in issues:
        if "pull_request" in item:
            continue
        labels = {x["name"] for x in item.get("labels", [])}
        matches = [phase_to_milestone[phase] for phase in phase_to_milestone if phase in labels]
        if len(matches) != 1:
            print("Ignorer issue #", item["number"], "phase non unique ou absente")
            continue
        target = matches[0]
        if item.get("milestone") and item["milestone"]["number"] == target:
            continue
        request("PATCH", "/issues/" + str(item["number"]), {"milestone": target})
        changed += 1
        print("Jalon ajoute a issue #", item["number"])
    print("Termine : jalons nouveaux ou verifies =", len(phase_to_milestone), ", issues modifiees =", changed)

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("Echec synchronisation jalons:", exc, file=sys.stderr)
        sys.exit(1)
