import json
import os
import sys
import urllib.request


url = sys.argv[1]
payload = json.dumps({"message": "What is the return policy?"}).encode()
headers = {"Content-Type": "application/json"}

internal_key = os.environ.get("INTERNAL_API_KEY")
if internal_key:
    headers["x-internal-api-key"] = internal_key
    headers["x-user-id"] = os.environ.get("SMOKE_USER_ID", "1")

request = urllib.request.Request(url, data=payload, headers=headers, method="POST")

with urllib.request.urlopen(request, timeout=30) as response:
    data = json.loads(response.read().decode())

if not data.get("answer"):
    raise SystemExit("AI smoke test failed: missing answer")

print("AI smoke test passed.")
