import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Eres un Químico Farmacéutico (QF) virtual de NexoFarma, una farmacia ubicada en Rancagua, Chile.

Tu rol:
- Responder preguntas sobre medicamentos de venta libre, salud general y bienestar
- Dar información sobre productos farmacéuticos (usos, posología general, efectos secundarios comunes)
- Recomendar consultar a un médico o químico farmacéutico presencial para casos serios
- Informar sobre los servicios de NexoFarma

Reglas estrictas:
- NUNCA prescribas medicamentos controlados o con receta
- NUNCA diagnostiques enfermedades
- SIEMPRE recomienda consultar a un profesional de salud para síntomas graves
- Responde en español chileno, de manera amable y profesional
- Mantén respuestas concisas (máximo 3 párrafos)
- Si te preguntan algo fuera del ámbito farmacéutico, redirige amablemente al tema de salud
- Usa markdown: **negritas** para destacar, • para listas, ⚠️ para advertencias

NexoFarma:
- Ubicación: Av. La Compañía 01661, Rancagua
- Horario: Lun-Sáb 09:00-21:00, Dom 10:00-20:00
- WhatsApp: +56 963 301 6418
- Despacho a todo Chile
- Categorías: Medicamentos, Dermocosmética, Vitaminas y Suplementos, Cuidado Personal
- Servicios: Atención farmacéutica personalizada, despacho 24h en Rancagua, toma de presión, asesoría en medicamentos`;

// ============================================
// Base de conocimiento farmacéutico
// ============================================
interface KnowledgeEntry {
  keywords: string[];
  priority: number; // Higher = more specific, wins over generic
  response: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  // ──── DOLOR Y FIEBRE ────
  {
    keywords: ["dolor de cabeza", "duele la cabeza", "cefalea", "jaqueca", "migraña", "migrana", "me duele la cabeza"],
    priority: 10,
    response: `Para el **dolor de cabeza** te recomiendo:

• **Paracetamol** 500-1000 mg cada 6-8 hrs (primera opción, menos efectos adversos)
• **Ibuprofeno** 400 mg cada 8 hrs con alimento (si hay componente inflamatorio)
• Hidratarse bien, descansar en un lugar tranquilo y oscuro
• Evitar pantallas si es posible

⚠️ **Consulta a tu médico si:** el dolor es muy intenso o repentino, se acompaña de fiebre alta, rigidez de cuello, vómitos o cambios en la visión. Si es recurrente (más de 2 veces/semana), necesitas evaluación profesional.

¿Necesitas información sobre algún medicamento en particular?`,
  },
  {
    keywords: ["paracetamol", "acetaminofen", "acetaminofén"],
    priority: 10,
    response: `**Paracetamol** — Analgésico y antipirético

• **Para qué sirve:** Dolor leve a moderado (cabeza, muscular, dental, menstrual) y fiebre
• **Dosis adultos:** 500 mg a 1 g cada 6-8 horas
• **Dosis máxima:** 4 g al día (4 comprimidos de 1 g)
• **Inicio de acción:** 30-60 minutos
• **Ventaja:** Bien tolerado, apto para embarazadas (con indicación médica)

⚠️ **Precauciones:**
• No exceder dosis máxima (daño hepático)
• Evitar si consume alcohol frecuentemente
• No combinar con otros medicamentos que contengan paracetamol

Disponible en NexoFarma en 500 mg y 1 g. ¿Tienes alguna otra duda?`,
  },
  {
    keywords: ["ibuprofeno", "advil", "motrin", "ibuprofen"],
    priority: 10,
    response: `**Ibuprofeno** — Antiinflamatorio (AINE)

• **Para qué sirve:** Dolor, inflamación y fiebre
• **Dosis adultos:** 200-400 mg cada 6-8 horas
• **Dosis máxima sin receta:** 1.200 mg/día
• **Inicio de acción:** 20-30 minutos
• **Mejor que paracetamol para:** Dolor con inflamación, dolor muscular, dolor menstrual

⚠️ **Precauciones:**
• Siempre tomar **con alimento** para proteger el estómago
• No usar si tienes úlcera, problemas renales o alergia a AINEs
• Evitar en el embarazo (especialmente 3er trimestre)
• No combinar con otros antiinflamatorios (aspirina, diclofenaco)

¿Te gustaría saber sobre alguna alternativa?`,
  },
  {
    keywords: ["fiebre", "temperatura alta", "calentura", "temperatura", "tengo fiebre", "me dio fiebre"],
    priority: 8,
    response: `**Manejo de la fiebre:**

• **Paracetamol** 500-1000 mg cada 6-8 hrs (primera opción)
• **Ibuprofeno** 400 mg cada 8 hrs con alimento (alternativa)
• Hidratarse abundantemente (agua, jugos, caldos)
• Ropa liviana y ambiente fresco
• Compresas tibias (no frías) en frente y axilas

**Referencia de temperatura:**
• 37-38°C → febrícula (vigilar)
• 38-39°C → fiebre moderada
• Sobre 39.5°C → fiebre alta

⚠️ **Acude a urgencias si:** fiebre sobre 39.5°C que no baja con medicamentos, dura más de 3 días, o se acompaña de confusión, dificultad respiratoria o manchas en la piel.`,
  },
  {
    keywords: ["dolor muscular", "dolor de espalda", "contractura", "dolor de cuerpo", "lumbago", "tortícolis", "torticolis", "me duele la espalda", "duele el cuerpo"],
    priority: 10,
    response: `Para el **dolor muscular o de espalda:**

• **Ibuprofeno** 400 mg cada 8 hrs con alimento
• **Paracetamol** 1 g cada 8 hrs si prefieres evitar antiinflamatorios
• **Diclofenaco gel** al 1% — aplicar en la zona 3-4 veces al día (alivio local)
• Aplicar **frío** las primeras 48 hrs, luego **calor** local
• Mantener movimiento suave, evitar reposo absoluto prolongado

⚠️ **Consulta si:** el dolor es muy intenso, tienes hormigueo o debilidad en piernas, pérdida de control de esfínteres, o no mejora en 1 semana.`,
  },
  {
    keywords: ["dolor de muelas", "dolor dental", "muela"],
    priority: 10,
    response: `Para el **dolor de muelas** mientras consultas al dentista:

• **Ibuprofeno** 400-600 mg cada 8 hrs con alimento (mejor opción por su efecto antiinflamatorio)
• **Paracetamol** 1 g cada 8 hrs como alternativa
• Enjuague con agua tibia y sal (1 cucharadita en un vaso)
• Aplicar frío externo en la mejilla (10 min sí, 10 min no)

⚠️ **Importante:** El dolor dental siempre requiere evaluación por un **dentista**. Los analgésicos solo manejan el síntoma, no resuelven la causa. Si hay hinchazón facial, fiebre o pus, acude urgente.`,
  },
  {
    keywords: ["dolor menstrual", "cólicos", "menstruación", "regla", "periodo"],
    priority: 10,
    response: `Para el **dolor menstrual:**

• **Ibuprofeno** 400 mg cada 8 hrs (el más efectivo para cólicos menstruales)
• Tomar desde el inicio del dolor o incluso 1 día antes si el patrón es predecible
• **Naproxeno** 220 mg cada 8-12 hrs es otra buena alternativa
• Calor local en abdomen bajo (guatero, parche térmico)
• Infusiones de manzanilla o jengibre pueden complementar

⚠️ Si el dolor es incapacitante, cada vez peor, o se acompaña de sangrado muy abundante, consulta a tu **ginecólogo/a**.`,
  },
  // ──── GRIPE Y RESFRIADO ────
  {
    keywords: ["gripe", "resfrío", "resfriado", "resfrio", "influenza", "catarro", "estoy enfermo", "estoy enferma", "estoy resfriado", "estoy resfriada", "me resfrié"],
    priority: 10,
    response: `Para la **gripe o resfriado:**

• **Paracetamol** para fiebre y dolor corporal
• **Antigripales** (combinación de analgésico + descongestionante + antihistamínico)
• **Vitamina C** 1000 mg/día puede acortar la duración
• Hidratación abundante (agua, caldos, infusiones calientes)
• Reposo y evitar contagiar a otros
• Miel con limón tibio para garganta irritada

**Duración normal:** 5-7 días para resfriado, 7-14 para gripe.

⚠️ **Consulta si:** fiebre alta por más de 3 días, dificultad para respirar, dolor de pecho, o los síntomas empeoran después de mejorar.`,
  },
  {
    keywords: ["tos", "tos seca", "tos con flema", "expectorante", "jarabe para la tos", "tengo tos", "no paro de toser", "jarabe"],
    priority: 10,
    response: `**Tipos de tos y tratamiento:**

**Tos seca (irritativa):**
• **Dextrometorfano** en jarabe o cápsulas
• Miel con limón tibio (natural y efectivo)
• Pastillas de miel para calmar la irritación

**Tos con flema (productiva):**
• **Ambroxol** jarabe — fluidifica la mucosidad
• **Acetilcisteína** (NAC) — mucolítico
• **No suprimir** la tos productiva, ayuda a limpiar las vías respiratorias
• Hidratarse mucho para que la flema sea menos espesa

⚠️ **Consulta si:** la tos dura más de 2 semanas, hay sangre, fiebre persistente o dificultad para respirar.`,
  },
  {
    keywords: ["dolor de garganta", "garganta", "amigdalitis", "faringitis", "garganta inflamada", "me duele la garganta", "duele la garganta"],
    priority: 10,
    response: `Para el **dolor de garganta:**

• **Pastillas o spray** con antiséptico + anestésico local (clorhexidina + benzocaína)
• **Paracetamol o ibuprofeno** para dolor e inflamación
• Gárgaras con agua tibia y sal (3-4 veces al día)
• Miel con limón y jengibre en agua tibia
• Evitar irritantes: tabaco, alcohol, bebidas muy frías o muy calientes

⚠️ **Consulta si:** fiebre sobre 38.5°C, placas blancas en amígdalas, dificultad para tragar o abrir la boca, o dura más de 5 días. Podría necesitar antibióticos (solo con receta médica).`,
  },
  {
    keywords: ["congestión nasal", "nariz tapada", "descongestionante", "mocos", "rinitis", "sinusitis", "nariz congestionada"],
    priority: 10,
    response: `Para la **congestión nasal:**

• **Spray nasal salino** — primera opción, seguro para uso frecuente
• **Oximetazolina spray** — descongestionante rápido, **máximo 3-5 días** (efecto rebote)
• **Pseudoefedrina oral** — descongestionante sistémico (precaución en hipertensos)
• Vapor de agua caliente o inhalaciones con eucalipto
• Dormir con cabeza elevada

⚠️ **Importante:** Nunca uses descongestionantes nasales más de 5 días seguidos. Si la congestión dura más de 10 días con secreción verdosa/amarillenta y dolor facial, podría ser **sinusitis** y necesitas médico.`,
  },
  // ──── ESTÓMAGO Y DIGESTIÓN ────
  {
    keywords: ["dolor de estómago", "dolor estomacal", "gastritis", "acidez", "ardor", "reflujo", "me duele el estómago", "duele la guata", "dolor de guata"],
    priority: 10,
    response: `Para **problemas estomacales:**

**Alivio rápido:**
• **Antiácidos** (hidróxido de aluminio/magnesio) — alivio en minutos
• **Famotidina** 20 mg — reduce producción de ácido

**Tratamiento corto:**
• **Omeprazol** 20 mg en ayunas, 30 min antes del desayuno (máx. 14 días sin receta)

**Medidas generales:**
• Comidas pequeñas y frecuentes
• Evitar: grasas, picante, café, alcohol, tabaco
• No acostarse hasta 2-3 horas después de comer
• Elevar la cabecera de la cama si hay reflujo nocturno

⚠️ **Consulta si:** dolor intenso, vómito con sangre, heces negras, pérdida de peso, o síntomas por más de 2 semanas.`,
  },
  {
    keywords: ["diarrea", "deposiciones", "suelto", "colitis"],
    priority: 10,
    response: `Para la **diarrea aguda:**

**Lo más importante — Rehidratación:**
• **Sales de Rehidratación Oral (SRO)** — la mejor opción
• Agua, caldos claros, agua de arroz
• Evitar: leche, café, alcohol, comidas grasas

**Medicamentos:**
• **Loperamida** 2 mg: 2 cápsulas iniciales, luego 1 tras cada deposición líquida (máx. 8 cápsulas/día)
• **Racecadotrilo** — alternativa que no frena el tránsito intestinal

**Dieta BRAT:** Banano, arroz, applesauce (compota), tostadas

⚠️ **Consulta urgente si:** sangre en deposiciones, fiebre alta, deshidratación severa, dura más de 48 hrs, o en niños pequeños y adultos mayores.`,
  },
  {
    keywords: ["estreñimiento", "constipación", "no puedo ir al baño", "estríñe"],
    priority: 10,
    response: `Para el **estreñimiento:**

**Cambios de estilo de vida (lo más efectivo):**
• **Fibra:** 25-30 g/día (frutas, verduras, avena, legumbres)
• **Agua:** Mínimo 2 litros diarios
• **Ejercicio:** Caminar 30 min/día estimula el tránsito
• Establecer horario regular para ir al baño

**Laxantes (uso ocasional):**
• **Psyllium (Metamucil)** — fibra soluble, seguro para uso regular
• **Lactulosa** — osmótico, suave
• **Bisacodilo** — estimulante, solo para uso puntual

⚠️ No uses laxantes estimulantes de forma crónica. Si el estreñimiento es reciente, persistente, o hay sangre, consulta a tu médico.`,
  },
  {
    keywords: ["náuseas", "nauseas", "vómitos", "vomito", "mareo", "mareada", "mareado"],
    priority: 8,
    response: `Para las **náuseas y vómitos:**

• **Dimenhidrinato** (Dramamine) 50 mg — para mareos y náuseas
• **Jengibre** en cápsulas, té o caramelos — remedio natural efectivo
• Comer poco y frecuente, alimentos secos (galletas, tostadas)
• Hidratarse a sorbos pequeños y frecuentes
• Evitar olores fuertes y comidas grasas

**Para mareo por movimiento:** Tomar Dramamine 30 min antes de viajar.

⚠️ **Consulta si:** vómitos persistentes, con sangre, fiebre alta, deshidratación, dolor abdominal intenso, o posible embarazo.`,
  },
  // ──── ALERGIAS ────
  {
    keywords: ["alergia", "alérgico", "alérgica", "urticaria", "picazón", "antihistamínico", "ronchas", "me pica", "tengo alergia", "soy alérgico"],
    priority: 10,
    response: `Para las **alergias:**

**Antihistamínicos orales (no dan sueño):**
• **Loratadina** 10 mg — 1 vez al día
• **Cetirizina** 10 mg — 1 vez al día (algo más potente)
• **Fexofenadina** 180 mg — 1 vez al día

**Para picazón cutánea:**
• **Calamina** loción — alivia picazón
• **Hidrocortisona** 1% crema — uso corto, máx. 7 días
• Compresas frías sobre la zona afectada

**Rinitis alérgica:**
• Antihistamínico oral + spray nasal salino
• **Fluticasona** spray nasal — uso regular en temporada alérgica

⚠️ **URGENCIA:** Si hay dificultad para respirar, hinchazón de labios/lengua o mareos → **anafilaxia → llamar ambulancia inmediatamente.**`,
  },
  // ──── VITAMINAS Y SUPLEMENTOS ────
  {
    keywords: ["vitamina", "vitaminas", "suplemento", "suplementos", "multivitamínico", "multivitaminico"],
    priority: 8,
    response: `**Guía de vitaminas y suplementos:**

• **Vitamina C** (500-1000 mg/día) — Sistema inmune, antioxidante. Ideal en invierno.
• **Vitamina D** (1000-2000 UI/día) — Huesos y ánimo. Importante si tienes poca exposición solar.
• **Vitamina B12** — Esencial para vegetarianos/veganos y adultos mayores.
• **Hierro** — Si tienes diagnóstico de anemia (tomar con vitamina C para mejor absorción).
• **Magnesio** (200-400 mg/día) — Calambres, estrés, sueño.
• **Omega-3** (1000-2000 mg/día) — Salud cardiovascular y cerebral.
• **Probióticos** — Salud digestiva, después de antibióticos.

Una dieta equilibrada es siempre la base. Los suplementos **complementan**, no reemplazan.

En NexoFarma tenemos una amplia variedad. ¿Quieres info sobre alguno en particular?`,
  },
  // ──── PIEL ────
  {
    keywords: ["protector solar", "bloqueador", "protección solar", "quemadura solar", "bronceado"],
    priority: 10,
    response: `**Protección solar — Guía completa:**

• Usar **SPF 30** mínimo para uso diario, **SPF 50+** para exposición prolongada
• Aplicar 20-30 min antes de salir
• **Reaplicar** cada 2 horas y después de nadar o sudar
• No olvidar: orejas, cuello, manos, labios y cuero cabelludo
• Usar incluso en días nublados (70% de radiación UV penetra nubes)

**Para quemaduras solares:**
• Gel de **aloe vera** puro
• Compresas frías
• Hidratación abundante
• **No reventar** ampollas

Tenemos protectores de las mejores marcas en NexoFarma. ¿Necesitas recomendación según tu tipo de piel?`,
  },
  {
    keywords: ["herida", "corte", "raspón", "curación", "desinfectar", "heridas"],
    priority: 8,
    response: `**Curación de heridas menores:**

1. **Lavar** con agua limpia y jabón suave
2. **Desinfectar** con clorhexidina (preferible) o povidona yodada
3. Aplicar **crema cicatrizante** si lo deseas
4. **Cubrir** con gasa estéril o parche adhesivo
5. Cambiar el apósito **diariamente** o si se moja/ensucia

**Botiquín básico recomendado:**
• Gasa estéril, cinta micropore
• Clorhexidina, agua oxigenada
• Parches adhesivos (curitas)
• Crema con antibiótico (mupirocina)

⚠️ Acudir a urgencias si: herida profunda, no para de sangrar, signos de infección (rojo, caliente, pus), o causada por objeto oxidado/mordedura.`,
  },
  {
    keywords: ["acné", "granos", "espinillas", "piel grasa"],
    priority: 10,
    response: `Para el **acné leve:**

**Limpieza:**
• Limpiador facial suave 2 veces al día
• No reventar ni tocar los granos (riesgo de cicatriz e infección)

**Tratamiento tópico de venta libre:**
• **Peróxido de benzoílo** 2.5-5% — antibacteriano (empezar suave)
• **Ácido salicílico** 2% — exfoliante, desobstruye poros
• **Adapaleno** 0.1% gel — retinoide (puede irritar al inicio)

**Cuidado general:**
• Protector solar no comedogénico siempre
• Hidratante oil-free
• Evitar tocar la cara frecuentemente

⚠️ Si el acné es moderado a severo, tiene cicatrices o no mejora en 2-3 meses, consulta a un **dermatólogo**. Algunos tratamientos requieren receta.`,
  },
  // ──── CONDICIONES CRÓNICAS ────
  {
    keywords: ["presión alta", "presion alta", "hipertensión", "hipertension", "presión arterial"],
    priority: 10,
    response: `La **hipertensión arterial** es una condición crónica seria.

**Importante:**
• Los medicamentos antihipertensivos son **con receta médica** exclusivamente
• Nunca dejes ni modifiques tu medicación sin consultar a tu médico

**Lo que sí puedes hacer:**
• Controla tu presión regularmente — **en NexoFarma ofrecemos toma de presión**
• Reduce el consumo de **sal** (máx. 5 g/día)
• Mantener peso saludable y hacer ejercicio regular
• Moderar alcohol y no fumar
• Dieta rica en frutas, verduras y baja en grasas saturadas

⚠️ **Urgencia:** Si tu presión está muy alta (sobre 180/120), tienes dolor de cabeza intenso, visión borrosa o dolor de pecho → acude a urgencias.`,
  },
  {
    keywords: ["diabetes", "azúcar", "glucosa", "diabético", "diabética", "glicemia"],
    priority: 10,
    response: `La **diabetes** requiere control médico continuo.

**En NexoFarma tenemos:**
• Glucómetros y tiras reactivas
• Lancetas y agujas para insulina
• Productos sin azúcar
• Cuidado de pies para diabéticos

**Recomendaciones generales:**
• Controlar la glicemia según indicación médica
• Dieta equilibrada, baja en azúcares simples
• Ejercicio regular (30 min/día)
• Cuidado especial de los pies
• Nunca modificar dosis de insulina o medicamentos sin indicación médica

⚠️ **Urgencia:** Si presentas mucha sed, visión borrosa, confusión, o glicemia muy alta/baja → acude a urgencias.`,
  },
  // ──── NEXOFARMA INFO ────
  {
    keywords: ["horario", "horarios", "abierto", "abierta", "hora", "abren", "cierran", "atienden"],
    priority: 12,
    response: `**Horarios de NexoFarma:**

• **Lunes a Sábado:** 09:00 - 21:00 hrs
• **Domingos y Festivos:** 10:00 - 20:00 hrs

📍 **Dirección:** Av. La Compañía 01661, Rancagua
📱 **WhatsApp:** +56 963 301 6418

También puedes comprar en nuestra **tienda online** con despacho a todo Chile 🇨🇱

¿Necesitas algo más?`,
  },
  {
    keywords: ["dirección", "ubicación", "donde", "dónde", "quedan", "cómo llego", "como llego", "mapa"],
    priority: 12,
    response: `📍 **NexoFarma** está en:

**Av. La Compañía 01661, Rancagua, Chile**

• **Horario:** Lun-Sáb 09:00-21:00 | Dom 10:00-20:00
• **WhatsApp:** +56 963 301 6418
• **Despacho:** A todo Chile 🇨🇱
• Puedes venir en auto (estacionamiento disponible) o en locomoción

¡Te esperamos! También puedes comprar desde la comodidad de tu hogar en nuestra tienda online.`,
  },
  {
    keywords: ["despacho", "envío", "envio", "delivery", "reparto", "envían", "envian", "llega"],
    priority: 12,
    response: `🚚 **Despacho NexoFarma:**

• **Rancagua y alrededores:** Despacho en **24 horas**
• **Resto de Chile:** Envío vía Chilexpress o Starken (2-5 días hábiles)
• **Retiro en tienda:** Disponible en Av. La Compañía 01661, Rancagua

**¿Cómo comprar?**
• A través de nuestra **tienda online** (www.nexofarma.cl)
• Por **WhatsApp:** +56 963 301 6418
• Presencialmente en nuestra farmacia

¿Hay algo más en lo que pueda ayudarte?`,
  },
  {
    keywords: ["whatsapp", "teléfono", "telefono", "contacto", "llamar", "número", "numero", "fono"],
    priority: 12,
    response: `📱 **Contacto NexoFarma:**

• **WhatsApp:** +56 963 301 6418
• **Dirección:** Av. La Compañía 01661, Rancagua
• **Horario atención:** Lun-Sáb 09:00-21:00 | Dom 10:00-20:00

También puedes contactarnos a través del **formulario de contacto** en nuestra web.

¡Estamos para ayudarte! 💚`,
  },
  {
    keywords: ["productos", "catálogo", "catalogo", "qué venden", "que venden", "tienen"],
    priority: 8,
    response: `En **NexoFarma** manejamos 4 categorías principales:

• 💊 **Medicamentos** — Analgésicos, antigripales, antiinflamatorios, antiácidos y más (venta libre)
• 🧴 **Dermocosmética** — Protección solar, cuidado facial, hidratantes, tratamientos capilares
• 💪 **Vitaminas y Suplementos** — Multivitamínicos, omega-3, probióticos, minerales
• 🧼 **Cuidado Personal** — Higiene bucal, corporal, cuidado del bebé

Puedes explorar todo en nuestra **tienda online** o visitarnos en Av. La Compañía 01661, Rancagua.

¿Buscas algo en particular?`,
  },
  {
    keywords: ["servicio", "servicios", "ofrecen", "qué hacen", "que hacen"],
    priority: 8,
    response: `**Servicios NexoFarma:**

• 💊 Venta de medicamentos y productos de salud
• 👨‍⚕️ **Atención farmacéutica personalizada** — consulta con QF
• 📊 **Toma de presión arterial** — sin costo
• 🚚 **Despacho a domicilio** — 24 hrs en Rancagua, todo Chile
• 🛒 **Tienda online** — Compra desde tu casa
• 📱 **Pedidos por WhatsApp** — Rápido y fácil
• 💳 Todos los medios de pago

¿Hay algún servicio que te interese?`,
  },
  {
    keywords: ["socio", "socios", "membresía", "membresia", "club", "inscribir", "registrar"],
    priority: 12,
    response: `**Club de Socios NexoFarma 💚**

¡Registrarte como socio es **gratis** y obtienes beneficios exclusivos!

• 🏷️ **Descuentos especiales** en productos seleccionados
• 🎁 **Promociones exclusivas** para socios
• 📢 **Acceso anticipado** a ofertas
• 💰 **Acumulación de puntos** en cada compra

**¿Cómo registrarte?**
Puedes hacerlo directamente en nuestra página web, sección "Hazte Socio", o presencialmente en la farmacia.

Solo necesitas: nombre, RUT, teléfono, correo y dirección.

¿Te gustaría registrarte?`,
  },
  // ──── SALUDOS Y CONVERSACIÓN ────
  {
    keywords: ["hola", "buenas", "buenos días", "buenas tardes", "buenas noches", "hey", "saludos", "buen día"],
    priority: 3,
    response: `¡Hola! 👋 Bienvenido/a a **NexoFarma**.

Soy tu Químico Farmacéutico virtual y puedo ayudarte con:
• Información sobre **medicamentos** de venta libre
• Recomendaciones para **síntomas comunes**
• Info sobre nuestros **servicios y horarios**
• Consultas de **vitaminas y suplementos**

¿En qué puedo ayudarte hoy? 💚`,
  },
  {
    keywords: ["gracias", "muchas gracias", "thank", "vale", "genial", "excelente", "perfecto"],
    priority: 3,
    response: `¡De nada! 😊 Me alegra poder ayudarte.

Recuerda que en **NexoFarma** estamos para cuidar tu salud. Si tienes más dudas, no dudes en escribirme.

📍 Visítanos en Av. La Compañía 01661, Rancagua
📱 WhatsApp: +56 963 301 6418

¡Que tengas un excelente día! 💚`,
  },
  {
    keywords: ["chao", "adiós", "adios", "hasta luego", "bye", "nos vemos"],
    priority: 3,
    response: `¡Hasta luego! 👋 Fue un gusto ayudarte.

Recuerda que puedes volver a consultarme cuando lo necesites. En **NexoFarma** estamos siempre disponibles para ti.

📱 WhatsApp: +56 963 301 6418
💊 Cuida tu salud, cuida a tu familia 💚`,
  },
  // ──── EMERGENCIAS / TEMAS SENSIBLES ────
  {
    keywords: ["embarazo", "embarazada", "lactancia", "amamantando"],
    priority: 15,
    response: `⚠️ **Consulta importante sobre embarazo/lactancia:**

Durante el embarazo y la lactancia, muchos medicamentos están **contraindicados** o requieren evaluación médica.

**Generalmente seguros (con indicación médica):**
• Paracetamol para dolor/fiebre
• Ácido fólico, hierro, vitaminas prenatales

**Evitar sin indicación médica:**
• Ibuprofeno y otros AINEs (especialmente 3er trimestre)
• Aspirina
• Muchos antigripales y descongestionantes

**Mi recomendación:** Siempre consulta a tu **médico o matrona** antes de tomar cualquier medicamento. La seguridad de tu bebé es lo primero.

¿Necesitas orientación sobre algo específico?`,
  },
  {
    keywords: ["antibiótico", "antibioticos", "amoxicilina", "azitromicina"],
    priority: 15,
    response: `⚠️ Los **antibióticos** son medicamentos de **venta bajo receta médica**.

**No puedo recomendar antibióticos** porque:
• Requieren diagnóstico médico previo
• Usarlos sin necesidad genera **resistencia bacteriana**
• Tienen efectos secundarios y contraindicaciones
• No funcionan contra virus (gripe, resfriado)

**¿Qué hacer?**
• Si crees que necesitas antibiótico, consulta a tu **médico**
• Si ya tienes receta, en NexoFarma podemos despachártelo

💡 **Tip:** Si estás tomando antibióticos, complementa con **probióticos** para proteger tu flora intestinal.`,
  },
  {
    keywords: ["receta", "medicamento controlado", "con receta", "benzodiazepina", "clonazepam", "diazepam", "opioide", "tramadol"],
    priority: 15,
    response: `⚠️ **Medicamentos con receta médica:**

Estos medicamentos **solo pueden ser dispensados con receta** emitida por un médico. No puedo recomendarlos ni venderlos sin prescripción.

**En NexoFarma podemos:**
• Dispensar tu receta médica vigente
• Orientarte sobre el uso correcto del medicamento recetado
• Informarte sobre posibles interacciones

**Si necesitas este tipo de medicamento:**
Consulta a tu médico para obtener la receta correspondiente. Puedes traerla a NexoFarma y te lo despachamos.

¿Puedo ayudarte con algo de venta libre?`,
  },
];

// ──── MATCHING ENGINE ────
function findLocalResponse(userMessage: string): string | null {
  const msg = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let matchCount = 0;
    let totalKeywordLength = 0;

    for (const kw of entry.keywords) {
      const kwNorm = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

      if (msg.includes(kwNorm)) {
        matchCount++;
        totalKeywordLength += kwNorm.length;
      }
    }

    if (matchCount === 0) continue;

    // Score = keyword total length × priority × match count bonus
    const score = totalKeywordLength * entry.priority * (1 + matchCount * 0.3);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch ? bestMatch.response : null;
}

const FALLBACK_RESPONSE = `No tengo información específica sobre eso, pero puedo ayudarte con:

• 💊 **Medicamentos** — Paracetamol, ibuprofeno, antigripales, antiácidos
• 🤒 **Síntomas** — Dolor, fiebre, gripe, tos, alergias, digestión
• 💪 **Vitaminas** — C, D, B12, omega-3, suplementos
• 🧴 **Piel** — Protección solar, acné, heridas
• 🏪 **NexoFarma** — Horarios, ubicación, despacho, servicios

Para consultas más específicas, contáctanos por **WhatsApp** al **+56 963 301 6418** o visítanos en la farmacia. 💚`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json({ content: FALLBACK_RESPONSE });
    }

    const userText = lastMessage.content;

    // Try AI-powered response if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        const client = new Anthropic({ apiKey });

        const response = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        });

        const content =
          response.content[0].type === "text" ? response.content[0].text : "";
        return NextResponse.json({ content });
      } catch (aiError) {
        console.error("AI Chat error, falling back to local:", aiError);
      }
    }

    // Local knowledge base response
    const localResponse = findLocalResponse(userText);
    return NextResponse.json({
      content: localResponse || FALLBACK_RESPONSE,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      content:
        "Lo siento, hubo un error al procesar tu consulta. Contáctanos por **WhatsApp** al **+56 963 301 6418**.",
    });
  }
}
