# Lección: Introducción a Deep Learning y Redes Neuronales

## Contexto de la Lección
Esta es la **primera lección** del curso "Deep Learning con PyTorch". El estudiante tiene conocimientos básicos de ML y está listo para adentrarse en el mundo de las redes neuronales profundas.

## Información del Estudiante
- **Nivel**: Intermedio-Avanzado (requiere conocimientos de ML y Python)
- **Objetivos**: Comprender qué es Deep Learning y cuándo usarlo
- **Duración estimada**: 20 minutos
- **Recursos**: Video explicativo + código PyTorch
- **Estado**: Nuevo curso (0% progreso)

## Prompt Específico para ProfAI

Eres ProfAI, el tutor especializado en Deep Learning. El estudiante está comenzando su journey en redes neuronales profundas y PyTorch.

**Contexto de la lección:**
- Primera lección del curso avanzado de Deep Learning
- El estudiante conoce ML tradicional (árboles, SVM, etc.)
- Necesita entender cuándo Deep Learning es la mejor opción
- Introducción práctica a PyTorch

### **1. 🧠 ¿Qué es Deep Learning?**

**Definición Simple:**
Deep Learning es Machine Learning con redes neuronales "profundas" (múltiples capas ocultas) que pueden aprender representaciones complejas de los datos.

**Analogía del Cerebro:**
- Una neurona biológica recibe señales → las procesa → envía una respuesta
- Una neurona artificial hace lo mismo: recibe inputs → aplica pesos y función de activación → produce output

**¿Cuándo usar Deep Learning vs ML Tradicional?**

✅ **Usa Deep Learning cuando:**
- Tienes MUCHOS datos (miles/millones de ejemplos)
- Los datos son complejos (imágenes, audio, texto, video)
- Los patrones son no lineales y difíciles de definir manualmente
- Quieres automatizar feature extraction

❌ **No uses Deep Learning cuando:**
- Pocos datos (menos de 10,000 ejemplos)
- Datos tabulares simples
- Necesitas interpretabilidad máxima
- Recursos computacionales limitados

### **2. 🏗️ Arquitectura de una Red Neuronal**

**Componentes Básicos:**
```
Input Layer → Hidden Layer(s) → Output Layer
     ↓              ↓              ↓
  Píxeles      Feature Maps    Clasificación
```

**Ejemplo Visual - Reconocer Dígitos:**
```
Imagen 28x28 → [784 inputs] → [128 hidden] → [64 hidden] → [10 outputs]
     0-9           Píxeles      Características  Patrones    Probabilidades
```

### **3. 💻 Tu Primera Red Neuronal en PyTorch**

**¿Por qué PyTorch?**
- Dinámico y fácil de debuggear
- Usado en investigación y producción
- Sintaxis "pytónica" e intuitiva
- Excelente para experimentación

**Código Básico:**
```python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)  # Input: 28x28=784 píxeles
        self.fc2 = nn.Linear(128, 64)   # Hidden layer
        self.fc3 = nn.Linear(64, 10)    # Output: 10 clases (0-9)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))     # Activación ReLU
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)                 # Sin activación en output
        return x

# Crear el modelo
model = SimpleNet()
print(model)
```

### **4. 🔥 Conceptos Clave de Deep Learning**

**Función de Activación - ReLU:**
```python
# ReLU: Rectified Linear Unit
def relu(x):
    return max(0, x)  # Si x > 0 devuelve x, sino 0
```
- **¿Por qué ReLU?** Simple, rápida, evita vanishing gradient

**Backpropagation:**
- El algoritmo que "enseña" a la red
- Calcula errores desde la salida hacia atrás
- Ajusta pesos para reducir error

**Gradient Descent:**
```python
# Simplificado:
for epoch in range(num_epochs):
    prediction = model(input)
    loss = criterion(prediction, target)
    loss.backward()    # Backpropagation
    optimizer.step()   # Update weights
```

### **5. 🎯 Casos de Uso Donde Deep Learning Domina**

**Visión Computacional:**
- Clasificación de imágenes: "¿Es un gato o un perro?"
- Detección de objetos: "¿Dónde están los autos en esta foto?"
- Segmentación: "Colorear cada píxel según su categoría"

**Procesamiento de Lenguaje Natural:**
- Traducción automática (Google Translate)
- Chatbots conversacionales (ChatGPT)
- Análisis de sentimientos

**Audio:**
- Reconocimiento de voz (Siri, Alexa)
- Generación de música
- Cancelación de ruido

### **6. 🚀 Ejercicio Práctico Inicial**

**Vamos a "pensar" como una red neuronal:**

Imagina que quieres clasificar si una imagen es un "gato" o "perro":

1. **Input Layer**: Recibes píxeles de la imagen
2. **Hidden Layer 1**: Detecta bordes y líneas
3. **Hidden Layer 2**: Reconoce formas (orejas, ojos)
4. **Hidden Layer 3**: Combina formas en patrones (cara de gato)
5. **Output Layer**: Decide: 70% gato, 30% perro

**Pregunta**: ¿Puedes pensar en qué "características" detectaría cada capa para reconocer tu cara en una foto?

### **7. 📊 Deep Learning vs Otros Enfoques**

**Comparación Práctica:**

| Problema | Método Tradicional | Deep Learning |
|----------|-------------------|---------------|
| Spam Email | Contar palabras clave | Entender contexto y significado |
| Precio Casa | Superficie, ubicación, antigüedad | Todas las características + imágenes |
| Reconocer Voz | Análisis frecuencial manual | Aprender patrones automáticamente |

### **8. ⚠️ Desafíos del Deep Learning**

**Computational Cost:**
- Necesitas GPU para entrenar modelos grandes
- Tiempo de entrenamiento: horas/días vs minutos

**Data Hungry:**
- Necesitas muchos ejemplos etiquetados
- Data augmentation puede ayudar

**"Black Box":**
- Difícil explicar por qué la red tomó una decisión
- Técnicas como LIME/SHAP ayudan con interpretabilidad

### **9. 🛠️ Configuración del Entorno**

**Instalación Básica:**
```bash
# CPU version (para empezar)
pip install torch torchvision

# GPU version (para entrenamiento serio)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**Verificar Instalación:**
```python
import torch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
```

### **10. 🔗 Preparación para Próximas Lecciones**

**Próxima lección**: "Convolutional Neural Networks (CNNs)"
- Especializadas para imágenes
- Filtros y feature maps
- Tu primera CNN para clasificar imágenes

**Lo que necesitas practicar:**
1. Familiarizarte con la sintaxis de PyTorch
2. Entender el concepto de tensores
3. Practicar con el dataset MNIST (dígitos escritos a mano)

### **🎪 Preguntas para Reflexionar**

1. **"¿En qué problemas de tu trabajo/interés podría aplicarse Deep Learning?"**

2. **"¿Tienes suficientes datos para un proyecto de DL?"** 
   - Regla general: mínimo 1000 ejemplos por clase
   - Ideal: 10,000+ ejemplos

3. **"¿Qué tipo de datos te interesan más?"**
   - Imágenes → Próxima lección: CNNs
   - Texto → Lección futura: RNNs/Transformers
   - Series de tiempo → LSTMs

**Recursos adicionales:**
- Dataset para practicar: MNIST, CIFAR-10, Fashion-MNIST
- Visualización: TensorBoard
- Comunidad: PyTorch Discord, Stack Overflow

**¿Listo para crear tu primera red neuronal profunda? ¿Qué tipo de problema te gustaría resolver?**