import os
import requests
import json

GITHUB_USERNAME = "rakeshhalijol"
API_URL = f"https://api.github.com/users/{GITHUB_USERNAME}/repos"
BANNER_KEYWORD = "banner"

headers = {"Accept": "application/vnd.github.v3+json"}

print("Fetching repositories...")
repos = requests.get(API_URL, headers=headers).json()
projects = []

if not isinstance(repos, list):
    print("Error fetching repositories:", repos)
    exit(1)

for repo in repos:
    name = repo["name"]
    desc = repo.get("description", "No description available.")
    html_url = repo["html_url"]

    contents_url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{name}/contents"
    contents_resp = requests.get(contents_url, headers=headers)
    contents = contents_resp.json()

    if not isinstance(contents, list):
        print(
            f"Skipping {name}: Failed to fetch contents. Response: {contents}")
        continue

    banner_img = None
    for item in contents:
        if item["type"] == "dir" and item["name"].lower() == BANNER_KEYWORD:
            banner_dir_url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{name}/contents/{item['name']}"
            banner_contents = requests.get(
                banner_dir_url, headers=headers).json()

            if isinstance(banner_contents, list):
                for file in banner_contents:
                    if file["type"] == "file" and file["name"].lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                        banner_img = file["download_url"]
                        break
            break

    if banner_img:
        projects.append({
            "name": name.replace("-", " ").title(),
            "description": desc,
            "banner": banner_img,
            "repo": html_url
        })

# Save to projects.json
with open("projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print(f"Updated projects.json with {len(projects)} projects.")
