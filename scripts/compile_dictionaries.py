import os
import json
import glob
import xml.etree.ElementTree as ET

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'datasets')

# Reverse mappings based on lib/sigml.ts
SHAPES = ["fist", "flat", "finger2", "finger23", "finger2345", "finger23spread", "pinch12", "pinchall", "cee12", "ceeall"]
DIRS = ["u", "d", "l", "r", "o", "i", "ul", "ur", "dl", "dr", "ol", "or"]
LOCATIONS = {
    "head": "head", "forehead": "forehead", "eyes": "eyes", "nose": "nose",
    "mouth": "mouth", "chin": "chin", "cheek": "cheek", "neck": "neck",
    "shoulders": "shoulders", "chest": "chest", "stomach": "stomach",
    "neutral": "neutral_space", "shoulderleft": "shoulder_l", 
    "shoulderright": "shoulder_r", "handweak": "palm_weak"
}

def parse_sigml_file(filepath):
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        # Find the first hns_sign
        hns_sign = root.find('.//hns_sign')
        if hns_sign is None:
            return None
            
        gloss = hns_sign.attrib.get('gloss', '').upper()
        if not gloss:
            gloss = os.path.splitext(os.path.basename(filepath))[0].upper()
            
        manual = hns_sign.find('.//hamnosys_manual')
        if manual is None:
            return None
            
        entry = {
            "gloss": gloss,
            "twoHanded": False,
            "dominant": {
                "shape": "fist", # Defaults
                "extFingerDir": "u",
                "palmOr": "i",
                "location": "chest"
            },
            "movement": {
                "type": "none"
            }
        }
        
        tags = [child.tag for child in manual]
        
        # Very basic heuristic mapping for the first pass
        for tag in tags:
            tag = tag.replace('ham', '')
            
            if tag in SHAPES:
                entry["dominant"]["shape"] = tag
            
            if tag.startswith('extfinger'):
                d = tag.replace('extfinger', '')
                if d in DIRS: entry["dominant"]["extFingerDir"] = d
                
            if tag.startswith('palm'):
                d = tag.replace('palm', '')
                if d in DIRS: entry["dominant"]["palmOr"] = d
                
            if tag in LOCATIONS:
                entry["dominant"]["location"] = LOCATIONS[tag]
                
            if tag.startswith('move'):
                entry["movement"]["type"] = "straight"
                d = tag.replace('move', '')
                if d in DIRS: entry["movement"]["direction"] = d
                
            if tag == 'symmlr' or tag == 'symmpar':
                entry["twoHanded"] = True
                entry["symmetric"] = True
                
            if tag == 'circle': entry["movement"]["type"] = "circle"
            if tag == 'wavy': entry["movement"]["type"] = "wavy"
            if tag == 'zigzag': entry["movement"]["type"] = "zigzag"
            if tag == 'nomotion': entry["movement"]["type"] = "contact"
            if tag == 'nod': entry["movement"]["type"] = "nod"
            if tag == 'twist': entry["movement"]["type"] = "twist"
            
        return entry
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None

def compile_dataset(lang):
    dir_path = os.path.join(DATA_DIR, lang)
    if not os.path.exists(dir_path):
        print(f"Directory {dir_path} not found.")
        return
        
    entries = []
    files = glob.glob(os.path.join(dir_path, '*.sigml'))
    for f in files:
        parsed = parse_sigml_file(f)
        if parsed:
            entries.append(parsed)
            
    out_file = os.path.join(DATA_DIR, f"{lang}_dictionary.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2)
        
    print(f"Compiled {len(entries)} entries for {lang.upper()} into {out_file}")

if __name__ == "__main__":
    compile_dataset('isl')
    compile_dataset('asl')
    compile_dataset('bsl')
