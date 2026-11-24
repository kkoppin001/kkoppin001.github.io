/* ==============================
   Mobile Navigation
   ============================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    function setMenu(open) {
        menuToggle.classList.toggle("active", open);
        navLinks.classList.toggle("active", open);

        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
    }

    menuToggle.addEventListener("click", () => {
        setMenu(!navLinks.classList.contains("active"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenu(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" &&
            navLinks.classList.contains("active")) {
            setMenu(false);
            menuToggle.focus();
        }
    });

    window.matchMedia("(max-width: 768px)")
        .addEventListener("change", () => {
            setMenu(false);
        });
}