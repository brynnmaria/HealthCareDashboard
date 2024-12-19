//PAGE LOADS

// Define the API URL: https://fedskillstest.coalitiontechnologies.workers.dev
const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const credentials = btoa("coalition:skills-test");

// Perform asynchronous GET request...
const xhttpr = new XMLHttpRequest();

// First, create API request using xhttpr.open, passing the apuUrl
xhttpr.open('GET', apiUrl, true);

// Next, use setRequestHeader to set the authorization info (your api login)
xhttpr.setRequestHeader('Authorization','Basic ' + credentials);

// Send the API request
xhttpr.send();

/* 
  The api request is asynchronous, meaning it does not pause 
  processing if the response takes some time.

  xhttpr.onload means that once we have a response back from api, do what's
  to the right of the equals sign. In this case, we created an anonymous
  function to run as soon as we get the response.

  BUT as mentioned above, processing is not paused while we wait!
  So we skip ahead for now...
*/
// START ASYNC
xhttpr.onload = ()=> {
  // Now we're inside the anonymous function, meaning an API response was received

  // 200 means successful response
  if (xhttpr.status === 200) {

      /* 
        Parse the response JSON we got from the API
        (returned raw as xhttpr.response), and save
        it to a variable called "response".
        
        "Parsing" the response means it is converted
        from raw JSON to a Javascript object we can use.
      */
      const response = JSON.parse(xhttpr.response);
      
      /* 
        Re-assign response to "window.patients".
        This creates a new varaible in the "window" (AKA global) scope.
        This allows us to use it later throughout the rest of our code,
        which is important since it literally holds all of the data
        returned bu the API.
      */
      window.patients = response;

      /* 
        Get the <ul> element from the HTML and save it to "patentList". 
        This is where we'll output each <li> element we'll be generating 
        for each patient below.
      */
      let patientList = document.getElementById("patients-list-container");
      

      /* 
        Create a "for..of" loop to loop through each of the patients
        returned by the API.

        Normally, we would simply do "for(patient of patients)", but
        since the index is important, in this case we need to define the loop
        as below, which includes the index as well.
      */
      for ([index, patient] of window.patients.entries()) {
 
        /* 
          Here, we actually create the <li> element dynamically! 
          It's dynamic because for each patient in the loop, we create a
          unique <li> just for them. Using interpolation (AKA ${}), we
          can insert custom data into the HTML depending on the type of patient.
        */
        let thisPatientListItem = `
          <li class="patients-info-list" id="patient-${index}" onclick="getPatientData(${index});">
            <div class="patient-section">
              <img class="patient-img" src="${patient.profile_picture}" alt="patient photo">
              <div class="patient-gender-age">
                <p>${patient.name}</p>
                <p>${patient.gender}, ${patient.age}</p>
              </div>
            </div>
            <div class="three-dot-horizontal-icon">
              <img src="images/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="Three dot horizontal icon">
            </div>
          </li>
        `
        /* 
          Before we loop to the next patient, add the <li> we generated 
          above (AKA "thisPatientListItem") to the <ul> (AKA "patientList") 
          on the frontend using innerHTML.

          We do "patientList.innerHTML + thisPatientListItem", because when 
          we add the new <li> ("thisPatientListItem"), we don't want to overwrite 
          what was already there in patientList.innerHTML, just add to it.
        */
        patientList.innerHTML = patientList.innerHTML + thisPatientListItem;

      } // End of our patients loop

    /* 
      Finally, on page load, directly call the function 
      getPatientData while passing index 0. This will to auto-select 
      the 1st patient when the page loads. 
    */
    getPatientData(0);

  } else {
      // Else, the response was not 200, so it as not successful.
      alert("API error! Unable to load patient data.");
  }
};
//END ASYNC


// FUNCTIONS
function getPatientData(patientIndex) {

  // Future code to remove "selected" from existing patients
  // Loop through every person in the list
  let patientList = document.getElementById("patients-list-container");
  // For every person in the list check if the person has the class selected
  // If person has class selected remove the class selected
  for(patient of patientList.children){
    if (patient.classList.contains("selected")) {
      patient.classList.remove("selected");
    } 
  }

  // Change bg color of selected patient
  let selectedPatient = document.getElementById("patient-" + patientIndex);
  selectedPatient.classList.add("selected");


  
  // Get patient based on the patientIndex passed to this function
  let thisPatientData = window.patients[patientIndex];

  // Get patient main info

  let patientImg = document.getElementById("patient-selected-img");
  let patientName = document.getElementById("patient-container-name");
  let patientDob = document.getElementById("patient-dob");
  let patientGender = document.getElementById("patient-gender");
  let patientContact = document.getElementById("patient-contact");
  let patientEmergencyContact = document.getElementById("patient-emergency-contact");
  let patientInsurance = document.getElementById("patient-insurance");
  let patientBtn= document.getElementById("patient-info-btn");

  patientImg.src = thisPatientData.profile_picture;
  patientName.innerHTML = thisPatientData.name;
  patientDob.innerHTML = thisPatientData.date_of_birth;
  patientGender.innerHTML = thisPatientData.gender;
  patientContact.innerHTML = thisPatientData.phone_number;
  patientEmergencyContact.innerHTML = thisPatientData.emergency_contact;
  patientInsurance.innerHTML = thisPatientData.insurance_type;

  
  let diagnosticTableData = document.getElementById("diagnostic-table-data");
  let diagnosticList = thisPatientData.diagnostic_list;
  diagnosticTableData.innerHTML = "";

  for(diagnostic of diagnosticList){
    let diagnosticRow = `
    <tr>
      <td>${diagnostic.name}</td>
      <td>${diagnostic.description}</td>
      <td>${diagnostic.status}</td>
    </tr>
    ` 
    diagnosticTableData.innerHTML = diagnosticTableData.innerHTML + diagnosticRow;
  }

  let systolicNumber = document.getElementById("systolic-number");
  let systolicText = document.getElementById("systolic-text");
  let diastolicNumber = document.getElementById("diastolic-number");
  let diastolicText = document.getElementById("diastolic-text");
  let respiratoryNum = document.getElementById("respiratory-num");
  let respiratoryResult = document.getElementById("respiratory-result");
  let temperatureNum = document.getElementById("temperature-num");
  let temperatureResult = document.getElementById("temperature-result");
  let heartRateNum = document.getElementById("heart-rate-num");
  let heartRateResult = document.getElementById("heart-rate-result");

  
  let diagnosisHistory = thisPatientData.diagnosis_history;

  let systolicArray = [];
  let diastolicArray = [];
  for(diagnosis of diagnosisHistory){
    systolicArray.push(diagnosis.blood_pressure.systolic.value);
    diastolicArray.push(diagnosis.blood_pressure.diastolic.value);
    systolicNumber.innerHTML = diagnosis.blood_pressure.systolic.value;
    
    if(diagnosis.blood_pressure.systolic.levels == "Higher than Average"){
      systolicText.innerHTML = '<img src="images/ArrowUp.svg" alt="Arrow pointing up"> ' + diagnosis.blood_pressure.systolic.levels;
    } else if(diagnosis.blood_pressure.systolic.levels == "Lower than Average"){
      systolicText.innerHTML = '<img src="images/ArrowDown.svg" alt="Arrow pointing down"> ' + diagnosis.blood_pressure.systolic.levels;
    } else{
      systolicText.innerHTML = diagnosis.blood_pressure.systolic.levels;
    }
      

    diastolicNumber.innerHTML = diagnosis.blood_pressure.diastolic.value;

    if(diagnosis.blood_pressure.diastolic.levels == "Higher than Average"){
      diastolicText.innerHTML = '<img src="images/ArrowUp.svg" alt="Arrow pointing up"> ' + diagnosis.blood_pressure.diastolic.levels;
    } else if(diagnosis.blood_pressure.diastolic.levels == "Lower than Average"){
      diastolicText.innerHTML = '<img src="images/ArrowDown.svg" alt="Arrow pointing down"> ' + diagnosis.blood_pressure.diastolic.levels;
    } else {
      diastolicText.innerHTML = diagnosis.blood_pressure.diastolic.levels;
    }

    respiratoryNum.innerHTML = diagnosis.respiratory_rate.value + " bpm";

    if(diagnosis.respiratory_rate.levels == "Higher than Average"){
      respiratoryResult.innerHTML = '<img src="images/ArrowUp.svg" alt="Arrow pointing up"> ' + diagnosis.respiratory_rate.levels;
    } else if (diagnosis.respiratory_rate.levels == "Lower than Average"){
      respiratoryResult.innerHTML = '<img src="images/ArrowDown.svg" alt="Arrow pointing down"> ' + diagnosis.respiratory_rate.levels;
    } else{
      respiratoryResult.innerHTML = diagnosis.respiratory_rate.levels;
    }

    temperatureNum.innerHTML = diagnosis.temperature.value + " &#8457";

    if(diagnosis.temperature.levels == "Higher than Average"){
      temperatureResult.innerHTML = '<img src="images/ArrowUp.svg" alt="Arrow pointing up"> ' + diagnosis.temperature.levels;
    } else if(diagnosis.temperature.levels == "Lower than Average"){
      temperatureResult.innerHTML = '<img src="images/ArrowDown.svg" alt="Arrow pointing down"> ' + diagnosis.temperature.levels;
    } else {
      temperatureResult.innerHTML = diagnosis.temperature.levels;
    }

    heartRateNum.innerHTML = diagnosis.heart_rate.value + " bpm";

    if(diagnosis.heart_rate.levels == "Higher than Average"){
      heartRateResult.innerHTML = '<img src="images/ArrowUp.svg" alt="Arrow pointing up"> ' + diagnosis.heart_rate.levels;
    } else if(diagnosis.heart_rate.levels == "Lower than Average"){
      heartRateResult.innerHTML = '<img src="images/ArrowDown.svg" alt="Arrow pointing down"> ' + diagnosis.heart_rate.levels;
    } else{
      heartRateResult.innerHTML = diagnosis.heart_rate.levels;
  }
}

  // console.log(systolicArray);
  // console.log(diastolicArray);


  //CHART.JS
  
  // destroy chart if it already exists, before we can create a new one
  document.getElementById('myChart').remove();

  //replace myChart canvas element in html
  const chartContainer = document.getElementById('blood-pressure-chart-container');
  let newChartCanvas = document.createElement("canvas");
  newChartCanvas.setAttribute("id", "myChart");
  chartContainer.append(newChartCanvas);


  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Oct,2023', 'Nov,2023', 'Dec,2023', 'Jan,2024', 'Feb,2024', 'Mar,2024'],
      datasets: [{
        label: 'systolic',
        data: systolicArray,
        pointBackgroundColor: '#E66FD2',
        borderColor: 'rgba(230, 111, 210)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change fill color
        tension: 0.4,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Diastolic',
        data: diastolicArray,
        pointBackgroundColor: '#8C6FE6',
        borderColor: 'rgb(140, 111, 230)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change fill color
        tension: 0.4,
        fill: false
      }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Set to false to hide the legend
        },
        title: {
          display: false // Set to false to hide the title
        }
      },

      elements:{
        point:{
          radius: 6,
        }
      },

      scales: {
        x: {
          grid: {
              display: false 
          }
      },
        y: {
          min: 60,
          max: 180,
        }
      }
    }
  });








  // Get the patient's lab results, assign to labResults
  let labResults = thisPatientData.lab_results;

  // Get lab results <ul> from the HTML
  let patientLabResults = document.getElementById("lab-results-details-container");
  // Clear any previous results
  patientLabResults.innerHTML = "";

  /* 
    For each labResult this person has, dynamically generate HTML and
    append it to the patientLabResults <ul>
  */
  for (labResult of labResults){

    let thislabResultsListItem = `
     <li class="lab-result">${labResult}
      <div class="lab-result-img-container">
        <img class="lab-result-img" src="images/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="Download-icon">  
      </div>    
    </li>
   `
   patientLabResults.innerHTML = patientLabResults.innerHTML + thislabResultsListItem;
  };
} //End of Function


