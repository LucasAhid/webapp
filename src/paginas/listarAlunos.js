import React, { useState } from 'react';
import FormularioAluno from '../fomularios/formularioAluno';
import TabelaAlunos from '../fomularios/tabelaAlunos';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function ListarAlunos() {
  const [formularioVisivel, setFormularioVisivel] = useState(false);

  const exibirFormulario = () => {
    setFormularioVisivel(true);
  };

  return (
    <div>
      <TabelaAlunos />
      <button onClick={exibirFormulario}>Novo Aluno</button>

      {formularioVisivel && <FormularioAluno />}

      <ReactHTMLTableToExcel
        id="botaoExportar"
        className="download-table-xls-button"
        table="tabelaAlunos"
        filename="tabelaAlunos"
        sheet="tabelaAlunos"
        buttonText="Exportar Excel"
      />
    </div>
  );
}

export default ListarAlunos;
