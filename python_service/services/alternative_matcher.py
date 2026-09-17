from utils.normalization import normalize_composition, extract_dosage_form

def match_alternatives(source_medicine, all_medicines):
    source_target = source_medicine.get("targetSpecies")
    if not source_target:
        return []

    source_comp = normalize_composition(source_medicine.get("composition", ""))
    source_dosage = extract_dosage_form(source_medicine.get("name", "") + " " + source_medicine.get("description", ""))

    alternatives = []
    
    for med in all_medicines:
        # Don't match with itself
        if str(med["_id"]) == str(source_medicine["_id"]):
            continue
            
        # Must match target species (Human vs Animal)
        if med.get("targetSpecies") != source_target:
            continue

        med_comp = normalize_composition(med.get("composition", ""))
        if not source_comp or not med_comp:
            continue
            
        med_dosage = extract_dosage_form(med.get("name", "") + " " + med.get("description", ""))

        # Check for Exact Match
        if source_comp == med_comp:
            score = 100
            match_type = "Exact Composition"
            reason = "Same active ingredient and strength."
            if source_dosage == med_dosage and source_dosage != "tablet":
                score += 5 # slight boost for matching dosage forms other than the default guess
        else:
            # Let's do a basic "Same active ingredient, different strength" check
            # Very simplistic for demo: if they share a word in composition >= 5 chars
            # or if the non-number parts of composition are similar
            source_words = set([w for w in source_comp.split() if not any(c.isdigit() for c in w)])
            med_words = set([w for w in med_comp.split() if not any(c.isdigit() for c in w)])
            
            if source_words and source_words == med_words:
                score = 80
                match_type = "Different Strength"
                reason = "Same active ingredient, different strength — pharmacist verification required."
            elif source_words and source_words.intersection(med_words):
                score = 50
                match_type = "Partial Composition"
                reason = "Partial composition similarity — not equivalent."
            else:
                continue # No match

        alternatives.append({
            "id": str(med["_id"]),
            "name": med.get("name"),
            "composition": med.get("composition"),
            "targetSpecies": med.get("targetSpecies"),
            "stock": med.get("stock", 0),
            "price": med.get("price", 0.0),
            "matchType": match_type,
            "matchScore": score,
            "reason": reason
        })

    # Sort alternatives by score (descending), then stock (descending)
    alternatives.sort(key=lambda x: (x["matchScore"], x["stock"]), reverse=True)
    return alternatives
