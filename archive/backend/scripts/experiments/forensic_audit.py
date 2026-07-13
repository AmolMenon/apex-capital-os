import sqlite3
import json

def audit():
    conn = sqlite3.connect('live_val.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    print("=== DECISIONS ===")
    c.execute("SELECT id, title, status FROM decisions")
    for row in c.fetchall():
        print(dict(row))

    print("\n=== REASONING RUNS ===")
    c.execute("SELECT id, decision_id, status, execution_mode, provider, model, execution_topology, evaluation_run_id, token_usage_json, latency_ms_json, intermediate_state_json, output_json, errors_json FROM reasoning_runs")
    for row in c.fetchall():
        d = dict(row)
        for k in ['token_usage_json', 'latency_ms_json', 'intermediate_state_json', 'output_json', 'errors_json']:
            if d[k]: d[k] = json.loads(d[k])
        print(json.dumps(d, indent=2))

    print("\n=== ESCALATION SIGNALS ===")
    c.execute("SELECT * FROM escalation_signals")
    for row in c.fetchall():
        print(dict(row))

    print("\n=== CHALLENGE TASKS ===")
    c.execute("SELECT * FROM challenge_tasks")
    for row in c.fetchall():
        print(dict(row))

    print("\n=== CHALLENGE FINDINGS ===")
    c.execute("SELECT * FROM challenge_findings")
    for row in c.fetchall():
        print(dict(row))

    print("\n=== RECOMMENDATIONS ===")
    c.execute("SELECT * FROM recommendations")
    for row in c.fetchall():
        print(dict(row))

    print("\n=== GRAPH EDGES ===")
    try:
        c.execute("SELECT * FROM graph_edges")
        for row in c.fetchall():
            print(dict(row))
    except sqlite3.OperationalError:
        print("Table graph_edges not found")

    print("\n=== GRAPH NODES ===")
    try:
        c.execute("SELECT * FROM graph_nodes")
        for row in c.fetchall():
            print(dict(row))
    except sqlite3.OperationalError:
        print("Table graph_nodes not found")

if __name__ == '__main__':
    audit()
