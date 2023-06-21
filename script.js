document.getElementById("plant-health-assessment-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  showLoadingAnimation();

  // Get selected files from the file input
  const files = [...document.querySelector('#PHA-image-upload').files];

  // Convert each file to base64 format
  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target.result;
        resolve(res);
      };
      reader.readAsDataURL(file);
    });
  });

  // Wait for all files to be converted to base64
  const base64files = await Promise.all(promises);

  // Prepare data for the API request
  const data = {
    api_key: "qvSbssteY5sTMXkvizRWQq9Dl2XR7w9vOTbGeC4wUirtiZty0S", // ATTAIN A KEY AT: https://web.plant.id/plant-identification-api/
    images: base64files,
    modifiers: ["crops_fast", "similar_images"],
    plant_language: "en",
    disease_details: [
      "common_names",
      "cause",
      "classification",
      "description",
      "treatment",
    ],
  };

  try {
    const response = await fetch('https://api.plant.id/v2/health_assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Success:', responseData);

    // Extracting the required properties from the response
    const isPlantProbability = responseData.is_plant_probability ? responseData.is_plant_probability : "";
    const isPlant = responseData.is_plant ? responseData.is_plant : "";
    const isHealthyProbability = responseData.health_assessment.is_healthy_probability ? responseData.health_assessment.is_healthy_probability : "";
    const isHealthy = responseData.health_assessment.is_healthy ? responseData.health_assessment.is_healthy : "";
    const diseases = responseData.health_assessment.diseases ? responseData.health_assessment.diseases : [];

    // Creating the card HTML
    // Creating the card container element
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    const plantStatus = document.createElement('div');
    plantStatus.classList.add('plant-status')
    
    const plantStatusHeading = document.createElement('h3');
    plantStatusHeading.textContent = 'Plant Status';
    plantStatus.appendChild(plantStatusHeading);
    
    const plantInfoContainer = document.createElement('div');
    plantInfoContainer.classList.add('plant-information');
    
    // Creating the heading for plant information
    const plantInfoHeading = document.createElement('h3');
    plantInfoHeading.textContent = 'Plant Information';
    plantInfoContainer.appendChild(plantInfoHeading);

    // Creating paragraphs for plant information
    const isPlantProbabilityPara = document.createElement('p');
    isPlantProbabilityPara.innerHTML = `<strong>Is Plant Probability:</strong> ${isPlantProbability}`;
    plantInfoContainer.appendChild(isPlantProbabilityPara);

    const isPlantPara = document.createElement('p');
    isPlantPara.innerHTML = `<strong>Is Plant:</strong> ${isPlant}`;
    plantInfoContainer.appendChild(isPlantPara);
    
    plantStatus.appendChild(plantInfoContainer);

    const plantHealthAssessment = document.createElement('div');
    plantHealthAssessment.classList.add('health-assessment');
    // Creating the heading for health assessment
    const healthAssessmentHeading = document.createElement('h3');
    healthAssessmentHeading.textContent = 'Health Assessment';
    plantHealthAssessment.appendChild(healthAssessmentHeading);

    // Creating paragraphs for health assessment
    const isHealthyProbabilityPara = document.createElement('p');
    isHealthyProbabilityPara.innerHTML = `<strong>Is Healthy Probability:</strong> ${isHealthyProbability}`;
    plantHealthAssessment.appendChild(isHealthyProbabilityPara);

    const isHealthyPara = document.createElement('p');
    isHealthyPara.innerHTML = `<strong>Is Healthy:</strong> ${isHealthy}`;
    plantHealthAssessment.appendChild(isHealthyPara);
    plantStatus.appendChild(plantHealthAssessment);
    
    cardContainer.appendChild(plantStatus);
    
    // Creating the heading for diseases
    const possibleDiseasesContainer = document.createElement('div');
    possibleDiseasesContainer.classList.add('possible-diseases');
    
    const diseasesHeading = document.createElement('h3');
    diseasesHeading.textContent = 'Possible Diseases';
    possibleDiseasesContainer.appendChild(diseasesHeading);

    // Creating disease elements
    diseases.forEach((disease) => {
      // Creating the disease element
      const diseaseElement = document.createElement('div');
      diseaseElement.classList.add('disease');

      const diseaseDetails = document.createElement('div');

      // Creating the heading for disease details
      const diseaseDetailsHeading = document.createElement('h4');
      diseaseDetailsHeading.textContent = 'Disease Details';
      diseaseDetails.appendChild(diseaseDetailsHeading);
      
      // Creating paragraphs for disease information
      const namePara = document.createElement('p');
      namePara.innerHTML = `<strong>Name:</strong> ${disease.name}`;
      diseaseDetails.appendChild(namePara);

      // Creating paragraphs for disease details
      const localNamePara = document.createElement('p');
      localNamePara.innerHTML = `<strong>Local Name:</strong> ${disease.disease_details.local_name}`;
      diseaseDetails.appendChild(localNamePara);

      // Creating an unordered list for common names
      if (disease.disease_details.common_names) {
        const commonNamesContainer = document.createElement('div');
        // Creating the heading for common names
        const commonNamesHeading = document.createElement('h5');
        commonNamesHeading.textContent = 'Common Names';
        commonNamesContainer.appendChild(commonNamesHeading);

        const commonNamesList = document.createElement('ul');
        disease.disease_details.common_names.forEach((name) => {
          const listItem = document.createElement('li');
          listItem.textContent = name;
          commonNamesList.appendChild(listItem);
        });
        commonNamesContainer.appendChild(commonNamesList);
        diseaseDetails.appendChild(commonNamesContainer);
      }

      const probabilityPara = document.createElement('p');
      probabilityPara.innerHTML = `<strong>Probability:</strong> ${disease.probability}`;
      diseaseDetails.appendChild(probabilityPara);

      const descriptionPara = document.createElement('p');
      descriptionPara.innerHTML = `<strong>Description:</strong> ${disease.disease_details.description}`;
      diseaseDetails.appendChild(descriptionPara);

      diseaseElement.appendChild(diseaseDetails);

      // Creating the heading for similar images
      const similarImagesContainer = document.createElement('div');
      similarImagesContainer.classList.add('similar-images');
      
      const similarImagesHeading = document.createElement('h4');
      similarImagesHeading.textContent = 'Similar Images';
      similarImagesContainer.appendChild(similarImagesHeading);

      const imageGallery = document.createElement('div');
      imageGallery.classList.add('image-gallery');
      // Creating image elements for similar images
      disease.similar_images.forEach((image) => {
        // Creating the image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image');

        // Creating the image element
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = 'Similar Image';
        imageContainer.appendChild(img);

        // Creating a paragraph for similarity
        const similarityPara = document.createElement('p');
        similarityPara.innerHTML = `<strong>Similarity:</strong> ${image.similarity}`;
        imageContainer.appendChild(similarityPara);

        // Appending the image container to the disease element
        imageGallery.appendChild(imageContainer);
      });
      similarImagesContainer.appendChild(imageGallery);
      diseaseElement.appendChild(similarImagesContainer);

      // Appending the disease element to the card container
      possibleDiseasesContainer.appendChild(diseaseElement);
    });
    
    cardContainer.appendChild(possibleDiseasesContainer);
    
    document.querySelector('#plant-health-results').appendChild(cardContainer);
    
    hideLoadingAnimation()
  } catch (error) {
    console.error('Error:', error);
    hideLoadingAnimation();
  }

  // Clear the selected files container
  document.querySelector(".PHA-selected-files").innerHTML = "";
});

// Function to show the loading animation
function showLoadingAnimation() {
  const spinner = document.querySelector('.loading-screen');
  spinner.classList.remove('loading-hidden');
  spinner.classList.add('loading-visible');
}

// Function to hide the loading animation
function hideLoadingAnimation() {
  const spinner = document.querySelector('.loading-screen');
  spinner.classList.remove('loading-visible');
  spinner.classList.add('loading-hidden');
}

document.getElementById("PHA-image-upload").addEventListener("change", function(event) {
  var selectedFilesContainer = document.querySelector(".PHA-selected-files");
  selectedFilesContainer.innerHTML = "";

  // Handle the selected files
  for (var i = 0; i < event.target.files.length; i++) {
    var file = event.target.files[i];
    var reader = new FileReader();

    // Read the file and create an image element
    reader.onload = function(event) {
      var image = document.createElement("img");
      image.src = event.target.result;

      var imageContainer = document.createElement("div");
      imageContainer.appendChild(image);

      // Add a remove button for each image
      var removeImage = document.createElement("span");
      removeImage.classList.add("remove-image");
      removeImage.innerHTML = "Remove";
      removeImage.addEventListener("click", function() {
        imageContainer.parentNode.removeChild(imageContainer);
      });

      imageContainer.appendChild(removeImage);
      selectedFilesContainer.appendChild(imageContainer);
    }

    reader.readAsDataURL(file);
  }
});



