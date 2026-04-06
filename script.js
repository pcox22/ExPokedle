import {createClient} from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = 'https://uleaqzzzmyiusmelotor.supabase.co';
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWFxenp6bXlpdXNtZWxvdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTg5MjgsImV4cCI6MjA4MDk3NDkyOH0.avgVi89YgT0ebEhOoURXgNyccWoFfwTmwZZkEWfZb3I";
const supabase = createClient(supabaseUrl, supabasekey);
let dailyID = ''
let lastRequestId = 0; // Used to manage db queries

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
    //console.log(data);

    return data;
}

async function fetchDataByID(targetID) {
  let { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .eq('id', targetID)
    .single();
    if (error) {
        console.error('Error fetching data:', error);
        return error;
    }
    //console.log(data);

    return data;
}

// function to submit search when button is pressed: submitSearch()
const submitBtn = document.getElementById("submitSearch");
submitBtn.addEventListener("click", function() {
  const optionsDisplay = document.getElementById("optionsDisplay");
  if (optionsDisplay && optionsDisplay.firstChild) {
    saveGuess(parseInt(optionsDisplay.firstChild.id));
    compareGuess(optionsDisplay.firstChild.id);
    removeOption(optionsDisplay.firstChild);
  }
});

const searchBar = document.getElementById("pokemonSearch");
searchBar.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Find the first child of optionsDisplay to submit, if any
    const optionsDisplay = document.getElementById("optionsDisplay");
    if (optionsDisplay && optionsDisplay.firstChild) {
      saveGuess(parseInt(optionsDisplay.firstChild.id));
      compareGuess(optionsDisplay.firstChild.id);
      removeOption(optionsDisplay.firstChild);
    }
  }
});


/* Currently triggers whenever the input text changes */
document.addEventListener("DOMContentLoaded", function() {
  let data = '';
  const searchInput = document.getElementById("pokemonSearch");
  const optionsDisplay = document.getElementById("optionsDisplay");


      // Event listener triggers whenever the input value changes, can use this for creating suggestions
  searchInput.addEventListener("input", async function(event) {
    const requestId = ++lastRequestId; // Update 

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
        compareGuess(item.id);
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

      if (requestId !== lastRequestId) return; // stale
    
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
  clearSearch();
  if (div.id == dailyID){
    console.log('Congratulations!');
  }
}

async function clearSearch(){
  const searchData = document.getElementById("pokemonSearch");
  searchData.value = "";

  const optionsDisplay = document.getElementById("optionsDisplay");
  while (optionsDisplay.firstChild) {
    optionsDisplay.removeChild(optionsDisplay.firstChild);
  }
  optionsDisplay.classList.remove("optionsDisplay");

}

// Aquire all options that contain prompt
async function getDropDown(name){
  //console.log('DropDown:', name);
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

async function compareGuess(guessID) {
  const comparisonContainer = document.getElementById('comparisons');
  const comparisonRow = document.createElement("div");
  comparisonRow.classList.add("comparisonRow");

  console.log('Comparing guess:', guessID);
  console.log('Target:', dailyID);
  const guessData = await fetchDataByID(guessID);
  const targetData = await fetchDataByID(dailyID);

  if (guessData.name == targetData.name) {
    correctGuess();
  }

    const comparisonItem = document.createElement("div");
    comparisonItem.className = "comp";
    comparisonItem.id = guessData.id;
    comparisonItem.textContent = guessData.name;

    comparisonContainer.prepend(comparisonRow);

    const pic = document.createElement("div");
    pic.classList.add("comp");
    const img = new Image();
      img.alt = guessData.name;
      img.loading = "lazy";
    
      img.onerror = () => console.error("failed:", img.src);
    
      const { data } = supabase
        .storage
        .from("poke_images")
        .getPublicUrl(guessData.image);
    
      img.src = data.publicUrl;
      img.classList.add("compPic");

      pic.appendChild(img);

      if (guessData.name == targetData.name) {
        pic.classList.add("compCorrect");
      }
      else {
        pic.classList.add("compWrong");
      }

    const type1 = document.createElement("div");
    type1.classList.add("comp");
    if (guessData.type1 === targetData.type1) {
      type1.classList.add("compCorrect");
    }
    else if (guessData.type1 === targetData.type2) {
      type1.classList.add("compPartial");
    }
    else {
      type1.classList.add("compWrong");
    }
    type1.textContent = guessData.type1;

    const type2 = document.createElement("div");
    type2.classList.add("comp");
    if (guessData.type2 === targetData.type2) {
      type2.classList.add("compCorrect");
    }
    else if (guessData.type2 === targetData.type1) {
      type2.classList.add("compPartial");
    }
    else {
      type2.classList.add("compWrong");
    }
    type2.textContent = guessData.type2;

    const stage = document.createElement("div");
    stage.classList.add("comp");
    stage.textContent = guessData.stage;
    if (guessData.stage === targetData.stage) {
      stage.classList.add("compCorrect");
    }
    else {
      if (guessData.stage > targetData.stage) {
        stage.textContent = "< " + guessData.stage;
      }
      else {
        stage.textContent = "> " + guessData.stage;
      }
    }
    stage.classList.add("compWrong");

    const color = document.createElement("div");
    color.classList.add("comp");
    if (guessData.colors === targetData.colors) {
      color.classList.add("compCorrect");
    }
    else {
      const [color1, color2] = guessData.colors.split(",");
      if (targetData.colors.includes(color1) || targetData.colors.includes(color2)) {
        color.classList.add("compPartial");
      }
      else {
        color.classList.add("compWrong");
      }
    }
    color.textContent = guessData.colors;

    const habitat = document.createElement("div");
    habitat.classList.add("comp");
    if (guessData.habitat === targetData.habitat) {
      habitat.classList.add("compCorrect");
    }
    else {
      habitat.classList.add("compWrong");
    }
    habitat.textContent = guessData.habitat;

    const height = document.createElement("div");
    height.classList.add("comp");
    if (guessData.height === targetData.height) {
      height.classList.add("compCorrect");
      height.textContent = guessData.height + "m";
    }
    else {
      if (guessData.height > targetData.height) {
        height.textContent = "< " + guessData.height + "m";
      }
      else {
        height.textContent = "> " + guessData.height + "m";
      }
      height.classList.add("compWrong");
    }

    const weight = document.createElement("div");
    weight.classList.add("comp");
    if (guessData.weight === targetData.weight) {
      weight.classList.add("compCorrect");
      weight.textContent = guessData.weight + "kg";
    }
    else {
      weight.classList.add("compWrong");
      if (guessData.weight > targetData.weight) {
        weight.textContent = "< " + guessData.weight + "kg";
      }
      else {
        weight.textContent = "> " + guessData.weight + "kg";
      }
    }

    appendWithDelay([pic, type1, type2, stage, color, habitat, height, weight], comparisonRow);
}

    // Helper to pause for ms milliseconds
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Append items to comparisonRow with a delay between each
    async function appendWithDelay(elements, parent, delay = 250) {
      for (const el of elements) {
        parent.appendChild(el);
        animateGrowDiv(el, 70, 70);
        await sleep(delay);
      }
    }


async function correctGuess() {
  await sleep(0);
  const searchInput = document.getElementById("pokemonSearch");
  if (searchInput) {
    searchInput.disabled = true;
  }
}


// Save guess to local storage
function saveGuess(pokemonId) {
  const guesses = JSON.parse(localStorage.getItem("guessedPokemon")) || [];
  if (!guesses.includes(pokemonId)) {
    guesses.push(pokemonId);
    console.log("Pushed ", pokemonId, " to guessedPokemon");
    console.log("GuessedPokemon:", guesses);
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

/**
 * Animate a div to grow from 0x0 to the given width and height (in px).
 * @param {HTMLElement} div - The div element to animate.
 * @param {number} targetWidth - Final width in px.
 * @param {number} targetHeight - Final height in px.
 * @param {number} duration - Duration of the animation in ms (default 400).
 */
function animateGrowDiv(div, targetWidth, targetHeight, duration = 400) {
    if (!div) return;
    div.style.overflow = 'hidden';
    div.style.width = '0px';
    div.style.height = '0px';
    div.style.transition = `width ${duration}ms ease, height ${duration}ms ease`;
    // Needed for the browser to register initial 0x0
    requestAnimationFrame(() => {
        div.style.width = targetWidth + "px";
        div.style.height = targetHeight + "px";
    });
    // Optional cleanup of transition after animation ends:
    setTimeout(() => {
        div.style.transition = '';
        div.style.overflow = '';
    }, duration + 50);
}