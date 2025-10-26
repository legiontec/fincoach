import joblib
import os
import pandas as pd
import numpy as np
from pathlib import Path

# Get the directory where this script is located
BASE_DIR = Path(__file__).parent

# Load models with absolute paths
modelo = joblib.load(BASE_DIR / 'resiliencia_model.pkl')
model_columnas = joblib.load(BASE_DIR / 'model_columns.pkl')

def predecir_score_resiliencia(datos_usuario, modelo, columnas_entrenamiento):
    """Toma datos de un nuevo usuario, los transforma y predice el Score."""
    
    df_nuevo = pd.DataFrame([datos_usuario])
    
    for col in ['TipoDeuda', 'fuenteIngresos', 'situacionVivienda', 'ValorCrediticio']:
        if col in df_nuevo.columns:
            df_nuevo[col] = df_nuevo[col].astype(str).str.strip().str.capitalize()
            
    df_nuevo['GastMensual'] = df_nuevo['GastMensual'].replace(0, 1) 
    df_nuevo['IngMensual'] = df_nuevo['IngMensual'].replace(0, 1)
    df_nuevo['Colchon_Meses'] = df_nuevo['Ahorros'] / df_nuevo['GastMensual']
    # Corregí la columna de tu traceback: 'PagMensDeudaTotal'
    df_nuevo['Ratio_Deuda_Ingreso'] = df_nuevo['PagMensDeudaTotal'] / df_nuevo['IngMensual']
    
    X_nuevo_encoded = pd.get_dummies(df_nuevo, drop_first=True)
    
    # *** ESTE ES EL PASO CRUCIAL PARA EVITAR EL 'FEATURE_NAMES MISMATCH' ***
    X_final = X_nuevo_encoded.reindex(columns=columnas_entrenamiento, fill_value=0)
    
    prediccion = modelo.predict(X_final)
    
    return np.round(prediccion[0], 2)

def get_predict():
    datos_nuevo = {
        'IngMensual': 5000,
        'GastMensual': 2000,
        'Ahorros': 25000,
        'ValorInversion': 50000,
        'AhorroMensual': 3000,
        'PagMensDeudaTotal': 300,
        'TipoDeuda': 'Hipotecaria',
        'DeudaTotalNOHipoteca': 1000,
        'ValorCrediticio': 'Alto',
        'edad': 40,
        'dependientes': 2,
        'fuenteIngresos': 'Empleado',
        'situacionVivienda': 'Propietario'
    }
    score_resiliencia = predecir_score_resiliencia(datos_nuevo, modelo, model_columnas)
    return score_resiliencia

# Only run if executed directly
if __name__ == '__main__':
    try:
        score = get_predict()
        print(f"Score de resiliencia: {score}")
    except Exception as e:
        print(f"Error al predecir: {e}")