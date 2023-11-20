import React, { useState } from 'react';
import './App.css';


import TabelaCursos from '../fomularios/tabelaCursos';
import FormularioCurso from '../fomularios/formularioCurso';



function HomePage({ onRedirect }) {
  const [exibirTabelaCursos, setExibirTabelaCursos] = useState(false);
  const [exibirFormularioCurso, setExibirFormularioCurso] = useState(false);

  const handleListarCursosClick = () => {
    setExibirTabelaCursos(true);
    setExibirFormularioCurso(false);
  };

  const handleCadastrarCursoClick = () => {
    setExibirTabelaCursos(false);
    setExibirFormularioCurso(true);
  };

  return (
    <div>
      <h1>Catálogo de Cursos CEUMA</h1>

      <button onClick={handleListarCursosClick}>Listar Cursos</button>
      <button onClick={handleCadastrarCursoClick}>Cadastrar Curso</button>

      {exibirTabelaCursos && <TabelaCursos />}
      {exibirFormularioCurso && <FormularioCurso />}
    </div>
  );
}

export default HomePage;
