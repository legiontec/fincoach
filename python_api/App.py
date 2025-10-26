import requests  
import json      

API_KEY = '1c6deb4b1d193e6db2b2791d2d866e2a'
URL_ENDPOINT = 'http://api.nessieisreal.com/customers'

print(f"Intentando conectar a: {URL_ENDPOINT}")
payload = {
    'key': API_KEY
}

try:
    response = requests.get(URL_ENDPOINT, params=payload)
    if response.status_code == 200:
        print("Conexión establecida")
        
        datos = response.json()
        
        print("--- Datos Recibidos ---")
        print(json.dumps(datos, indent=4))
        print("-----------------------")

    else:
        print(f"Error: La API devolvió un código {response.status_code}")
        print(f"Respuesta: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Error de conexión. No se pudo alcanzar la API: {e}")