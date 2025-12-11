import {createClient} from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = 'https://uleaqzzzmyiusmelotor.supabase.co';
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWFxenp6bXlpdXNtZWxvdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTg5MjgsImV4cCI6MjA4MDk3NDkyOH0.avgVi89YgT0ebEhOoURXgNyccWoFfwTmwZZkEWfZb3I";
const supabase = createClient(supabaseUrl, supabasekey);

async function fetchData() {
  let { data, error } = await supabase
    .from('pokemon')
    .select('*')
    
    if (error) {
        console.error('Error fetching data:', error);
        return error;
    }
    console.log(data);

    return data;
}

async function displayDataOnPage() {
    const data = await fetchData();
    if (data) {
        const dataContainer = document.getElementById('dataContainer'); // An HTML element to display data
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `ID: ${item.id}, Name: ${item.name}`; // Adjust based on your table columns
            dataContainer.appendChild(div);

            const imagePath = item.image;  // "poke_images/bulbasaur.png"
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


document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("pokemonSearch");
  searchInput.addEventListener("input", function(event) {
    // Event listener triggers whenever the input value changes
    console.log('Input changed:', event.target.value);
  });
});

displayDataOnPage();