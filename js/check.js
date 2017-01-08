$(document).ready(function(){

 $('body')
  .breed('div').css({
    width: "187px",
    position: "fixed",
    right: "-209px",
    top: "10%",
    border: "1px solid red",
    "border-radius": "4px 0 0 4px",
     "background-color": "white",
    padding: "10px",
    font: "12px 'Trebuchet MS'"}).attr('id', 'qpcheck')
  .breed('div').css({
    width: "45px",
    height: "32px",
    position: "absolute",
    right: "200px",
    top: "20px",
    padding: "8px 8px",
    border: "1px solid #aaa",
    "background-color": "red",
    "border-top": "0",
    "border-radius": "0 0 8px 8px",
    cursor: "pointer",
    color: "rgb(241, 228, 228)",
    "font-family": "sans-serif",
    "font-weight": "bold",
    "-moz-transform": "rotate(90deg)",
    "-webkit-transform": "rotate(90deg)",
    "-o-transform": "rotate(90deg)",
    "-ms-transform": "rotate(90deg)"}).attr('id', 'qpchecklabel').html('Seiten-<br>Check');

 // Formular basteln
 $("#qpcheck").breed("span").html('<b>Guten Tag!</b><br>Bitte beurteilen Sie diese Web-Seite.');

 var tmp,
     frm=$("#qpcheck").breed("form").submit(function(event) {
       // Browser bekommt Individielles Cookie bei erstmalige Aufruf
       // Uniq-ID beim Speichern ist Cookie + URL der Webseite 

/*
      $.ajax({
         url: "idmplus.ptb.de/.html",
         context: document.body})
       .done(function() {
         $(this).addClass("done");});
*/

    event.preventDefault();});

 frm.breed('div').css({'margin-top': '8px'})
  .breed('label').attr({for: 'qptyp'}).html('Die Seite beinhaltet:<br>')
  .breed('select','after').attr({name: 'qptyp'}).breed([["option", {value: ""}, "-keine Einschätzung-"], ["option", {value: "angebot"}, "Ein (Dienstleistungs-)Angebot"],["option", {value: "information"}, "Eine informelle Wissensbasis"]]);
  
 frm.breed('div').css({'margin-top': '8px'})
  .breed('label').attr({for: 'qpstatus'}).html('Der Status der Seite ist:<br>')
  .breed('select','after').attr({name: 'qpstatus'}).breed([["option", {value: ""}, "-keine Einschätzung-"], ["option", {value: "beibehalten"}, 'keine Änderung nötig'],["option", {value: "überarbeiten"}, "Überarbeitung nötig"],["option", {value: "löschen"}, "Seite kann gelöscht werden"]]);

 tmp=frm.breed('div').css({'margin-top': '8px'}).html('Diese Seite gehört zu OE:');
 
 ['Q','Q.11','Q.2','Q.3','Q.4','Q.41','Q.42','Q.44','Q.45','Q.5','Q.61','Q.62','Q.01','andere','unklar'].forEach(function(ele,i,a) {
   tmp.breed('div').css({width: '59px', float: 'left'})
    .breed('input').attr({type: 'checkbox', name: 'qtoe[]', id: 'qtoe'+i, value: ele})
    .breed('label','after').attr('for','qtoe'+i).text(ele);});

 tmp.breed('br').css({clear: 'left'});

 frm.breed('div').css({'margin-top': '8px'}).text('Kommentar zur Seite:').breed('textarea').css({width: '100%', height:'5em'});
 
 frm.breed('div').css({'margin-top': '8px'}).breed('input').attr({type: "submit", value: "Abspeichern"});
 
 frm.breed('div').text('Ihrer Einschätzung hilft mit, die Intranet-Webseiten zu verbessern.')

 // auf und zu
	$("#qpchecklabel").click(function(){
		if($("#qpcheck").attr('open')){
			$("#qpcheck").animate({right:'-209px'},500, function(){
				$("#qpcheck").removeAttr('open');});} 
		else {
			$("#qpcheck").animate({right:'-1px'},500, function(){
				$("#qpcheck").attr('open',true);});}})
		.hover(		
				function() {
     $( this ).attr("oldColor", $(this).css("background-color")).css("background-color", 'rgb(214, 0, 0)');}, 
    function() {
     $(this).css("background-color",$(this).attr("oldColor"));});

	});
