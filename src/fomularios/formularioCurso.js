import React, { useState } from 'react';

function FormularioCurso({ cursoEditando, salvarEdicao}) {  
  const [curso, setCurso] = useState({
    codigo: cursoEditando ? cursoEditando.codigo : '',
    nome: cursoEditando ? cursoEditando.nome : '',
    cargaHoraria: cursoEditando ? cursoEditando.cargaHoraria : '',
  });

  const [mensagem, setMensagem] = useState('');

  const aoDigitar = (e) => {
    const { id, value } = e.target;
    setCurso((prevCurso) => ({
      ...prevCurso,
      [id]: value,
    }));
  };

  const cadastrarCurso = () => {
    handleLimpar();

    const dataAtual = new Date().toISOString();
    const cursoComData = {
      ...curso,
      dataCadastro: dataAtual,
    };

    const cargaHorariaInt = parseInt(cursoComData.cargaHoraria, 10);

    if (!isNaN(cargaHorariaInt)) {
      cursoComData.cargaHoraria = cargaHorariaInt;

      fetch('http://localhost:8080/api/cursos/cadastrarCurso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoComData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao cadastrar curso');
          }
          return response.json();
        })
        .then((data) => {
          setMensagem('Cadastro realizado com sucesso');
          console.log('Cadastro realizado com sucesso:', data);
        })
        .catch((error) => {
          setMensagem('Erro ao cadastrar curso');
          console.error('Erro ao cadastrar curso:', error);
        });
    } else {
      setMensagem('Erro ao converter cargaHoraria para número inteiro');
      console.error('Erro ao converter cargaHoraria para número inteiro');
    }
  };
  const handleLimpar = () => {
    setCurso({
      codigo: '',
      nome: '',
      cargaHoraria: ''
    });
  };

  const salvarEdicaoCurso = () => {
    salvarEdicao(cursoEditando.id, curso);
  };

  return (
    <form>
      <h1>Formulário do Curso</h1>
      <div>
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Código'
          id='codigo'
          value={curso.codigo}
        />
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Nome'
          id='nome'
          value={curso.nome}
        />
      </div>
      <div id='time'>
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Carga Horaria em Minutos'
          id='cargaHoraria'
          value={curso.cargaHoraria}
          pattern="[0-9]*"
          maxLength="5"
        />
      </div>
      <div>
      {cursoEditando ? (
        <input type='button' value='Salvar Edição' onClick={salvarEdicaoCurso} />
      ) : (
        <input type='button' value='Cadastrar' onClick={cadastrarCurso} />
      )}
        <input type='button' value='Limpar' onClick={handleLimpar} />
      </div>
      {mensagem && <p>{mensagem}</p>}
    </form>
  );
}

export default FormularioCurso;
