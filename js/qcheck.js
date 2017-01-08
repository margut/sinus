$(document).ready(function(){

 $('body')
  .breed('div').css({
    width: "187px",
    height: "400px",
    position: "fixed",
    left: "-209px",
    top: "10%",
    border: "1px solid red",
    "border-radius": "0 4px 4px 0",
    padding: "10px",
    font: "12px 'Trebuchet MS'"}).attr('id', 'qpcheck')
  .breed('div').css({
    width: "45px",
    height: "32px",
    position: "absolute",
    left: "200px",
    top: "20px",
    padding: "8px 8px",
    border: "1px solid #aaa",
    "background-color": "red",
    "border-bottom": "0",
    "border-radius": "4px 4px 0 0",
    cursor: "pointer",
    color: "rgb(241, 228, 228)",
    "font-family": "sans-serif",
    "font-weight": "bold",
    "-moz-transform": "rotate(90deg)",
    "-webkit-transform": "rotate(90deg)",
    "-o-transform": "rotate(90deg)",
    "-ms-transform": "rotate(90deg)"}).attr('id', 'qpchecklabel').html('Seiten-<br>Check');


		$("#qpchecklabel").click(function(){
			if($("#qpcheck").attr('open')){
				$("#qpcheck").animate({left:'-209px'},500, function(){
					$("#qpcheck").removeAttr('open');});} 
			else {
				$("#qpcheck").animate({left:'-1px'},500, function(){
					$("#qpcheck").attr('open',true);});}});

	});
