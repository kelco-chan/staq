document.querySelectorAll(".draggable-box").forEach(function(box){
    let dragging = false;
    box.addEventListener("mousedown", function(){
        dragging = true;
    })
    document.addEventListener("mousemove", function(e: PointerEvent){
        if(dragging){
            (box as HTMLDivElement).style.left = e.pageX + 'px';
            (box as HTMLDivElement).style.top = e.pageY + 'px';
        }
    })
    document.addEventListener("mouseup", function(){
        dragging = false;
    })
})