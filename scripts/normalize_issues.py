#!/usr/bin/env python3
"""Normaliser les issues EpiVerse. Idempotent. Utiliser GitHub Actions (issues:write).
Les heures rétrospectives ne sont PAS des pointages réels.
"""
import json, os, re, sys, time, urllib.request, urllib.error, urllib.parse
from datetime import datetime, timezone
REPO = os.getenv("GH_REPO","epiverse-epitech/epiverse")
ORG=REPO.split("/")[0]
TOKEN=os.environ["GH_TOKEN"]
API="https://api.github.com"
DRY=os.getenv("DRY_RUN","true").lower()!="false"
MAX=int(os.getenv("MAX_ISSUES","1000"))
VERS="2026-03-10"
HEAD={"Authorization":"Bearer "+TOKEN,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":VERS,"User-Agent":"EpiVerse-FU2-Pilotage"}
BASE="https://github.com/"+REPO+"/issues/"
OWNERS={"estelle":"estellegiroud","eckson":"Eckson-Glitho","philimon":"prusom",
        "thomas":"thomas-pradeau","julien":"Juliendev200","soumia":"miso882",
        "ousmane":"bayeousmane1","lina":"LambdaIotaNuAlpha","belaid":"Eckson-Glitho"}  # Référent GitHub, Belaid reste réalisateur
MILESTONES={
 "FU2":("FU2 — 13 novembre 2026","2026-11-13T13:00:00Z"),
 "S9":("S9 — Première intégration / FU3","2026-12-18T13:00:00Z"),
 "FU3":("FU3 — 18 décembre 2026","2026-12-18T13:00:00Z"),
 "S10":("S10 — Soutenance 5 février 2027","2027-02-05T13:00:00Z"),
 "FUTUR":("Vision future — après février 2027",None),
 "ARCHIVE":("Archives historiques",None),
}
SUCCESS=[]; FAIL=[]; WARN=[]
def req(method,path, data=None, allow=None):
    body=json.dumps(data).encode() if data is not None else None
    rq=urllib.request.Request(API+path,data=body,method=method,headers={**HEAD,**({"Content-Type":"application/json"} if body else {})})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(rq,timeout=40) as r:
                s=r.read().decode();return json.loads(s) if s else {}
        except urllib.error.HTTPError as e:
            msg=e.read().decode(errors="replace")
            if allow and e.code in allow:return None
            if e.code in (403,429,503) and attempt<2:
                time.sleep(3*(attempt+1));continue
            raise RuntimeError(f"{method} {path}: {e.code} {msg[:240]}")
def listing(path):
    arr=[]
    for page in range(1,8):
        suffix=("&" if "?" in path else "?")+f"per_page=100&page={page}"
        data=req("GET",path+suffix)
        if not isinstance(data,list):break
        arr+=data
        if len(data)<100:break
    return arr
def category(issue):
    n=issue["number"]
    if "type:epic" in {l["name"] for l in issue.get("labels",[])}:return "epic"
    if n<=101 and issue["state"]=="open":return "exigence"
    if n<=101:return "archive"
    return "tache"
def get_phase(issue,kind):
    if kind=="archive":return "ARCHIVE"
    labels=[l["name"] for l in issue.get("labels",[])]
    v=next((x.split(":")[1] for x in labels if x.startswith("phase:")),None)
    if v:return v.upper()
    if "FUTUR" in (issue.get("body") or "").upper():return "FUTUR"
    if nint(issue["number"])<=112:return "FU2"
    return "S9"
def nint(x):return int(x)
def priority(issue,kind):
    m=re.search(r"\[P([012])\]",issue["title"])
    if m:return "P"+m.group(1)
    labels=[l["name"] for l in issue.get("labels",[])]
    v=next((x.split(":")[1] for x in labels if x.startswith("prio:")),None)
    return v if v in ("P0","P1","P2") else ("P2" if kind=="archive" else "P1")
def team(issue):
    title=issue["title"].lower()
    labels=[l["name"] for l in issue.get("labels",[])]
    existing=next((x.split(":")[1] for x in labels if x.startswith("pole:")),None)
    if existing:return existing
    patterns=[("devops",["infra","deploy","platform","sre","backup","redis","host","supply","release"]),
       ("securite",["security","rgpd","sec","cve","priva","modéra"]),
       ("campus",["campus","c2d","world","xr","avatar","maison"]),
       ("frontend",["app","frontend","ux","profil"]),
       ("backend",["api","database","backend","événements"]),
       ("data-ia",["ia","data","mongo","agents"]),
       ("pilotage",["pilotage","gouv","fu","projects","insights","backlog"])]
    return next((name for name,tokens in patterns if any(x in title for x in tokens)),"produit")
def responsible(issue,kind,teamname):
    body=issue.get("body") or ""
    names=list(OWNERS.keys())
    if kind=="archive":return "estellegiroud"
    fields=re.search(r"\*\*(?:Responsable|Réalisation|Pilotage)\s*:\*\*\s*(.{1,115})",body,re.I)
    phrase=fields.group(1).split("\n")[0].lower() if fields else ""
    mentions=[(m.start(),OWNERS[name]) for name in names for m in re.finditer(r"\b"+re.escape(name)+r"\b",phrase)]
    if mentions:return min(mentions,key=lambda x:x[0])[1]
    if kind=="exigence":
        m=re.search(r"\*\*Validation\s*:\*\*\s*(.{1,70})",body,re.I)
        if m and "estelle" in m.group(1).lower():return "estellegiroud"
    fallback={"backend":"Eckson-Glitho","frontend":"prusom","devops":"bayeousmane1",
              "campus":"Juliendev200","data-ia":"thomas-pradeau","design":"miso882",
              "securite":"estellegiroud","pilotage":"estellegiroud"}
    return fallback.get(teamname,"estellegiroud")
def hours(issue,kind,teamname):
    if kind!="tache":return None
    body=issue.get("body") or ""
    m=re.search(r"(?:Estimation initiale|Prévu)\s*:\s*\*{0,2}\s*(\d+(?:[.,]\d+)?)\s*h",body,re.I)
    if not m:return None
    before=float(m.group(1).replace(",","."))
    # Impact IA : code standard accéléré, sécurité/médias toujours très exigeants en tests.
    factor=0.76 if teamname in ("frontend","backend","data-ia") else 0.88 if teamname in ("campus","media","devops","securite") else 0.70
    total=max(1,round(before*factor*2)/2)
    # Quelques livrables possèdent un historique de code/PR ou des commits documentaires.
    # Valeurs = reconstitution d'effort, PAS un relevé d'heures réel.
    proof={104:(1.5,"README versionné dans la PR #147"),
           105:(2.0,"CRAv FU1 documenté en PR #147"),
           107:(1.5,"Tableau des heures créé en PR #147"),
           108:(1.5,"KPI historique dans la PR #147"),
           109:(2.0,"Registres risques et écarts dans la PR #147"),
           115:(3.0,"PR #45 ouverte : inscription proposée, intégration restante"),
           116:(5.0,"Branche EPI-57 avec code auth/session non fusionné"),
           117:(5.0,"Branche EPI-42 avec parcours non fusionné"),
           121:(6.0,"Branche EPI-459-avatar-poc : banc Phaser visible"),
           137:(3.0,"Table PBS/WBS et exigences dans PR #147"),
           180:(2.0,"ADR et reporting versionnés dans PR #147"),
           186:(1.5,"Delta Log et liens de commits dans PR #147")}
    spent,note=proof.get(issue["number"],(None,None))
    if spent is not None:
        spent=min(spent,total)
        remaining=max(0.5,round((total-spent)*2)/2) if issue["state"]=="open" else 0
    else:
        remaining=total
    return before,total,spent,remaining,note
def phase_from_body(issue,phase):
    if issue["number"] in (72,86,87,88,89,90,91,101,130,187):
        return "FUTUR"
    if issue["number"] in (75,97,140,145,170,173,181,188):return "S10"
    if issue["number"]==139:return "FU3"
    return phase
def native_type(kind,issue):
    if kind in ("exigence","epic"):return "Feature"
    if kind=="archive":return "Task"
    if issue["number"] in (131,132,141,142,152,178):return "Bug" if "corriger" in issue["title"].lower() else "Task"
    return "Task"
def get_references(issue,kind):
    body=(issue.get("body") or "").split("<details>")[0]
    refs=sorted(set(int(x) for x in re.findall(r"#(\d{2,3})",body) if int(x)!=issue["number"]))
    return refs[:25]
def block(issue,kind,prio,phase,owner,teamname,h):
    refs=get_references(issue,kind)
    if kind=="tache":
        old,total,spent,remain,note=h or (None,None,None,None,None)
        cost=(f"- **Estimation historique :** {old:g} h (avant révision IA).\n"
              f"- **Charge totale réestimée avec assistance IA :** {total:g} h (hypothèse de cadrage).\n"
              f"- **Déjà effectué estimé, NON chronométré :** {spent:g} h — {note}.\n" if spent is not None
              else f"- **Estimation historique :** {old:g} h.\n- **Charge totale réestimée avec assistance IA :** {total:g} h.\n- **Heures déjà travaillées :** non relevées (pas de preuve de quantité).\n") if h else "- **Estimation :** à expertiser.\n"
        cost+=f"- **ETC — reste à faire estimé :** {remain:g} h.\n" if h else ""
        proof=(f"- **Preuve de progression :** {note}.\n" if note else "- **Preuve de progression :** non établie tant qu'une PR/test n'est pas liée.\n")
    else:
        cost="- **Heures :** regroupement ou réception non chiffré séparément ; la charge est portée par les tâches de réalisation liées.\n"
        proof="- **Preuve de réception :** tests, PR et validation exigés pour clore.\n" if kind=="exigence" else "- **Archive :** aucun développement n'est considéré terminé du seul fait de la fermeture.\n"
    status=("Archivée : doublon historique, suivi transféré" if kind=="archive" else
            ("En revue (documents en PR #147)" if issue["number"] in (104,105,107,108,109,137,180,186) else
             "Code en PR/branche, intégration à vérifier" if issue["number"] in (115,116,117,121) else
             "À faire / non validé"))
    relation=", ".join(f"#{i}" for i in refs) if refs else "aucun ticket identifié"
    dev=("#45" if issue["number"]==115 else "#147" if issue["number"] in (104,105,107,108,109,137,180,186) else
         "#39 (historique)" if issue["number"]==110 else "aucune PR liée vérifiée")
    return (f"<!-- EPIVERSE-SUIVI-START -->\n"
        f"## Suivi opérationnel — 13/11/2026\n\n"
        f"**Catégorie :** {kind.capitalize()} · **Priorité :** {prio} · **Phase :** {phase} · **Équipe :** {teamname}  \n"
        f"**Référent GitHub de suivi :** @{owner} · **État vérifiable :** {status}.\n\n"
        f"### Effort (estimations, pas de pointage)\n{cost}\n"
        f"### Traçabilité et acceptation\n"
        f"- **Liens :** {relation}.\n"
        f"- **Développement :** {dev}.\n"
        f"{proof}"
        f"- **Règle de clôture :** revue indépendante, CI/tests applicables et preuve de fonctionnement pour tout ticket actif.\n"
        f"<!-- EPIVERSE-SUIVI-END -->\n\n")
def main():
    print("REPO",REPO,"DRY_RUN",DRY,flush=True)
    issues=[x for x in listing(f"/repos/{REPO}/issues?state=all") if "pull_request" not in x]
    issues.sort(key=lambda x:x["number"])
    nums={int(n) for n in os.getenv("ISSUE_NUMBERS","").split(",") if n.strip().isdigit()}
    if nums:issues=[x for x in issues if x["number"] in nums]
    issues=issues[:MAX]
    milestones={}
    if not DRY:
        existing=listing(f"/repos/{REPO}/milestones?state=all")
        milestones={x["title"]:x["number"] for x in existing}
        for key,(title,due) in MILESTONES.items():
            if title in milestones:continue
            try:
                item=req("POST",f"/repos/{REPO}/milestones",{"title":title,"description":"EpiVerse : jalon du pilotage scolaire et du produit",**({"due_on":due} if due else {})})
                milestones[title]=item["number"]
                print("MILESTONE+",title,item["number"],flush=True)
            except Exception as e:WARN.append("milestone "+title+": "+str(e))
    fields=[]
    try:
        fields=req("GET",f"/orgs/{ORG}/issue-fields",allow={403,404}) or []
    except Exception as e:WARN.append("Fields: "+str(e))
    priofield=next((f for f in fields if f.get("name","").lower()=="priority"),None)
    fieldoptions={o["name"] for o in priofield.get("options",[])} if priofield else set()
    for idx,item in enumerate(issues):
        number=item["number"]; kind=category(item); labelset={l["name"] for l in item.get("labels",[])}
        p=priority(item,kind); t=team(item); phase=phase_from_body(item,get_phase(item,kind)); owner=responsible(item,kind,t); h=hours(item,kind,t)
        opt={"P0":"Urgent" if number in (103,110,119,141,142,154,155) else "High","P1":"Medium","P2":"Low"}[p]
        status=("archive" if kind=="archive" else "en-cours" if kind=="epic" and number==189 else "en-revue" if number in (104,105,107,108,109,115,137,180,186) else
                "en-cours" if number in (116,117,121,123,148) else "a-faire")
        chosen={x for x in labelset if not x.startswith(("prio:","phase:","etat:","pole:","type:"))}
        chosen.update({f"prio:{p}",f"phase:{phase}",f"pole:{t}",f"etat:{status}",f"type:{kind}"})
        if kind=="archive":chosen.add("archive:historique")
        if owner=="Eckson-Glitho" and "belaid" in (item.get("body") or "").lower()[:280]:chosen.add("affectation:compte-belaid-a-confirmer")
        content=item.get("body") or ""
        content=re.sub(r"<!-- EPIVERSE-SUIVI-START -->.*?<!-- EPIVERSE-SUIVI-END -->\s*","",content,flags=re.S)
        body=block(item,kind,p,phase,owner,t,h)+content
        payload={"body":body,"assignees":[owner],"labels":sorted(chosen)}
        mt=MILESTONES.get(phase,MILESTONES["S9"])[0]
        if mt in milestones:payload["milestone"]=milestones[mt]
        if DRY:
            print("DRY",number,kind,p,phase,owner,mt,h,flush=True);continue
        # GitHub REST supports native Type and issue fields from 2026, but permissions may differ.
        payload["type"]=native_type(kind,item)
        if priofield and opt in fieldoptions:
            payload["issue_field_values"]=[{"field_id":priofield["id"],"value":opt}]
        try:
            req("PATCH",f"/repos/{REPO}/issues/{number}",payload)
            SUCCESS.append(number)
        except Exception as e:
            # Differentiate unsupported org Priority from unsupported native Type.
            try:
                if "issue_field_values" in payload:
                    payload.pop("issue_field_values",None)
                    req("PATCH",f"/repos/{REPO}/issues/{number}",payload)
                    SUCCESS.append(number);WARN.append(f"#{number}: org Priority unavailable: {e}")
                else:raise e
            except Exception as ee:
                try:
                    payload.pop("type",None)
                    req("PATCH",f"/repos/{REPO}/issues/{number}",payload)
                    SUCCESS.append(number);WARN.append(f"#{number}: native Type unavailable: {ee}")
                except Exception as eee: FAIL.append(f"#{number}: {eee}")
        if idx%10==0:print("PROGRESS",idx+1,"/",len(issues),"ok",len(SUCCESS),"fail",len(FAIL),flush=True)
        time.sleep(0.55)
    print("SUMMARY",json.dumps({"total":len(issues),"updated":len(SUCCESS),"failed":FAIL,"warnings":WARN[:15],"native_priority_field":bool(priofield),"milestones":milestones},ensure_ascii=False),flush=True)
    if FAIL:sys.exit(1)
if __name__=="__main__":main()
