import Papa from 'papaparse';

export interface Conta {
  id: string;
  cpfCnpjCliente: string;
  tipo: "corrente" | "poupanca";
  saldo: number;
  limiteCredito: number;
  creditoDisponivel: number;
}

export async function fetchContas(): Promise<Conta[]> {
  const url = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas';
  const response = await fetch(url);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, { header: true });
  const rawContas = parsed.data as any[];

  const contas: Conta[] = rawContas.map((c) => ({
    id: c.id,
    cpfCnpjCliente: c.cpfCnpjCliente,
    tipo: c.tipo as Conta["tipo"],
    saldo: parseFloat(c.saldo),
    limiteCredito: parseFloat(c.limiteCredito),
    creditoDisponivel: parseFloat(c.creditoDisponivel),
  }));

  return contas;
}
