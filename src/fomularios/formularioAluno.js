import React, { useState } from 'react';

function FormularioAluno() {
  const [aluno, setAluno] = useState({
    Codigo: '',
    Name: '',
    CPF: '',
    Endereço: '',
    CEP: '',
    Email: ''
  });

  const aoDigitar = (e) => {
    const { id, value } = e.target;
    setAluno((prevAluno) => ({
      ...prevAluno,
      [id]: value,
    }));
  };

  const cadastrarAluno = () => {
    
    if (validarEmail(aluno.Email)) {
  
      console.log('Email válido. Cadastrar aluno:', aluno);
    } else {
      console.error('Email inválido. Não cadastrar aluno.');
    }
    
    fetch('/cadastrarAluno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aluno),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Cadastro realizado com sucesso:', data);
      })
      .catch((error) => {
        console.error('Erro ao cadastrar aluno:', error);
      });
      handleLimpar();
  };

  const handleLimpar = () => {
    setAluno({
      Codigo: '',
      Nome: '',
      CPF: '',
      Endereço: '',
      CEP: '',
      Email: ''
    });
  };

  const handleCancelar = () => {
    console.log('Cancelando e voltando para a lista de cursos');
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
          value={aluno.Name}
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
        <input type='button' value='Cancelar' onClick={handleCancelar} />
      </div>
    </form>
  );
}

export default FormularioAluno;
