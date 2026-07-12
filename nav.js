
/* ===== Page definitions ===== */

const pages = [
    { id: "about", file: "about.html", label: "About" },
    { id: "academics", file: "academics.html", label: "Academics" },
    { id: "passions", file: "passions.html", label: "Passions" },
    { id: "moments", file: "moments.html", label: "Moments" },
    { id: "extra", file: "extra.html", label: "Extra" },
    { id: "contact", file: "contact.html", label: "Contact" }
];

/* ===== Detect active page ===== */

const navContainer = document.getElementById("nav-placeholder");
const currentPage = navContainer.dataset.page;

/* ===== Build navigation links ===== */

let linksHTML = "";

pages.forEach(page => {

    if (page.id === currentPage) {

        linksHTML += `
            <span class="current">${page.label}</span>
        `;

    } else {

        linksHTML += `
            <a href="${page.file}">${page.label}</a>
        `;
    }

});

/* ===== Build navbar HTML ===== */

const navHTML = `
<nav class="academic-nav">

    <button
        class="nav-toggle"
        id="navToggle"
        type="button">

        ☰

    </button>

    <div
        class="collapse"
        id="navCollapse">

        <div class="nav-links">

            ${linksHTML}

        </div>

    </div>

</nav>
`;

/* ===== Inject navbar ===== */

navContainer.innerHTML = navHTML;

/* ===== Initialize Bootstrap collapse ===== */

const collapseElement = document.getElementById("navCollapse");

const collapseInstance = new bootstrap.Collapse(
    collapseElement,
    {
        toggle: false
    }
);

/* ===== Toggle menu on button click ===== */

document
    .getElementById("navToggle")
    .addEventListener("click", function () {

        collapseInstance.toggle();

});
