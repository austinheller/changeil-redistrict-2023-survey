import { createElement, createFragment } from "./lib/vanillaJSX.js";

/** @jsx createElement */
/** @jsxFrag createFragment */

export default function getSocialMediaLink(field, site) {
  let el = "";
  // Check field
  field = field.trim();
  console.log(field);
  const isUrl = field.match(/https:\/\//g);
  if (isUrl) {
    switch (site) {
      case "facebook":
        el = (
          <a
            class="facebook"
            href={field}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-facebook"></i>
          </a>
        );
        break;
      case "twitter":
        el = (
          <a
            class="twitter"
            href={field}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-twitter"></i>
          </a>
        );
        break;
      default:
        el = "";
    }
  }
  return el;
}
