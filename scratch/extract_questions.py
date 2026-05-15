import json
import re
from assessment_engine import BancoQuestoesDataScience, BancoQuestoesDesenvolvimento

def extract_questions():
    ds_questions = []
    ds_questions.extend(BancoQuestoesDataScience.questoes_python_basico())
    ds_questions.extend(BancoQuestoesDataScience.questoes_numpy())
    ds_questions.extend(BancoQuestoesDataScience.questoes_pandas())
    ds_questions.extend(BancoQuestoesDataScience.questoes_estatistica())
    ds_questions.extend(BancoQuestoesDataScience.questoes_machine_learning())
    ds_questions.extend(BancoQuestoesDataScience.questoes_visualizacao())
    ds_questions.extend(BancoQuestoesDataScience.questoes_sql())

    dev_questions = []
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_github_git())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_poo())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_apis())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_testes())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_banco_dados())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_devops())
    dev_questions.extend(BancoQuestoesDesenvolvimento.questoes_algoritmos())

    all_questions = ds_questions + dev_questions
    
    # Organize by subject and difficulty for Onyx
    onyx_db = {
        "python": {"easy": [], "medium": [], "hard": []},
        "numpy": {"easy": [], "medium": [], "hard": []},
        "pandas": {"easy": [], "medium": [], "hard": []},
        "estatistica": {"easy": [], "medium": [], "hard": []},
        "machine_learning": {"easy": [], "medium": [], "hard": []},
        "visualizacao": {"easy": [], "medium": [], "hard": []},
        "sql": {"easy": [], "medium": [], "hard": []},
        "git": {"easy": [], "medium": [], "hard": []},
        "poo": {"easy": [], "medium": [], "hard": []},
        "apis": {"easy": [], "medium": [], "hard": []},
        "testes": {"easy": [], "medium": [], "hard": []},
        "banco_dados": {"easy": [], "medium": [], "hard": []},
        "devops": {"easy": [], "medium": [], "hard": []},
        "algoritmos": {"easy": [], "medium": [], "hard": []},
    }

    subject_map = {
        "Python Básico": "python",
        "Python Intermediário": "python",
        "NumPy": "numpy",
        "NumPy Avançado": "numpy",
        "Pandas": "pandas",
        "Pandas Avançado": "pandas",
        "Estatística": "estatistica",
        "Estatística Avançada": "estatistica",
        "Machine Learning": "machine_learning",
        "Machine Learning Avançado": "machine_learning",
        "Visualização": "visualizacao",
        "SQL": "sql",
        "SQL Avançado": "sql",
        "Git & GitHub": "git",
        "Programação Orientada a Objetos": "poo",
        "POO Avançada": "poo",
        "APIs REST": "apis",
        "Testes": "testes",
        "Testes Avançados": "testes",
        "Banco de Dados": "banco_dados",
        "Banco de Dados Avançado": "banco_dados",
        "DevOps": "devops",
        "DevOps Avançado": "devops",
        "Algoritmos": "algoritmos"
    }

    level_map = {
        "basico": "easy",
        "intermediario": "medium",
        "avancado": "hard"
    }

    for q in all_questions:
        subj = subject_map.get(q.get("tema"), "logic")
        lvl = level_map.get(q.get("nivel"), "easy")
        
        formatted = {
            "id": q["id"],
            "question": q["pergunta"],
            "options": q["alternativas"],
            "answer": q["resposta_correta"],
            "explanation": q.get("explicacao", ""),
            "difficulty": q.get("dificuldade", 1),
            "tags": list(set([q.get("tema"), subj] + q.get("tags", []))),
            "time_limit": q.get("tempo_estimado", 60),
            "subject": subj
        }
        
        if subj not in onyx_db:
            onyx_db[subj] = {"easy": [], "medium": [], "hard": []}
        
        onyx_db[subj][lvl].append(formatted)

    with open('onyx_knowledge_expanded.json', 'w', encoding='utf-8') as f:
        json.dump(onyx_db, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    extract_questions()
