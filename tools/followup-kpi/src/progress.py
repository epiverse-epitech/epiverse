"""Utilitaires KPI de démonstration pour les suivis, sans dépendances externes."""
def completion_rate(completed: int, total: int) -> float:
    if total <= 0 or completed < 0 or completed > total:
        raise ValueError("Invalid progress values")
    return round(100 * completed / total, 2)


def remaining_hours(tasks: list[dict]) -> float:
    values = [task["remaining_hours"] for task in tasks]
    if any(not isinstance(v, (int, float)) or v < 0 for v in values):
        raise ValueError("Invalid remaining hours")
    return float(sum(values))
