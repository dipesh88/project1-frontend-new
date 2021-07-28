function showModal() {  //Open the upload box
    var modal = document.getElementById('modal');
    var overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'block';
    modal.style.display = 'block';
}
function closeModal() {  //Close the upload box
    var modal = document.getElementById('modal');
    var overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'none';
    modal.style.display = 'none';
}
//Add Events to the Fork and Black Mask Layer in the Upper Right corner with DOM2 Level Method: Close Upload Box after Clicking
document.getElementsByClassName('overlay')[0].addEventListener('click', closeModal, false);
document.getElementById('close').addEventListener('click', closeModal, false);

//Using the html5 FormData() API, create an object that receives files, because it can be dragged and dropped many times. Here we use the singleton mode to create object Dragfiles.
var Dragfiles=(function (){
    var instance;
    return function(){
        if(!instance){
            instance = new FormData();
        }
        return instance;
    }
}());
//Add a way to empty all files for Dragfiles
FormData.prototype.deleteAll=function () {
    var _this=this;
    this.forEach(function(value,key){
        _this.delete(key);
    })
}

//Add drag events
var dz = document.getElementById('content');
dz.ondragover = function (ev) {
    //Prevent browsers from opening files by default
    ev.preventDefault();
    //Drag the file and the border turns red
    this.style.borderColor = 'red';
}

dz.ondragleave = function () {
    //Restore border color
    this.style.borderColor = 'gray';
}
dz.ondrop = function (ev) {
    //Restore border color
    this.style.borderColor = 'gray';
    //Prevent browsers from opening files by default
    ev.preventDefault();
    var files = ev.dataTransfer.files;
    var len=files.length,
        i=0;
    var frag=document.createDocumentFragment();  //In order to reduce the frequency of js modifying dom tree, first create a fragment, and then operate in the fragment
    var tr,time,size;
    var newForm=Dragfiles(); //Getting singletons
    var it=newForm.entries(); //Create an iterator for testing
    while(i<len){
        tr=document.createElement('tr');
        //Get file size
        size=Math.round(files[i].size * 100 / 1024) / 100 + 'KB';
        //Get the formatting modification time
        time = files[i].lastModifiedDate.toLocaleDateString() + ' '+files[i].lastModifiedDate.toTimeString().split(' ')[0];
        tr.innerHTML='<td>'+files[i].name+'</td><td>'+time+'</td><td>'+size+'</td><td>delete</td>';
        console.log(size+' '+time);
        frag.appendChild(tr);
        //Add files to newForm
        newForm.append(files[i].name,files[i]);
        //console.log(it.next());
        i++;
    }
    this.childNodes[1].childNodes[1].appendChild(frag);
    //Why is it `1'? Almost everything in a document is a node, and even spaces and newline characters are interpreted as nodes. And they are all included in the array returned by the child Nodes attribute. Unlike the jade template
}
function blink()
{
  document.getElementById('content').style.borderColor = 'gray';
}

//ajax upload file
function upload(){
    if(document.getElementsByTagName('tbody')[0].hasChildNodes()==false){
        document.getElementById('content').style.borderColor = 'red';
        setTimeout(blink,200);
        return false;
    }
    var data=Dragfiles(); //Get formData
    $.ajax({
        url: 'upload',
        type: 'POST',
        data: data,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('succeed!')  //Can be replaced by your own method
            closeModal();
            data.deleteAll(); //Clear formData
            $('.tbody').empty(); //clear list
        },
        error: function (returndata) {
            alert('failed!')  //Can be replaced by your own method
        }
    });
}
// Add click events for deletion by event delegation, using on Method in jquery
$(".tbody").on('click','tr td:last-child',function(){
    //Delete existing files in drag-and-drop boxes
    var temp=Dragfiles();
    var key=$(this).prev().prev().prev().text();
    console.log(key);
    temp.delete(key);
    $(this).parent().remove();
});
//Clear everything up
function clearAll(){
    if(document.getElementsByTagName('tbody')[0].hasChildNodes()==false){
        document.getElementById('content').style.borderColor = 'red';
        setTimeout(blink,300);
        return false;
    }
    var data=Dragfiles(); 
    data.deleteAll(); //Clear formData
    //$('. tbody').empty(); equivalent to the following method
    document.getElementsByTagName('tbody')[0].innerHTML='';
}