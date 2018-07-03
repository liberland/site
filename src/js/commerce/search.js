

const debounceInterval = 600;
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
    { name:"tags", weight:0.4 },

]};

const search = document.getElementById("search");
const selected_category = document.getElementById("select_industries");
const links = document.querySelectorAll('.category_select');

let searchQuery ='';
let pages;
let fuse;

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

const setIndustryAndSearch = (categoryIndex) => {
  document.getElementById('select_industries').selectedIndex = categoryIndex;
  doSearch();
}

Array.prototype.forEach.call(links, function(el){
  let industryIndex = el.getAttribute('data-value');

  el.addEventListener("click", (() => {
    setIndustryAndSearch(industryIndex);
  }).bind(this));
});

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
  $('#search-results').empty();

  $.each(result,function(key,value){
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

const limitIndustry = (pages, categoryText) =>
  pages.filter((el) => (el.industry === categoryText));

let doSearch = () => {
  let data = pages;

  if(selected_category.selectedIndex !== 0) {
    data = limitIndustry(pages, selected_category.value);
  }
  searchQuery = search.value;

  if(searchQuery.length > 0) {

    fuse = new Fuse(data, fuseOptions);

    var result = fuse.search(searchQuery);

    if(result.length > 0){
      populateResults(result);
    } else {
      $('#search-results').append("<p>No matches found</p>");
    }
  } else {
    showAll(data);
  }
  searchQuery = '';
}

const showAll = (data) => {
  const everything = data.map(function(value, index){
    return { item: value, matches: [] };
  });

  populateResults(everything);
};

const initialiseSearch = () => {
  $.getJSON( "index.json", (data) => {
    pages = data.data;

    // console.log(pages);
    showAll(pages);

    search.setAttribute('placeholder', 'search terms');

    search.removeAttribute('disabled');
    selected_category.removeAttribute('disabled');

    search.focus();

    selected_category.onchange = doSearch;
    search.oninput = debounce(doSearch, debounceInterval);

  });
}

if (document.readyState !== 'loading') {
  const search_form = document.getElementById("member-search");
  if(search_form) initialiseSearch();
} else {
  document.addEventListener('DOMContentLoaded', eventHandler);
}
