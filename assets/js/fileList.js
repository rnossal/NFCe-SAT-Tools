var fileHandler;
window.onload = function() {
	//Procura pelo elemento que deve estar no arquivo HTML
	fileHandler = document.querySelector('#fileHandler');
	//Adiciona os inputs e o div que possuirá a lista
	fileHandler.innerHTML = '<input type="file" name="chooseFolder" id="chooseFolder" webkitdirectory directory multiple>' +
							'<label for="chooseFolder"><i class="icon icon-inverse icon-upload"></i>Selecionar uma Pasta</label>' +
							'<input type="file" name="chooseFiles" id="chooseFiles" multiple>' +
							'<label for="chooseFiles"><i class="icon icon-inverse icon-upload"></i>Selecionar Arquivos</label>' +
							'<div id="selectedFiles"></div>';
	//Pega o elemento com id="files" e adiciona o evento handleFiles() a cada mudança
	document.querySelector('#chooseFolder').addEventListener('change', handleFiles);
	document.querySelector('#chooseFiles').addEventListener('change', handleFiles);
};
//Variável que vai ter os arquivos já colocados por falta de lugar melhor
var arqs = [];
//O função que vai cuidar de pegar e ler os arquivos
function handleFiles(evt) {
	//Se não tem nada só vai
	if(!evt.target.files) return;
	//Pega o array de arquivos que tá dentro do elemento do evento
	var files = evt.target.files;
	//Se for o primeiro arquivo do array arqs, só coloca o primeiro do seletor de file
	if(arqs.length === 0) {
		arqs.push(files[0]);
	}
	//Pega todos os arquivos dentro do elemento do evento e tenta colocar no array de controle
	for(var i = 0; i < files.length; i++) {
		var igu = 0;
		//Percorre todo array de arquivos
		for(var j = 0; j < arqs.length; j++) {
			//Chega e o arquivo atual no loop de files já existe no array de arquivos. Se existe aumenta uma ocorrência
			if(files[i].name === arqs[j].name && files[i].size === arqs[j].size) {
				igu++;
			}
		}
		//Se não houver nenhuma ocorrência coloca na última posição
		if(igu === 0) {
			arqs.push(files[i]);
		}
	}
	//Começa a construir a lista de arquivos na tela
	printFilesList();
}
//Função que vai imprimir os arquivos tudo na tela em uma lista
function printFilesList() {
	var qtdLst = (document.querySelector('[qtd]') === null)? 10 : document.querySelector('[qtd]').getAttribute('qtd');
	//Pega o DIV que a gente vai usar pra colocar a lista
	var filesList = document.querySelector('#selectedFiles');
	//Limpa pra montar de novo
	filesList.innerHTML = '';
	//Cria um elemento de lista
	var list = document.createElement('ul');
	//Percorre o array de arquivos para montar a lista
	for (i = 0; i < arqs.length; i++) {
		//Cria o item da lista
		list.innerHTML += '<li class="file"><i class="removeFile icon icon-times" id="' + arqs[i].name + '" title="Remover arquivo da lista"></i><div class="filename">' + arqs[i].name +'</div></li>';
		//Se a lista não for definida para infinita, quando chegar no limite colocar como último item um elemento para exibir mais dez itens
		if(i === qtdLst - 1 && qtdLst !== -1) {
			list.innerHTML += '<li id="continue" class="file" onClick="showMoreItens()" title="Exibir mais 10 itens?"><i class="icon icon-chevron-down"></i></li>';
			break;
		}
	}
	//Coloca a lista dentro do DIV que a gente selecionou
	if(arqs.length !== 0) {
		filesList.appendChild(list);
	}
	//Busca todos os itens com a classe removeFile
	var remove = document.querySelectorAll('.removeFile');
	//Percorre o array com os removeFile
	for (var i = 0; i < remove.length; i++) {
		//Adiciona o evento removeFile ao clicar para cada um dos itens
		remove[i].addEventListener('click', removeFile);
	}
}
//Função para remover o arquivo tanto da lista quanto do array que está guardando os arquivos
function removeFile() {
	//Pega o span, e sobe dois níveis para aí sim remover um nível acima do span (a linha toda)
	this.parentNode.parentNode.removeChild(this.parentNode);
	//Percorre a lista de arquivos, checa se a nome do arquivo percorrido é igual ao nome do id do span (que é o nome do arquivo que ela cuida') e se for igual remove do array
	for (var arq in arqs) {
		if (this.id == arqs[arq].name) {
			arqs.splice(arq, 1);
		}
	}
	printFilesList();
}
//Função para exibir mais itens se solicitado
function showMoreItens() {
	var qtd = fileHandler.getAttribute('qtd');
	fileHandler.setAttribute('qtd', qtd === null ? 20 : parseInt(qtd, 10) + 10);
	printFilesList();
}
