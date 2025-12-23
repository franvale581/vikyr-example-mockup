// data-usa.js — Tarifas USA + rangos completos + 5% agregado

// 1) Tarifas por estado (con +5% ya aplicado)
export const statePricesUSA = {
  "Vermont_1_199": 20.14 * 1.05,              // 51.04
  "Massachusetts": 17.54 * 1.05,              // 51.04
  "Rhode Island": 17.54 * 1.05,               // 51.04
  "New Hampshire": 20.14 * 1.05,              // 65.03
  "Maine": 23.39 * 1.05,                      // 71.64
  "Vermont_5000_5999": 20.14 * 1.05,          // 70.32
  "Connecticut": 17.54 * 1.05,                // 56.33
  "New Jersey": 17.54 * 1.05,                 // 51.04
  "New York": 17.54 * 1.05,                   // 56.33
  "Pennsylvania": 17.54 * 1.05,               // 56.33
  "Delaware": 17.54 * 1.05,                   // 56.33
  "Virginia": 18.77 * 1.05,                   // 46.99
  "West Virginia": 31.02 * 1.05,              // 59.90
  "North Carolina": 15.52 * 1.05,             // 40.37
  "South Carolina": 14.73 * 1.05,             // 41.62
  "Georgia": 17.93 * 1.05,                    // 42.94
  "Florida": 13.78 * 1.05,                    // 39.00
  "Alabama": 31.02 * 1.05,                    // 59.90
  "Tennessee": 15.52 * 1.05,                  // 45.66
  "Mississippi": 15.52 * 1.05,                // 45.66
  "Kentucky": 15.52 * 1.05,                   // 40.37
  "Ohio": 20.79 * 1.05,                       // 57.65
  "Indiana": 17.54 * 1.05,                    // 51.04
  "Michigan": 20.79 * 1.05,                   // 57.65
  "Iowa": 23.39 * 1.05,                        // 71.64
  "Wisconsin": 20.14 * 1.05,                  // 70.32
  "Minnesota": 23.39 * 1.05,                  // 71.64
  "South Dakota": 35.64 * 1.05,               // 84.56
  "North Dakota": 24.79 * 1.05,               // 79.12
  "Montana": 40.05 * 1.05,                   // 105.40
  "Illinois": 20.79 * 1.05,                   // 57.65
  "Missouri": 17.54 * 1.05,                   // 56.33
  "Kansas": 35.64 * 1.05,                     // 51.04
  "Nebraska": 35.64 * 1.05,                   // 84.54
  "Louisiana": 18.77 * 1.05,                  // 46.99
  "Arkansas": 20.79 * 1.05,                   // 57.65
  "Oklahoma": 33.04 * 1.05,                   // 70.57
  "Texas": 23.39 * 1.05,                      // 71.64
  "Colorado": 21.54 * 1.05,                   // 77.79
  "Wyoming": 37.04 * 1.05,                    // 92.03
  "Idaho": 40.05 * 1.05,                     // 105.40
  "Utah": 24.55 * 1.05,                       // 85.87
  "Arizona": 37.04 * 1.05,                    // 92.03
  "New Mexico": 23.39 * 1.05,                 // 71.64
  "Nevada": 24.55 * 1.05,                     // 104.58
  "California": 24.55 * 1.05,                 // 91.16
  "Oregon": 40.05 * 1.05,                    // 105.40
  "Washington": 27.80 * 1.05,                 // 92.48
  "Alaska": 90.00 * 1.05,                    // 193.67
  "Hawaii": 75.00 * 1.05                     // 157.76
};


// 2) Rangos completos USA por estado
export const zipRangesUSA = [
  { range: [1, 199], state: "Vermont_1_199" },
  { range: [1000, 2799], state: "Massachusetts" },
  { range: [2800, 2999], state: "Rhode Island" },
  { range: [3000, 3899], state: "New Hampshire" },
  { range: [3900, 4999], state: "Maine" },
  { range: [5000, 5999], state: "Vermont_5000_5999" },
  { range: [6000, 6999], state: "Connecticut" },
  { range: [7000, 8999], state: "New Jersey" },
  { range: [10000, 14999], state: "New York" },
  { range: [15000, 19699], state: "Pennsylvania" },
  { range: [19700, 19999], state: "Delaware" },
  { range: [20000, 24699], state: "Virginia" },
  { range: [24700, 26999], state: "West Virginia" },
  { range: [27000, 28999], state: "North Carolina" },
  { range: [29000, 29999], state: "South Carolina" },
  { range: [30000, 31999], state: "Georgia" },
  { range: [32000, 34999], state: "Florida" },
  { range: [35000, 36999], state: "Alabama" },
  { range: [37000, 38599], state: "Tennessee" },
  { range: [38600, 39999], state: "Mississippi" },
  { range: [40000, 42999], state: "Kentucky" },
  { range: [43000, 45999], state: "Ohio" },
  { range: [46000, 47999], state: "Indiana" },
  { range: [48000, 49999], state: "Michigan" },
  { range: [50000, 52999], state: "Iowa" },
  { range: [53000, 54999], state: "Wisconsin" },
  { range: [55000, 56799], state: "Minnesota" },
  { range: [57000, 57999], state: "South Dakota" },
  { range: [58000, 58999], state: "North Dakota" },
  { range: [59000, 59999], state: "Montana" },
  { range: [60000, 62999], state: "Illinois" },
  { range: [63000, 65999], state: "Missouri" },
  { range: [66000, 67999], state: "Kansas" },
  { range: [68000, 69999], state: "Nebraska" },
  { range: [70000, 71599], state: "Louisiana" },
  { range: [71600, 72999], state: "Arkansas" },
  { range: [73000, 74999], state: "Oklahoma" },
  { range: [75000, 79999], state: "Texas" },
  { range: [80000, 81999], state: "Colorado" },
  { range: [82000, 83199], state: "Wyoming" },
  { range: [83200, 83999], state: "Idaho" },
  { range: [84000, 84999], state: "Utah" },
  { range: [85000, 86999], state: "Arizona" },
  { range: [87000, 88499], state: "New Mexico" },
  { range: [88900, 89999], state: "Nevada" },
  { range: [90000, 96162], state: "California" },
  { range: [97000, 97999], state: "Oregon" },
  { range: [98000, 99499], state: "Washington" },
  { range: [99500, 99950], state: "Alaska" },
  { range: [96700, 96999], state: "Hawaii" }
];

// -------------------------------------------------------------
// 3) Funciones nuevas: normalizar ZIP y obtener estado por ZIP
// -------------------------------------------------------------

// Normaliza ZIP → siempre devuelve 5 dígitos agregando ceros
export function normalizeZip(zip) {
  let z = String(zip).trim();

  // Si no contiene solo números: ZIP inválido
  if (!/^\d+$/.test(z)) return null;

  // Agregar ceros adelante si faltan
  if (z.length < 5) {
    z = z.padStart(5, "0");
  }

  return z;
}

// Detecta el estado según rangos y ZIP normalizado
export function getStateFromZip(zip) {
  const normalized = normalizeZip(zip);
  if (!normalized) return null;

  const zipNumber = parseInt(normalized);

  for (const entry of zipRangesUSA) {
    const [min, max] = entry.range;
    if (zipNumber >= min && zipNumber <= max) {
      return entry.state;
    }
  }

  return null;
}


// -------------------------------------------------------------
// 4) Función principal: obtiene tarifa según ZIP
// -------------------------------------------------------------
export function getShippingRateByZip(zip) {
  const state = getStateFromZip(zip);
  if (!state) return null;

  const price = Number(statePricesUSA[state]?.toFixed(2));
  if (!price) return null;

  return { state, price };
}

