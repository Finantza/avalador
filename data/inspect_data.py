import json

expanded_path = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\data\onyx_knowledge_expanded.json"
knowledge_path = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\data\knowledge_db.json"

with open(expanded_path, "r", encoding="utf-8") as f:
    expanded_data = json.load(f)

with open(knowledge_path, "r", encoding="utf-8") as f:
    knowledge_data = json.load(f)

print("=== EXPANDED DATA SUBJECTS ===")
for subj, diffs in sorted(expanded_data.items()):
    total = sum(len(qs) for qs in diffs.values())
    diff_breakdown = ", ".join(f"{d}:{len(qs)}" for d, qs in diffs.items())
    print(f"{subj}: total {total} ({diff_breakdown})")

print("\n=== KNOWLEDGE DATA SUBJECTS ===")
for subj, diffs in sorted(knowledge_data.items()):
    total = sum(len(qs) for qs in diffs.values())
    diff_breakdown = ", ".join(f"{d}:{len(qs)}" for d, qs in diffs.items())
    print(f"{subj}: total {total} ({diff_breakdown})")
