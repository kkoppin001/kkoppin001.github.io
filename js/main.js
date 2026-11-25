/* ====================================== */
/* Hamburger Navigation                   */
/* ====================================== */

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
        if (
            event.key === "Escape" &&
            navLinks.classList.contains("active")
        ) {
            setMenu(false);
            menuToggle.focus();
        }
    });

    window.matchMedia("(max-width: 768px)")
        .addEventListener("change", () => {
            setMenu(false);
        });

}


/* ====================================== */
/* Project Image Gallery                  */
/* ====================================== */

const galleryModal = document.getElementById("project-gallery");

if (galleryModal) {

    /* Gallery Elements */

    const galleryTriggers = document.querySelectorAll(
        ".project-gallery-trigger"
    );

    const galleryImage = document.getElementById("gallery-image");
    const galleryTitle = document.getElementById("gallery-title");
    const galleryDescription = document.getElementById("gallery-description");
    const gallerySkills = document.getElementById("gallery-skills");
    const galleryGithub = document.getElementById("gallery-github");

    const galleryClose = document.getElementById("gallery-close");
    const galleryPrev = document.getElementById("gallery-prev");
    const galleryNext = document.getElementById("gallery-next");

    const galleryCounter = document.getElementById("gallery-counter");
    const galleryThumbnails = document.getElementById("gallery-thumbnails");


    /* Gallery State */

    let currentImages = [];
    let currentIndex = 0;
    let currentProject = "";
    let activeTrigger = null;


    /* ====================================== */
    /* Update Active Image                    */
    /* ====================================== */

    function updateGallery() {

        if (currentImages.length === 0) {
            return;
        }

        galleryImage.src = currentImages[currentIndex];

        galleryImage.alt =
            `${currentProject} — Image ${currentIndex + 1}`;

        galleryCounter.textContent =
            `${currentIndex + 1} / ${currentImages.length}`;

        const hasMultipleImages = currentImages.length > 1;

        galleryPrev.hidden = !hasMultipleImages;
        galleryNext.hidden = !hasMultipleImages;
        galleryCounter.hidden = !hasMultipleImages;
        galleryThumbnails.hidden = !hasMultipleImages;

        galleryThumbnails
            .querySelectorAll(".gallery-thumbnail")
            .forEach((thumbnail, index) => {

                const isActive = index === currentIndex;

                thumbnail.classList.toggle("active", isActive);

                thumbnail.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

    }


    /* ====================================== */
    /* Create Image Thumbnails                */
    /* ====================================== */

    function createThumbnails() {

        galleryThumbnails.replaceChildren();

        if (currentImages.length <= 1) {
            return;
        }

        currentImages.forEach((imagePath, index) => {

            const thumbnail = document.createElement("button");

            thumbnail.className = "gallery-thumbnail";
            thumbnail.type = "button";

            thumbnail.setAttribute(
                "aria-label",
                `View image ${index + 1}`
            );

            const image = document.createElement("img");

            image.src = imagePath;
            image.alt = "";

            thumbnail.appendChild(image);

            thumbnail.addEventListener("click", () => {
                currentIndex = index;
                updateGallery();
            });

            galleryThumbnails.appendChild(thumbnail);

        });

    }


    /* ====================================== */
    /* Open Project Gallery                   */
    /* ====================================== */

    function openGallery(trigger) {

        const projectCard = trigger.closest(".project-card");

        if (!projectCard) {
            return;
        }

        try {
            currentImages = JSON.parse(trigger.dataset.images);
        } catch (error) {
            console.error("Unable to load project gallery:", error);
            return;
        }

        if (!Array.isArray(currentImages) || currentImages.length === 0) {
            return;
        }

        currentIndex = 0;
        activeTrigger = trigger;


        /* Project Information */

        const title = projectCard.querySelector(".project-content h2");

        const description = projectCard.querySelector(
            ".project-content > p:not(.project-role)"
        );

        const skills = projectCard.querySelectorAll(
            ".project-content .skill-tags span"
        );

        const githubLink = projectCard.querySelector(
            ".project-actions a"
        );


        /* Project Title */

        currentProject = title.textContent.trim();

        galleryTitle.textContent = currentProject;


        /* Project Description */

        galleryDescription.textContent =
            description ? description.textContent.trim() : "";


        /* Technology Tags */

        gallerySkills.replaceChildren();

        skills.forEach((skill) => {

            const tag = document.createElement("span");

            tag.textContent = skill.textContent.trim();

            gallerySkills.appendChild(tag);

        });


        /* GitHub Link */

        if (githubLink) {

            galleryGithub.href = githubLink.href;
            galleryGithub.hidden = false;

        } else {

            galleryGithub.removeAttribute("href");
            galleryGithub.hidden = true;

        }


        /* Prepare Gallery */

        createThumbnails();
        updateGallery();


        /* Display Modal */

        galleryModal.showModal();

        document.body.classList.add("gallery-open");

        galleryModal.scrollTop = 0;

        galleryClose.focus();

    }


    /* ====================================== */
    /* Close Project Gallery                  */
    /* ====================================== */

    function closeGallery() {

        if (galleryModal.open) {
            galleryModal.close();
        }

    }

    galleryModal.addEventListener("close", () => {

        document.body.classList.remove("gallery-open");

        if (activeTrigger) {
            activeTrigger.focus();
        }

        activeTrigger = null;

    });


    /* ====================================== */
    /* Previous Image                         */
    /* ====================================== */

    function previousImage() {

        if (currentImages.length <= 1) {
            return;
        }

        currentIndex =
            (currentIndex - 1 + currentImages.length) %
            currentImages.length;

        updateGallery();

    }


    /* ====================================== */
    /* Next Image                             */
    /* ====================================== */

    function nextImage() {

        if (currentImages.length <= 1) {
            return;
        }

        currentIndex =
            (currentIndex + 1) % currentImages.length;

        updateGallery();

    }


    /* ====================================== */
    /* Event Listeners                        */
    /* ====================================== */

    galleryTriggers.forEach((trigger) => {

        trigger.addEventListener("click", () => {
            openGallery(trigger);
        });

    });

    galleryClose.addEventListener("click", closeGallery);

    galleryPrev.addEventListener("click", previousImage);

    galleryNext.addEventListener("click", nextImage);


    /* Close When Clicking Outside Modal */

    galleryModal.addEventListener("click", (event) => {

        if (event.target === galleryModal) {

            const bounds = galleryModal.getBoundingClientRect();

            const outside =
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom;

            if (outside) {
                closeGallery();
            }

        }

    });


    /* Keyboard Navigation */

    galleryModal.addEventListener("keydown", (event) => {

        if (!galleryModal.open) {
            return;
        }

        if (event.key === "ArrowLeft") {

            event.preventDefault();
            previousImage();

        }

        if (event.key === "ArrowRight") {

            event.preventDefault();
            nextImage();

        }

    });


    /* Escape Key */

    galleryModal.addEventListener("cancel", (event) => {

        event.preventDefault();
        closeGallery();

    });

}