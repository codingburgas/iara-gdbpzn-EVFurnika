# -*- coding: utf-8 -*-
"""
IARA - SQLite data layer.

Creates the tables and seeds them with demo data matching web/js/data.js.
Uses only the Python standard library (sqlite3), no external dependencies.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "iara.db")

# Table -> list of columns (without 'id')
SCHEMA = {
    "korabi": [
        "ime", "mejdunaroden_nomer", "pozivna", "markirovka", "pristanishte",
        "sobstvenik", "kapitan", "dalzhina", "shirina", "tonaj", "gazene",
        "moshtnost", "gorivo", "tip", "status",
    ],
    "razreshitelni": [
        "nomer", "korab", "sobstvenik", "kapitan", "uredi", "zona",
        "izdadeno", "validno_do", "status",
    ],
    "dnevnik": [
        "korab", "data", "start", "kray", "zona", "uredi",
        "vid_riba", "kolichestvo", "edinica", "status",
    ],
    "inspekcii": [
        "nomer", "inspektor", "obekt_tip", "obekt", "mqsto", "data",
        "rezultat", "akt", "globa", "belejka",
    ],
    "bileti": [
        "nomer", "ime", "egn", "email", "kategoria", "srok", "cena",
        "ot", "do_data", "telk", "created",
    ],
}


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the tables (if missing) and load the seed data."""
    conn = get_conn()
    cur = conn.cursor()
    for table, cols in SCHEMA.items():
        col_defs = ", ".join(f"{c} TEXT" for c in cols)
        cur.execute(f"CREATE TABLE IF NOT EXISTS {table} (id INTEGER PRIMARY KEY AUTOINCREMENT, {col_defs})")
    conn.commit()

    # Seed demo data only if the table is empty
    for table, rows in SEED.items():
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        if cur.fetchone()[0] == 0:
            for row in rows:
                cols = SCHEMA[table]
                placeholders = ", ".join("?" for _ in cols)
                values = [row.get(c) for c in cols]
                cur.execute(
                    f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})",
                    values,
                )
    conn.commit()
    conn.close()


def fetch_all(table):
    conn = get_conn()
    rows = conn.execute(f"SELECT * FROM {table} ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def insert(table, data):
    """Insert a new row and return it with the generated id."""
    cols = SCHEMA[table]
    used = [c for c in cols if c in data]
    placeholders = ", ".join("?" for _ in used)
    values = [data[c] for c in used]
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {table} ({', '.join(used)}) VALUES ({placeholders})",
        values,
    )
    conn.commit()
    new_id = cur.lastrowid
    row = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (new_id,)).fetchone()
    conn.close()
    return dict(row)


def update(table, row_id, data):
    """Update a row by id and return it (or None if it does not exist)."""
    cols = SCHEMA[table]
    used = [c for c in cols if c in data]
    conn = get_conn()
    if used:
        set_clause = ", ".join(f"{c} = ?" for c in used)
        values = [data[c] for c in used] + [row_id]
        conn.execute(f"UPDATE {table} SET {set_clause} WHERE id = ?", values)
        conn.commit()
    row = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (row_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def delete(table, row_id):
    """Delete a row by id."""
    conn = get_conn()
    conn.execute(f"DELETE FROM {table} WHERE id = ?", (row_id,))
    conn.commit()
    conn.close()
    return True


# --- Seed (demo) data ---
SEED = {
    "korabi": [
        dict(ime="Свети Никола", mejdunaroden_nomer="BGR000124578", pozivna="LZ4521",
             markirovka="BS-1245", pristanishte="Бургас", sobstvenik="Морски риболов ЕООД",
             kapitan="Иван Петров Димитров", dalzhina=18.4, shirina=5.2, tonaj=42,
             gazene=2.1, moshtnost=240, gorivo="Дизел", tip="Траулер", status="активен"),
        dict(ime="Калиакра", mejdunaroden_nomer="BGR000118903", pozivna="LZ3380",
             markirovka="VN-0890", pristanishte="Варна", sobstvenik="Георги Стоянов Колев",
             kapitan="Георги Стоянов Колев", dalzhina=12.7, shirina=4.1, tonaj=19,
             gazene=1.6, moshtnost=150, gorivo="Дизел", tip="Сейнер", status="активен"),
        dict(ime="Черноморец", mejdunaroden_nomer="BGR000130011", pozivna="LZ7712",
             markirovka="BS-3001", pristanishte="Созопол", sobstvenik="Понтика Фиш АД",
             kapitan="Димитър Ангелов Тодоров", dalzhina=24.0, shirina=6.8, tonaj=78,
             gazene=2.9, moshtnost=410, gorivo="Дизел", tip="Траулер", status="активен"),
        dict(ime="Делфин", mejdunaroden_nomer="BGR000121456", pozivna="LZ2210",
             markirovka="BG-2146", pristanishte="Несебър", sobstvenik="Атанас Иванов Маринов",
             kapitan="Атанас Иванов Маринов", dalzhina=9.2, shirina=3.0, tonaj=8,
             gazene=1.1, moshtnost=85, gorivo="Бензин", tip="Крайбрежна лодка", status="активен"),
        dict(ime="Посейдон", mejdunaroden_nomer="BGR000127788", pozivna="LZ5567",
             markirovka="VN-2778", pristanishte="Варна", sobstvenik="Аква Трейд ООД",
             kapitan="Николай Петков Илиев", dalzhina=21.5, shirina=6.0, tonaj=64,
             gazene=2.5, moshtnost=360, gorivo="Дизел", tip="Траулер", status="спрян"),
        dict(ime="Бриз", mejdunaroden_nomer="BGR000119234", pozivna="LZ1190",
             markirovka="BS-1923", pristanishte="Поморие", sobstvenik="Стефан Колев Георгиев",
             kapitan="Стефан Колев Георгиев", dalzhina=11.0, shirina=3.6, tonaj=14,
             gazene=1.4, moshtnost=120, gorivo="Дизел", tip="Сейнер", status="активен"),
    ],
    "razreshitelni": [
        dict(nomer="РБ-2026-00124", korab="Свети Никола", sobstvenik="Морски риболов ЕООД", kapitan="Иван Петров Димитров", uredi="Дънна тралова мрежа", zona="Зона B – Южно Черноморие", izdadeno="2026-01-15", validno_do="2026-12-31", status="валидно"),
        dict(nomer="РБ-2026-00088", korab="Калиакра", sobstvenik="Георги Стоянов Колев", kapitan="Георги Стоянов Колев", uredi="Пелагичен трал, хрилни мрежи", zona="Зона A – Северно Черноморие", izdadeno="2026-01-10", validno_do="2026-12-31", status="валидно"),
        dict(nomer="РБ-2026-00301", korab="Черноморец", sobstvenik="Понтика Фиш АД", kapitan="Димитър Ангелов Тодоров", uredi="Дънна тралова мрежа, грибове", zona="Зона B – Южно Черноморие", izdadeno="2026-02-01", validno_do="2026-12-31", status="валидно"),
        dict(nomer="РБ-2025-00277", korab="Посейдон", sobstvenik="Аква Трейд ООД", kapitan="Николай Петков Илиев", uredi="Дънна тралова мрежа", zona="Зона A – Северно Черноморие", izdadeno="2025-01-20", validno_do="2025-12-31", status="отнето"),
        dict(nomer="РБ-2025-00214", korab="Делфин", sobstvenik="Атанас Иванов Маринов", kapitan="Атанас Иванов Маринов", uredi="Хрилни мрежи, въдици", zona="Зона B – Южно Черноморие", izdadeno="2025-03-05", validno_do="2025-12-31", status="изтекло"),
        dict(nomer="РБ-2026-00190", korab="Бриз", sobstvenik="Стефан Колев Георгиев", kapitan="Стефан Колев Георгиев", uredi="Грибове, парагади", zona="Зона B – Южно Черноморие", izdadeno="2026-02-18", validno_do="2026-12-31", status="валидно"),
    ],
    "dnevnik": [
        dict(korab="Свети Никола", data="2026-06-28", start="04:30", kray="11:15", zona="Зона B – кв. 42°20′ / 27°55′", uredi="Дънна тралова мрежа", vid_riba="Калкан", kolichestvo=180, edinica="кг", status="разтоварен"),
        dict(korab="Черноморец", data="2026-06-28", start="05:00", kray="13:40", zona="Зона B – кв. 42°10′ / 28°05′", uredi="Пелагичен трал", vid_riba="Цаца", kolichestvo=950, edinica="кг", status="разтоварен"),
        dict(korab="Калиакра", data="2026-06-27", start="06:10", kray="12:00", zona="Зона A – кв. 43°15′ / 28°10′", uredi="Хрилни мрежи", vid_riba="Сафрид", kolichestvo=220, edinica="кг", status="в транспорт"),
        dict(korab="Свети Никола", data="2026-06-26", start="04:45", kray="10:30", zona="Зона B – кв. 42°22′ / 27°50′", uredi="Дънна тралова мрежа", vid_riba="Барбун", kolichestvo=95, edinica="кг", status="в магазин"),
        dict(korab="Бриз", data="2026-06-26", start="05:30", kray="09:50", zona="Зона B – кв. 42°35′ / 27°45′", uredi="Грибове", vid_riba="Попче", kolichestvo=60, edinica="кг", status="разтоварен"),
    ],
    "inspekcii": [
        dict(nomer="ИНС-2026-0451", inspektor="Петър Радев", obekt_tip="Кораб", obekt="Свети Никола", mqsto="Пристанище Бургас", data="2026-06-28", rezultat="редовно", akt="", globa=0, belejka="Уловът съответства на електронния дневник и разрешителното."),
        dict(nomer="ИНС-2026-0448", inspektor="Мария Колева", obekt_tip="Магазин", obekt="Риба Маркет – Варна", mqsto="Варна", data="2026-06-27", rezultat="нарушение", akt="АКТ-2026-0112", globa=1500, belejka="Липсва документ за произход на част от продаваната риба."),
        dict(nomer="ИНС-2026-0445", inspektor="Петър Радев", obekt_tip="Хладилен камион", obekt="СВ 4521 ВТ", mqsto="АМ Тракия", data="2026-06-27", rezultat="редовно", akt="", globa=0, belejka="Проследяемостта на товара е потвърдена."),
        dict(nomer="ИНС-2026-0440", inspektor="Иван Симеонов", obekt_tip="Кораб", obekt="Посейдон", mqsto="Пристанище Варна", data="2026-06-25", rezultat="нарушение", akt="АКТ-2026-0109", globa=3000, belejka="Риболов с отнето разрешително. Уредите са иззети."),
        dict(nomer="ИНС-2026-0436", inspektor="Мария Колева", obekt_tip="Любителски риболов", obekt="яз. Камчия", mqsto="яз. Камчия", data="2026-06-24", rezultat="предупреждение", akt="", globa=0, belejka="Билетът е валиден, но липсва регистрация на улова в приложението."),
    ],
    "bileti": [],
}


if __name__ == "__main__":
    init_db()
    print("Database created:", DB_PATH)
