// ------------------------------------------------
// Main.js
// ------------------------------------------------
console.log("Called main.js")
let daysEachMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), { keyboard: false });
// when processing a month, each week will be a separate
// chunk in this array
let weekChunks = []



let button = document.getElementById('addSession');
button.addEventListener("click", () => {

  myModal.hide();

  // Get the values
  let day = document.getElementById('sessionDay').value;
  let month = document.getElementById('sessionMonth').value;
  let year = document.getElementById('sessionYear').value;
  let title = document.getElementById('sessionTitle').value;
  let desc = document.getElementById('sessionDesc').value;
  let time = document.getElementById('sessionTime').value;
  let location = document.getElementById('sessionLocation').value;

  // print for debugging
  console.log(day);
  console.log(month);
  console.log(year);
  console.log(title);
  console.log(desc);
  console.log(time);
  console.log(location);
  saveNewSessionData(day, month, year, title, desc, time, location);

});




// -------------------------------------------
// Core function that will save all the current information from the dialog
// and save it into the local storage.
// -------------------------------------------
function saveNewSessionData(day, month, year, title, desc, time, location) {

  console.log("called saveNewSessionData()");

  console.log(day);
  console.log(month);
  console.log(year);
  console.log(title);
  console.log(desc);
  console.log(time);

  let peoplevar = "USer";



  var value = JSON.stringify({
    "day": day, "month": month, "year": year, "title": title,
    "location": location, "time": time, "people": peoplevar
  });


  let startRecordNum = 0;



  console.log("checking if first record created..")
  // check if calendar start number is logged
  chrome.storage.local.get(['start_record']).then((result) => {

    startRecordNum = result['start_record']

    console.log("Found start record " + startRecordNum)



    // if we have to record, make a new one..
    if (startRecordNum == 0 || startRecordNum == undefined) {
      console.log("no record, making a new one")
      chrome.storage.local.set({ ['start_record']: 1 }).then(() => {
        console.log("start_record saved");
        startRecordNum = 1;
      });

    }


    // increment the calendar counter variable
    startRecordNum = startRecordNum + 1;
    console.log("incremented record counter.." + startRecordNum)

    // save incrmented number
    chrome.storage.local.set({ ['start_record']: startRecordNum }).then(() => {
      console.log("start_record update saved");



      chrome.storage.local.set({ ['calendar_' + startRecordNum]: value }).then(() => {
        console.log("JSON Data is saved");

        plotThisWeeksEvents()


      });


    });




  });



}





// ------------------------------------------
// Pull all the data from the storage and load 
// the JSON into memory.
// ------------------------------------------
function plotThisWeeksEvents() {

  
  for (var i = 0; i < 1000; i++) {
    let keyName = 'calendar_' + i;

    chrome.storage.local.get([keyName]).then((result) => {

      if (result[keyName] != undefined) {
        console.log("Value is " + result[keyName]);
        parseCalendarJSONRecord(result[keyName], keyName)

      }
    });

  }


}



// For each different record stored, if today is the same day
// we can add the record to the calendar.
//
function parseCalendarJSONRecord(recordContent, keyName) {
  console.log("Parsing calendar JSON")
  console.log("key " + keyName)



  let record = JSON.parse(recordContent)

  console.log(record.day)

  // get the current date range
  let mon = document.getElementById('1_date').innerHTML
  let tue = document.getElementById('2_date').innerHTML
  let wed = document.getElementById('3_date').innerHTML
  let thu = document.getElementById('4_date').innerHTML
  let fri = document.getElementById('5_date').innerHTML
  let sat = document.getElementById('6_date').innerHTML 
  let sun = document.getElementById('7_date').innerHTML

  if(mon){
    mon = mon.split('-')[0]
  }
  if(tue){
    tue = tue.split('-')[0]
  }
  if(wed){
    wed = wed.split('-')[0]
  }
  if(thu){
    thu = thu.split('-')[0]
  }
  if(fri){
    fri = fri.split('-')[0]
  }
  if(sat){
    sat = sat.split('-')[0]
  }
  if(sun){
    sun = sun.split('-')[0]
  }

  let currentMonth = document.getElementById('currentMonth').innerHTML; 
  console.log("CURRENT Month" + currentMonth)


  let month =record.month

  // check we are currently on the same month as the record.
  if(currentMonth == month){
      console.log("ON SAME MONTH")

      console.log("CHECKING " +record.day + " on the calendar");
      console.log("monday is " + mon)
      console.log("tu is " + tue)
      console.log("wed is " + wed)
      console.log("thu is " + thu)
      console.log("fri is " + fri)
      console.log("sat is " + sat)
      console.log("sun is " + sun)
      let time = record.time;
      let day = record.day


      console.log("day " + day)
      console.log("month " + month)
      console.log("timeslot " + time)
      if (record.day == mon) {
        plotToCalendar(1, time, keyName, record) 
      }
      else if (record.day == tue) {
        plotToCalendar(2, time, keyName, record)
      }
      else if (record.day == wed) {
        plotToCalendar(3, time, keyName, record) 
      }
      else if (record.day == thu) {
        plotToCalendar(4, time, keyName, record) 
      }
      else if (record.day == fri) {
        plotToCalendar(5, time, keyName, record)
      }
      else if (record.day == sat) {
        plotToCalendar(6, time, keyName, record)
      }
      else if (record.day == sun) {
        plotToCalendar(7, time, keyName, record)
      }

    
  }











}

function plotToCalendar(weekNum, time, keyName,record){

        let currentElement = weekNum+'sessionBlock_' + time;
        let elem = document.getElementById(currentElement);
    
        elem.innerHTML = record.title
        elem.style.backgroundColor = "grey";
        elem.setAttribute("data", keyName)
        elem.classList.remove('empty');
        elem.classList.add('canDelete');
}

// Delete a single calendar entry
// based on the id.
function deleteLocalRecord(id) {
  console.log("deleting record: " + id)
  chrome.storage.local.remove([id]);

}






// General click listener to see if someone has clicked
// one of the time slots.
// allows people to delete and also add new.
function processClick(e) {

  let single = document.getElementById(e.target.id)

  // delete an existing block
  if (e.target.getAttribute('class') == 'canDelete') {

    let deleteResult = window.confirm("Delete record?");

    if (deleteResult) {
      deleteLocalRecord(single.getAttribute('data'))
      window.location.reload()
    }
  } else if (e.target.getAttribute('class') == 'empty') {
    //
    // Getting the current date and time and creating a popup.
    // to add a new block
    //
    let currentId = e.target.getAttribute('id');

    // get the day in 1-7 format, then get the date above.
    let currentDayNum = currentId.substring(0, 1);
    let currentSelectedDateNum = document.getElementById(currentDayNum+'_date').innerHTML;
    
    // remove the everything after the date e.g., 11-Tue, remove -Tue
    currentSelectedDateNum = currentSelectedDateNum.split('-')[0]
    console.log(currentSelectedDateNum)
    document.getElementById('sessionDay').value = currentSelectedDateNum;

    // Get the month
    let cMonth = document.getElementById('currentMonth').innerHTML;
    document.getElementById('sessionMonth').value = cMonth;
    // show the time selected
    let start = currentId.indexOf('k_')
    let jumpToTime = currentId.substring(start + 2, currentId.length)
    document.getElementById('sessionTime').value = jumpToTime;


    // clear any old text
    document.getElementById('sessionTitle').value = '';
    document.getElementById('sessionDesc').value = '';
    
    myModal.show();


  }
  else if (e.target.getAttribute('id') == 'nextWeek') {
    console.log("forward 1 week")

    weekCount = weekCount + 1
    let mon = document.getElementById('1_date').innerHTML
    let tue = document.getElementById('2_date').innerHTML
    let wed = document.getElementById('3_date').innerHTML;
    let thu = document.getElementById('4_date').innerHTML;
    let fri = document.getElementById('5_date').innerHTML;
    let sat = document.getElementById('6_date').innerHTML;
    let sun = document.getElementById('7_date').innerHTML;

    // we are looking for one of the days containing the last day
    // of the month as the key to switch to the next month
    let lookingFor = daysEachMonth[currentMonthNumber];


    if (mon.includes(lookingFor) ||
      tue.includes(lookingFor) ||
      wed.includes(lookingFor) ||
      thu.includes(lookingFor) ||
      fri.includes(lookingFor) ||
      sat.includes(lookingFor) ||
      sun.includes(lookingFor)) {


      // delete old week chunks
      // and generate new ones
      weekChunks = []
      monthCount = monthCount + 1
      console.log("generating month chunks")

      currentMonthNumber++
      generateMonToSundayChunks(currentMonthNumber)
      document.getElementById('currentMonth').innerHTML = (month + monthCount)

      weekCount = 0

    }
    // main call to render the visual components
    loadThisWeek() // plot dates
    clearCalendar() // empty blocks

    plotThisWeeksEvents() // check what events need to be plotted.

  }
  else if (e.target.getAttribute('id') == 'previousWeek') {
    console.log("Back 1 week")

    weekCount = weekCount - 1


    if (weekCount == -1) {
      console.log("MOVE BACK A MONTH")

      // move month back
      currentMonthNumber = currentMonthNumber - 1;

      // update the month visually on the calendar
      document.getElementById('currentMonth').innerHTML = (currentMonthNumber)

      console.log("Making previous month chunks")
      weekChunks = []
      generateMonToSundayChunks(currentMonthNumber)

      // print the chunks we are working with in this calendar month
      for (let i = 0; i < weekChunks.length; i++) {
        console.log(weekChunks[i])
      }

      weekCount = weekChunks.length - 1;



    }


    loadThisWeek() // load the dates for this week
    clearCalendar() // remove this weeks data
    plotThisWeeksEvents() // check to see what we need to plot this week
  }

  else {
    console.log("not processing click")
  }



}
document.addEventListener("click", processClick)




//
// Before any new time blocks are plotted to the calendar
// to show that a time is reserved, we clear off the HTML and
// background colour.
function clearCalendar(){

  for(var col=1; col< 8; col++){
        for(var i=1; i< 23; i++){
          console.log("Clearing " + col+'sessionBlock_'+i)
          let singleBlock = document.getElementById(col+'sessionBlock_'+i);
          singleBlock.innerHTML = '';
          singleBlock.style.backgroundColor = 'white'
        }
  }


}