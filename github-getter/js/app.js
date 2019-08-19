const search = document.getElementById("search");
const results = document.getElementById("results-container"); 
const loadmore = document.getElementById("load"); 
const searchBox = document.getElementById("searchBox"); 
const sort = document.getElementById("sort"); 


let pageIndex; 


fetchData = async(isSearch) => { // checks reques source-search(true),load(false)

  if (isSearch) {
    pageIndex = 1;
  } else {
    pageIndex++;
  }

  await axios.get('https://api.github.com/search/repositories?q=' + search.value + `?page=${pageIndex}&per_page=10&sort=${sort.options[sort.selectedIndex].value}&order=desc`).then(function (response) {
    console.log(response)
    const dataObject = response.data.items;
    const length = Object.keys(dataObject).length; // length of fetched object

    if(length > 1) {

      displayData(dataObject,isSearch);
      moveSearch();
      addListener();
      displayLoadMore();
      
    } else {

      displayMessage();
      removeLoadMore();
    }

  }).catch(function (error) {
    console.log(error);
  }).finally(function () {
  });
  
}

displayData = (dataObj, isSearch) => {

  isSearch ? results.innerHTML = "" : console.log("i know there is stuff");

  dataObj.map(function(item, index) {
    results.innerHTML += createItem(item);
  });

}

displayMessage = () => {
  results.innerHTML = "";

  results.innerHTML = "<a>No results were found</a>";
  search.classList.add("search__failed");
  
}

displayLoadMore = () => {
  loadmore.style.visibility = "visible";
}

moveSearch = () => {
  if(searchBox.style.top !=  "1.6rem" ||  results.innerHTML != "") {
    searchBox.style.top =  "1.6rem";
  } else {
    searchBox.style.top =  "20rem";
  }
}

clearResults = () => {
  search.value = "";
  if(results.innerHTML != ""){
    results.innerHTML = "";
    removeLoadMore();
    moveSearch();
    
  }
}


removeLoadMore = () => {
  loadmore.style.visibility = "hidden";
}

addListener = () =>{
  let details = document.getElementsByClassName("block");

  
  for (let i = 0; i < details.length; i++) {
    details[i].addEventListener('click', expandDetails);
  }
}

expandDetails = (e) => {
  const clickedNode = e.currentTarget;
  const opacity = clickedNode.lastChild.style.opacity;
  const arrow = clickedNode.firstChild.lastChild;



  if(opacity == "0" || opacity == ""){
    clickedNode.lastChild.style.opacity = "1";
    clickedNode.lastChild.style.height = "4rem";
    clickedNode.lastChild.style.visibility = "visible";
    arrow.style.transform = "rotate(-135deg)"
  } else {
    clickedNode.lastChild.style.opacity = "0";
    clickedNode.lastChild.style.height = "0";
    arrow.style.transform = "rotate(45deg)"
  }
}

sortBy = () => {
  console.log("sortby got called")
    fetchData(true);
  
}


createItem = (item) => {
  let seperate = item.full_name.indexOf("/");
  let author =  item.full_name.substr(0,seperate);
  let repo =  item.full_name.substr(seperate + 1);

  let basicHTML = "<a class=arrow>" +  repo + " by " + author + " <i class=down></i></a></br>" ;
  let detailsHTML = `<div class="details"> 
  <a> Owner: ${item.owner.login} ;</a>
  <a> Language: ${item.language} ;</a>
  <a> Forks: ${item.forks_count} ;</a>
  <a> Score: ${item.score} </a> ;</br>
  <a> Created At: ${item.created_at} </a> ;</br>
  <div class ="details__link"> <a href= ${item.svn_url} target="_blank" > Link </a> </div>
      </div>`;
  let innerHTML = "<div class=block>" + basicHTML + detailsHTML + "</div>";
  return innerHTML;
}


loadMore = () => {
  results.innerHTML = "";
  console.log("getting clicked")
  fetchData(false)
}


