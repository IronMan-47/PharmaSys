import urllib.request
import json

url = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States"
output_path = "frontend/src/assets/india-states.json"

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f)
    print("Successfully downloaded India GeoJSON")
except Exception as e:
    print(f"Failed: {e}")
    # Backup URL
    backup_url = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson"
    try:
        req = urllib.request.Request(backup_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f)
        print("Successfully downloaded India GeoJSON from backup")
    except Exception as e2:
        print(f"Backup Failed: {e2}")
