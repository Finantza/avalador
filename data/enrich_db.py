# -*- coding: utf-8 -*-
"""
ONYX SEED DATABASE ENRICHER v1.0
Analisa semanticamente todas as questões do banco semente (onyx_database.db)
e as categoriza curricularmente em 1º, 2º ou 3º ano do Ensino Médio de forma equilibrada.
"""

import json
import os
import re

db_path = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\data\onyx_database.db"

# 1. Definição de Palavras-Chave de Classificação Curricular (BNCC Brasil)
keywords_1 = [
    # Geral
    "introdução", "fundamento", "básico", "conceito", "iniciante", "primeiro ano", "1º ano",
    # Português / Literatura
    "morfologia", "plural", "substantivo", "trovadorismo", "humanismo", "classicismo", "quinhentismo", "barroco",
    # Matemática
    "equação do primeiro grau", "função afim", "conjunto", "plana", "triângulo", "perímetro", "área do retângulo",
    # Ciências da Natureza
    "cinemática", "leis de newton", "velocidade média", "movimento uniforme", "tabela periódica", "ligação iônica",
    "ligação covalente", "modelo atômico", "citologia", "célula", "membrana", "organela", "mitose",
    # Ciências Humanas
    "pré-história", "antiguidade", "grécia", "roma", "feudalismo", "idade média", "cartografia", "relevo", "clima", "sócrates", "platão", "aristóteles", "mito"
]

keywords_2 = [
    # Geral
    "segundo ano", "2º ano", "intermediário", "aplicação",
    # Português / Literatura
    "período composto", "regência", "crase", "figura de linguagem", "função da linguagem", "romantismo", "realismo", "naturalismo", "parnasianismo", "simbolismo",
    # Matemática
    "exponencial", "logaritmo", "matriz", "determinante", "progressão", "pa e pg", "geometria espacial", "prisma", "cilindro", "cone", "esfera", "trigonometria",
    # Ciências da Natureza
    "termodinâmica", "calorimetria", "óptica", "ondulatória", "acústica", "estequiometria", "solução", "termoquímica", "cinética", "equilíbrio químico", "fisiologia", "reino", "botânica", "zoologia",
    # Ciências Humanas
    "idade moderna", "revolução industrial", "independência", "império", "industrialização", "urbanização", "escolástica", "descartes", "kant", "empirismo", "racionalismo", "max weber", "karl marx",
    # Financeiro / Itinerários
    "juros simples", "juros compostos", "poupança", "empréstimo", "investimento", "canvas", "mvp", "pitch"
]

keywords_3 = [
    # Geral
    "terceiro ano", "3º ano", "avançado", "análise", "enem", "otimização",
    # Português / Literatura
    "discurso", "coesão", "coerência", "semântica avançada", "redação", "modernismo", "vanguardas", "contemporâneo",
    # Matemática
    "análise combinatória", "probabilidade", "estatística", "desvio padrão", "média ponderada", "moda", "mediana",
    # Ciências da Natureza
    "eletromagnetismo", "carga elétrica", "campo elétrico", "corrente elétrica", "circuito", "magnetismo", "relatividade", "física quântica", "quântico", "química orgânica", "carbono", "isomeria", "reação orgânica", "ecologia", "cadeia alimentar", "ciclo biogeoquímico", "poluição", "biotecnologia",
    # Ciências Humanas
    "idade contemporânea", "guerra mundial", "guerra fria", "república", "ditadura", "geopolítica", "globalização", "existencialismo", "movimentos sociais", "direitos humanos",
    # Itinerários Avançados
    "inteligência artificial", "redes neurais", "machine learning", "deep learning", "llm", "cibersegurança", "criptografia", "blockchain", "big data", "game loop", "hitbox", "game engine", "storyboard", "cromaqui", "mixagem", "abnt", "plágio", "acessibilidade", "wcag", "dua"
]

def classify_by_keywords(text):
    text_lower = text.lower()
    score1 = sum(1 for kw in keywords_1 if kw in text_lower)
    score2 = sum(1 for kw in keywords_2 if kw in text_lower)
    score3 = sum(1 for kw in keywords_3 if kw in text_lower)
    
    if score1 > score2 and score1 > score3:
        return 1
    elif score2 > score1 and score2 > score3:
        return 2
    elif score3 > score1 and score3 > score2:
        return 3
    return None  # Empate ou nenhuma palavra-chave encontrada

def main():
    if not os.path.exists(db_path):
        print(f"Erro: O arquivo semente {db_path} não foi localizado.")
        return

    print("Carregando arquivo semente...")
    with open(db_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    subjects = data.get("subjects", {})
    total_processed = 0
    stats = {1: 0, 2: 0, 3: 0}
    resolved_by_kw = 0
    resolved_by_balancing = 0

    print("Iniciando enriquecimento de questões...")

    for subject_name, difficulties in sorted(subjects.items()):
        for diff_name, questions in difficulties.items():
            if not isinstance(questions, list) or len(questions) == 0:
                continue

            # Passo 1: Classificação por palavras-chave
            classifications = []
            unresolved_indices = []
            counts = {1: 0, 2: 0, 3: 0}

            for idx, q in enumerate(questions):
                # Junta enunciado, explicação e conceito para aumentar resolução
                search_text = " ".join([
                    q.get("q", ""),
                    q.get("explanation", ""),
                    q.get("concept", "")
                ])
                
                # Se o ano já estivesse definido no semente (raro), mantém
                pre_defined = q.get("ano")
                if pre_defined in [1, 2, 3]:
                    year = pre_defined
                else:
                    year = classify_by_keywords(search_text)

                if year is not None:
                    classifications.append(year)
                    counts[year] += 1
                    resolved_by_kw += 1
                else:
                    classifications.append(None)
                    unresolved_indices.append(idx)

            # Passo 2: Alocação Gulosa Autocompensadora para Equilíbrio Curricular
            # Garante que mesmo disciplinas com poucas palavras-chave mapeadas
            # tenham uma distribuição homogênea perfeita de 1º, 2º e 3º ano.
            for idx in unresolved_indices:
                # Encontra o ano com a menor quantidade acumulada de questões neste pool
                assigned_year = min(counts.keys(), key=lambda k: counts[k])
                classifications[idx] = assigned_year
                counts[assigned_year] += 1
                resolved_by_balancing += 1

            # Passo 3: Gravação das propriedades enriquecidas nos objetos de questão
            for idx, q in enumerate(questions):
                year = classifications[idx]
                q["ano"] = year
                stats[year] += 1
                total_processed += 1

    # Gravar as alterações de volta no arquivo semente
    print("Gravando arquivo semente enriquecido...")
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n=== ESTATÍSTICAS DE ENRIQUECIMENTO ===")
    print(f"Total de Questões Processadas: {total_processed}")
    print(f"Mapeadas por Semântica: {resolved_by_kw} ({resolved_by_kw*100/total_processed:.1f}%)")
    print(f"Mapeadas por Balanço Curricular: {resolved_by_balancing} ({resolved_by_balancing*100/total_processed:.1f}%)")
    print("\nDistribuição Final por Ano Letivo:")
    print(f"  1º Ano: {stats[1]} questões ({stats[1]*100/total_processed:.1f}%)")
    print(f"  2º Ano: {stats[2]} questões ({stats[2]*100/total_processed:.1f}%)")
    print(f"  3º Ano: {stats[3]} questões ({stats[3]*100/total_processed:.1f}%)")
    print("\n[SUCESSO] Semente enriquecido com êxito e gravado no disco!")

if __name__ == "__main__":
    main()
