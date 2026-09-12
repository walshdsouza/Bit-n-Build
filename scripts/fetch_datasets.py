import os
import urllib.request
import json
import base64
import time
import zipfile
import io

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'datasets')
HEADERS = {'User-Agent': 'Mozilla/5.0'}

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def download_github_dir(repo, branch, out_dir):
    ensure_dir(out_dir)
    print(f"Fetching tree for {repo}...")
    url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
    
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode())
    except Exception as e:
        print(f"Failed to fetch {repo}: {e}")
        return

    sigml_files = [f for f in data.get('tree', []) if f['path'].endswith('.sigml')]
    print(f"Found {len(sigml_files)} .sigml files in {repo}. Downloading...")

    for i, file_obj in enumerate(sigml_files):
        try:
            # We construct the raw URL
            raw_url = f"https://raw.githubusercontent.com/{repo}/{branch}/{urllib.parse.quote(file_obj['path'])}"
            file_name = os.path.basename(file_obj['path'])
            out_path = os.path.join(out_dir, file_name)
            
            # Avoid re-downloading
            if os.path.exists(out_path):
                continue
                
            req_file = urllib.request.Request(raw_url, headers=HEADERS)
            content = urllib.request.urlopen(req_file).read()
            
            with open(out_path, 'wb') as f:
                f.write(content)
            
            if (i+1) % 50 == 0:
                print(f"Downloaded {i+1}/{len(sigml_files)}")
                time.sleep(1) # Rate limiting buffer
        except Exception as e:
            print(f"Failed to download {file_obj['path']}: {e}")

def download_zip_and_extract(url, out_dir, ext='.sigml'):
    ensure_dir(out_dir)
    print(f"Downloading ZIP from {url}...")
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        response = urllib.request.urlopen(req)
        zip_data = response.read()
        with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
            count = 0
            for name in z.namelist():
                if name.endswith(ext):
                    filename = os.path.basename(name)
                    if filename:
                        with open(os.path.join(out_dir, filename), 'wb') as f:
                            f.write(z.read(name))
                        count += 1
            print(f"Extracted {count} {ext} files to {out_dir}")
    except Exception as e:
        print(f"Failed to download or extract ZIP: {e}")

if __name__ == "__main__":
    print("Starting dataset downloads...")
    
    print("\n--- Downloading ISL Dataset ---")
    download_zip_and_extract("https://github.com/shoebham/text_to_isl/archive/refs/heads/main.zip", os.path.join(DATA_DIR, 'isl'))
    
    print("\n--- Downloading BSL Dataset ---")
    download_zip_and_extract("https://github.com/vhcg/sigml/archive/refs/heads/master.zip", os.path.join(DATA_DIR, 'bsl'))
    
    print("\n--- Downloading ASL Dataset ---")
    download_zip_and_extract("https://github.com/PratyushaKumarKar/ASLtoSig-transformer/archive/refs/heads/main.zip", os.path.join(DATA_DIR, 'asl'))
    
    print("\nFinished downloading datasets.")
