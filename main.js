document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("project-scroll-button").addEventListener("click", function () {
        document.getElementById("project-section").scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    });
});