#!/usr/bin/env python3
"""Configurer le GitHub Project et la priorité native des issues.
Nécessite le secret EPIVERSE_PLANNING_TOKEN (GitHub App avec Projects/Issue Fields
ou PAT classic project + repo + read:org). Ne jamais mettre de token dans le code.
"""
import os,json,sys,time,urllib.request,urllib.error
ORG=os.getenv("GH_ORG","epiverse-epitech")
REPO=os.getenv("GH_REPO","epiverse-epitech/epiverse")
TOKEN=os.getenv("GH_PLANNING_TOKEN","")
PROJECT_TITLE="EpiVerse — Pilotage et Livraison"
if not TOKEN:print("SKIPPED: secret EPIVERSE_PLANNING_TOKEN absent. Aucun Project créé.",flush=True);sys.exit(0)
HEAD={"Authorization":"Bearer "+TOKEN,"Accept":"application/vnd.github+json",
"Content-Type":"application/json","X-GitHub-Api-Version":"2026-03-10","User-Agent":"Epiverse-Project"}
def api(path,data=None,method=None):
    method=method or ("POST" if data is not None else "GET")
    req=urllib.request.Request("https://api.github.com"+path,method=method,
        headers=HEAD,data=json.dumps(data).encode() if data is not None else None)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req,timeout=40) as r:return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg=e.read().decode(errors="replace")
            if e.code in (403,429,503) and attempt<3:time.sleep(3*(attempt+1));continue
            raise RuntimeError(f"{method} {path} HTTP {e.code}: {msg[:240]}")
def gql(q,vars=None):
    data=api("/graphql",{"query":q,"variables":vars or {}})
    if data.get("errors"):raise RuntimeError(str(data["errors"])[:300])
    return data["data"]
def allissues():
    a=[]
    for page in range(1,7):
        part=api(f"/repos/{REPO}/issues?state=all&per_page=100&page={page}")
        a.extend(x for x in part if "pull_request" not in x)
        if len(part)<100:break
    return a
def project():
    data=gql("query($login:String!){organization(login:$login){id projectsV2(first:100){nodes{id number title}}}}",{"login":ORG})
    if not data.get("organization"):raise RuntimeError("Compte org introuvable / droits insuffisants")
    org=data["organization"]
    matches=[p for p in org["projectsV2"]["nodes"] if p["title"]==PROJECT_TITLE]
    if matches:return matches[0]
    created=gql("mutation($owner:ID!,$title:String!){createProjectV2(input:{ownerId:$owner,title:$title}){projectV2{id number title}}}",{"owner":org["id"],"title":PROJECT_TITLE})
    print("PROJECT_CREE",created["createProjectV2"]["projectV2"],flush=True)
    return created["createProjectV2"]["projectV2"]
def status_field(number):
    data=gql("query($login:String!,$number:Int!){organization(login:$login){projectV2(number:$number){fields(first:30){nodes{... on ProjectV2SingleSelectField{id name options{id name}}}}}}}",{"login":ORG,"number":number})
    return next((x for x in data["organization"]["projectV2"]["fields"]["nodes"] if x and x.get("name")=="Status"),None)
def issues_field_priority():
    try:
        vals=api(f"/orgs/{ORG}/issue-fields")
        return next((f for f in vals if f.get("name","").lower()=="priority"),None)
    except Exception as exc:print("PRIORITY_FIELD_UNAVAILABLE",exc,flush=True);return None
def main():
    items=allissues();p=project();status=status_field(p["number"]);pr=issues_field_priority()
    opts={x["name"].lower():x["id"] for x in status.get("options",[])} if status else {}
    print("START",{"project":p["number"],"issues":len(items),"status":bool(status),"native_priority":bool(pr)},flush=True)
    ok=[];bad=[];prior_ok=0
    for idx,issue in enumerate(items,1):
        n=issue["number"]
        try:
            z=gql("mutation($project:ID!,$issue:ID!){addProjectV2ItemById(input:{projectId:$project,contentId:$issue}){item{id}}}",
                {"project":p["id"],"issue":issue["node_id"]})
            itemid=z["addProjectV2ItemById"]["item"]["id"]
            labels={l["name"] for l in issue.get("labels",[])}
            state="done" if issue["state"]=="closed" else "in progress" if "etat:en-cours" in labels else "in review" if "etat:en-revue" in labels else "todo"
            opt=opts.get(state) or (opts.get("in progress") if state=="in review" else None) or opts.get("todo")
            if status and opt:
                gql("mutation($project:ID!,$item:ID!,$field:ID!,$option:String!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$option}}){projectV2Item{id}}}",
                    {"project":p["id"],"item":itemid,"field":status["id"],"option":opt})
            ok.append(n)
        except Exception as exc:bad.append([n,str(exc)[:190]])
        if pr:
            labels={l["name"] for l in issue.get("labels",[])}
            v=next((x.split(":")[1] for x in labels if x.startswith("prio:")),"P1")
            target="Low" if issue["state"]=="closed" else {"P0":"High","P1":"Medium","P2":"Low"}.get(v,"Medium")
            options={x["name"].lower():x["name"] for x in pr.get("options",[])}
            if target.lower() in options:
                try:
                    api(f"/repos/{REPO}/issues/{n}/issue-field-values",
                        {"issue_field_values":[{"field_id":pr["id"],"value":options[target.lower()]}]},"POST")
                    prior_ok+=1
                except Exception as exc:bad.append([n,"Native Priority: "+str(exc)[:145]])
        if idx%20==0:print("PROGRESS",idx,len(items),"project",len(ok),"priority",prior_ok,flush=True)
        time.sleep(.4)
    print("SUMMARY",json.dumps({"project_number":p["number"],"added":len(ok),"priority":prior_ok,"errors":bad[:25]},ensure_ascii=False),flush=True)
    if bad:sys.exit(1)
if __name__=="__main__":main()
