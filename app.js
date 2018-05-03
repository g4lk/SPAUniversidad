// Variable de galeria
var galeria;



$(window).load(function() { // Ejecutar cuando la web esté ya cargada
	$("#cargando").delay(2600).hide(0);
});

//Inicializamos campos de busqueda




$(function() {

	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key='
		 + api_key + '&user_id=' +user_id +
		'&format=json&nojsoncallback=1',
		function(json){

			galeria = new crearGaleria();
			galeria.actualizar(json); // Metemos las fotos de la busqueda en la galeria

			asignarClic(); // Asignamos la funcion de click a las imagenes
		}
	);

// *********************************** BUSCADOR CRITERIOS ****************************** //

	$('#menu').click(function(e) { // Enlace para abrir el buscador
		e.preventDefault(); // Bloquea el funcionamiento por defecto
		$('#buscador').toggle('slow'); //Muestra el buscador despacio
	});

	$('#buscar').click(function(e) { // Boton de buscar
		e.preventDefault();
		$('#buscador').toggle('slow'); // Ocultamos buscador para ver busqueda


// *********************************** CRITERIOS DEL BUSCADOR ****************************** //

		var min_taken_date; // Fecha mínima de captura
		if ($("#minTakeDate").datepicker('getDate') != null) {
			min_taken_date = $("#minTakeDate").datepicker('getDate').getTime() / 1000;
		}

		var max_taken_date; // Fecha máxima de captura
		if ($("#maxTakeDate").datepicker('getDate') != null) {
			max_taken_date = $("#maxTakeDate").datepicker('getDate').getTime() / 1000;
		}

		var tags; // tags
		if ($("#tags").val() != "") {
			tags = $("#tags").val();

		}
		var texto; //texto en foto (Título tag o descripción)
		if ($("#texto").val() != "") {
			texto = $("#texto").val();
		}

		$("#criterios").empty();
		$("#criterios").append("<p><h3>Estos son tus criterios:</h3></p>")
		var contenido = $("#contenido").val(); // tipo de contenido
    $("#criterios").append("<p><h4>Tipo de contenido: "+$("#contenido option:selected").text()+"</h4></p>");





		var tipoBusqueda = $("#busquedaSegura").val(); // tipo de busqueda
				$("#criterios").append("<p><h4>Tipo de busqueda: "+$("#busquedaSegura option:selected").text()+"</h4></p>");





		//Generamos la consulta con todos los campos

		var urlBusqueda = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=" + api_key + "&user_id=" +user_id;

		if (typeof min_taken_date != "undefined") {
			urlBusqueda +=  "&min_taken_date=" + min_taken_date;
			$("#criterios").append("<p><h4>Minima fecha de captura: "+min_taken_date+"</h4></p>")

		}

		if (typeof max_taken_date != "undefined") {
			urlBusqueda += "&max_taken_date=" + max_taken_date;
			$("#criterios").append("<p><h4>Maxima fecha de captura: "+max_taken_date+"</h4></p>")
		}

		if (typeof tags != "undefined") {
			urlBusqueda += "&tags=" + tags;
			$("#criterios").append("<p><h4>Tags: "+tags+"</h4></p>")
		}
		if (typeof texto != "undefined"){
				urlBusqueda += "&text=" + texto;
				$("#criterios").append("<p><h4>Texto en foto: "+texto+"</h4></p>")
		}

		urlBusqueda += "&content_type=" + contenido + "&safe_search=" + tipoBusqueda + "&format=json&nojsoncallback=1";

		//Hacemos la consulta a la url formada
		$.getJSON(urlBusqueda,
			function(json){
				galeria.clear(); // Limpiamos las imagenes, miniatura y mostramos el cargar
				galeria.actualizar(json); // Regeneramos la galeria con el nuevo json
				asignarClic(); // Asignamos las funciones de click a las imagenes
			});

		$('body, html').animate({ // Subimos a la parte superior de la galeria
        	scrollTop: $('#vista-grande').offset().top
    	}, 600);
	});

	inicializarDatapicker(); // Para generar los datapicker y sus funciones
});

function inicializarDatapicker() {
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '<Ant',
		nextText: 'Sig>',
		currentText: 'Hoy',
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};

	$.datepicker.setDefaults($.datepicker.regional["es"]);
	$("#locale").change(function() {
		$("#minTakeDate").datepicker("option",
			$.datepicker.regional[$(this).val()]);
		$("#maxTakeDate").datepicker("option",
			$.datepicker.regional[$(this).val()]);
  });

	$("#minTakeDate").datepicker();
	$("#maxTakeDate").datepicker();
}
function asignarClic() {
	$("img").click(function(e) {
		if ($(this).attr('id') != 'imagen-grande') {
    		$('#imagen-grande').attr('src', galeria.url[this.id]);
			$("#titulo").text(galeria.title[this.id]);
			$('body, html').animate({
        		scrollTop: $('#vista-grande').offset().top
    		}, 700);
		}
	});
}
function crearGaleria() {

	// Para actualizar la galeria con un json dado como parametro

	this.actualizar = function(json) {
		this.info = json;
		this.item = new Array();
		this.url = new Array();
		this.url_m = new Array();
		this.title = new Array();

		if (this.info.photos.photo.length == 0) { // Si no hay fotos con esa busqueda, mostramos el error
			$("#titulo").text("No existen imágenes con esos criterios de búsqueda.");
		} else {
			var i;
			for (i = 0; i < this.info.photos.photo.length; i++) {
				this.item[i] = this.info.photos.photo[i];
				this.url[i] = 'https://farm' + this.item[i].farm + ".staticflickr.com/" + this.item[i].server + '/' + this.item[i].id + '_' + this.item[i].secret + '.jpg';
				this.url_m[i] = 'https://farm' + this.item[i].farm + ".staticflickr.com/" + this.item[i].server + '/' + this.item[i].id + '_' + this.item[i].secret + '_m.jpg';
				this.title[i] = this.item[i].title;
			}

			for (i = 0; i < galeria.item.length; i++) {
				$("#miniaturas").append($('<li><img class="miniaturas" src="' + galeria.url_m[i] + '" title="' + galeria.title[i] + '" alt="' + galeria.title[i] + '" id = "' + i + '"></li>'));
			}
			$("#vista-grande").append($('<img src="' + this.url[0] + '" title="' + galeria.title[0] + '" alt="' + galeria.title[0] + '" id="imagen-grande">'));
			$("#titulo").text(galeria.title[0]);
		}

		$("#cargando").delay(2000).hide(0); // Ocultamos el cargar pasados 2 segundos
	}

	// Para limpiar la galeria
	this.clear = function() {
		$("#miniaturas").empty();
		$("#vista-grande").empty();
		$("#cargando").show().delay(2600).hide(0);
	}
}
