let tabela = document.getElementsByTagName("tabela");

for(let i = 0; i < tabela.length; i++){

    let tab = tabela[i];
    let linhas = parseInt(tab.getAttribute("linha"));
    let colunas = parseInt(tab.getAttribute("coluna"));

    let novaTabela = document.createElement("table");

    let espan = tab.getElementsByTagName("expand");

    let matriz = [];

    for(let j = 0; j < espan.length; j++){

        let linha = espan[j].getAttribute("linha");
        let coluna = espan[j].getAttribute("coluna");
        let tamanho = espan[j].getAttribute("tamanho");
        let tipo = espan[j].getAttribute("tipo");

        matriz.push([linha, coluna, tamanho, tipo]);
    }

    let quantRowspan = [];

    for(let i = 0; i < colunas; i++){
        quantRowspan[i] = 0;
    }

    for(let x = 0; x < linhas; x++){

        let tr = document.createElement("tr");

        for(let y = 0; y < colunas; y++){

            if(quantRowspan[y] > 0){
                quantRowspan[y]--;
                continue;
            }

            let td = document.createElement("td");

            let colspan = 1;
            let rowspan = 1;

            for(let k = 0; k < matriz.length; k++){

                if(matriz[k][0] == x && matriz[k][1] == y){

                    if(matriz[k][3] == "coluna"){
                        colspan = parseInt(matriz[k][2]);
                    }

                    if(matriz[k][3] == "linha"){
                        rowspan = parseInt(matriz[k][2]);
                    }

                    break;
                }
            }

            if(colspan > 1){
                td.setAttribute("colspan", colspan);
            }

            if(rowspan > 1){
                td.setAttribute("rowspan", rowspan);
                quantRowspan[y] = rowspan - 1;
            }

            tr.appendChild(td);

            y += colspan - 1;
        }

        novaTabela.appendChild(tr);
    }

    tab.appendChild(novaTabela);
}
