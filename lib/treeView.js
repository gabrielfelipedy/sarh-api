// function getNthKey(obj, n) {
//     return Object.entries(obj)[n]?.[0];
//   }

function buildTreeView(dadosSql, idRaizDesejada) {
    if (!dadosSql || dadosSql.length === 0) {
      return null;
    }
  
    const nodeMap = {}; // Para acesso rápido aos nós pelo ID
    let arvoreRaiz = null; // A raiz da árvore que será retornada
  
    // 1. Primeira passagem: criar todos os nós e colocá-los no mapa.
    //    Isso garante que todos os nós existam antes de tentarmos adicionar filhos.
    dadosSql.forEach(item => {
      const nodeId = item[0];
      nodeMap[nodeId] = {
        id: nodeId,
        codigoPai: item[1], // Mantemos para referência, se necessário
        descricao: item[2],
        sigla: item[3],
        children: [] // Inicializa a lista de filhos
      };
    });
  
    // 2. Segunda passagem: conectar os nós pais aos filhos.
    dadosSql.forEach(item => {
      const nodeId = item[0];
      const parentId = item[1];
      const currentNode = nodeMap[nodeId];
  
      if (nodeId === idRaizDesejada) {
        // Este é o nó raiz da subárvore que queremos
        arvoreRaiz = currentNode;
      } else if (parentId && nodeMap[parentId]) {
        // Se tem um pai E o pai existe no nosso conjunto de dados (nodeMap)
        // Adiciona o nó atual como filho do nó pai
        nodeMap[parentId].children.push(currentNode);
      }
      // Se parentId for null ou não estiver no nodeMap (o que não deveria acontecer
      // com a query `CONNECT BY PRIOR` se a raiz desejada for o `START WITH`),
      // ele seria uma raiz, mas já estamos tratando a `idRaizDesejada` especificamente.
    });
  
    // Opcional: remover a propriedade codigoPai se não for mais necessária no JSON final.
    if (arvoreRaiz) {
      const cleanTree = (node) => {
        delete node.codigoPai; // Remove a referência ao pai, já que a estrutura hierárquica está formada
        node.children.forEach(cleanTree);
      };
      // cleanTree(arvoreRaiz); // Descomente se quiser remover codigoPai
    }
  
  
    return arvoreRaiz;
  }

module.exports = {
    buildTreeView
}