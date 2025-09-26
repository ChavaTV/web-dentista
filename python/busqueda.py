import json

# Cargar el JSON
with open("estructura_colonias.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Buscar colonias de IRAPUATO con clave 017 en estado 11
colonias = data.get("11", {}).get("IRAPUATO", {}).get("017", [])

if colonias:
    print("Colonias encontradas:", colonias)
else:
    print("No se encontraron colonias")
