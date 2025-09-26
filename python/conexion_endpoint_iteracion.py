import requests
import json
import time

API_URL = "https://api.tau.com.mx/dipomex/v1/municipios"
API_KEY = "272406fa9058c2494438c4872b8dba1450c0cbc1"  # Reemplaza con tu clave real

# Lista de IDs de estado (del 01 al 32 como strings)
id_estados = [f"{i:02}" for i in range(1, 33)]

# Diccionario para almacenar todos los municipios
todos_municipios = {}

for id_estado in id_estados:
    print(f"Consultando estado {id_estado}...")
    try:
        response = requests.get(
            f"{API_URL}?id_estado={id_estado}",
            headers={"APIKEY": API_KEY}
        )
        response.raise_for_status()
        data = response.json()
        todos_municipios[id_estado] = data
    except Exception as e:
        print(f"Error en estado {id_estado}: {e}")
    time.sleep(0.5)  # Pausa para evitar saturar el servidor

# Guardar en archivo JSON
with open("municipios_por_estado.json", "w", encoding="utf-8") as f:
    json.dump(todos_municipios, f, ensure_ascii=False, indent=2)

print("✅ Municipios guardados en municipios_por_estado.json")
