import {createClient} from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = 'https://uleaqzzzmyiusmelotor.supabase.co';
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWFxenp6bXlpdXNtZWxvdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTg5MjgsImV4cCI6MjA4MDk3NDkyOH0.avgVi89YgT0ebEhOoURXgNyccWoFfwTmwZZkEWfZb3I";
const supabase = createClient(supabaseUrl, supabasekey);
let dailyID = ''
let lastRequestId = 0; // Used to manage db queries
let totalGuesses = 0;

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

  //console.log('Comparing guess:' + guessID);
  //console.log('Target:' + dailyID);
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
  await sleep(2000)
  showCongratulatoryAnimation("Congratulations! 🎉");
}

async function showCongratulatoryAnimation(message = "Congratulations! 🎉") {
  // Remove existing animation if present
  const existing = document.getElementById('congratsAnimation');
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'congratsAnimation';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  });

  // Main content
  const centerBox = document.createElement('div');
  Object.assign(centerBox.style, {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
    padding: '44px 64px',
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#4CAF50',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transform: 'scale(0)',
    opacity: 0,
    transition: 'transform 0.42s cubic-bezier(.5,2,0,1), opacity 0.34s'
  });

  /* Sparkle/confetti (simple emoji, for effect)
  const sparkle = document.createElement('div');
  sparkle.textContent = "✨🎊";
  sparkle.style.fontSize = '3.2rem';
  sparkle.style.marginBottom = '14px';
  */

  // Message
  const msg = document.createElement('div');
  msg.textContent = message;

  let gD = await fetchDataByID(dailyID)
  const guessInfo = document.createElement('div');
  guessInfo.textContent = "You correctly guessed " + gD.name + " in " + totalGuesses + " attempt(s)!"

  //centerBox.appendChild(sparkle);
  centerBox.appendChild(msg);
  centerBox.appendChild(guessInfo);


  overlay.appendChild(centerBox);
  document.body.appendChild(overlay);

  // Animate in
  setTimeout(() => {
    centerBox.style.transform = 'scale(1)';
    centerBox.style.opacity = '1';
  }, 40);

  // Burst confetti effect (emoji-based)
  for (let i = 0; i < 24; ++i) {
    const confetti = document.createElement('div');
    confetti.textContent = Math.random() < .5 ? "🎉" : (Math.random() < .5 ? '✨' : '🌟');
    Object.assign(confetti.style, {
      position: 'absolute',
      left: '50%',
      top: '54%',
      fontSize: (Math.random() * 1.1 + 1.1).toFixed(2) + 'rem',
      opacity: 0.85,
      pointerEvents: 'none',
      transition: 'transform 0.92s cubic-bezier(.19,.88,.62,1.25), opacity 0.72s'
    });
    overlay.appendChild(confetti);

    // Animate confetti burst radially outward
    (function(el, idx) {
      setTimeout(() => {
        const angle = (Math.PI * 2 / 24) * idx + (Math.random() - .5) * .6;
        const radius = (68 + Math.random() * 52);
        el.style.transform =
          `translate(-50%, -50%) translate(${Math.cos(angle)*radius}px,${Math.sin(angle)*radius}px) rotate(${angle*40}deg)`;
        el.style.opacity = 0;
      }, 120 + idx * 12);
      // Remove after animation
      setTimeout(() => el.remove(), 1900 + idx*13);
    })(confetti, i);
  }

  // Automatically fade out after 4s
  setTimeout(() => {
    centerBox.style.opacity = '0';
    centerBox.style.transform = 'scale(1.11)';
    setTimeout(() => {
      overlay.remove();
    }, 700);
  }, 4000);
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
  totalGuesses = guesses.length || 0;
}

function resetGuessedPokemon() {
  localStorage.setItem("guessedPokemon", JSON.stringify([]));
  totalGuesses = 0;
  console.log("guessedPokemon reset for the new day.");
}

// Helper to compute ms until the next midnight ET (Eastern Time, UTC-5/UTC-4 with DST)
function msUntilNextETMidnight() {
  // Get current Eastern Time by using UTC and adjusting for ET offset
  const now = new Date();

  // EST is UTC-5, EDT (DST) is UTC-4
  // This uses US Eastern Time, adjusting for DST if needed
  // Get current time in UTC, then check if DST is in effect in New York
  let etOffset = -5; // EST by default
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  // Offset in minutes between UTC and New York in January/July
  const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const nyOffset = now.getTimezoneOffset();
  if (nyOffset < stdTimezoneOffset) {
    etOffset = -4; // DST (EDT)
  }
  // Current ET time
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const etNow = new Date(utc + etOffset * 3600 * 1000);

  // Next ET midnight
  const nextETMidnight = new Date(etNow);
  nextETMidnight.setHours(24, 0, 0, 0); // Midnight of next day

  const msToMidnight = nextETMidnight.getTime() - etNow.getTime();
  return msToMidnight;
}

// Setup auto-reset every night at 12:00 am ET
function scheduleGuessedPokemonReset() {
  const msUntilReset = msUntilNextETMidnight();
  setTimeout(() => {
    resetGuessedPokemon();
    // After the first execution, reset every 24 hours (no need to shift for DST here, as drift will be < 1s/day)
    setInterval(resetGuessedPokemon, 24 * 60 * 60 * 1000);
  }, msUntilReset);
}

// Initiate the schedule when the script loads
// ToDo: Test whether this correctly works when hosted overnight
scheduleGuessedPokemonReset();


document.addEventListener('DOMContentLoaded', generateGuessedData);
async function generateGuessedData() {
  // Retrieve the "guessedPokemon" item from localStorage
  const guessedPokemon = localStorage.getItem("guessedPokemon");
  if (guessedPokemon){
    // Remove "[" and "]" from guessedPokemon string
    const cleanedGuessedPokemon = guessedPokemon.replace(/[\[\]]/g, "");
    let formatGuessed = cleanedGuessedPokemon.split(",")


    for (let i = 0; i < guessedPokemon.length; i++) {
      if (formatGuessed[i]){
        totalGuesses += 1
        console.log(formatGuessed[i])
        await compareGuess(formatGuessed[i])
      }
    }
  }
}



// Need to study up on some of these concepts
document.addEventListener('DOMContentLoaded', getDailyIndex); // Note; This is called when the page loads
function getDailyIndex() {
  // Either comment or uncomment the following line to prevent or allow guesses to be stored.
  //localStorage.setItem("guessedPokemon", null);
  const today = new Date().toISOString().slice(0, 10); // "20xx-MM-DD"
  let hash = 0;

  /* Outdated hashing function. Trying the new one stored in function.
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  console.log(hash)
  hash = Math.abs(hash % 151)
  console.log(hash);
  */
  hash = getDailyRandomNumber();
  console.log(hash);
  dailyID = hash;
  //return Math.abs(hash) % totalPokemon;
}



/**
 * Returns a completely randomized number based on today's date,
 * ensuring that two consecutive days never have outputs within 1 digit of each other.
 * The result is between min (inclusive) and max (exclusive).
 * By default, produces values in [0, 1_000_000).
 */
function getDailyRandomNumber(min = 0, max = 151) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // A base hash function (FNV-1a) to hash the date string.
  function hash(str) {
    let h = 2166136261 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
  }

  // Ensures consecutive days cannot be off by 1
  // Use a salt which alternates (for example: "A"/"B") and add more entropy from year/month/day offset
  const salt = ((parseInt(yyyy + mm + dd, 10) % 2) === 0) ? 'A' : 'B';

  // Mix in the day of year so Jan 1 ... Dec 31 always differ
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

  // Final key to hash
  const key = `${dateStr}:${salt}:${dayOfYear + 100}`;

  // Generate hash and map to range.
  let rand = hash(key);

  // For extra randomness, mix with a congruential transformation
  rand = (rand * 9301 + 49297) % 233280;

  // Map to range
  const finalNum = min + (rand % (max - min));

  // As a final safety, if two consecutive days produce values within 1, "jump" the number by +7, wrap max.
  if (typeof window !== "undefined") {
    // Try to cache yesterday's value in window to compare
    let prevDay = new Date(today);
    prevDay.setDate(today.getDate() - 1);
    const prevYyyy = prevDay.getFullYear();
    const prevMm = String(prevDay.getMonth() + 1).padStart(2, '0');
    const prevDd = String(prevDay.getDate()).padStart(2, '0');
    const prevDateStr = `${prevYyyy}-${prevMm}-${prevDd}`;
    const prevDoY = Math.floor((prevDay - new Date(prevYyyy, 0, 0)) / (1000 * 60 * 60 * 24));
    const prevSalt = ((parseInt(prevYyyy + prevMm + prevDd, 10) % 2) === 0) ? 'A' : 'B';
    const prevKey = `${prevDateStr}:${prevSalt}:${prevDoY + 100}`;
    let prevRand = hash(prevKey);
    prevRand = (prevRand * 9301 + 49297) % 233280;
    const prevFinal = min + (prevRand % (max - min));
    if (Math.abs(finalNum - prevFinal) <= 1) {
      // Jump to different value
      return (finalNum + 7) % (max - min) + min;
    }
  }

  return finalNum;
}


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