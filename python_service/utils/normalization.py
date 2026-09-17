import re

def normalize_composition(composition_str):
    if not composition_str:
        return ""
    # Lowercase
    text = composition_str.lower()
    # Remove extra whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove common punctuation separating items, replace with space
    text = re.sub(r'[,;+]', ' ', text)
    # Normalize mg, g, mcg by removing space before unit
    text = re.sub(r'(\d+)\s*(mg|g|mcg|ml)', r'\1\2', text)
    # Standardize spacing around numbers (optional, but good for "paracetamol500mg" -> "paracetamol 500mg")
    text = re.sub(r'([a-z]+)(\d+)', r'\1 \2', text)
    # Remove extra spaces again
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_ingredients(composition_str):
    # Extremely simplified rule-based extraction for the demo
    # Split by common delimiters
    text = composition_str.lower()
    parts = re.split(r'\+| and |,|;', text)
    ingredients = []
    for part in parts:
        part = part.strip()
        if not part: continue
        # Try to find name and strength
        # e.g., "paracetamol 500 mg"
        match = re.search(r'([a-z\s\-]+)\s*(\d+(?:\.\d+)?)\s*(mg|g|mcg|ml)?', part)
        if match:
            name = match.group(1).strip()
            strength = float(match.group(2))
            unit = match.group(3) or "mg"
            ingredients.append({"name": name, "strength": strength, "unit": unit})
        else:
            ingredients.append({"name": part, "strength": None, "unit": None})
    return ingredients

def extract_dosage_form(name_or_desc):
    text = name_or_desc.lower()
    forms = ["tablet", "capsule", "syrup", "injection", "cream", "ointment", "drops", "gel"]
    for form in forms:
        if form in text:
            return form
    return "tablet" # Default guess if none found, or None
