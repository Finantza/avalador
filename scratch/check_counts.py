import json

def count_words(text):
    return len(text.split())

with open('knowledge_db.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for category in data:
    for difficulty in data[category]:
        for q in data[category][difficulty]:
            counts = [count_words(opt) for opt in q['options']]
            if len(set(counts)) > 1:
                print(f"Fix needed: {category} - {difficulty} - {q['question']}")
                print(f"  Current counts: {counts}")
                print(f"  Options: {q['options']}")
