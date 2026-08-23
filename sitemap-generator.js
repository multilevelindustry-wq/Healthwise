"use strict";


/* =========================================================
   HEALTHWISE SITEMAP GENERATOR
========================================================= */


/* =========================================================
   DEFAULT HEALTHWISE PAGES
========================================================= */

const DEFAULT_PAGES = [

    {
        path: "",
        frequency: "weekly",
        priority: "1.0"
    },

    {
        path: "food.html",
        frequency: "weekly",
        priority: "0.8"
    },

    {
        path: "health.html",
        frequency: "weekly",
        priority: "0.8"
    },

    {
        path: "supplements.html",
        frequency: "weekly",
        priority: "0.8"
    },

    {
        path: "about-us.html",
        frequency: "monthly",
        priority: "0.5"
    },

    {
        path: "contact.html",
        frequency: "monthly",
        priority: "0.5"
    },

    {
        path: "privacy-policy.html",
        frequency: "yearly",
        priority: "0.3"
    },

    {
        path: "terms-and-conditions.html",
        frequency: "yearly",
        priority: "0.3"
    },

    {
        path: "editorial-policy.html",
        frequency: "yearly",
        priority: "0.5"
    },

    {
        path: "medical-disclaimer.html",
        frequency: "yearly",
        priority: "0.5"
    },

    {
        path: "affiliate-disclosure.html",
        frequency: "yearly",
        priority: "0.4"
    },

    {
        path: "content-guidelines.html",
        frequency: "yearly",
        priority: "0.4"
    },

    {
        path: "product-transparency.html",
        frequency: "yearly",
        priority: "0.5"
    }

];



/* =========================================================
   DOM
========================================================= */

const websiteUrl =
    document.getElementById(
        "websiteUrl"
    );


const pageList =
    document.getElementById(
        "pageList"
    );


const pageCount =
    document.getElementById(
        "pageCount"
    );


const addPageButton =
    document.getElementById(
        "addPageButton"
    );


const generateButton =
    document.getElementById(
        "generateButton"
    );


const downloadButton =
    document.getElementById(
        "downloadButton"
    );


const copyButton =
    document.getElementById(
        "copyButton"
    );


const sitemapOutput =
    document.getElementById(
        "sitemapOutput"
    );


const resultSection =
    document.getElementById(
        "resultSection"
    );


const resultMessage =
    document.getElementById(
        "resultMessage"
    );


const currentYear =
    document.getElementById(
        "currentYear"
    );



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        initializeSitemapGenerator();

    }
);



function initializeSitemapGenerator(){

    if(currentYear){

        currentYear.textContent =
            new Date().getFullYear();

    }


    loadSavedDomain();

    renderDefaultPages();

    addEventListeners();

}



/* =========================================================
   EVENTS
========================================================= */

function addEventListeners(){

    addPageButton.addEventListener(
        "click",
        function(){

            addPageRow();

        }
    );


    generateButton.addEventListener(
        "click",
        function(){

            generateSitemap();

        }
    );


    downloadButton.addEventListener(
        "click",
        function(){

            downloadSitemap();

        }
    );


    copyButton.addEventListener(
        "click",
        function(){

            copySitemap();

        }
    );


    websiteUrl.addEventListener(
        "input",
        function(){

            saveDomain();

        }
    );

}



/* =========================================================
   RENDER DEFAULT PAGES
========================================================= */

function renderDefaultPages(){

    pageList.innerHTML = "";


    DEFAULT_PAGES.forEach(
        function(page){

            addPageRow(
                page.path,
                page.frequency,
                page.priority
            );

        }
    );


    updatePageCount();

}



/* =========================================================
   ADD PAGE ROW
========================================================= */

function addPageRow(
    path = "",
    frequency = "",
    priority = ""
){

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "page-row";


    row.innerHTML = `

        <input
            type="text"
            class="page-path"
            placeholder="example.html"
            value="${escapeHTML(path)}"
            aria-label="Page path"
        >


        <select
            class="page-frequency"
            aria-label="Change frequency"
        >

            <option value="daily">
                Daily
            </option>

            <option value="weekly">
                Weekly
            </option>

            <option value="monthly">
                Monthly
            </option>

            <option value="yearly">
                Yearly
            </option>

        </select>


        <button
            type="button"
            class="remove-page"
            aria-label="Remove page"
        >
            ×
        </button>

    `;


    pageList.appendChild(
        row
    );


    const frequencySelect =
        row.querySelector(
            ".page-frequency"
        );


    frequencySelect.value =
        frequency ||
        document.getElementById(
            "changeFrequency"
        ).value;


    const removeButton =
        row.querySelector(
            ".remove-page"
        );


    removeButton.addEventListener(
        "click",
        function(){

            row.remove();

            updatePageCount();

        }
    );


    updatePageCount();

}



/* =========================================================
   COUNT
========================================================= */

function updatePageCount(){

    const rows =
        pageList.querySelectorAll(
            ".page-row"
        );


    const count =
        rows.length;


    pageCount.textContent =
        count === 1
            ? "1 page"
            : `${count} pages`;

}



/* =========================================================
   COLLECT PAGES
========================================================= */

function collectPages(){

    const rows =
        pageList.querySelectorAll(
            ".page-row"
        );


    const pages = [];


    rows.forEach(
        function(row){

            const path =
                row.querySelector(
                    ".page-path"
                ).value.trim();


            const frequency =
                row.querySelector(
                    ".page-frequency"
                ).value;


            if(!path){

                return;

            }


            pages.push({

                path:
                    cleanPath(path),

                frequency:
                    frequency,

                priority:
                    getPriorityForPage(
                        path
                    )

            });

        }
    );


    return removeDuplicatePages(
        pages
    );

}



/* =========================================================
   GENERATE XML
========================================================= */

function generateSitemap(){

    const domain =
        websiteUrl.value.trim();


    if(!domain){

        alert(
            "Please enter your website URL first."
        );

        websiteUrl.focus();

        return;

    }


    if(
        !domain.startsWith(
            "https://claunecks.com"
        ) &&
        !domain.startsWith(
            "https://claunecks.com"
        )
    ){

        alert(
            "Please enter a complete URL beginning with https://"
        );

        websiteUrl.focus();

        return;

    }


    const pages =
        collectPages();


    if(
        pages.length === 0
    ){

        alert(
            "Please add at least one website page."
        );

        return;

    }


    const xml =
        createSitemapXML(
            domain,
            pages
        );


    sitemapOutput.value =
        xml;


    resultSection.hidden =
        false;


    downloadButton.disabled =
        false;


    resultMessage.textContent =
        `${pages.length} pages included in your sitemap.`;


    resultSection.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}



/* =========================================================
   CREATE SITEMAP XML
========================================================= */

function createSitemapXML(
    domain,
    pages
){

    const cleanDomain =
        domain
            .trim()
            .replace(
                /\/+$/,
                ""
            );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;


    pages.forEach(
        function(page){

            const url =
                buildUrl(
                    cleanDomain,
                    page.path
                );


            xml += `
    <url>
        <loc>${escapeXML(url)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.frequency}</changefreq>
        <priority>${page.priority}</priority>
    </url>
`;

        }
    );


    xml +=
`</urlset>`;


    return xml;

}



/* =========================================================
   BUILD URL
========================================================= */

function buildUrl(
    domain,
    path
){

    if(
        !path ||
        path === "/"
    ){

        return domain + "/";

    }


    return (
        domain +
        "/" +
        path.replace(
            /^\/+/,
            ""
        )
    );

}



/* =========================================================
   PRIORITY
========================================================= */

function getPriorityForPage(
    path
){

    const clean =
        cleanPath(
            path
        ).toLowerCase();


    if(
        clean === ""
    ){

        return "1.0";

    }


    if(
        clean === "food.html" ||
        clean === "health.html" ||
        clean === "supplements.html"
    ){

        return "0.8";

    }


    if(
        clean.includes(
            ".html"
        )
    ){

        return "0.6";

    }


    return "0.5";

}



/* =========================================================
   CLEAN PATH
========================================================= */

function cleanPath(
    path
){

    return String(
        path || ""
    )
    .trim()
    .replace(
        /^https?:\/\/[^/]+/i,
        ""
    )
    .replace(
        /^\/+/,
        ""
    );

}



/* =========================================================
   REMOVE DUPLICATES
========================================================= */

function removeDuplicatePages(
    pages
){

    const seen =
        new Set();


    return pages.filter(
        function(page){

            const key =
                page.path
                    .toLowerCase();


            if(
                seen.has(
                    key
                )
            ){

                return false;

            }


            seen.add(
                key
            );


            return true;

        }
    );

}



/* =========================================================
   DOWNLOAD
========================================================= */

function downloadSitemap(){

    const xml =
        sitemapOutput.value;


    if(!xml){

        alert(
            "Generate the sitemap first."
        );

        return;

    }


    const blob =
        new Blob(
            [
                xml
            ],
            {
                type:
                    "application/xml"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "sitemap.xml";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}



/* =========================================================
   COPY
========================================================= */

async function copySitemap(){

    const xml =
        sitemapOutput.value;


    if(!xml){

        return;

    }


    try{

        await navigator.clipboard.writeText(
            xml
        );


        const original =
            copyButton.textContent;


        copyButton.textContent =
            "✓ Copied";


        setTimeout(
            function(){

                copyButton.textContent =
                    original;

            },
            1800
        );

    }
    catch(error){

        sitemapOutput.select();

        document.execCommand(
            "copy"
        );

    }

}



/* =========================================================
   SAVE DOMAIN
========================================================= */

function saveDomain(){

    try{

        localStorage.setItem(
            "healthwise_sitemap_domain",
            websiteUrl.value.trim()
        );

    }
    catch(error){

        console.warn(
            "Could not save domain.",
            error
        );

    }

}



/* =========================================================
   LOAD DOMAIN
========================================================= */

function loadSavedDomain(){

    try{

        const saved =
            localStorage.getItem(
                "healthwise_sitemap_domain"
            );


        if(saved){

            websiteUrl.value =
                saved;

        }

    }
    catch(error){

        console.warn(
            "Could not load saved domain.",
            error
        );

    }

}



/* =========================================================
   ESCAPE XML
========================================================= */

function escapeXML(
    value
){

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&apos;"
    );

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
){

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}
