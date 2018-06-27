

const debounce = (fn, time) => {
  let timeout;

  return function() {
    $('#search-results').empty();
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

var search = document.getElementById("search");

const summaryInclude=60;

var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize:true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name:"name",weight:0.8 },
    { name:"short_description",weight:0.5 },
    { name:"industry", weight:0.3 },
  ]};

  function render(templateString, data) {
    var conditionalMatches,conditionalPattern,copy;
    conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
    //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
    copy = templateString;
    while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
      if(data[conditionalMatches[1]]){
        //valid key, remove conditionals, leave contents.
        copy = copy.replace(conditionalMatches[0],conditionalMatches[2]);
      } else {
        //not valid, remove entire section
        copy = copy.replace(conditionalMatches[0],'');
      }
    }
    templateString = copy;
    //now any conditionals removed we can do simple substitution
    var key, find, re;
    for (key in data) {
      find = '\\$\\{\\s*' + key + '\\s*\\}';
      re = new RegExp(find, 'g');
      templateString = templateString.replace(re, data[key]);
    }
    return templateString;
  }

  function populateResults(result){
    $.each(result,function(key,value){
      console.log(key,value)

      var contents = value.item.short_description;
      var snippet = "";
      var snippetHighlights=[];
      var tags =[];
      if( fuseOptions.tokenize ){
        snippetHighlights.push(searchQuery);
      }else{
        $.each(value.matches,function(matchKey,mvalue){
          if(mvalue.key == "tags" || mvalue.key == "industry" ){
            snippetHighlights.push(mvalue.value);
          }else if(mvalue.key == "contents"){
            start = mvalue.indices[0][0]-summaryInclude>0?mvalue.indices[0][0]-summaryInclude:0;
            end = mvalue.indices[0][1]+summaryInclude<contents.length?mvalue.indices[0][1]+summaryInclude:contents.length;
            snippet += contents.substring(start,end);
            snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0],mvalue.indices[0][1]-mvalue.indices[0][0]+1));
          }
        });
      }

      if(snippet.length<1){
        snippet += contents.substring(0,summaryInclude*2);
      }
      //pull template from hugo templarte definition
      var templateDefinition = $('#search-result-template').html();
      //replace values
      var output = render(templateDefinition,{key:key,name:value.item.name,link:value.item.permalink,tags:value.item.tags,industry:value.item.industry,snippet:snippet,logo:value.item.logo});
      $('#search-results').append(output);

      $.each(snippetHighlights,function(snipkey,snipvalue){
        $("#summary-"+key).mark(snipvalue);
      });

    });
  }

  let searchQuery;
  let pages;
  let fuse;

  let doSearch = () => {
    if(+search.value === 0) {
      return;
    }

    searchQuery = search.value
    var result = fuse.search(searchQuery);

    if(result.length > 0){
      populateResults(result);
    } else {
      $('#search-results').append("<p>No matches found</p>");
    }
  }

  const initialiseSearch = () => {
    $.getJSON( "index.json", (data) => {
      pages = data.data;
      fuse = new Fuse(pages, fuseOptions);

      search.setAttribute('placeholder', 'search terms');
      search.removeAttribute('disabled');
      search.focus();

      search.oninput = debounce(doSearch, 600);
    });
  }

  if (document.readyState !== 'loading') {
    const search_form = document.getElementById("member-search");
    if(search_form) initialiseSearch();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }
