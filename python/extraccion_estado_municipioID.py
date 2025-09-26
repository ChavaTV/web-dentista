import requests
import json
import time

API_ESTADOS = "https://api.tau.com.mx/dipomex/v1/estados"
API_MUNICIPIOS = "https://api.tau.com.mx/dipomex/v1/municipios"
API_KEY = "272406fa9058c2494438c4872b8dba1450c0cbc1"  

headers = { "APIKEY": API_KEY }

estructura_combinada = {
    "error": False,
    "message": "Estructura combinada generada",
    "datos": []
}

# Paso 1: Obtener estados
try:
    res_estados = requests.get(API_ESTADOS, headers=headers)
    res_estados.raise_for_status()
    estados_data = res_estados.json().get("estados", [])
except Exception as e:
    print(f"❌ Error al obtener estados: {e}")
    estados_data = []

# Paso 2: Iterar por cada estado y consultar municipios
for estado in estados_data:
    estado_id = estado.get("ESTADO_ID")
    estado_nombre = estado.get("ESTADO")

    print(f"🔍 Consultando municipios de {estado_id} - {estado_nombre}...")

    try:
        res_municipios = requests.get(f"{API_MUNICIPIOS}?id_estado={estado_id}", headers=headers)
        res_municipios.raise_for_status()
        municipios_data = res_municipios.json().get("municipios", [])
    except Exception as e:
        print(f"⚠️ Error en estado {estado_id}: {e}")
        municipios_data = []

    municipios_limpios = [
        {
            "MUNICIPIO_ID": m.get("MUNICIPIO_ID"),
            "MUNICIPIO": m.get("MUNICIPIO")
        }
        for m in municipios_data
    ]

    estructura_combinada["datos"].append({
        "ESTADO_ID": estado_id,
        "ESTADO": estado_nombre,
        "municipios": municipios_limpios
    })

    time.sleep(0.5)  # Pausa para no saturar la API

# Paso 3: Guardar en archivo JSON
with open("estado_mun.json", "w", encoding="utf-8") as f:
    json.dump(estructura_combinada, f, ensure_ascii=False, indent=2)

print("✅ JSON combinado generado correctamente")
