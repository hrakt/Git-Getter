/*
    # Endpoint URL #

    https://api.github.com/legacy/repos/search/{query}

    Note: Github imposes a rate limit of 60 request per minute. Documentation can be found at http://developer.github.com/v3/.

    # Example Response JSON #

    {
      "meta": {...},
      "data": {
        "repositories": [
          {
            "type": string,
            "watchers": number,
            "followers": number,
            "username": string,
            "owner": string,
            "created": string,
            "created_at": string,
            "pushed_at": string,
            "description": string,
            "forks": number,
            "pushed": string,
            "fork": boolean,
            "size": number,
            "name": string,
            "private": boolean,
            "language": number
          },
          {...},
          {...}
        ]
      }
    }
*/


const search = document.getElementById("search"); // search element
const results = document.getElementById("results-container"); // the results container
const loadmore = document.getElementById("load");

let pageIndex = 1; // temporary fix for the pagination index
let origin = true; // this sets a bool that if its coming from search(true) or loadmore(false)

execute = async(bool) => { // bool checks whether the request comes from search(true) or load(false)
  
  if (bool) {
    pageIndex = 1;
    origin = true;
  } else {
    pageIndex++;
    origin = false;
  }

  await axios.get('https://api.github.com/search/repositories?q=' + search.value + `?page=${pageIndex}&per_page=10`).then(function (response) {
    console.log(response)
    const dataObject = response.data.items;
    const length = Object.keys(dataObject).length; // this is the length of the object

    if(length > 1) {
      display(dataObject,origin);
      addListener();
      displayLoadMore();
    } else {
      displayMessage();
      removeLoadMore();
    }
  }).catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });
  
}

display = async(obj, bool) => {

  bool ? results.innerHTML = "" : console.log("i know there is stuff");

  obj.map(function(item, index) {
    results.innerHTML += create(item);
  });

}

displayMessage = () => {
  results.innerHTML = "";
  results.innerHTML += "<a>No Results Were Found</a>";
}

displayLoadMore = () => {
  loadmore.style.visibility = "visible";
}



removeLoadMore = () => {
  loadmore.style.visibility = "hidden";
}

addListener = () =>{
  let details = document.getElementsByClassName("arrow");

  
  for (let i = 0; i < details.length; i++) {
    details[i].addEventListener('click', expand);
  }
}

expand = (e) => {
  const clickedNode = e.target.parentElement;
  const opacity = clickedNode.lastChild.style.opacity;
  const arrow = clickedNode.firstChild.lastChild;
  if(opacity == "0" || opacity == ""){
    clickedNode.lastChild.style.opacity = "1";
    clickedNode.lastChild.style.height = "2rem";
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


  let basicHTML = "<a class=arrow>" +  repo + " by " + author + "  <i class=down></i></a></br>" ;
  let detailsHTML = `<div class="details"> 
  <a> Owner: ${item.owner.login} </a>
  <a> Language: ${item.language} </a>
  <a> Forks: ${item.forks_count} </a>
  <a> Score: ${item.score} </a> </br>
  <div class ="details__link"> <a href= ${item.svn_url} target="_blank" > Link </a> </div>
      </div>`;
  let innerHTML = "<div class=block>" + basicHTML + detailsHTML + "</div>";
  return innerHTML;
}


loadMore = () => {
  console.log("getting clicked")
  execute(false)
}


