import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Cliente, Conta, Agencia } from "../types";

// URLs para os dados
const CLIENTES_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const CONTAS_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const AGENCIAS_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

export function useDados() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dados CSV
    const fetchCSV = async (url: string) => {
      const response = await fetch(url);
      const text = await response.text();
      return new Promise<any[]>((resolve) => {
        Papa.parse(text, {
          header: true,  // Usa o primeiro valor como cabeçalho
          skipEmptyLines: true,  // Ignora linhas vazias
          complete: (result) => resolve(result.data),
        });
      });
    };

    // Função para carregar os dados
    const carregarDados = async () => {
      setLoading(true);  // Inicia o carregamento
      try {
        // Carrega os dados de todas as planilhas ao mesmo tempo
        const [clientesData, contasData, agenciasData] = await Promise.all([
          fetchCSV(CLIENTES_URL),
          fetchCSV(CONTAS_URL),
          fetchCSV(AGENCIAS_URL),
        ]);

        // Processa os dados dos clientes
        setClientes(
          clientesData.map((c: any) => ({
            ...c,
            dataNascimento: new Date(c.dataNascimento),
            rendaAnual: parseFloat(c.rendaAnual),
            patrimonio: parseFloat(c.patrimonio),
            codigoAgencia: Number(c.codigoAgencia),
          }))
        );

        // Processa os dados das contas
        setContas(
          contasData.map((c: any) => ({
            ...c,
            saldo: parseFloat(c.saldo),
            limiteCredito: parseFloat(c.limiteCredito),
            creditoDisponivel: parseFloat(c.creditoDisponivel),
          }))
        );

        // Processa os dados das agências
        setAgencias(
          agenciasData.map((a: any) => ({
            ...a,
            codigo: Number(a.codigo),
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);  // Finaliza o carregamento
      }
    };

    carregarDados();  // Chama a função para carregar os dados
  }, []);  // Só executa uma vez, no momento que o componente monta

  return { clientes, contas, agencias, loading };  // Retorna os dados carregados
}
