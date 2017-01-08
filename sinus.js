/*
 * Zeichnung und Stückliste 
 * für Sinus-Regal erzeugen
 * (c) M. Gutbrod, 2013,2014
 * 
 * Pro Bauteil eine Seite
 * 
 * Zeichenmaßstab 1:1, Skalierung beim Drucken
 *
 * Seite 1: Plan  
 * Seite 2: Stückliste
 * todo: Seite 3-n: Einzelteile
 *
 *
 * Usage:
 sinus=include('sinus');
 sinus.generate(optionen, function(pdfbin) {
  res.set('Content-Type', 'application/pdf');
  res.send(pdfbin);});
 *
 */


var mm=0.352777778,	// 1 Punkt = 0,352777778 Millimeter, d.h. Maß in Millimeter/mm macht Länge
    PDFDocument=require('pdfkit');

exports.generate = function(opts, res, cb) {

 // Vorgabe
 var 
     // Fächerzahl
     F= parseInt(opts.varF) || 12,
     //Höhe gesamt (mm)
     H= parseInt(opts.varH) || 1500,
     // Maximale Breite für Aufbewahrung (Lichte Breite Einlagefläche in mm)
     L= parseInt(opts.varL) || 260,
     // Maximale Länge für Aufbewahrung (Tiefe Einlegebretter in mm)
     T= parseInt(opts.varT) || 320,

     // Seitenwand Wandstärke (mm) (MDF-Dicke)
     SW= parseInt(opts.varSW) || 19,
     // Dicke Einlegebretter (mm)
     D= parseInt(opts.varD) || 6,
     // Rückwand Dicke (mm)
     RD= parseInt(opts.varRD) || 4,

     // Sinuskurve-Amplitudenhöhe (mm)
     A= parseInt(opts.varA) || 120,
     // Seitenwandtiefe an schwächster Stelle (mm)
     W= parseInt(opts.varW) || 120,
     // Tiefe der Fräsnuten (mm)
     N= parseInt(opts.varN) || 5,
    
     // Farbe Seitenwand
     CW= opts.varCW || 'white',
     // Farbe Einlegebretter
     CD= opts.varCD || 'green',
     // Farbe Zahlenstrahl
     CZ= opts.varCZ || 'magenta',
     // Farbe Linie
     CL= opts.varCL || 'black';
     // Farbe Schrift
     CS= opts.varCS || 'black',
     // Seitenränder (mm)
     SR= parseInt(opts.varSR) || 30,
     // Standard Liniendicke (mm)
     LD= parseFloat(opts.varLD) || 0.1,

     // Dokument erzeugen
     // Vgl. http://www.tug.org/applications/hyperref/manual.html#x1-70003.3
     doc=new PDFDocument({
      size: [(2*SR+T+RD)/mm,(2*SR+H)/mm],
      margin: SR/mm,            // spielt nur bei automatischen Positionierungen eine Rolle  (Evtl. Relevanz bei Skalierung prüfen)
      info: {
       Title: 'Plan Sinus Regal',
       Author: 'Sesam Design'}});

 res.set('Content-Type', 'application/pdf');
 
 // Dokument direkt auf Ausgabestream schicken
 doc.pipe(res);

 // So skalieren, dass Maße in mm angegeben werden können
 doc.scale(1/mm, {origin: [0,0]})
   .translate(SR,H+SR)
   .rotate(-90, {origin: [0,0]});

 // Schriften festlegen (extra laden, da Standardschriften von pdfkit kein UTF-8 können)
 doc.registerFont('PalatinoBold', 'fonts/PalatinoBold.ttf')

 // Standardlinie festlegen
 doc.strokeColor(CL)
   .lineWidth(LD);

 // Rückwand
 doc.rect(SW-N,0,H-2*(SW-N),RD)
   .fillColor(CW)
   .fillOpacity(0.8)
   .fillAndStroke();

 // Fuß ("links")
 doc.rect(0,0,SW,T+RD)
   .fillColor(CW)
   .fillAndStroke();

 // Deckel ("rechts")
 doc.rect(H-SW,0,SW,W)
   .fillColor(CW)
   .fillAndStroke();

 // für Sinuslinie relevante x-Länge
 var hx=H-2*SW;

 // Wie viele Radianteinheiten für die Anzahl Fächer?
 var imax=F*2*Math.PI+Math.PI;

 // x-Skalierung: imax-Anfang geht über hx
 var fx=hx/imax;

 // y-Skalierung
 var fy=A/2;

 // Verschiebung
 dx=SW-Math.PI*fx/2;
 dy=A/2+W;

 // Einlegebretter
 var xstart=SW+2*Math.PI*fx-(D/2);
 for(var j=0;j<F;j++) {
  doc.rect(xstart+(j*2*Math.PI*fx), RD, D, T)
    .fillColor(CD)
    .fillAndStroke();}

 // Verschiebung
 dx=SW-Math.PI*fx/2;
 dy=A/2+W;

 // Sinusbrett Seite
 doc.moveTo(SW, 0)
   .lineTo(SW,A+W);       // gerade Brettkante unten

 // Sinus-Polygonlinie
 for (var i=(0.5*Math.PI); i<=(imax+(Math.PI/2)); i+=0.1) {
  doc.lineTo(i*fx+dx, Math.sin(i)*fy+dy);}

 // letzte Punkt nicht "gerundet"
 doc.lineTo(H-SW,W);

 // Ober- und Hinterkante
 doc.lineTo(H-SW,0)
   .lineTo(SW,0);

 // Pfad schließen macht den Rest
 doc.fillColor(CW)
   .lineCap('round')
   .fillOpacity(0.9) 
   .fillAndStroke();

 // Zahlenstrahl
 fstmp=W/2.5;
 doc.fillColor(CZ)
   .fontSize(fstmp)
   .font('Helvetica')
   .lineCap('butt');
 dezi=2*Math.PI*fx/10;
 for(var k=0;k<=F;k++) {
  xtmp=SW+(k*2*Math.PI*fx);
  if (k>=0) {
   txt=k;
   doc.strokeColor(CZ)
     .text(txt, xtmp-(fstmp*2), W/2.3, {width: fstmp*4, align: 'center'})
     .lineWidth(2*Math.PI*fx/20)
     .moveTo(xtmp, 0)
     .lineTo(xtmp,W/2.5)
     .stroke();}
  if (k<=F) {
   // Zwischenstriche
   for(var o=1;o<10;o++) {
    if (k<F || o<6) {
     x2tmp=xtmp+(o*dezi);
     lak=(o==5?2.6:3.5);
     doc.strokeColor(CZ)
        .lineWidth(2*Math.PI*fx/30)
        .moveTo(x2tmp, 0)
        .lineTo(x2tmp,W/lak)
        .stroke();}}}}

 doc.addPage({size: 'a4', layout: 'portrait', margin: 20})
   .scale(1/mm, {origin: [0,0]});

 doc.fillColor(CS)
   .fontSize(20)
   .font('PalatinoBold')
   .text('Stückliste')
   .moveDown();

 doc.fillColor(CS)
   .fontSize(8);

 var stcklst={
 'Seitenwände':{
   n: 1,	// Anzahl
   l: H-2*SW,	// Länge
   b: 2*W+A,	// Breite
   d: SW,	// Dicke
   t: 'An Sinuskurve mit Stichsäge mittig durchsägen',   // Bemerkung
   m: 'MDF',
   c: CW},	// Farbe
 'Standfuß':{
   n: 1,
   l: 2*SW+L,
   b: T+RD,
   d: SW,
   m: 'MDF',
   c: CW},
 'Deckel':{
   n: 1,
   l: 2*SW+L,
   b: W,
   d: SW,
   m: 'MDF',
   c: CW},
 'Rückwand':{
   n: 1,
   l: H-2*SW+SW,
   b: 2*SW+L-SW,
   d: RD,
   m: 'Sperrholz Papel',
   c: CW},
 'Einlegefächer':{
   n: F,
   l: T,
   b: 2*N+L,
   d: D,
   m: 'Sperrholz Buche',
   c: CD}}

 var tab=[25,15,20,40],  // Spaltenbreiten in % der verfügbaren Seitenbreite
    my=doc.y,
    wdth=doc.page.width*mm-doc.page.margins.left-doc.page.margins.right,
    mat='',
    sck,
    colrs={};

 // Header
 doc.fillColor(CS)
   .fontSize(6)
   .text('Teil',doc.page.margins.left,my,{width: wdth*tab[0]/100*mm})
   .text('Anzahl',doc.page.margins.left+wdth*tab[0]/100,my,{width: wdth*tab[1]/100})
   .text('Maße [mm]',doc.page.margins.left+wdth*(tab[0]+tab[1])/100,my,{width: wdth*tab[2]/100})
   .text('Bemerkung',doc.page.margins.left+wdth*(tab[0]+tab[1]+tab[2])/100,my,{width: wdth*tab[3]/100})

 // "Table"
 for (var stck in stcklst) {
  sck=stcklst[stck];
  my=doc.y;
  if (sck.m != mat) {
   my+=6;
   doc.fillColor(CS)
      .fontSize(8)
      .text(sck.m+':' ,doc.page.margins.left,my,{width: wdth},'UTF-8');
   my=doc.y;}
  mat=sck.m;
  doc.fillColor(CS)
    .fontSize(5)
    .text(stck,doc.page.margins.left,my,{width: wdth*tab[0]/100},'UTF-8')
    .text(sck.n,doc.page.margins.left+wdth*tab[0]/100,my,{width: wdth*tab[1]/100},'UTF-8')
    .text(sck.l+'x'+sck.b+'x'+sck.d,doc.page.margins.left+wdth*(tab[0]+tab[1])/100,my,{width: wdth*tab[2]/100},'UTF-8')
    .text(sck.t ? sck.t :' ' ,doc.page.margins.left+wdth*(tab[0]+tab[1]+tab[2])/100,my,{width: wdth*tab[3]/100},'UTF-8');
  // surface color 
  colrs[sck.c]=(colrs[sck.c] ? colrs[sck.c] :0)+sck.n*(sck.d*2*(sck.l+sck.b)+(2*sck.l*sck.b));}

 my=doc.y+6;
 doc.fillColor(CS)
   .fontSize(8)
   .text('Flächenberechnung pro Farbe:',doc.page.margins.left,my,{width: wdth},'UTF-8');

 for (var co in colrs) {
  my=doc.y;
  doc.rect(doc.page.margins.left, my, 10, 5)
     .lineWidth(0.2)
     .fillAndStroke(co, "#000");
  doc.fillColor(CS)
     .fontSize(5)
     .text(': ~'+(Math.round(colrs[co]/100000)/10)+' qm', doc.page.margins.left+11,my,{width: wdth},'UTF-8');}
 if (!colrs[CZ]) {
  doc.rect(doc.page.margins.left, doc.y, 10, 5)
     .lineWidth(0.2)
     .fillAndStroke(CZ, "#000");
  doc.fillColor(CS)
     .fontSize(5)
     .text(': ein wenig', doc.page.margins.left+11, doc.y,{width: wdth},'UTF-8');}

 my=doc.y+12;

 doc.fillColor(CS)
   .fontSize(8)
   .text('Sonstiges:',doc.page.margins.left,my,{width: wdth},'UTF-8');

 doc.fillColor(CS)
   .fontSize(5)
   .text('Nut in Seitenwand für Einlegefächer: Tiefe: '+N+'mm; Weite: ~'+(D+1)+'mm',doc.page.margins.left,doc.y,{width: wdth},'UTF-8')
   .text('Umlaufende Nut für Rückwand: Tiefe: '+RD+'mm; Breite: '+Math.round(SW/2*10)/10+'mm',doc.page.margins.left,doc.y,{width: wdth},'UTF-8')
   .text('Fächerabstand (Oberkanten): '+Math.round(2*Math.PI*fx*10)/10+'mm',doc.page.margins.left,doc.y,{width: wdth},'UTF-8')
   ;

 //doc.pages.reverse();
 //doc.page=doc.pages[0];

 //console.log(PDFDocument.prototype);

 doc.end();
 // cb();

 }

