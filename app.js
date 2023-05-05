'use strict'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'
let playerScore = 0;

function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAPI(url){
    const response = await fetch(url)
    var data = await response.json();
    
    if (response) {
        hideloader();
    }

    // console.log(data);
    return data;
}

async function getRandomCorrectPokemon(){
    const data = await fetchAPI(API_URL);
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const correctPokemon = data.results[randomIndex].name;

    // console.log(correctPokemon);
    return correctPokemon;
}

async function getRandomWrongPokemon(excludePokemonName) {
    const data = await fetchAPI(API_URL);
    
    const pokemonNames = data.results.map(result => result.name);
    
    // Filtere das korrekte Pokemon aus der Liste der Pokemon-Namen heraus
    const filteredPokemonNames = pokemonNames.filter(name => name !== excludePokemonName);
    const randomPokemonNames = [];
    
    // Wähle drei zufällige Pokemon-Namen aus, die nicht das korrekte Pokemon sind
    while (randomPokemonNames.length < 3) {
        const randomIndex = Math.floor(Math.random() * filteredPokemonNames.length);
        const randomName = filteredPokemonNames[randomIndex];
      
        if (!randomPokemonNames.includes(randomName)) {
            randomPokemonNames.push(randomName);
        }
    }
    
    // console.log(randomPokemonNames);
    return randomPokemonNames;
}

async function displayPokemonButtons(correctPokemon, otherPokemon) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    
    const allPokemon = [correctPokemon, ...otherPokemon];
    const shuffledPokemon = shuffleArray(allPokemon);

    // API-URL für das korrekte Pokemon abrufen
    const correctPokemonData = await fetchAPI(`${API_URL}/${correctPokemon}`);
    const correctPokemonImageUrl = correctPokemonData.sprites.front_default;
    
    // Bild des korrekten Pokemon anzeigen
    const correctPokemonImage = document.createElement('img');
    correctPokemonImage.src = correctPokemonImageUrl;
    correctPokemonImage.classList.add('pokemon-image');
    correctPokemonImage.style.position = 'absolute';
    correctPokemonImage.style.top = '120px';
    correctPokemonImage.style.left = '85px';
    correctPokemonImage.style.width = '150px';
    correctPokemonImage.style.height = '150px';
    correctPokemonImage.style.filter = 'brightness(0%)';
    buttonContainer.appendChild(correctPokemonImage);
    
    
    for (let i = 0; i < 4; i++) {
        const button = document.createElement('button');
        button.innerText = capitalizeFirstLetter(shuffledPokemon[i]);
        
        const topOffset = i < 2 ? '10px' : '60px';
        const leftOffset = i % 2 === 0 ? '10px' : '160px';
        
        button.style.position = 'absolute';
        button.style.top = topOffset;
        button.style.left = leftOffset;
        button.style.width = '140px';
        button.style.height = '40px';
        
        button.addEventListener('click', function() {
            correctPokemonImage.style.filter = '';
            if (button.innerText.toLowerCase() === correctPokemon) {
                correctPokemonImage.style.filter = '';
                playerScore++;
                setTimeout(() => {
                    alert('Correct!');
                    document.querySelector('.pokemon-image').remove();
                    document.querySelector('.button-container').remove();
                    main()}, 500);
                
            } else {
                playerScore = 0;
                setTimeout(() => {
                    document.querySelector('.pokemon-image').remove();
                    document.querySelector('.button-container').remove();
                    alert(`Wrong, it was ${correctPokemon}. You lost!`);
                    main()}, 500);
            }
        });
      
        buttonContainer.appendChild(button);
    }
    
    document.body.appendChild(buttonContainer);
}
  
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
}
    
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
async function main() {
    const correctPokemon = await getRandomCorrectPokemon();
    const otherPokemon = await getRandomWrongPokemon(correctPokemon);
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerText = `Score: ${playerScore}`;
    await displayPokemonButtons(correctPokemon, otherPokemon);
    
    // console.log(correctPokemon, otherPokemon);
    // console.log(playerScore);
}

main();