import {createClient} from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = 'https://uleaqzzzmyiusmelotor.supabase.co';
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWFxenp6bXlpdXNtZWxvdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTg5MjgsImV4cCI6MjA4MDk3NDkyOH0.avgVi89YgT0ebEhOoURXgNyccWoFfwTmwZZkEWfZb3I";
const supabase = createClient(supabaseUrl, supabasekey);

async function fetchData() {
  let { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .ilike('name', '%char%')
    
    if (error) {
        console.error('Error fetching data:', error);
        return error;
    }
    console.log(data);

    return data;
}

/* Just so I can see and test some formatting */
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

function getPublicImageUrl(path) {
    return `${supabaseUrl}/storage/v1/object/public/${path}`;
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
  var data = '';
  const searchInput = document.getElementById("pokemonSearch");
  const optionsDisplay = document.getElementById("optionsDisplay");
  searchInput.addEventListener("input", function(event) {
    // Event listener triggers whenever the input value changes, can use this for creating suggestions
    console.log('Input changed:', event.target.value);
    data = getDropDown(event.target.value);
    console.log("Re:", event.target.value)
  });

  if (data){
    data.forEach(item =>{
      const option = document.createElement("option")
      option.text = item.name
      console.log("Drop down change detected")

    })
  }
});

displayDataOnPage();

async function getDropDown(name){
  const {data, error} = await supabase
  .from('pokemon')
  .select('*')
  .ilike('name', `%${name}%`);

  if (error) console.error(error);
  return data;
}




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