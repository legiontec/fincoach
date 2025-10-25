import requests
import json

# --- CONFIGURACIÓN ---
# ¡IMPORTANTE! Usa la NUEVA llave secreta que generaste.
API_KEY = '1c6deb4b1d193e6db2b2791d2d866e2a'
URL_BASE = 'http://api.nessieisreal.com'

# Preparamos el parámetro 'key' que pide la API en todas las peticiones
params_llave = {
    'key': API_KEY
}
# --- FIN CONFIGURACIÓN ---

id_cliente_creado = None
id_cuenta_creada = None

# ---------------------------------------------------------------
# PASO 1: CREAR UN NUEVO CLIENTE (POST a /customers)
# ---------------------------------------------------------------
print("--- PASO 1: Creando un nuevo cliente... ---")

endpoint_post_cliente = f"{URL_BASE}/customers"
datos_cliente_nuevo = {
    "first_name": "Fernando",
    "last_name": "Patricio",
    "address": {
        "street_number": "123",
        "street_name": "Calle Falsa",
        "city": "HACKMTY",
        "state": "NL",
        "zip": "64000"
    }
}

try:
    response_post_cliente = requests.post(endpoint_post_cliente, params=params_llave, json=datos_cliente_nuevo)
    
    if response_post_cliente.status_code == 201: # 201 = "Creado"
        datos_cliente = response_post_cliente.json()
        id_cliente_creado = datos_cliente['objectCreated']['_id']
        print(f"¡Éxito! Cliente creado con ID: {id_cliente_creado}")
    else:
        print(f"Error al crear el cliente: {response_post_cliente.text}")
        exit() # Si falla aquí, no podemos continuar

except requests.exceptions.RequestException as e:
    print(f"Error de conexión: {e}")
    exit()


# ---------------------------------------------------------------
# PASO 2: CREAR UNA CUENTA PARA ESE CLIENTE (POST a /customers/{id}/accounts)
# ---------------------------------------------------------------
if id_cliente_creado:
    print(f"\n--- PASO 2: Creando una cuenta para el cliente {id_cliente_creado}... ---")
    
    # Este es el endpoint para crear una cuenta ASOCIADA al cliente
    endpoint_post_cuenta = f"{URL_BASE}/customers/{id_cliente_creado}/accounts"
    
    # Los datos que la API pide para una nueva cuenta
    datos_cuenta_nueva = {
        "type": "Checking", # Tipo de cuenta (Cheques)
        "nickname": "Mi Primera Cuenta",
        "rewards": 100,
        "balance": 5000
    }
    
    response_post_cuenta = requests.post(endpoint_post_cuenta, params=params_llave, json=datos_cuenta_nueva)
    
    if response_post_cuenta.status_code == 201:
        datos_cuenta = response_post_cuenta.json()
        id_cuenta_creada = datos_cuenta['objectCreated']['_id']
        print(f"¡Éxito! Cuenta creada con ID: {id_cuenta_creada}")
    else:
        print(f"Error al crear la cuenta: {response_post_cuenta.text}")


# ---------------------------------------------------------------
# PASO 3: OBTENER "INFORMACIÓN REAL" DE ESA CUENTA (GET a /accounts/{id})
# ---------------------------------------------------------------
if id_cuenta_creada:
    print(f"\n--- PASO 3: Obteniendo información de la cuenta {id_cuenta_creada}... ---")
    
    endpoint_get_cuenta = f"{URL_BASE}/accounts/{id_cuenta_creada}"
    
    response_get_cuenta = requests.get(endpoint_get_cuenta, params=params_llave)
    
    if response_get_cuenta.status_code == 200: # 200 = "OK"
        print("Información obtenida")
        datos_finales = response_get_cuenta.json()
        print(json.dumps(datos_finales, indent=4)) # Imprime los datos bonitos
    else:
        print(f"Error al obtener la cuenta: {response_get_cuenta.text}")