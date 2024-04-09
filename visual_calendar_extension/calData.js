// ----------------------------------------
// calData.js
// ----------------------------------------

// get the current date info for reference
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
var dayName = date.toString().split(' ')[0];


// update the UI with the current month
document.getElementById('currentMonth').innerHTML = month;


// Main var to keep track of the current week
// this will go up and down 1 each time
// the week button is clicked to change the calendar.
let weekCount = 0;
let monthCount = 0;
let currentMonthNumber = month;

// all of the month arrays will be held in this array.
let months = [];

// fill the months with empty values so we can get
// 3 to be March etc in the array.
for(let i=0; i< currentMonthNumber; i++){
  months.push([])
}




//
// Generate the Day in three letter form, followed by date number.
//
function generateCalendarDatesData(){



    // This holds the number of days in each month
    // 0 is the first record so we can use 1,2,3 etc. for month numbers
    // Generate month data
    let lastDay = generateMonthDates(month, '', daysEachMonth[month]);
    lastDay = generateMonthDates(month+1, lastDay, daysEachMonth[month+1]);
    lastDay = generateMonthDates(month+2, lastDay, daysEachMonth[month+2]);
    lastDay = generateMonthDates(month+3, lastDay, daysEachMonth[month+3]);
    

}

// ---------------------------------------------
// Given the first three letters of a day,
// return the next calendar day.
// ---------------------------------------------
function getTomorrowDay(today){

  let tomorrow = '';

      if(today == 'Mon'){
          tomorrow = 'Tue'
      }
      else if(today == 'Tue'){
          tomorrow = 'Wed'
      }
      else if(today == 'Wed'){
          tomorrow = 'Thu'
      }
      else if(today == 'Thu'){
          tomorrow = 'Fri'
      }
      else if(today == 'Fri'){
          tomorrow = 'Sat'
      }
      else if(today == 'Sat'){
          tomorrow = 'Sun'
      }
      else if(today == 'Sun'){
          tomorrow = 'Mon'
      }

      return tomorrow;
}


// ---------------------------------------------
// For each different calendar month after the current
// month, this will generate the dates.
// ---------------------------------------------
function generateMonthDates(monthNum, lastDay, numberOfDays){
    console.log("month ----- "+monthNum)
    
    let monthDates = [];
    let tomorrow = '';
    // if we are on the current month, we need the current day.
    // if no last day, we are on the current month
    let counter = 0;
    if(lastDay == ''){
      console.log("no last day using "+dayName)

      //adding today
      monthDates.push(day+'-'+dayName)
      tomorrow = dayName;
      counter=day+1; 
    } else {
        tomorrow = lastDay;
        counter=1;
    }



    // generate rest of the month dates and days
    for(counter;counter<numberOfDays+1; counter++){
        tomorrow = getTomorrowDay(tomorrow);       
        monthDates.push(counter + "-"+tomorrow);
    
        if(counter==numberOfDays){
          lastDayWas = tomorrow; 
        }
    }
    
    // store the dates in the main months array
    // for future reference
    months.push(monthDates)
    
    return lastDayWas
 
 
}







// break the month into smaller week length arrays
// mon-sun
// this is done once per month
function generateMonToSundayChunks(monthNum){

  console.log("------ Month changed, pulling raw dates for the month ----") 
  currentMonth = months[monthNum]
 
  // update month visual on calendar
  document.getElementById('daysInMonth').innerHTML = daysEachMonth[monthNum]


  let tempWeek = []
    
    for(let i=0; i< currentMonth.length; i++){

        let currentElement = currentMonth[i];
        if(currentElement.includes("Sun")){
            tempWeek.push(currentElement)
            weekChunks.push(tempWeek);
            tempWeek = []
        } else {
          tempWeek.push(currentElement)
          
        }

    }

     
    //
    //get left over days to make a final chunk from
    //
    let total=0
    console.log("Week chunks")
    for(let wk=0; wk < weekChunks.length; wk++){
      console.log(weekChunks[wk])
      total=total+weekChunks[wk].length;
    }


    let leftOver = currentMonth.length-total;

    let leftOverChunk = []
    for(let i=total; i<currentMonth.length; i++){

        console.log("adding.." + currentMonth[i])
        leftOverChunk.push(currentMonth[i])
    }



   let totalElementsToCreate = 7 - leftOverChunk.length;
   console.log("total elements.."+totalElementsToCreate)


   for(let i=0; i<totalElementsToCreate; i++){
      leftOverChunk.push(" ")
   }
   
    weekCount=0

   if(totalElementsToCreate != 7){   
      weekChunks.push(leftOverChunk)
   }




}











//
// Update the visual dates with the current week data
//
// weekCount global var is used to change the current week
//
function loadThisWeek(){

  console.log("loadThisWeek() ---------" + weekCount)
  
  // add missing days at start of a week as blank values
  // if we start on any day other than monday
  totalMissing = 7-weekChunks[weekCount].length
  fillBlanks = []

  for(var i =0; i< totalMissing; i++){
    fillBlanks.push(" ")
  }

   
   let newArr = fillBlanks.concat(weekChunks[weekCount])
   weekChunks[weekCount] = newArr;



  // update the dates visually
  let mon = document.getElementById('1_date').innerHTML = weekChunks[weekCount][0]
  let tue = document.getElementById('2_date').innerHTML = weekChunks[weekCount][1]
  let wed = document.getElementById('3_date').innerHTML = weekChunks[weekCount][2]
  let thu = document.getElementById('4_date').innerHTML = weekChunks[weekCount][3]
  let fri = document.getElementById('5_date').innerHTML = weekChunks[weekCount][4]
  let sat = document.getElementById('6_date').innerHTML = weekChunks[weekCount][5]
  let sun = document.getElementById('7_date').innerHTML = weekChunks[weekCount][6]
  
 

}



// --------------------------------------------
// main call to actually generate days and dates.
// this is only done once
generateCalendarDatesData()

// these are called once for each month
generateMonToSundayChunks(currentMonthNumber)


// plot the current week to the calendar
loadThisWeek()

plotThisWeeksEvents()