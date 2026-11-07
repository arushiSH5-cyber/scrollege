// The mockup loaded three.js and pdf.js from a CDN as globals.
// We bundle them locally (works offline as a PWA) and expose the same globals.
import * as THREE from "three";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
window.THREE = THREE;
window.pdfjsLib = pdfjsLib;
