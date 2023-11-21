import React, { useState } from 'react';

function FormularioAluno(cursoSelecionadoId) {
  const [aluno, setAluno] = useState({
    Codigo: '',
    Nome: '', 
    CPF: '',
    Endereço: '',
    CEP: '',
    Telefone: '',
    Email: '',
    curso: cursoSelecionadoId,
  });
  
  const aoDigitarTelefone = (e) => {
    const { id, value } = e.target;

    const numerosApenas = value.replace(/\D/g, '');

    let telefoneFormatado = numerosApenas.replace(/^(\d{2})(\d{8,9})$/, '$1-$2');


    setAluno((prevAluno) => ({
      ...prevAluno,
      [id]: telefoneFormatado,
    }));
  };


  const aoDigitar = (e) => {
    const { id, value } = e.target;
    setAluno((prevAluno) => ({
      ...prevAluno,
      [id]: value,
    }));
  };

  const cadastrarAluno = () => {
    console.log('Enviando requisição de cadastro do aluno:', aluno);
  
    fetch('http://localhost:8080/api/alunos/cadastrarAluno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aluno),
    })
    .then((response) => {
      console.log('Resposta do servidor:', response);
      
      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    })
    .then((data) => {
      console.log('Cadastro realizado com sucesso:', data);
      handleLimpar();
      })
      .catch((error) => {
        console.error('Erro ao cadastrar aluno:', error);
      });
  };
  

  const handleLimpar = () => {
    setAluno({
      Codigo: '',
      Nome: '', 
      CPF: '',
      Endereço: '',
      CEP: '',
      Telefone: '',
      Email: ''
    });
  };


  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  return (
    <form>
      <h1>Formulário do Aluno</h1>
      <div>
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Nome'
          id='Nome'
          value={aluno.Nome}
        />
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Código'
          id='Codigo'
          value={aluno.Codigo}
        />
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='CPF'
          id='CPF'
          value={aluno.CPF}
          pattern="[0-9]*"
          maxLength="14" 
          onKeyPress={(e) => {
            const inputValue = e.key;
            const isNumber = /^[0-9]$/;

            if (isNumber.test(inputValue)) {
            if (aluno.CPF.length === 3 || aluno.CPF.length === 7) {
                setAluno((prevAluno) => ({
                ...prevAluno,
                CPF: prevAluno.CPF + '.',
                }));
            } else if (aluno.CPF.length === 11) {
                setAluno((prevAluno) => ({
                ...prevAluno,
                CPF: prevAluno.CPF + '-',
                }));
            }

            if (aluno.CPF.length < 14) {
                setAluno((prevAluno) => ({
                ...prevAluno,
                CPF: prevAluno.CPF + inputValue,
                }));
            }
            }

            e.preventDefault();
        }}
        />

        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Endereço'
          id='Endereço'
          value={aluno.Endereço}
        />
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='CEP'
          id='CEP'
          value={aluno.CEP}
          pattern="[0-9]*"
          maxLength="10"
          onKeyPress={(e) => {
              const inputValue = e.key;
              const isNumber = /^[0-9]$/;

              if (isNumber.test(inputValue) && aluno.CEP.length < 8) {
              setAluno((prevAluno) => ({
                  ...prevAluno,
                  CEP: prevAluno.CEP + inputValue,
            }));
            }

            e.preventDefault();
        }}
        />
        <input
          type='text'
          onChange={aoDigitarTelefone}
          className='form-control'
          placeholder='Telefone'
          id='Telefone'
          value={aluno.Telefone}
          pattern="[0-9]{2}-[0-9]{8,9}"
          maxLength="12"
        />
        <input
          type='text'
          onChange={aoDigitar}
          className='form-control'
          placeholder='Email'
          id='Email'
          value={aluno.Email}
        />
      </div>
      <div>
        <input type='button' value='Cadastrar' onClick={cadastrarAluno} />
        <input type='button' value='Limpar' onClick={handleLimpar} />
      </div>
    </form>
  );
}

export default FormularioAluno;
