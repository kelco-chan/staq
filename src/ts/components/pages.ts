window.addEventListener("hashchange", function(){
    const currentActivePage = document.querySelector(".pages > div.active");
    const newActivePage = document.querySelector(location.hash);
    const oldLink = document.querySelector(".nav > a.link.active");
    const newLink = document.querySelector(`a[href$="${location.hash}"]`);
    currentActivePage.classList.remove("active");
    newActivePage.classList.add("active");
    oldLink.classList.remove("active");
    newLink.classList.add("active")
})