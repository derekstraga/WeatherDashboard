// Activate Carousel
$("#carouselIndicatorsDiv").carousel();
    
// Enable Carousel Indicators
$(".carousel-indicators li[data-slide-to=0]").click(function(){
    $("#carouselIndicatorsDiv").carousel(0);
});
$(".carousel-indicators li[data-slide-to=1]").click(function(){
    $("#carouselIndicatorsDiv").carousel(1);
});
$(".carousel-indicators li[data-slide-to=2]").click(function(){
    $("#carouselIndicatorsDiv").carousel(2);
});
$(".carousel-indicators li[data-slide-to=3]").click(function(){
    $("#carouselIndicatorsDiv").carousel(3);
});
$(".carousel-indicators li[data-slide-to=4]").click(function(){
    $("#carouselIndicatorsDiv").carousel(4);
});
    

// Enable Carousel Controls
$(".carousel-control-prev").click(function(){
$("#carouselIndicatorsDiv").carousel("prev");
});
$(".carousel-control-next").click(function(){
$("#carouselIndicatorsDiv").carousel("next");
});