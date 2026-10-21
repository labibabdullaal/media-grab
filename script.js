
const urlInput = document.getElementById("mediaUrl");
const platformSelect = document.getElementById("platform");
const checkButton = document.getElementById("checkBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");

document.getElementById("year").textContent =
  new Date().getFullYear();

const knownHosts = {
  youtube: ["youtube.com", "youtu.be"],
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.watch"]
};

function identifyPlatform(host) {
  const hostname = host.toLowerCase().replace(/^www\./, "");

  for (const [platform, domains] of Object.entries(knownHosts)) {
    if (domains.some(domain =>
      hostname === domain || hostname.endsWith("." + domain)
    )) {
      return platform;
    }
  }

  return "other";
}

function isAllowedUrl(url) {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return false;
  }

  // Reject local and private network addresses.
  const host = url.hostname.toLowerCase();

  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "::1" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return false;
  }

  return true;
}

checkButton.addEventListener("click", () => {
  message.className = "message";
  result.hidden = true;
  result.textContent = "";

  const rawUrl = urlInput.value.trim();

  if (!rawUrl) {
    message.textContent = "Please paste a media URL first.";
    message.classList.add("error");
    urlInput.focus();
    return;
  }

  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    message.textContent =
      "This URL is not valid. Check it and try again.";
    message.classList.add("error");
    return;
  }

  if (!isAllowedUrl(url)) {
    message.textContent =
      "Please enter a valid public HTTP or HTTPS website URL.";
    message.classList.add("error");
    return;
  }

  const detected = identifyPlatform(url.hostname);
  const selected = platformSelect.value;

  if (selected !== "auto" && selected !== detected) {
    message.textContent =
      "The selected platform does not match the URL. Please check your selection.";
    message.classList.add("error");
    return;
  }

  const platformName = {
    youtube: "YouTube",
    instagram: "Instagram",
    facebook: "Facebook",
    other: "Other website"
  };

  const format = document.querySelector(
    'input[name="format"]:checked'
  ).value;

  message.textContent = "The URL format looks valid.";
  message.classList.add("success");

  const heading = document.createElement("strong");
  heading.textContent = "Link check result";

  const details = document.createElement("p");
  details.textContent =
    "Platform: " + platformName[detected] +
    " | Requested format: " + format.toUpperCase();

  const explanation = document.createElement("p");
  explanation.textContent =
    "This prototype does not fetch or download media. " +
    "A supported, authorized media source must be connected " +
    "before a download can start.";

  result.append(heading, details, explanation);
  result.hidden = false;
});
