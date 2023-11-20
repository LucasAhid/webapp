import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faList } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';
import './Form.css';

import Modal from 'react-modal';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ListarAlunos from '../paginas/listarAlunos';
import FormularioCurso from './formularioCurso';


function TabelaCursos() {
  // UseState
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState(null);
  const [alunosDoCurso, setAlunosDoCurso] = useState([]);
  // UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/api/cursos/listarCursos")
      .then(retorno => retorno.json())
      .then(retorno_json => setCursos(retorno_json));
  }, []);

  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  Modal.setAppElement('ID');

  // Modal
  const openModal = (cursoId) => {
    setCursoSelecionadoId(cursoId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const excluirCurso = (cursoId) => {
    fetch(`http://localhost:8080/api/cursos/${cursoId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao excluir curso: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Curso excluído com sucesso:', data);
        return fetch("http://localhost:8080/api/cursos/listarCursos");
      })
      .then((retorno) => retorno.json())
      .then((retorno_json) => setCursos(retorno_json))
      .catch((error) => {
        console.error('Erro ao excluir curso:', error.message);
      });
  };

  const editarCurso = (curso) => {
    setCursoEditando(curso);
    setModalEdicaoAberto(true);
  };

  const fecharEditar = () => {
    setModalEdicaoAberto(false)
  }


  return (
    <table id="tabelaCursos">
      <thead>
        <tr>
          <th>#</th>
          <th>Código</th>
          <th>Nome</th>
          <th>Carga Horária</th>
          <th>Data do Cadastro</th>
          <th></th>
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
                <button onClick={() => openModal(curso.id)} title="Listar Alunos">
                  <FontAwesomeIcon icon={faList} />
                </button>
                <button onClick={() => editarCurso(curso)} title="Editar Curso">
                   <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => excluirCurso(curso.id)} title="Excluir Curso">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
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

      {/* Botão de Exportação */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Listar Alunos</h2>
        <ListarAlunos />
        <button onClick={closeModal}>Fechar Modal</button>
      </Modal>
      <Modal isOpen={modalEdicaoAberto} onRequestClose={fecharEditar}>
        <h2>Editar Curso</h2>
        <FormularioCurso />
        <button onClick={fecharEditar}>Fechar Modal</button>
      </Modal>

    </table>
  );
}

export default TabelaCursos;
