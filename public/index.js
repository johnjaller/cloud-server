$.get("/data").done(function (data) {
  let cloudData = JSON.parse(data);
  console.log(cloudData);
  console.log(cloudData.fileList);
  console.log(cloudData.fileSize);
  let fileList;
  for (let i = 0; i < cloudData.fileList.length; i++) {
    $(".cloud-items").append(
      `<tr><td>${i + 1}</td><td id="${
        i + 1
      }" class="cloud-data position-relative"><a href="/upload/${cloudData.fileList[i]}">${
        cloudData.fileList[i]
      }</a></td><td>${cloudData.fileSize[i]}</td><td>${cloudData.lastModified[i]}</td><td><button class="btn btn-success my-1 mx-1 px-2" onclick="renameThis(this)"><i class="fas fa-edit mx-1"></i>rename</button><button class="my-1 mx-2 btn btn-danger delete" onclick="deleteThis(this)" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-trash-alt mx-1"></i>Delete</button></td></tr>`
    );
  }
});
function deleteThis(element) {
  let delItem = $(element).parent().parent().find(".cloud-data").text();
  $(".modal-title").html(delItem);
}
function showUpload(){
  $(".upload").slideToggle()
  if($(".btn-upload").html()===`<i class="fas fa-plus-circle mx-1"></i>Upload`){
    $(".btn-upload").html(`<i class="far fa-times-circle"></i>Dismiss`)
  }else{
    $(".btn-upload").html(`<i class="fas fa-plus-circle mx-1"></i>Upload`);
  }
  $(".btn-upload").toggleClass("btn-success");
  $(".btn-upload").toggleClass("btn-secondary");
}

function sendDelReq(){
  let deleteTarget=$(".modal-title").text();
  window.location.href="/delete/"+deleteTarget
}

function hideRename(){
  $(".original-name").val("");
$(".new-name").val("");
  $(".rename-text").hide();

}
function renameThis(element) {
  let renameCol = $(element).parent().parent().find(".cloud-data");
  let renameItem = $(element).parent().parent().find(".cloud-data").text();
  console.log(renameItem)
  $(".rename-text").show()
  $(".rename-text").css("visibility","visible")
$(renameCol).append($(".rename-text"));
$(".original-name").val(renameItem);
$(".new-name").val(renameItem);
}