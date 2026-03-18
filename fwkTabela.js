let tabela = document.getElementsByTagName("tabela");

for (let i = 0; i < tabela.length; i++) {

    let tab = tabela[i];
    let linhas = parseInt(tab.getAttribute("linha"));
    let colunas = parseInt(tab.getAttribute("coluna"));

    if (!linhas || !colunas) {
        alert("Tabela inválida: linhas ou colunas não definidas");
        continue;
    }

    let novaTabela = document.createElement("table");

    let dadosTag = tab.getElementsByTagName("dados")[0];
    let dados = [];

    if (dadosTag) {
        let texto = dadosTag.textContent.trim();

        let linhasDados = texto
            .split("\n")
            .map(l => l.trim())
            .filter(l => l !== "");

        dados = linhasDados.map(linha =>
            linha.split("|").map(c => c.trim())
        );
    }

    let erro = false;

    if (dados.length > linhas) {
        alert("Dados excedem o número de linhas");
        erro = true;
    }

    let espan = tab.getElementsByTagName("expand");
    let matriz = [];

    for (let j = 0; j < espan.length; j++) {

        let linha = parseInt(espan[j].getAttribute("linha"));
        let coluna = parseInt(espan[j].getAttribute("coluna"));
        let tamanho = parseInt(espan[j].getAttribute("tamanho"));
        let tipo = espan[j].getAttribute("tipo");

        if (tipo == "coluna" && coluna + tamanho > colunas) {
            alert("Colspan inválido");
            erro = true;
        }

        if (tipo == "linha" && linha + tamanho > linhas) {
            alert("Rowspan inválido");
            erro = true;
        }

        matriz.push([linha, coluna, tamanho, tipo]);
    }

    if (erro) {
        alert("Tabela não criada por erro de validação");
        continue;
    }

    let ocupado = [];

    for (let x = 0; x < linhas; x++) {
        ocupado[x] = [];
        for (let y = 0; y < colunas; y++) {
            ocupado[x][y] = false;
        }
    }

    for (let x = 0; x < linhas; x++) {

        let tr = document.createElement("tr");
        let y = 0;

        while (y < colunas) {

            if (ocupado[x][y]) {
                y++;
                continue;
            }

            let td = document.createElement("td");

            let colspan = 1;
            let rowspan = 1;

            for (let k = 0; k < matriz.length; k++) {

                if (matriz[k][0] == x && matriz[k][1] == y) {

                    if (matriz[k][3] == "coluna") {
                        colspan = matriz[k][2];
                    }

                    if (matriz[k][3] == "linha") {
                        rowspan = matriz[k][2];
                    }

                    break;
                }
            }

            if (dados[x] && dados[x][y]) {
                td.innerText = dados[x][y];
            }

            if (colspan > 1) {
                td.setAttribute("colspan", colspan);
            }

            if (rowspan > 1) {
                td.setAttribute("rowspan", rowspan);
            }

            for (let i2 = 0; i2 < rowspan; i2++) {
                for (let j2 = 0; j2 < colspan; j2++) {
                    if (x + i2 < linhas && y + j2 < colunas) {
                        ocupado[x + i2][y + j2] = true;
                    }
                }
            }

            tr.appendChild(td);

            y++;
        }

        novaTabela.appendChild(tr);
    }

    tab.appendChild(novaTabela);
}
