var result = document.querySelector('#result'),
	fileRead = "",
	parserXML = new DOMParser(),
	total;

var checkbox = document.querySelector('#acao'),
	btnAcao = document.querySelector('#btnAcao');

checkbox.addEventListener('change', acaoDeLeitura);
btnAcao.addEventListener('click', calcXMLs);

function acaoDeLeitura() {
	if(checkbox.checked === false) {
		btnAcao.style = 'opacity: 0';
		setTimeout(function() {
			btnAcao.removeEventListener('click', exibeXMLs);
			btnAcao.addEventListener('click', calcXMLs);
			btnAcao.innerHTML = '<i class="icon icon-inverse icon-calculator"></i>Calcular totais';
			btnAcao.style = 'opacity: 1';
		}, 200);
	} else {
		btnAcao.style = 'opacity: 0';
		setTimeout(function() {
			btnAcao.removeEventListener('click', calcXMLs);
			btnAcao.addEventListener('click', exibeXMLs);
			btnAcao.innerHTML = '<i class="icon icon-inverse icon-search"></i>Exibir Informações';
			btnAcao.style = 'opacity: 1';
		}, 200);
	}
}

function calcXMLs() {
	if (arqs.length !== 0) {
		result.innerHTML = '';
		result.style.opacity = '1';
		total = 0;
		for(var i = 0, len=arqs.length; i < len; i++) {
			readFile(arqs[i], function() {
				var xmlParsed = parserXML.parseFromString(fileRead, "text/xml");
				if (xmlParsed.querySelector('vNF') !== null) { // Se for NFC-e
					total += parseFloat(xmlParsed.querySelector('vNF').childNodes[0].nodeValue);
				} else if (xmlParsed.querySelector('vCFe') !== null) { // Se for SAT
					total += parseFloat(xmlParsed.querySelector('vCFe').childNodes[0].nodeValue);
				}
				result.innerHTML = "Total dos XMLs: " + monetize(total, 'R$'); //Exibe o total das somas
			});
		}
	}
}
function exibeXMLs() {
	if (arqs.length !== 0) {
		result.innerHTML = 'Aguarde.';
		result.style.opacity = '1';
		var qtdLido = 0;
		var str = '';
		for(var i = 0, len=arqs.length; i < len; i++) {
			readFile(arqs[i], function() {
				var xmlParsed = parserXML.parseFromString(fileRead, "text/xml");
				if (xmlParsed.querySelector('nNF') !== null) { // Se for NFC-e
					str += xmlParsed.querySelector('nNF').childNodes[0].nodeValue + '<br />';
				} else if (xmlParsed.querySelector('nCFe') !== null) { // Se for SAT
					str += xmlParsed.querySelector('nCFe').childNodes[0].nodeValue + '<br />';
				}
				qtdLido++;
			});
		}
		var interv = setInterval(function() {
			if (qtdLido === arqs.length) {
				result.innerHTML = str;
				clearInterval(interv);
				processingWatcher(qtdLido, arqs.length);
			} else {
				if (result.innerHTML.length > 9) {
					result.innerHTML = 'Aguarde.';
				} else {
					result.innerHTML += '.';
				}
				processingWatcher(qtdLido, arqs.length);
			}
		}, 700);
	}
}

//Lê o arquivo passado e executa tarefa de callback
function readFile(arq, callback) {
	var reader = new FileReader();
	reader.onload = function(evt) {
		fileRead = evt.target.result;
	};
	reader.onloadend = function(evt) {
		callback();
	};
	reader.readAsText(arq);
}

//Transforma uma string de números em valores monetários
function monetize(val, currency) {
	return currency + ' ' + val.toFixed(2).replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
}

//Menu handler
var bg = document.querySelector('.menu-bg'),
	menuHamburger = document.querySelector('.menu-hamburger'),
	contentMenu = document.querySelector('.content-menu');

function toggleMenu(evt) {
	document.body.classList.toggle('hidden');
	bg.classList.toggle('menu-visible');
	contentMenu.classList.toggle('content-visible');
	menuHamburger.classList.toggle('menu-close');
}

menuHamburger.addEventListener('click', toggleMenu);

//Lê, faz o parse para XML e guarda os aquivos lidos em um array
function fileTracker() {

}

//Exibe no log porcentagem de processamento
function processingWatcher(atual, final) {
	console.clear();
	if (atual !== final) {
		console.log('Processamento em ' + Math.round((atual * 100) / final) + '%');
		console.log('Arquivo ' + atual + ' de ' + final);
	} else {
		console.log('Processamento concluído!');
	}
}
