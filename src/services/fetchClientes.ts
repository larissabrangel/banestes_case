// src/services/fetchClientes.ts
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

export const fetchClientes = async (): Promise<Cliente[]> => {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes");
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const clientes: Cliente[] = (parsed.data as any[]).map((row) => ({
    id: row["id"],
    cpfCnpj: row["cpfCnpj"],
    rg: row["rg"] || undefined,
    dataNascimento: new Date(row["dataNascimento"]),
    nome: row["nome"],
    nomeSocial: row["nomeSocial"] || undefined,
    email: row["email"],
    endereco: row["endereco"],
    rendaAnual: parseFloat(row["rendaAnual"]),
    patrimonio: parseFloat(row["patrimonio"]),
    estadoCivil: row["estadoCivil"],
    codigoAgencia: parseInt(row["codigoAgencia"], 10),
  }));

  return clientes;
};
