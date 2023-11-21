import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import FormularioAluno from './formularioAluno';

function ListarAlunos({ cursoId }) {
  const [alunos, setAlunos] = useState([]);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [mostrarFormularioAluno, setMostrarFormularioAluno] = useState(false);
  const [erro, setErro] = useState(null);
  const [alunoEditado, setAlunoEditado] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/api/cursos/por-curso/${cursoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao obter lista de alunos: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setAlunos(data))
      .catch((error) => {
        console.error('Erro ao obter lista de alunos por curso:', error);
        setErro('Erro ao carregar a lista de alunos. Tente novamente mais tarde.');
      });
  }, [cursoId, mostrarFormularioAluno]); 

  const abrirFormularioAluno = () => {
    setMostrarFormularioAluno(true);
  };

  const fecharFormularioAluno = () => {
    setMostrarFormularioAluno(false);
    // Atualize a lista de alunos após cadastrar
    atualizarListaAlunos();
  };

  const editarAluno = (alunoId) => {
    // Obtém os dados do aluno a ser editado
    const alunoEditado = obterAlunoEditadoDoEstado();
    // Salva a edição do aluno
    salvarEdicaoAluno(alunoId, alunoEditado);
  };

  const salvarEdicaoAluno = (alunoId, alunoEditado) => {
    fetch(`http://localhost:8080/api/alunos/${alunoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alunoEditado),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao editar aluno: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Aluno editado com sucesso:', data);
        // Atualize a lista de alunos após a edição
        atualizarListaAlunos();
      })
      .catch((error) => {
        console.error('Erro ao editar aluno:', error.message);
      });
  };

  const excluirAluno = (alunoId) => {
    confirmarExclusao(alunoId);
  };

  const confirmarExclusao = (alunoId) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir este aluno?');
    if (confirmacao) {
      removerAluno(alunoId);
    }
  };

  const removerAluno = (alunoId) => {
    fetch(`http://localhost:8080/api/alunos/${alunoId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao excluir aluno: ${response.status}`);
        }
        console.log('Aluno excluído com sucesso.');
        // Atualize a lista de alunos após a exclusão
        atualizarListaAlunos();
      })
      .catch((error) => {
        console.error('Erro ao excluir aluno:', error.message);
      });
  };

  const atualizarListaAlunos = () => {
    console.log('Atualizando lista de alunos...');
    // Chame a função para atualizar a lista de alunos
    listarAlunos();
  };

  const listarAlunos = () => {
    // Adicione a lógica para obter a lista de alunos aqui
    fetch(`http://localhost:8080/api/cursos/por-curso/${cursoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao obter lista de alunos: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setAlunos(data))
      .catch((error) => {
        console.error('Erro ao obter lista de alunos por curso:', error);
        setErro('Erro ao carregar a lista de alunos. Tente novamente mais tarde.');
      });
  };

  const obterAlunoEditadoDoEstado = () => {
    // Retorna os dados do aluno editado do estado
    return alunoEditado;
  };

  const voltarParaCursos = () => {
    // Sua lógica para voltar para a tela inicial
    console.log('Voltar para cursos...');
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'F5') {
        voltarParaCursos();
      }
    };

    // Adiciona um event listener para a tecla F5
    window.addEventListener('keydown', handleKeyPress);

    // Remove o event listener ao desmontar o componente
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [voltarParaCursos]);

  return (
    <div>
      <button onClick={voltarParaCursos}>
        <FontAwesomeIcon icon={faHome} />
        Retornar à Tela Inicial
      </button>
      <button onClick={abrirFormularioAluno}>
        Adicionar Aluno
      </button>
      {mostrarFormularioAluno && <FormularioAluno fecharFormulario={fecharFormularioAluno} />}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Endereço</th>
            <th>CEP</th>
            <th>Email</th>
            <th>Gerenciar</th>
          </tr>
        </thead>
        <tbody>
          {alunos && alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.codigo}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.cpf}</td>
              <td>{aluno.endereco}</td>
              <td>{aluno.cep}</td>
              <td>{aluno.email}</td>
              <td>
                <button onClick={() => editarAluno(aluno.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                  Editar
                </button>
                <button onClick={() => excluirAluno(aluno.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <ReactHTMLTableToExcel
                id="botaoExportar"
                className="download-table-xls-button"
                table="tabelaAlunos"
                filename="tabelaAlunos"
                sheet="tabelaAlunos"
                buttonText="Exportar Excel"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default ListarAlunos;
