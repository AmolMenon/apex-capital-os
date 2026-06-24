import sqlite3

db = sqlite3.connect("backend/apex_capital.db")
c = db.cursor()

columns_to_add = [
    ("founder_name", "VARCHAR")
]

for col_name, col_type in columns_to_add:
    try:
        c.execute(f"ALTER TABLE deals ADD COLUMN {col_name} {col_type}")
        print(f"Added {col_name}")
    except sqlite3.OperationalError as e:
        print(f"Skipped {col_name}: {e}")

db.commit()
db.close()
