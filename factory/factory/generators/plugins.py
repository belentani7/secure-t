"""SCORM 2004 + xAPI + LTI."""
import json
import zipfile

MANIFEST = """<?xml version="1.0"?><manifest xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" identifier="ST-{slug}">
<organizations><organization identifier="O1" structure="hierarchical">
<item identifier="I1" identifierref="R1"><title>{title}</title></item></organization></organizations>
<resources><resource identifier="R1" type="webcontent" href="index.html"/></resources></manifest>"""


def gen_scorm(course_slug, lesson_title, lesson_id, video_url, out_path):
    z = zipfile.ZipFile(out_path, "w")
    z.writestr("imsmanifest.xml", MANIFEST.format(slug=course_slug, title=lesson_title))
    z.writestr("index.html", f'<html><body style="background:#070D18;color:#F3EFE7"><video src="{video_url}" controls width="960"></video></body></html>')
    z.close()


def gen_xapi(lesson_id, user="demo", verb="completed"):
    return {"actor": {"account": {"name": user}}, "verb": {"id": f"http://adlnet.gov/expapi/verbs/{verb}"},
            "object": {"id": f"https://securet.university/lessons/{lesson_id}"},
            "result": {"score": {"raw": 100}, "completion": True}}


def gen_lti_config(course_slug):
    return json.dumps({"issuer": "https://securet.university", "client_id": course_slug,
                       "auth_endpoint": "https://securet.university/lti/login",
                       "token_endpoint": "https://securet.university/lti/token"}, indent=2)
