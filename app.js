const apiUrl = "https://sj-sam.de/apps/geburtstagsliste/";

const frmEntry = document.getElementById("frmEntry");
const frmLogIn = document.getElementById("frmLogIn");
const frmSignIn = document.getElementById("frmSignIn");
const tblList = document.getElementById("tblList");
const btnLogout = document.getElementById("btnLogout");
const btnLogin = document.getElementById("btnLogin");
const btnSignin = document.getElementById("btnSignin");
const btnNewEntry = document.getElementById("btnNewEntry");
const lblUsername = document.getElementById("lblUsername");



frmSignIn.addEventListener("submit",function(ev){
  ev.preventDefault();
  createUser();
});
frmSignIn.addEventListener("reset",function(ev){
  ev.preventDefault();
  hideSignInForm();
});

frmLogIn.addEventListener("submit",function(ev){
  ev.preventDefault();
  userLogin();
});
frmLogIn.addEventListener("reset",function(ev){
  ev.preventDefault();
  hideLoginForm();
});

frmEntry.addEventListener("submit",function(ev){
  ev.preventDefault();
  createEntry();
});

frmEntry.addEventListener("reset",function(ev){
  ev.preventDefault();
  hideEntryForm();
});

btnLogout.addEventListener("click", function(ev){
  userLogout();
})

btnLogin.addEventListener("click", function(ev){
  showLoginForm();
})

btnSignin.addEventListener("click", function(ev){
  console.log("hide Form");
  showSignInForm();
})
btnNewEntry.addEventListener("click", function(ev){
  console.log("hide Form");
  newEntry();
})


function showLoginForm(){
  frmLogIn.classList.add('show')
}

function hideLoginForm(){
  frmLogIn.classList.remove('show');
}

function showEntryForm(){
  frmEntry.classList.add('show');
}

function hideEntryForm(){
  frmEntry.classList.remove('show');
}

function showSignInForm(){
  frmSignIn.classList.add('show');
}

function hideSignInForm(){
  frmSignIn.classList.remove('show');
}




async function createUser(){
  const route = apiUrl + "user.php";
  const formData = new FormData(frmSignIn);
  formData.append('action', 'create');
  const response = await fetch(route,
  {
      body: formData,
      method: "post"
  });
  const user = await response.json();
  localStorage.setItem('username', user.name);
  localStorage.setItem('userid', user.id);
  frmSignIn.reset();
  init();
}

async function createEntry(){
  const route = apiUrl + "entries.php";
  const formData = new FormData(frmEntry);
  let userid = localStorage.getItem("userid");
  formData.append('action', 'create');
  formData.append('userid', userid);
  const response = await fetch(route, {
      body: formData,
      method: "post"
  });
  await init();
  frmEntry.reset();
}

async function userLogin(){
  const route = apiUrl + "user.php";
  const formData = new FormData(frmLogIn);
  formData.append('action', 'login');
  const response = await fetch(route,
  {
      body: formData,
      method: "post"
  });
  const user = await response.json();
  if(user.name == "NULL"){
    alert("wrong!!");
  }else{
    localStorage.setItem('username', user.name);
    localStorage.setItem('userid', user.id);
  }
  frmLogIn.reset();
  hideLoginForm();
  init();
}

function userLogout(){
  localStorage.removeItem('username');
  localStorage.removeItem('userid');
  init();
}

function newEntry(){
  showEntryForm();
}

async function deleteEntry(id){
  const route = `${apiUrl}entries.php?action=delete&id=${id}`
  const response = await fetch(route);
  const json = await response.json();
  init();

}
async function drawEntries(userid){
  tblList.innerHTML = "";
  const route = `${apiUrl}entries.php?action=get&userid=${userid}`
  const response = await fetch(route);
  const json = await response.json();
  json.forEach(el => {
    let tr = document.createElement('tr');
    tr.innerHTML = `<tr><td>${el.dd}.${el.mm}. 
    </td><td>${el.text}</td> 
    <td> <button onclick="deleteEntry(${el.id})"><img src="icons/delete_12.png"></button></td></tr> `;
    tblList.appendChild(tr);
  });

}
async function init(){
  
  if(localStorage.getItem('username')){
    //user IS logged in-----------------------------
    lblUsername.innerHTML=localStorage.getItem('username');
    btnLogout.style.display = "inline";
    btnLogin.style.display = "none";
    btnSignin.style.display = "none";
    btnNewEntry.style.display ="inline";
    const userid = localStorage.getItem("userid");
    drawEntries(userid);
    //--------------------------------------------
  }else{
    //user IS NOT logged in------------------------------
    lblUsername.innerHTML="";
    btnLogout.style.display = "none";
    btnLogin.style.display = "inline";
    btnSignin.style.display = "inline";
    btnNewEntry.style.display ="none";
    tblList.innerHTML = "";
    //-------------------------------------------------------
  }
}


init();