# --- IN-MEMORY DATABASE ---
# Moving this list here ensures it persists as long as the app is open.
vessel_data = [
    {
        "cfr": "BGR001234567",
        "name": "Света Анна",
        "owner": "Риболов ЕООД",
        "params": "Мощност: 150HP",
        "status": "Активен"
    },
    {
        "cfr": "BGR009876543",
        "name": "Чайка",
        "owner": "Иван Иванов",
        "params": "Мощност: 90HP",
        "status": "В ремонт"
    }
]


def get_vessel_registry():
    """
    Returns the current list of vessels.
    Crucial: It must explicitly 'return' the list so app_interface can read it.
    """
    return vessel_data


def save_vessel(cfr, name, owner, power):
    """
    Creates a new dictionary and appends it to the vessel_data list.
    """
    new_entry = {
        "cfr": cfr,
        "name": name,
        "owner": owner,
        "params": f"Мощност: {power}HP",
        "status": "Нов запис"
    }

    # Python's equivalent to C++ vector.push_back()
    vessel_data.append(new_entry)

    # This will show up in your PyCharm terminal for verification
    print(f"DEBUG: Vessel '{name}' successfully added to memory.")

    return True