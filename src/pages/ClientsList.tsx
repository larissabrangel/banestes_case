import React, { useEffect, useState } from 'react';
import { Cliente } from '../services/fetchClientes';
import { fetchClientes } from '../services/fetchClientes';
import { useNavigate } from 'react-router-dom';

const ClientsList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();

  const itensPorPagina = 10;

  useEffect(() => {
    fetchClientes().then(setClientes);
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.includes(searchTerm)
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const clientesPaginados = clientesFiltrados.slice(inicio, fim);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '16px' }}>Lista de Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nome ou CPF/CNPJ"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPaginaAtual(1);
        }}
        style={{
          padding: '8px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      {clientesPaginados.map((cliente) => (
        <div
          key={cliente.id}
          onClick={() => navigate(`/cliente/${cliente.id}`)}
          style={{
            cursor: 'pointer',
            backgroundColor: 'white',
            color: 'black',
            padding: '16px',
            marginBottom: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
        </div>
      ))}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaAtual === 1}
          style={{ padding: '8px', borderRadius: '4px' }}
        >
          Anterior
        </button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          style={{ padding: '8px', borderRadius: '4px' }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ClientsList;
