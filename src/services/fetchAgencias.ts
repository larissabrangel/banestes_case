import Papa from 'papaparse';

export interface Agencia {
  id: string;
  codigo: number;
  nome: string;
  endereco: string;
}

export async function fetchAgencias(): Promise<Agencia[]> {
  const url = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias';
  const response = await fetch(url);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, { header: true });
  const rawAgencias = parsed.data as any[];

  const agencias: Agencia[] = rawAgencias.map((a) => ({
    id: a.id,
    codigo: parseInt(a.codigo),
    nome: a.nome,
    endereco: a.endereco,
  }));

  return agencias;
}
