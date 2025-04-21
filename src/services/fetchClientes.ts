import Papa from 'papaparse';

export interface Cliente {
  id: string;
  cpfCnpj: string;
  rg?: string;
  dataNascimento: Date;
  nome: string;
  nomeSocial?: string;
  email: string;
  endereco: string;
  rendaAnual: number;
  patrimonio: number;
  estadoCivil: "Solteiro" | "Casado" | "Viúvo" | "Divorciado";
  codigoAgencia: number;
}

export async function fetchClientes(): Promise<Cliente[]> {
  const url = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes';
  const response = await fetch(url);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, { header: true });
  const rawClientes = parsed.data as any[];

  const clientes: Cliente[] = rawClientes.map((c) => ({
    id: c.id,
    cpfCnpj: c.cpfCnpj,
    rg: c.rg || undefined,
    dataNascimento: new Date(c.dataNascimento),
    nome: c.nome,
    nomeSocial: c.nomeSocial || undefined,
    email: c.email,
    endereco: c.endereco,
    rendaAnual: parseFloat(c.rendaAnual),
    patrimonio: parseFloat(c.patrimonio),
    estadoCivil: c.estadoCivil as Cliente["estadoCivil"],
    codigoAgencia: parseInt(c.codigoAgencia),
  }));

  return clientes;
}
