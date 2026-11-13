#!/usr/bin/env python3
"""Créer le lien natif parent → sous-issue des exigences/tâches EpiVerse."""
import os,json,re,sys,time,urllib.request,urllib.error
REPO=os.getenv("GH_REPO","epiverse-epitech/epiverse")
TOKEN=os.environ["GH_TOKEN"]
API="https://api.github.com/repos/"+REPO
HEAD={"Authorization":"Bearer "+TOKEN,"Accept":"application/vnd.github+json",
      "X-GitHub-Api-Version":"2026-03-10","User-Agent":"Epiverse-Relationships"}
ROOT_ACTIVE=189;ROOT_FUTURE=190;ROOT_ARCHIVE=191
def call(method,path,data=None):
    b=json.dumps(data).encode() if data is not None else None
    r=urllib.request.Request(API+path,method=method,data=b,
        headers={**HEAD,**({"Content-Type":"application/json"} if b else {})})
    for retry in range(3):
        try:
            with urllib.request.urlopen(r,timeout=30) as ans:
                raw=ans.read().decode();return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as err:
            message=err.read().decode(errors="replace")
            if err.code in (403,429,503) and retry<2:
                time.sleep(3*(retry+1));continue
            raise RuntimeError(f"HTTP {err.code} {path}: {message[:170]}")
def getall():
    result=[]
    for p in range(1,7):
        items=call("GET",f"/issues?state=all&per_page=100&page={p}")
        result.extend(x for x in items if "pull_request" not in x)
        if len(items)<100:break
    return sorted(result,key=lambda z:z["number"])
def typ(issue):
    labels={l["name"] for l in issue.get("labels",[])}
    return "epic" if "type:epic" in labels else "exigence" if "type:exigence" in labels else "archive" if "type:archive" in labels else "tache"
def refs(issue):
    body=(issue.get("body") or "").split("<details>")[0]
    return sorted(set(int(n) for n in re.findall(r"#(\d{3})",body)))
def phase(issue):
    return next((z["name"].split(":")[1].upper() for z in issue.get("labels",[]) if z["name"].startswith("phase:")),"S9")
def main():
    items=getall();byid={x["number"]:x for x in items}
    requirements=[x for x in items if typ(x)=="exigence"]
    tasks=[x for x in items if typ(x)=="tache"]
    archives=[x for x in items if typ(x)=="archive"]
    mapping={}
    for req in requirements:
        for n in refs(req):
            if n in byid and typ(byid[n])=="tache":mapping.setdefault(n,[]).append(req["number"])
    operations=[]
    for x in requirements:operations.append((ROOT_FUTURE if phase(x)=="FUTUR" else ROOT_ACTIVE,x))
    for x in archives:operations.append((ROOT_ARCHIVE,x))
    for x in tasks:
        future=phase(x)=="FUTUR"
        possible=[n for n in mapping.get(x["number"],[]) if phase(byid[n])==("FUTUR" if future else phase(byid[n])) and (future== (phase(byid[n])=="FUTUR"))]
        parent=min(possible) if possible else ROOT_FUTURE if future else ROOT_ACTIVE
        operations.append((parent,x))
    succeeded=[];skipped=[];failed=[]
    print("PREP",json.dumps({"issues":len(items),"requirements":len(requirements),"tasks":len(tasks),
        "archives":len(archives),"links_planned":len(operations)}),flush=True)
    for idx,(parent,child) in enumerate(operations,1):
        if parent==child["number"]:continue
        try:
            call("POST",f"/issues/{parent}/sub_issues",{"sub_issue_id":child["id"]})
            succeeded.append([parent,child["number"]])
        except Exception as err:
            msg=str(err)
            if "422" in msg and ("already" in msg.lower() or "exists" in msg.lower() or "parent" in msg.lower()):
                skipped.append(child["number"])
            else:failed.append([parent,child["number"],msg[:180]])
        if idx%15==0:
            print("PROGRESS",idx,"/",len(operations),"linked",len(succeeded),"failed",len(failed),flush=True)
        time.sleep(.35)
    print("SUMMARY",json.dumps({"created":len(succeeded),"already":len(skipped),"failed":failed[:30],
        "examples":succeeded[:10]},ensure_ascii=False),flush=True)
    if failed:sys.exit(1)
if __name__=="__main__":main()
