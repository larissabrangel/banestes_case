// src/services/dataService.ts

import Papa from 'papaparse';
import { Cliente, Conta, Agencia } from '../types.ts';

const parseCSV = async <T>(url: string): Promise<T[]> => {
  const response = await fetch(url);
  const text = await response.text();

  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
    });
  });
};

export const fetchClientes = () => parseCSV<Cliente>('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes');

export const fetchContas = () => parseCSV<Conta>('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas');

export const fetchAgencias = () => parseCSV<Agencia>('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias');
