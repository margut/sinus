/* 
 * JQuery PlugIn "breed" 
 * Add new elements to each element in collection and return collection of *added* elements
 *
 * For easy adding elements to dom tree in a chaining way
 * M. Gutbrod, 2014
 * 
 * Possible parameters:
 * One element:					.breed('tagname', pos)
 * Slibing several elements:			.breed(['tagname','tag2',...], pos)
 * Slibing several elements with attributes:	.breed([ [tagname, {attr:'one', attr2: 'two', ...}, text|breed-parameter1], [tag2: {attr:'abc', attr2: '123', ...}, text|breed-parameter1], ...], pos)
 * Slibing elements as function results object:	.breed(function (this) {return <one of other types>;}, pos)
 * 
 * pos: 'prepend' insert element(s) to the beginning of each element in the set of matched elements.
 *      'append'  insert element(s) to the end of each element in the set of matched elements.
 *      'before'  insert element(s) before each element in the set of matched elements.
 *      'after'   insert element(s) after each element in the set of matched elements.
 */

(function ($) {

 $.fn.breed = function(tag,pos) {
  var jQ = $();

  pos = ((['prepend','append','before','after'].indexOf(pos) !== -1) && pos) || 'append';

  this.each(function() {
   var tmp;
   if (typeof tag === 'function') {
    tag=tag(this);}
   if (typeof tag === 'string') {
    tag=[tag];}
   for (var t in tag) {
    tmp=document.createElement(typeof tag[t] === 'string' ? tag[t] : tag[t][0]);
    $(this)[pos](tmp);
    jQ=jQ.add(tmp);
    if (typeof tag[t] !== 'string') {
     $(tmp).attr(tag[t][1]);
     if (tag[t][2]) {
      if (typeof tag[t][2] === 'string') {
       $(tmp).text(tag[t][2]);}
      else {
       tmp.breed(tag[t][2]);}}}}});

  return jQ;}

 }(jQuery));


