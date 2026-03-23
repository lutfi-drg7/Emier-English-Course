let editId = null;

db.collection("registration")
.orderBy("time","desc")
.onSnapshot((snap)=>{

let html="";

snap.forEach(doc=>{

let d = doc.data();

html += `

<tr>

<td>${d.nama}</td>
<td>${d.program}</td>
<td>${d.hp}</td>
<td>${d.tanggal}</td>

<td>

<button class="btn"
onclick="showDetail('${doc.id}')">
Detail
</button>

<button class="delete-btn"
onclick="deleteData('${doc.id}')">
Delete
</button>

</td>

</tr>

`;

});

document.getElementById("data").innerHTML = html;

});

async function addNews(){

const title = document.getElementById("title").value;
const desc = document.getElementById("desc").value;

const fileInput = document.getElementById("photo");
const file = fileInput.files[0];

let url = null;

try{

// ===== kalau pilih foto =====

if(file){

const formData = new FormData();

formData.append("file", file);

formData.append(
"upload_preset",
"emier_news"
);

const res = await fetch(
"https://api.cloudinary.com/v1_1/drcbakrx4/image/upload",
{
method:"POST",
body:formData
}
);

const data = await res.json();

url = data.secure_url;

}


// ===== EDIT MODE =====

if(editId){

let updateData = {

title:title,
desc:desc

};

if(url){
updateData.image = url;
}

await db.collection("news")
.doc(editId)
.update(updateData);

editId = null;

document.getElementById("newsBtn").innerText = "Upload News";

document.getElementById("title").value = "";
document.getElementById("desc").value = "";
document.getElementById("photo").value = "";

alert("News updated");

return;

}


// ===== ADD MODE =====

if(!url){

alert("Pilih foto dulu");
return;

}

await db.collection("news").add({

title:title,
desc:desc,
image:url,
time:new Date()

});

alert("News berhasil");

}catch(err){

console.log(err);
alert("Error upload");

}

}

let newsData = {}

db.collection("news")
.orderBy("time","desc")
.onSnapshot((snap)=>{

let html="";

snap.forEach(doc=>{

let d = doc.data();

newsData[doc.id] = d.desc

let tgl = "";

if(d.time){

tgl = new Date(d.time?.seconds * 1000)
.toLocaleDateString("id-ID",{
day:"numeric",
month:"long",
year:"numeric"
});

}

html += `

<div class="news-card">

<img src="${d.image}">

<h3>${d.title}</h3>

<p id="desc-${doc.id}">
${shortText(d.desc,120)}
</p>

<button class="btn"
id="btn-${doc.id}"
onclick="toggleText('${doc.id}')">
Detail
</button>

<button class="btn"
onclick="editNews('${doc.id}')">
Edit
</button>

<button class="delete-btn"
onclick="deleteNews('${doc.id}')">

Hapus

</button>

</div>

`;
});

newsList.innerHTML = html;

});

function previewImage(event){

const file = event.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

const img = document.getElementById("preview");

img.src = e.target.result;

img.style.display = "block";

};

reader.readAsDataURL(file);

}

function deleteNews(id){

if(confirm("Hapus news?")){

db.collection("news")
.doc(id)
.delete();

}

}

function showDetail(id){

db.collection("registration")
.doc(id)
.get()
.then(doc=>{

let d = doc.data();

let html = `

<div class="admin-box detail-card">

<h3>Detail Siswa</h3>

<div class="detail-grid">

<p><b>Nama</b><br>${d.nama}</p>
<p><b>Lahir</b><br>${d.lahir}</p>
<p><b>Gender</b><br>${d.gender}</p>
<p><b>Asal Sekolah</b><br>${d.sekolah}</p>
<p><b>Kelas</b><br>${d.kelas}</p>
<p><b>Alamat</b><br>${d.alamat}</p>
<p><b>HP</b><br>${d.hp}</p>
<p><b>Wali Murid</b><br>${d.ortu}</p>
<p><b>Program</b><br>${d.program}</p>
<p><b>Periode Pembayaran</b><br>${d.periode}</p>
<p><b>Tanggal</b><br>${d.tanggal}</p>

</div>

</div>

`;

detailBox.innerHTML = html;

});

}
function deleteData(id){
if(!auth.currentUser){
    alert("Anda tidak punya akses login");
    return;
  }
  if(confirm("Hapus data?")){
    db.collection("registration").doc(id).delete();
  }

}

function clearAll(){
if(!auth.currentUser){
    alert("Anda tidak punya akses login");
    return;
  }
if(confirm("Hapus semua data?")){

db.collection("registration")
.get()
.then(snap=>{

snap.forEach(doc=>{

doc.ref.delete();

});

});

}

}

function exportCSV(){
if(!auth.currentUser){
    alert("Anda tidak punya akses login");
    return;
  }
db.collection("registration")
.get()
.then(snap=>{

let csv =
"Nama,Program,HP,Tanggal\n";

snap.forEach(doc=>{

let d = doc.data();

csv +=
`${d.nama},${d.program},${d.hp},${d.tanggal}\n`;

});

let blob =
new Blob([csv],
{type:"text/csv"});

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"data.csv";

a.click();

});

}

function logout(){
  firebase.auth().signOut().then(()=>{
    window.location.href = "login.html";
  });
}

function editNews(id){

editId = id;

db.collection("news")
.doc(id)
.get()
.then(doc=>{

let d = doc.data();

document.getElementById("title").value = d.title;
document.getElementById("desc").value = d.desc;

document.getElementById("newsBtn").innerText = "Update News";

window.scrollTo(0,0);

});

}

function addSchedule(){

let day = dayEl("day")
let time = dayEl("time")
let student = dayEl("student")
let lesson = dayEl("lesson")
let teacher = dayEl("teacher")

if(!day || !time || !lesson || !teacher || !student){
alert("Lengkapi dulu")
return
}

let data = {

day,
time,
student,
lesson,
teacher,
created: Date.now()

}


if(editScheduleId){

db.collection("schedule")
.doc(editScheduleId)
.update(data)
.then(()=>{

editScheduleId = null

showMsg()

})

}else{

db.collection("schedule")
.add(data)
.then(()=>{

showMsg()

})

}

document.getElementById("student").value=""

}


function showMsg(){

let msg = document.getElementById("scheduleMsg")

msg.innerText = "✔ Saved"

setTimeout(()=>{
msg.innerText=""
},1500)

}


function dayEl(id){
return document.getElementById(id).value
}

let orderDay = {
Monday:1,
Tuesday:2,
Wednesday:3,
Thursday:4,
Friday:5,
Saturday:6
}

let orderTime = {
"09.00 - 10.00":1,
"10.00 - 11.00":2,
"11.00 - 12.00":3,
"13.00 - 14.00":4,
"14.00 - 15.00":5,
"15.00 - 16.00":6,
"16.00 - 17.00":7,
"17.00 - 18.00":8,
"19.00 - 20.00":9,
"20.00 - 21.00":10
}

let editScheduleId = null

let scheduleData = []

db.collection("schedule")
.onSnapshot(snap=>{

scheduleData = []

snap.forEach(doc=>{

scheduleData.push({
id:doc.id,
...doc.data()
})

})

scheduleData.sort((a,b)=>{

let d = orderDay[a.day] - orderDay[b.day]

if(d !== 0) return d

return orderTime[a.time] - orderTime[b.time]

})

renderSchedule()

})



function renderSchedule(){

let searchInput = document.getElementById("scheduleSearch")

let s = ""

if(searchInput){
s = searchInput.value.toLowerCase()
}

let html = ""

scheduleData.forEach(d=>{

let text =
(d.day +
d.time +
d.student +
d.lesson +
d.teacher).toLowerCase()

if(!text.includes(s)) return

html += `

<tr>

<td>${d.day}</td>
<td>${d.time}</td>
<td>${d.student.replace(/\n/g,"<br>")}</td>
<td>${d.lesson}</td>
<td>${d.teacher}</td>

<td>

<button
class="edit-btn"
onclick="editSchedule('${d.id}')">
Edit
</button>

<button
class="delete-btn"
onclick="deleteSchedule('${d.id}')">
Delete
</button>

</td>

</tr>

`

})

document.getElementById("scheduleList").innerHTML = html

}



document.addEventListener("input",(e)=>{

if(e.target.id === "scheduleSearch"){
renderSchedule()
}

})



function deleteSchedule(id){

if(!confirm("Hapus schedule?")) return

db.collection("schedule")
.doc(id)
.delete()

}



function editSchedule(id){

db.collection("schedule")
.doc(id)
.get()
.then(doc=>{

let d = doc.data()

day.value = d.day
time.value = d.time
student.value = d.student
lesson.value = d.lesson
teacher.value = d.teacher

editScheduleId = id

})

}

function shortText(text,max){

if(!text) return ""

if(text.length <= max) return text

return text.substring(0,max) + "..."

}

let openedText = {}

function toggleText(id){

let full = newsData[id]

let el = document.getElementById("desc-"+id)
let btn = document.getElementById("btn-"+id)

if(openedText[id]){

el.innerText = shortText(full,120)
btn.innerText = "Detail"

openedText[id] = false

}else{

el.innerText = full
btn.innerText = "Hide"

openedText[id] = true

}

}

let newsOpen = true

function toggleNews(){

let list = document.getElementById("newsList")
let arrow = document.getElementById("newsToggle")

if(newsOpen){

list.style.display = "none"
arrow.innerText = "⯈"

newsOpen = false

}else{

list.style.display = "block"
arrow.innerText = "⯆"

newsOpen = true

}

}