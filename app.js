
const API_URL = 'https://dog.ceo/api';


const breedSelect = document.getElementById('breed');
const gallery = document.getElementById('gallery');
const loadMoreButton = document.getElementById('load-more');
const searchInput = document.getElementById('search');
let breeds = {};  


function fetchBreeds() {
    fetch(`${API_URL}/breeds/list/all`)
        .then(response => response.json())
        .then(data => {
            breeds = data.message;
            populateBreedDropdown(Object.keys(breeds));  
        })
        .catch(error => console.error('Error fetching breeds:', error));
}


function populateBreedDropdown(breedList) {
    breedSelect.innerHTML = '';  
    breedList.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedSelect.appendChild(option);
    });
}


searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBreeds = Object.keys(breeds).filter(breed =>
        breed.toLowerCase().includes(searchTerm)
    );
    populateBreedDropdown(filteredBreeds);  
});


function fetchImages(breeds, count = 6) {
    gallery.innerHTML = ''; 
    const promises = breeds.map(breed => {
        return fetch(`${API_URL}/breed/${breed}/images/random/${count}`)
            .then(response => response.json())
            .then(data => {
                displayImages(data.message);
            })
            .catch(error => console.error('Error fetching images:', error));
    });

    Promise.all(promises).then(() => {
        loadMoreButton.style.display = 'block';  
    });
}


function displayImages(images) {
    images.forEach(imageUrl => {
        const img = document.createElement('img');
        img.src = imageUrl;
        gallery.appendChild(img);
    });
}


breedSelect.addEventListener('change', function() {
    const selectedBreeds = Array.from(breedSelect.selectedOptions).map(option => option.value);
    fetchImages(selectedBreeds);
});


loadMoreButton.addEventListener('click', function() {
    const selectedBreeds = Array.from(breedSelect.selectedOptions).map(option => option.value);
    fetchImages(selectedBreeds, 6);  
});


fetchBreeds();
