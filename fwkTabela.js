let tabela = document.getElementsByTagName("tabela");

for(let i = 0; i < tabela.length; i++){

    let tab = tabela[i];
    let linhas = parseInt(tab.getAttribute("linha"));
    let colunas = parseInt(tab.getAttribute("coluna"));

    if(!linhas || !colunas){
        console.error("Tabela inválida: linhas ou colunas não definidas");
        continue;
    }

    let novaTabela = document.createElement("table");

    let dadosTag = tab.getElementsByTagName("dados")[0];
    let dados = [];

    if(dadosTag){
        let texto = dadosTag.innerText.trim();

        let linhasDados = texto
            .split("\n")
            .map(l => l.trim())
            .filter(l => l);

        dados = linhasDados.map(linha =>
            linha.split("|").map(c => c.trim())
        );
    }

    let erro = false;

    if(dados.length > linhas){
        console.error("Dados excedem o número de linhas");
        erro = true;
    }

    for(let d = 0; d < dados.length; d++){
        if(dados[d].length > colunas){
            console.error("Dados excedem o número de colunas");
            erro = true;
        }
    }

    let espan = tab.getElementsByTagName("expand");

    let matriz = [];

    for(let j = 0; j < espan.length; j++){

        let linha = parseInt(espan[j].getAttribute("linha"));
        let coluna = parseInt(espan[j].getAttribute("coluna"));
        let tamanho = parseInt(espan[j].getAttribute("tamanho"));
        let tipo = espan[j].getAttribute("tipo");

        if(tipo == "coluna" && coluna + tamanho > colunas){
            console.error("Colspan inválido");
            erro = true;
        }

        if(tipo == "linha" && linha + tamanho > linhas){
            console.error("Rowspan inválido");
            erro = true;
        }

        matriz.push([linha, coluna, tamanho, tipo]);
    }

    if(erro){
        console.error("Tabela não criada por erro de validação");
        continue;
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

            if(dados[x] && dados[x][y]){
                td.innerText = dados[x][y];
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
