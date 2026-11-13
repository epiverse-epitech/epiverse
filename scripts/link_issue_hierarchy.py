#!/usr/bin/env python3
"""Hiérarchie native des issues EpiVerse, sans supprimer ni réaffecter les parents existants."""
import json,os,time,urllib.request,urllib.error
REPO=os.getenv("GH_REPO","epiverse-epitech/epiverse")
TOKEN=os.environ["GH_TOKEN"]
LIMIT=int(os.getenv("MAX_LINKS","999"))
DRY=os.getenv("DRY_RUN","true").lower()!="false"
H={"Authorization":"Bearer "+TOKEN,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2026-03-10","Content-Type":"application/json"}
def get(method,path,data=None,allow_fail=False):
    b=json.dumps(data).encode() if data is not None else None
    req=urllib.request.Request("https://api.github.com"+path,data=b,headers=H,method=method)
    for t in range(3):
        try:
            with urllib.request.urlopen(req,timeout=35) as r:
                payload=r.read().decode()
                return json.loads(payload) if payload else {}
        except urllib.error.HTTPError as e:
            msg=e.read().decode(errors="replace")
            if e.code in (429,503) and t<2:time.sleep(3*(t+1));continue
            if allow_fail:return {"error":f"HTTP {e.code} {msg[:180]}"}
            raise RuntimeError(f"{method} {path}: HTTP {e.code} {msg[:180]}")
def listall(path):
    all=[]
    for page in range(1,6):
        items=get("GET",path+(("&" if "?" in path else "?")+"per_page=100&page="+str(page)))
        if not isinstance(items,list):break
        all.extend(items)
        if len(items)<100:break
    return all
def parent_of(x):
    n=x["number"];label={z["name"] for z in x.get("labels",[])}
    if n in (189,190,191):return None
    if n in (192,193):return 189
    if n<=101 and x["state"]=="closed":return 191
    if "scope:future" in label or "phase:FUTUR" in label:return 190
    if "type:exigence" in label:return 192
    if "type:epic" in label:return 189
    return 193
def main():
    issues=[x for x in listall(f"/repos/{REPO}/issues?state=all") if "pull_request" not in x]
    byid={x["number"]:x for x in issues}
    parentids=(189,190,191,192,193)
    existing={}
    for p in parentids:
        children=listall(f"/repos/{REPO}/issues/{p}/sub_issues")
        existing[p]={x["number"] for x in children}
    count={p:len(v) for p,v in existing.items()}
    todo=[(parent_of(x),x) for x in sorted(issues,key=lambda x:x["number"]) if parent_of(x) is not None]
    print("INITIAL",json.dumps({"issues":len(issues),"planned_links":len(todo),"current":count,"dry":DRY}),flush=True)
    # Les issues déjà rattachées directement à #189 sont replacées dans les deux sous-groupes.
    # On ne modifie pas les parents externes inconnus, ni les archives et futures correctes.
    current={n:p for p,nums in existing.items() for n in nums}
    completed=0;errors=[]
    for parent,x in todo:
        old_parent=current.get(x["number"])
        # Une tâche déjà enfant de son exigence métier est correctement reliée.
        # Ne pas la déplacer vers l'epic générique sous prétexte qu'elle a un autre parent.
        if old_parent is None:
            observed=get("GET",f"/repos/{REPO}/issues/{x['number']}/parent",allow_fail=True)
            if isinstance(observed,dict) and observed.get("number"):
                old_parent=observed["number"]
                current[x["number"]]=old_parent
                if old_parent not in existing:
                    print("PRESERVE",x["number"],"parent métier",old_parent,flush=True)
                    continue
        if old_parent==parent:continue
        if completed>=LIMIT:break
        if len(existing[parent])>=100:
            errors.append(f"#{parent}: 100 children limit");continue
        replace=old_parent==189 and parent in (192,193)
        if old_parent is not None and not replace:
            errors.append(f"#{x['number']}: parent #{old_parent} préservé, attendu #{parent}");continue
        if DRY:
            print("PLAN",parent,"<",x["number"],"replace",replace);completed+=1;continue
        data={"sub_issue_id":x["id"]}
        if replace:data["replace_parent"]=True
        result=get("POST",f"/repos/{REPO}/issues/{parent}/sub_issues",data,allow_fail=True)
        if "error" in result:
            errors.append(f"#{x['number']} to #{parent}: {result['error']}")
        else:
            if old_parent in existing:existing[old_parent].discard(x["number"])
            existing[parent].add(x["number"]);current[x["number"]]=parent;completed+=1
        if completed%15==0:print("PROGRESS",completed,"linked",flush=True)
        time.sleep(.45)
    print("RESULT",json.dumps({"linked":completed,"errors":errors[:25],"counts":{p:len(v) for p,v in existing.items()}},ensure_ascii=False),flush=True)
    if errors:raise SystemExit(1)
if __name__=="__main__":main()
