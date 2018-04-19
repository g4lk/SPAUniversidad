$(function() {
$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key='
	 + api_key + '&user_id=' +user_id +
	'&format=json&nojsoncallback=1',
	mostrar_fotos
)

function mostrar_fotos(info){
	var i;
	for (i=0;i<info.photos.photo.length;i++) {
	   var item = info.photos.photo[i];
	   var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
		          +'/'+item.id+'_'+item.secret+'_m.jpg';
	   console.debug(url);
     $("#imagenes").append($("<img/>").attr("src",url));
		 $("#imagenes").append($("<span/>").html("Fecha minima: "+document.getElementById("datepicker").value));
		 $("#imagenes").append($("<span/>").html("Fecha maxima: "+document.getElementById("datepicker2").value));
    }
}

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
 $( "#locale" ).change(function() {
		 $( "#datepicker" ).datepicker( "option",
			 $.datepicker.regional[ $( this ).val() ] );
	 });

	  $( "#locale" ).change(function() {
	 		 $( "#datepicker2" ).datepicker( "option",
	 			 $.datepicker.regional[ $( this ).val() ] );
	 	 });

$("#datepicker").datepicker().datepicker("setDate", new Date());
$("#datepicker2").datepicker().datepicker("setDate", new Date());

$("#dpbutton2").click(function(){
	$("#imagenes").empty();
	var date = document.getElementById("datepicker").value;
	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key='
		 + api_key + '&user_id=' +user_id +
		'&format=json&nojsoncallback=1' +
		'&max_taken_date=' + date,
		mostrar_fotos)
});

$("#dpbutton").click(function(){
	$("#imagenes").empty();
	var date = document.getElementById("datepicker").value;
	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key='
		 + api_key + '&user_id=' +user_id +
		'&format=json&nojsoncallback=1' +
		'&min_taken_date=' + date,
		mostrar_fotos)
});

}
)
