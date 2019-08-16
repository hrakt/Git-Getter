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


let search = document.getElementById("search");
let results = document.getElementById("results-container");







execute = async() => {
  await axios.get('https://api.github.com/search/repositories?q=' + search.value).then(function (response) {
    const dataObject = response.data.items;
    display(dataObject);
    addListener();
  }).catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });
  
}

display = (obj) => {
  results.innerHTML = "";
  obj.map(function(item, index) {
    
    results.innerHTML += create(item);

  });
}

addListener = () =>{
  let details = document.getElementsByClassName("arrow");
  console.log(details);
  
  for (let i = 0; i < details.length; i++) {
    details[i].addEventListener('click', expand);
  }
}

expand = (e) => {
  let clickedNode = e.target.parentElement;
  clickedNode.lastChild.style.opacity = "1";
}



create = (item) => {
  let seperate = item.full_name.indexOf("/");
  let author =  item.full_name.substr(0,seperate);
  let repo =  item.full_name.substr(seperate + 1);

  console.log(item);
  let basicHTML = "<a>" +  repo + " by " + author + " &#8675;</a></br>" ;
  let detailsHTML = `<div class="details"> 
  <a> Owner: ${item.owner.login}
      Language: ${item.language} 
      Forks: ${item.forks_count} 
      Score: ${item.score} 
      </a> 
      </div>`;
  let innerHTML = "<div class=arrow>" + basicHTML + detailsHTML + "</div>";
  return innerHTML;
}




