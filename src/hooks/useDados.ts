// src/hooks/useDados.ts
import { useState, useEffect } from 'react';
import { Cliente } from '../services/fetchClientes';
import { Conta } from '../services/fetchContas';
import { Agencia } from '../services/fetchAgencias';

export const useDados = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar e processar os dados de Clientes
        const clienteRes = await fetch(
          'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes'
        );
        const clienteCsv = await clienteRes.text();
        const clientesParsed = parseClientes(clienteCsv);
        setClientes(clientesParsed);

        // Buscar e processar os dados de Contas
        const contasRes = await fetch(
          'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas'
        );
        const contasCsv = await contasRes.text();
        const contasParsed = parseContas(contasCsv);
        setContas(contasParsed);

        // Buscar e processar os dados de Agências
        const agenciasRes = await fetch(
          'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias'
        );
        const agenciasCsv = await agenciasRes.text();
        const agenciasParsed = parseAgencias(agenciasCsv);
        setAgencias(agenciasParsed);

        setLoading(false);
      } catch (err) {
        setErro('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para parsear os dados de clientes para o formato correto
  const parseClientes = (csvText: string): Cliente[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
      const values = line.split(',');

      const cliente: Cliente = {
        id: values[0],
        cpfCnpj: values[1],
        rg: values[2] || undefined,
        dataNascimento: new Date(values[3]),
        nome: values[4],
        nomeSocial: values[5] || undefined,
        email: values[6],
        endereco: values[7],
        rendaAnual: parseFloat(values[8]),
        patrimonio: parseFloat(values[9]),
        estadoCivil: values[10] as 'Solteiro' | 'Casado' | 'Viúvo' | 'Divorciado',
        codigoAgencia: parseInt(values[11], 10),
      };

      return cliente;
    });
  };

  // Função para parsear os dados de contas
  const parseContas = (csvText: string): Conta[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
      const values = line.split(',');

      const conta: Conta = {
        id: values[0],
        cpfCnpjCliente: values[1],
        tipo: values[2] as 'corrente' | 'poupanca',
        saldo: parseFloat(values[3]),
        limiteCredito: parseFloat(values[4]),
        creditoDisponivel: parseFloat(values[5]),
      };

      return conta;
    });
  };

  // Função para parsear os dados de agências
  const parseAgencias = (csvText: string): Agencia[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
      const values = line.split(',');

      const agencia: Agencia = {
        id: values[0],
        codigo: parseInt(values[1], 10),
        nome: values[2],
        endereco: values[3],
      };

      return agencia;
    });
  };

  return { clientes, contas, agencias, loading, erro };
};
