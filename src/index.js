(function () {

  let allDogs; //variables in the top level scope
  const dogBar = document.getElementById('dog-bar')
  const dogDiv = document.getElementById('dog-info');

  fetchPups();
  listenForClick();
  listenForDogStatus();
  listenForDogFilter();

  function fetchPups() {
    fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(allPups => {
      allDogs = allPups;
      allPups.forEach(dog => {
        const dogSpan = document.createElement('span')
        dogSpan.textContent = dog.name
        dogSpan.id = dog.id
        dogBar.appendChild(dogSpan)
      })
    })
  }

  function listenForClick() {
    dogBar.addEventListener('click', function(event) {
      const dogId = parseInt(event.target.id);
      const dog = allDogs.find(dog => dog.id === dogId)
      dogDiv.innerHTML = renderDogDiv(dog);
    })
  }

  function renderDogDiv(dog) {
    if (dog.isGoodDog) {
      return `
        <img src=${dog.image} /><h2>${dog.name}</h2>
        <button class="status-btn" data-id="${dog.id}">Good Dog!</button>
      `;
    } else {
      return `
        <img src=${dog.image} /><h2>${dog.name}</h2>
        <button class="status-btn" data-id="${dog.id}">Bad Dog!</button>
      `;
    }
  }

  function listenForDogStatus() {
    dogDiv.addEventListener('click', function(event) {
      const dogStatusButton = document.getElementsByClassName("status-btn")[0]
      if (event.target.className === 'status-btn') {
        const dogId = parseInt(event.target.dataset.id);
        const dog = allDogs.find(dog => dog.id === dogId);
        dog.isGoodDog = !dog.isGoodDog

        if (dog.isGoodDog) {
          dogStatusButton.textContent = "Good Dog!";
        } else {
          dogStatusButton.textContent = "Bad Dog!";
        }

        fetch(`http://localhost:3000/pups/${dogId}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            isGoodDog: dog.isGoodDog
          })
        })
        .then(resp => resp.json())
        .then(updatedObject => {
        console.log(updatedObject)
        })
      }
    })
  }

  function listenForDogFilter() {
    const filterBar = document.getElementById('good-dog-filter')
    filterBar.addEventListener('click', function(event) {
      if (event.target.textContent === 'Filter good dogs: OFF') {
        filterBar.textContent = "Filter good dogs: ON"
        const goodDogs = allDogs.filter(dog => dog.isGoodDog === true )
        dogDiv.innerHTML = ""
        dogDiv.innerHTML = goodDogs.map(dog => renderDogDiv(dog)).join('')
      } else {
        filterBar.textContent = 'Filter good dogs: OFF'
        dogDiv.innerHTML = ""
      }
    })
  }

})();