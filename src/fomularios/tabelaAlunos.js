import React, { useState, useEffect } from 'react';

function TabelaAlunos(cursoSelecionadoId){
    
    const [alunos, setAlunos] = useState([])
    useEffect(() => {
        if (cursoSelecionadoId) {
          fetch(`http://localhost:8080/api/alunos/por-curso/${cursoSelecionadoId}`)
            .then((retorno) => retorno.json())
            .then((retorno_json) => setAlunos(retorno_json));
        }
      }, [cursoSelecionadoId])     
      
    return (
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
            </tr>
        </thead>
        <tbody>
        {alunos.map(aluno => (
          <tr key={aluno.id}>
            <td>{aluno.id}</td>
            <td>{aluno.codigo}</td>
            <td>{aluno.nome}</td>
            <td>{aluno.cpf}</td>
            <td>{aluno.endereco}</td>
            <td>{aluno.cep}</td>
            <td>{aluno.email}</td>
          </tr>
        ))}
        </tbody>
        </table>
        )
}

export default TabelaAlunos;