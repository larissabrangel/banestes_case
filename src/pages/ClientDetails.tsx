import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cliente, Conta, Agencia } from '../types';
import { fetchClientes, fetchContas, fetchAgencias } from '../services/dataService';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencia, setAgencia] = useState<Agencia | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const clientes = await fetchClientes();
      const contasTodas = await fetchContas();
      const agencias = await fetchAgencias();

      const clienteSelecionado = clientes.find((c) => c.id === id);
      setCliente(clienteSelecionado || null);

      if (clienteSelecionado) {
        const contasCliente = contasTodas.filter(
          (conta) => conta.cpfCnpjCliente === clienteSelecionado.cpfCnpj
        );
        setContas(contasCliente);

        const agenciaDoCliente = agencias.find(
          (a) => a.codigo === clienteSelecionado.codigoAgencia
        );
        setAgencia(agenciaDoCliente || null);
      }
    };

    fetchData();
  }, [id]);

  if (!cliente) {
    return <p style={{ padding: '2rem' }}>Carregando informações do cliente...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Voltar
      </button>

      <h2>{cliente.nome}</h2>
      <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Endereço:</strong> {cliente.endereco}</p>
      <p><strong>Data de nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString()}</p>
      <p><strong>Renda Anual:</strong> R$ {cliente.rendaAnual.toLocaleString()}</p>
      <p><strong>Patrimônio:</strong> R$ {cliente.patrimonio.toLocaleString()}</p>
      <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>

      <h3>Contas Bancárias</h3>
      {contas.length > 0 ? (
        <ul>
          {contas.map((conta) => (
            <li key={conta.id}>
              <p><strong>Tipo:</strong> {conta.tipo}</p>
              <p><strong>Saldo:</strong> R$ {conta.saldo.toLocaleString()}</p>
              <p><strong>Limite de Crédito:</strong> R$ {conta.limiteCredito.toLocaleString()}</p>
              <p><strong>Crédito Disponível:</strong> R$ {conta.creditoDisponivel.toLocaleString()}</p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma conta encontrada para este cliente.</p>
      )}

      <h3>Agência</h3>
      {agencia ? (
        <>
          <p><strong>Nome:</strong> {agencia.nome}</p>
          <p><strong>Endereço:</strong> {agencia.endereco}</p>
        </>
      ) : (
        <p>Agência não encontrada.</p>
      )}
    </div>
  );
};

export default ClientDetails;
