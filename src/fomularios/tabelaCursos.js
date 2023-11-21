import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faList } from '@fortawesome/free-solid-svg-icons';
import './Form.css';
import ReactDOM from 'react-dom';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ListarAlunos from './tabelaAlunos';
import FormularioCurso from './formularioCurso';


function TabelaCursos() {
  // UseState
  const [cursos, setCursos] = useState([]);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/api/cursos/listarCursos")
      .then(retorno => retorno.json())
      .then(retorno_json => setCursos(retorno_json));
  }, []);

  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  
  const salvarEdicao = (cursoId, novoCurso) => {
    // Estabelecer a data do cadastro como a data do sistema
    novoCurso.dataCadastro = format(new Date(), "yyyy-MM-dd");
  
    // Lógica para salvar a edição do curso
    fetch(`http://localhost:8080/api/cursos/${cursoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoCurso),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao editar curso: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Curso editado com sucesso:', data);
        // Atualize a lista de cursos
        fetch("http://localhost:8080/api/cursos/listarCursos")
          .then((retorno) => retorno.json())
          .then((retorno_json) => setCursos(retorno_json))
          .catch((error) => {
            console.error('Erro ao obter lista de cursos após edição:', error);
          });
      })
      .catch((error) => {
        console.error('Erro ao editar curso:', error.message);
      });
  
    // Limpe o curso editando e oculte o formulário
    setCursoEditando(null);
    setMostrarFormulario(false);
  };
  

  const excluirCurso = (cursoId) => {
    fetch(`http://localhost:8080/api/cursos/${cursoId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao excluir curso: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        console.log('Curso excluído com sucesso:', data);
  
        // Remova o curso excluído da lista local
        setCursos((cursos) => cursos.filter(curso => curso.id !== cursoId));
      })
      .catch((error) => {
        console.error('Erro ao excluir curso:', error.message);
      });
  };

  const editarCurso = (curso) => {
    setCursoEditando(curso);
    setMostrarFormulario(true);
  };

  const fecharEditar = () => {
    // Limpe o curso editando e oculte o formulário
    setCursoEditando(null);
    setMostrarFormulario(false);
  };


  function listarAlunos({ cursoId, voltarParaCursos }) {
    ReactDOM.render(<ListarAlunos cursoId={cursoId} />, 
    document.getElementById('root'));
    console.log(cursoId)
  }

  return (
    <div>
      {!mostrarFormulario && (
        <table id="tabelaCursos">
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Nome</th>
              <th>Carga Horária</th>
              <th>Data do Cadastro</th>
              <th>Gerenciar</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.codigo}</td>
                <td>{curso.nome}</td>
                <td>{curso.cargaHoraria}</td>
                <td>{formatarData(curso.dataCadastro)}</td>
                <td>
                  <div>
                    <button onClick={() => editarCurso(curso)} title="Editar Curso">
                      <FontAwesomeIcon icon={faEdit} />
                      Editar
                    </button>
                    <button onClick={() => excluirCurso(curso.id)} title="Excluir Curso">
                      <FontAwesomeIcon icon={faTrash} />
                      Excluir
                    </button>
                    <div>
                    <button onClick={() => listarAlunos({ cursoId: curso.id })} title="Listar Alunos">
                      <FontAwesomeIcon icon={faList} />
                      Alunos
                    </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <ReactHTMLTableToExcel
                  id="botaoExportarModal"
                  className="download-table-xls-button"
                  table="tabelaCursos"
                  filename="tabelaCursos"
                  sheet="tabelaCursos"
                  buttonText="Exportar para Excel"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      {mostrarFormulario && cursoEditando && (
        <div>
          <h2>Editar Curso</h2>
          <FormularioCurso cursoEditando={cursoEditando} salvarEdicao={salvarEdicao} />
          <button onClick={fecharEditar}>Fechar Edição</button>
        </div>
      )}
    </div>
  );
}

export default TabelaCursos;


