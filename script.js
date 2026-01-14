import {createClient} from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = 'https://uleaqzzzmyiusmelotor.supabase.co';
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWFxenp6bXlpdXNtZWxvdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTg5MjgsImV4cCI6MjA4MDk3NDkyOH0.avgVi89YgT0ebEhOoURXgNyccWoFfwTmwZZkEWfZb3I";
const supabase = createClient(supabaseUrl, supabasekey);
let dailyID = ''

function getPublicImageUrl(path) {
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}

// Template for returning data using a passed variable
async function fetchData(name) {
  name = 'char'

  let { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .ilike('name', `%${name}%`)
    if (error) {
        console.error('Error fetching data:', error);
        return error;
    }
    console.log(data);

    return data;
}


document.addEventListener("DOMContentLoaded", function() {
  const searchBtn = document.getElementById("submitSearch");
  searchBtn.addEventListener("click", function() {
    const input = document.getElementById("pokemonSearch").value;
    console.log(input);
  });
});

/* Currently triggers whenever the input text changes
Working on getting it to query the database and display valid options */

document.addEventListener("DOMContentLoaded", function() {
  let data = '';
  const searchInput = document.getElementById("pokemonSearch");
  const optionsDisplay = document.getElementById("optionsDisplay");

      // Event listener triggers whenever the input value changes, can use this for creating suggestions
  searchInput.addEventListener("input", async function(event) {

    // Clear previous options
    while (optionsDisplay.firstChild) {
      optionsDisplay.removeChild(optionsDisplay.firstChild);
    }

    // Ensure that DB is only queried whenever there is text in the input
    if (event.target.value.length <= 0 || !data) {
      optionsDisplay.classList.remove("optionsDisplay");
    }
    if (event.target.value.length > 0) {
      let data = await getDropDown(event.target.value);

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "optionTile";
      div.dataset.id = item.id;
      div.id = item.id;

      div.addEventListener("click", async () => {
        saveGuess(item.id);
        removeOption(div);
      });
    
      const img = new Image();
      img.alt = item.name;
      img.loading = "lazy";
    
      const label = document.createElement("span");
      label.textContent = item.name;
    
      img.onerror = () => console.error("failed:", img.src);
    
      const { data } = supabase
        .storage
        .from("poke_images")
        .getPublicUrl(item.image);
    
      img.src = data.publicUrl;
    

      div.appendChild(img);
      div.appendChild(label);
      optionsDisplay.appendChild(div);
      optionsDisplay.classList.add("optionsDisplay");      
    });
  }
  });
});

// Triggers whenever the user clicks on an option
async function removeOption(div){
  const optionsDisplay = document.getElementById('optionsDisplay');
  optionsDisplay.removeChild(div);
  if (div.id == dailyID){
    console.log('Congratulations!');
  }
}

// Aquire all options that contain prompt
async function getDropDown(name){
  console.log('DropDown:', name);
  const {data, error} = await supabase
  .from('pokemon')
  .select('*')
  .ilike('name', `%${name}%`);

  if (error) console.error(error);
  const guesses = JSON.parse(localStorage.getItem("guessedPokemon")) || [];
  const guessSet = new Set(guesses);
    // Remove all items from data if the item.id is found in guesses
    var refinedData = data.filter(pokemon => !guessSet.has(pokemon.id));
  return refinedData;
}

// Still in testing
// Save guess to local storage
function saveGuess(pokemonId) {
  const guesses = JSON.parse(localStorage.getItem("guessedPokemon")) || [];
  if (!guesses.includes(pokemonId)) {
    guesses.push(pokemonId);
    localStorage.setItem("guessedPokemon", JSON.stringify(guesses));
  }
}

// Need to study up on some of these concepts
function getDailyIndex() {
  localStorage.setItem("guessedPokemon", null);
  const today = new Date().toISOString().slice(0, 10); // "20xx-MM-DD"
  let hash = 0;

  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  console.log(hash)
  hash = Math.abs(hash % 151)
  console.log(hash);
  dailyID = hash;
  //return Math.abs(hash) % totalPokemon;
}
document.addEventListener('DOMContentLoaded', getDailyIndex);


/* Just so I can see and test some formatting 

displayDataOnPage();

async function displayDataOnPage() {
    const data = await fetchData();
    if (data) {
        const dataContainer = document.getElementById('dataContainer');
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `ID: ${item.id}, Name: ${item.name}`; 
            dataContainer.appendChild(div);

            const imagePath = item.image;  // "poke_images/gen1/bulbasaur.png"
            const imageUrl = getPublicImageUrl(imagePath);
            const img = document.createElement("img");
            img.classList.add("pokemon-image");
            img.src = imageUrl;
            dataContainer.appendChild(img);
        });
    }
}
  */

/* Research the following functions before implementation:

async function queryWithCondition(query){
const { data, error } = await supabase
  .from('pokemon')
  .select('*')
  .eq('type', 'Fire')
  .eq('generation', 1);
}

Function to obtain all data from the database such that 
async function searchPokemon(query) {
  const { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) console.error(error);
  return data;
}

*/