import requests
import json
import time

API_URL = "https://api.tau.com.mx/dipomex/v1/colonias"
API_KEY = "272406fa9058c2494438c4872b8dba1450c0cbc1"  # Reemplaza con tu clave real

# Cargar municipios
with open("municipios_por_estado.json", "r", encoding="utf-8") as f:
    municipios_data = json.load(f)

# Diccionario final
estructura_colonias = {}

for estado_id, municipios in municipios_data.items():
    estructura_colonias[estado_id] = {}
    for municipio in municipios:
        if isinstance(municipio, dict):
            municipio_id = municipio.get("MUNICIPIO_ID")
            nombre_municipio = municipio.get("MUNICIPIO")
            print(f"Consultando colonias de {estado_id}-{municipio_id} ({nombre_municipio})...")

            try:
                response = requests.get(
                    f"{API_URL}?id_estado={estado_id}&id_mun={municipio_id}",
                    headers={"APIKEY": API_KEY}
                )
                response.raise_for_status()
                colonias = response.json()

                # Crear entrada si no existe
                if nombre_municipio not in estructura_colonias[estado_id]:
                    estructura_colonias[estado_id][nombre_municipio] = {}

                estructura_colonias[estado_id][nombre_municipio][municipio_id] = colonias
            except Exception as e:
                print(f"❌ Error en {estado_id}-{municipio_id}: {e}")
            time.sleep(0.5)
        else:
            print(f"⚠️ Municipio mal formado en estado {estado_id}: {municipio}")

# Guardar archivo final
with open("estructura_colonias.json", "w", encoding="utf-8") as f:
    json.dump(estructura_colonias, f, ensure_ascii=False, indent=2)

print("✅ Colonias organizadas por estado y municipio")
