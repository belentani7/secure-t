export interface Dataset { columns: Array<{ name: string; type: "string" | "number" | "boolean" | "date" | "unknown" }>; rows: Record<string, unknown>[]; }
export interface ColumnProfile { name: string; type: string; nulls: number; unique: number; min?: number; max?: number; mean?: number; }
export interface DatasetAnalysis { rows: number; columns: ColumnProfile[]; warnings: string[]; suggestedQuestions: string[]; }

export function analyzeDataset(data: Dataset): DatasetAnalysis {
  const warnings: string[] = [];
  const columns = data.columns.map(c => {
    const values = data.rows.map(r => r[c.name]).filter(v => v !== null && v !== undefined && v !== "");
    const nums = values.filter(v => typeof v === "number") as number[];
    const profile: ColumnProfile = { name: c.name, type: c.type, nulls: data.rows.length - values.length, unique: new Set(values.map(String)).size };
    if (nums.length) { profile.min = Math.min(...nums); profile.max = Math.max(...nums); profile.mean = nums.reduce((a, b) => a + b, 0) / nums.length; }
    if (profile.nulls / Math.max(data.rows.length, 1) > 0.2) warnings.push(`${c.name}: >20% missing values`);
    if (values.length && profile.unique === 1) warnings.push(`${c.name}: constant column`);
    return profile;
  });
  return { rows: data.rows.length, columns, warnings, suggestedQuestions: suggestQuestions(columns) };
}

function suggestQuestions(columns: ColumnProfile[]): string[] {
  const numeric = columns.filter(c => c.type === "number").map(c => c.name);
  const categorical = columns.filter(c => c.type === "string" || c.type === "boolean").map(c => c.name);
  return [
    numeric[0] ? `¿Cómo se distribuye ${numeric[0]}?` : "¿Qué variables dominan el dataset?",
    numeric.length > 1 ? `¿Existe relación entre ${numeric[0]} y ${numeric[1]}?` : "¿Qué valores faltan y por qué?",
    categorical[0] ? `¿Qué categorías de ${categorical[0]} son más frecuentes?` : "¿Hay anomalías o duplicados?",
  ];
}
