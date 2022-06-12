let addbtn = document.querySelector('.add-btn');
let removebtn = document.querySelector('.remove-btn')
let modalCont = document.querySelector('.modal-cont');
let maincont = document.querySelector('.main-cont');
let textareaCont = document.querySelector('.textarea-cont');
let allPriorityColors  = document.querySelectorAll('.priority-color');  
let toolBoxColors = document.querySelectorAll(".color");



let colors = ["lightpink","lightblue",'lightgreen',"black"]
let modalPriorityColor = colors[colors.length-1];

let addFlag = false;
let removeFlag = false;

let lockClass  = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

if(localStorage.getItem("Jira_Tickets")){
  // Retrieve and display tickets
  ticketsArr = JSON.parse(localStorage.getItem("Jira_Tickets"));
  ticketsArr.forEach((ticketObj) => {
    createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
  })
}

for(let i = 0 ; i<toolBoxColors.length ;i++){
  toolBoxColors[i].addEventListener("click",(e) => {
    let currentToolBoxColor = toolBoxColors[i].classList[0];

    let filteredTickers = ticketsArr.filter((ticketObj,idx)=>{
       return currentToolBoxColor === ticketObj.ticketColor;
    });
  
    // Remove previous tickets
    let allTicketsCont = document.querySelectorAll(".ticket-cont");
    for(let i = 0; i <allTicketsCont.length ;i++){
       allTicketsCont[i].remove(); 
    }
    console.log("filtered",filteredTickers);
    // Display New Filtered Ticekts
    filteredTickers.forEach((ticketObj,idx) =>{
       createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
    });
  
  });
  toolBoxColors[i].addEventListener("dbclick",(e) => {  
    // Remove previous tickets
    let allTicketsCont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allTicketsCont.length; i++) {
      allTicketsCont[i].remove();
    } 

    ticketsArr.forEach((ticketObj, idx) => {
      createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    });

  });

}



//lISTENER FOR MODAL PRIORITY COLORING
allPriorityColors.forEach((colorElem,idx)=>{
    colorElem.addEventListener('click',(e) =>{
      allPriorityColors.forEach((priorityColorElem, idx) =>{
        priorityColorElem.classList.remove('border');
      })
      colorElem.classList.add('border');

      modalPriorityColor = colorElem.classList[0];
    });
}); 





addbtn.addEventListener('click', (e)=> {
  // create a display modal



  // Addflag is True then modal is displayed

  // Addflag is False then modal is hidden
  addFlag = !addFlag; // toggle the flag it will be true or false u can check it in console
  // console.log(addFlag);
    if(addFlag){
        modalCont.style.display = 'flex';}
    else{
        modalCont.style.display = 'none';
    }


});

removebtn.addEventListener('click',(e) => {
  removeFlag = !removeFlag;
  

})



modalCont.addEventListener('keydown', (e)=> {
  let key = e.key;
  if(key === "Shift"){
    createTicket(modalPriorityColor,textareaCont.value);
    addFlag = false;
    setModalToDefault();
    


  }
})

function createTicket(ticketColor,ticketTask,ticketID){
  let id  = ticketID || shortid();
  let ticketCont = document.createElement('div');
  ticketCont.setAttribute('class', 'ticket-cont');  
  ticketCont.innerHTML = `
             <div class="ticket-color ${ticketColor}"></div>
             <div class="ticket-id ">#${id}</div>
             <div class="task-area">${ticketTask}</div>
             <div class="ticket-lock">
                 <i class="fa-solid fa-lock"></i>
            </div>

  `;

  maincont.appendChild(ticketCont);


  // create an object and add to an array
  if(!ticketID){
      ticketsArr.push({ticketColor,ticketTask,ticketID: id});
      localStorage.setItem("Jira_Tickets",JSON.stringify(ticketsArr));
  }
  handleRemoval(ticketCont,id);
  handleLock(ticketCont,id);
  handleColor(ticketCont,id);
}


function handleRemoval(ticket,id){
  // removalFlag only if its true if its true remove it
  ticket.addEventListener("click",(e)=>{

 
    if(!removeFlag) return ;
    
    let idx = getTicketIdx(id);

    //DB removal 
    ticketsArr.splice(idx,1);
    let strTicketsArr = JSON.stringify("Jira_tickets",strTicketsArr);
    localStorage.setItem("Jira_Tickets",strTicketsArr);



    ticket.remove(); // UI removal
    
  })
}

function handleLock(ticket,id){
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketlock = ticketLockElem.children[0]; 
  let ticketTaskArea = ticket.querySelector('.task-area');
  ticketlock.addEventListener('click',(e) =>{
    let ticketIdx = getTicketIdx(id);
       if (ticketlock.classList.contains(lockClass)) {
          ticketlock.classList.remove(lockClass);
          ticketlock.classList.add(unlockClass);
          ticketTaskArea.setAttribute("contenteditable","true");

       }
       else{
         ticketlock.classList.remove(unlockClass);
         ticketlock.classList.add(lockClass);
         ticketTaskArea.setAttribute('contenteditable','false');
       }
       //Modify data in local storage (Ticket task)
       ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innertext;
       localStorage.setItem("Jira_Tickets",JSON.stringify(ticketsArr));

  })

}

function handleColor(ticket,id){
  let ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click",(e) => {
    //Get ticketidx from ticket array
    let ticketIdx  = getTicketIdx(id);

    let currentTicketColor = ticketColor.classList[1];
    // get ticket color idx
    let currentTicketColorIdx  = colors.findIndex((color) =>{
      return currentTicketColor === color;
    });
    console.log(currentTicketColor,currentTicketColorIdx);
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);
    // modify data in local storage (priority Color change)
    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    localStorage.setItem("Jira_Tickets",JSON.stringify(ticketsArr)); 
  })
}
function getTicketIdx(id){
  let ticketIdx = ticketsArr.findIndex((ticketObj)=>{
    return ticketObj.ticketColor === id;
  })
  return ticketIdx;
}

function setModalToDefault(){
  modalCont.style.display = 'none';
  textareaCont.value = "";
  modalPriorityColor  = colors[colors.length-1];
  allPriorityColors.forEach((priorityColorElem, idx) => {
    priorityColorElem.classList.remove('border');
  });
  allPriorityColors[allPriorityColors.length-1].classList.add('border');
}
