const search = document.getElementById("search"); // search element
const results = document.getElementById("results-container"); // the results container
const loadmore = document.getElementById("load");
const searchBox = document.getElementById("searchBox");


let pageIndex = 1; // temporary fix for the pagination index


fetchData = async(isSearch) => { // bool checks whether the request comes from search(true) or load(false)

  if (isSearch) {
    pageIndex = 1;
  } else {
    pageIndex++;
  }

  await axios.get('https://api.github.com/search/repositories?q=' + search.value + `?page=${pageIndex}&per_page=10`).then(function (response) {
    console.log(response)
    const dataObject = response.data.items;
    const length = Object.keys(dataObject).length; // this is the length of the object

    if(length > 1) {
      moveSearch();
      displayData(dataObject,isSearch);
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
    results.innerHTML += create(item);
  });

}

displayMessage = () => {
  results.innerHTML = "";
  search.input = "";
  search.palceholder = "No Results Were Found";
  search.classList.add("search__failed");
  
}

displayLoadMore = () => {
  loadmore.style.visibility = "visible";
}

moveSearch = () => {
  if(searchBox.style.top !=  "1.6rem" &&  results.innerHTML != "") {
    searchBox.style.top =  "1.6rem";
  } else {
    searchBox.style.top =  "20rem";
  }
}

clearResults = () => {
  results.innerHTML = "";
  removeLoadMore();
  moveSearch();
  search.value = "";
}


removeLoadMore = () => {
  loadmore.style.visibility = "hidden";
}

addListener = () =>{
  let details = document.getElementsByClassName("block");

  
  for (let i = 0; i < details.length; i++) {
    details[i].addEventListener('click', expand);
  }
}

expand = (e) => {
  const clickedNode = e.currentTarget;
  const opacity = clickedNode.lastChild.style.opacity;
  const arrow = clickedNode.firstChild.lastChild;



  if(opacity == "0" || opacity == ""){
    clickedNode.lastChild.style.opacity = "1";
    clickedNode.lastChild.style.height = "4rem";
    arrow.style.transform = "rotate(-135deg)"
  } else {
    clickedNode.lastChild.style.opacity = "0";
    clickedNode.lastChild.style.height = "0";
    arrow.style.transform = "rotate(45deg)"
  }
}



create = (item) => {
  let seperate = item.full_name.indexOf("/");
  let author =  item.full_name.substr(0,seperate);
  let repo =  item.full_name.substr(seperate + 1);


  let basicHTML = "<a class=arrow>" +  repo + " by " + author + " <i class=down></i></a></br>" ;
  let detailsHTML = `<div class="details"> 
  <a> Owner: ${item.owner.login} ;</a>
  <a> Language: ${item.language} ;</a>
  <a> Forks: ${item.forks_count} ;</a>
  <a> Score: ${item.score} </a> ;</br>
  <div class ="details__link"> <a href= ${item.svn_url} target="_blank" > Link </a> </div>
      </div>`;
  let innerHTML = "<div class=block>" + basicHTML + detailsHTML + "</div>";
  return innerHTML;
}


loadMore = () => {
  console.log("getting clicked")
  fetchData(false)
}


