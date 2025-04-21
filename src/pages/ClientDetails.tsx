import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Cliente } from '../services/fetchClientes';
import { fetchClientes } from '../services/fetchClientes';
import { fetchContas, Conta } from '../services/fetchContas';
import { Agencia, fetchAgencias } from '../services/fetchAgencias';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencia, setAgencia] = useState<Agencia | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      const todosClientes = await fetchClientes();
      const clienteSelecionado = todosClientes.find((c) => c.id === id);
      if (clienteSelecionado) {
        setCliente(clienteSelecionado);

        const todasContas = await fetchContas();
        const contasCliente = todasContas.filter(
          (conta) => conta.cpfCnpjCliente === clienteSelecionado.cpfCnpj
        );
        setContas(contasCliente);

        const agencias = await fetchAgencias();
        const agenciaCliente = agencias.find(
          (a) => a.codigo === clienteSelecionado.codigoAgencia
        );
        setAgencia(agenciaCliente || null);
      }
    };

    carregarDados();
  }, [id]);

  if (!cliente) return <p>Carregando cliente...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Detalhes do Cliente</h1>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>← Voltar</Link>

      <div style={{ marginBottom: '20px' }}>
        <h2>{cliente.nome}</h2>
        <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Endereço:</strong> {cliente.endereco}</p>
        <p><strong>Data de nascimento:</strong> {cliente.dataNascimento.toLocaleDateString()}</p>
        <p><strong>Renda Anual:</strong> R$ {cliente.rendaAnual.toLocaleString()}</p>
        <p><strong>Patrimônio:</strong> R$ {cliente.patrimonio.toLocaleString()}</p>
        <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>
        {cliente.nomeSocial && <p><strong>Nome Social:</strong> {cliente.nomeSocial}</p>}
      </div>

      <h3>Contas Bancárias</h3>
      {contas.length > 0 ? (
        contas.map((conta) => (
          <div key={conta.id} style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#f9f9f9' }}>
            <p><strong>Tipo:</strong> {conta.tipo}</p>
            <p><strong>Saldo:</strong> R$ {conta.saldo.toLocaleString()}</p>
            <p><strong>Limite de Crédito:</strong> R$ {conta.limiteCredito.toLocaleString()}</p>
            <p><strong>Crédito Disponível:</strong> R$ {conta.creditoDisponivel.toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>Este cliente não possui contas cadastradas.</p>
      )}

      <h3>Agência</h3>
      {agencia ? (
        <div>
          <p><strong>Nome:</strong> {agencia.nome}</p>
          <p><strong>Endereço:</strong> {agencia.endereco}</p>
        </div>
      ) : (
        <p>Agência não encontrada.</p>
      )}
    </div>
  );
};

export default ClientDetails;
