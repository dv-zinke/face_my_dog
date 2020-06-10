var dogData;
var isLoad;

$(document).ready(function(){
    getDogData();
});
function getDogData(){
    $.getJSON("assets/data.json", function(json) {
        isLoad=true;
        dogData=json;
    });
}

function readURL(input) {
    if (input.files && input.fils[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.image-upload-wrap').hide();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
        init().then(function(){
            predict();
        });

    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function() {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function() {
    $('.image-upload-wrap').removeClass('image-dropping');
});

const URL = "model/";
let model, webcam, labelContainer, maxPredictions;
// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();


    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function predict() {
    var image = document.getElementById("face-image");
    const prediction = await model.predict(image, false);
    prediction.sort(function(a,b){
        return numberTo(b.probability) - numberTo(a.probability);
    });
    for (let i = 0; i < 3; i++) {
        const select = prediction[i].className.toLowerCase().trim();
        const classPrediction =
            dogData[select].name + "<br>"+
            "<img src='"+dogData[select].url + "' class='dog-image'>" +
            (prediction[i].probability * 100).toFixed(0) +  "%<br>"+dogData[select].detail
            ;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function numberTo(num){
    return (num * 100).toFixed(0)
}

