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

frmLogIn.addEventListener("submit",function(ev){
  ev.preventDefault();
  userLogin();
});

frmEntry.addEventListener("submit",function(ev){
  ev.preventDefault();
  createEntry();
});

frmEntry.addEventListener("reset",function(ev){
  ev.preventDefault();
  alert("abbruch");
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
  frmLogIn.classList.remove('show')
}

function showEntryForm(){
  frmEntry.classList.add('show')
}

function hideEntryForm(){
  frmEntry.classList.remove('show')
}

function showSignInForm(){
  frmSignIn.classList.add('show')
}

function hideSignInForm(){
  frmSignIn.classList.remove('show')
}

function displayUsername(){
  let username = localStorage.getItem('username');
  if(username == "NULL"){
    lblUsername.innerHTML="nobody";
  }else{
    lblUsername.innerHTML = username;
  }
}


async function createUser(){
  const apiurl = "user.php";
  const formData = new FormData(frmSignIn);
  formData.append('action', 'create');
  const response = await fetch(apiurl,
  {
      body: formData,
      method: "post"
  });
  const user = await response.json();
  localStorage.setItem('username', user.name);
  localStorage.setItem('userid', user.id);
  frmSignIn.reset();
  displayUsername();
}

async function createEntry(){
  const apiurl = "entries.php";
  const formData = new FormData(frmEntry);
  let userid = localStorage.getItem("userid");
  formData.append('action', 'create');
  formData.append('userid', userid);
  const response = await fetch(apiurl, {
      body: formData,
      method: "post"
  });
  await init();
  frmEntry.reset();
}

async function userLogin(){
  const apiurl = "user.php";
  const formData = new FormData(frmLogIn);
  formData.append('action', 'login');
  const response = await fetch(apiurl,
  {
      body: formData,
      method: "post"
  });
  const user = await response.json();
  if(user.name == "NULL"){
    alert("wrong");
  }else{
    localStorage.setItem('username', user.name);
    localStorage.setItem('userid', user.id);
  }
  frmLogIn.reset();
  hideLoginForm();
  displayUsername();
  init();
}

function userLogout(){
  localStorage.removeItem('username');
  localStorage.removeItem('userid');
  displayUsername();
  init();
}

async function init(){
  displayUsername();
  if(localStorage.getItem("username") != "NULL"){
    let userid = localStorage.getItem("userid");
    tblList.innerHTML = "";
    const response = await fetch(`entries.php?action=get&userid=${userid}`);
    const json = await response.json();
    json.forEach(el => {
      let tr = document.createElement('tr');
      tr.innerHTML = `<tr><td>${el.dd}.${el.mm}. ${el.text}</td> <td><button>edit</button></td><td> <button>delete</button></td></tr> `;
      tblList.appendChild(tr);
    });
  }
}
init();