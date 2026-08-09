// Comprehensive disposable email domain blocklist and email validation utilities

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "temp-mail.org", "10minutemail.com", "mailinator.com", "guerrillamail.com",
  "throwawaymail.com", "yopmail.com", "sharklasers.com", "getnada.com", "dispostable.com",
  "trashmail.com", "10minmail.com", "mohmal.com", "emailondeck.com", "fakeinbox.com",
  "tempmailo.com", "mytemp.email", "temp-mail.io", "maildrop.cc", "minteemail.com",
  "crazymailing.com", "tmail.ws", "tempinbox.com", "boun.cr", "clipmail.eu",
  "getairmail.com", "incognitomail.com", "tempmailaddress.com", "dropmail.me",
  "10minutemail.net", "tempail.com", "tempmail.net", "guerrillamail.info",
  "guerrillamail.biz", "guerrillamail.org", "guerrillamailblock.com", "poke-email.com",
  "spam4.me", "generator.email", "inboxbear.com", "disposablemail.com", "burnermail.io",
  "trashmail.net", "trashmail.me", "mytempemail.com", "disposable.com", "receive-smss.com",
  "tempmail.de", "temp-mail.ru", "tempmail.us", "10minutemail.co.uk", "20mail.it",
  "33mail.com", "anonbox.net", "anonymbox.com", "antichef.net", "binkmail.com",
  "bobmail.info", "chacuo.net", "discard.email", "discardmail.com", "disposableaddress.com",
  "dodgeit.com", "drdrb.com", "e4ward.com", "emailmiser.com", "emailsensei.com",
  "emailtemporario.com.br", "fake-box.com", "fakemailgenerator.com", "filzmail.com",
  "ghostmail.com", "gishpuppy.com", "guerrillamail.de", "guerrillamail.net", "hatespam.org",
  "hidemail.de", "hohmsta.de", "hide-email.com", "incognitomail.org", "inboxalias.com",
  "jetable.org", "jourrapide.com", "kasmail.com", "klzlk.com", "kt4n.com",
  "kurzepost.de", "mail-temporaire.fr", "mailcatch.com", "mailexpire.com", "mailfa.org",
  "mailgenerator.net", "mailimate.com", "mailnesia.com", "mailnull.com", "mailpigeon.net",
  "mailprox.com", "mailsac.com", "mailtothis.com", "meltmail.com", "mefound.com",
  "mycleaninbox.com", "my10minutemail.com", "netmail.tk", "noclickemail.com",
  "nogmail.com", "no-spam.ws", "nospamfor.us", "objectmail.com", "oneoffmail.com",
  "pookmail.com", "protect-email.com", "quickmail.nl", "rcpt.at", "reallymymail.com",
  "reusablemail.com", "safe-mail.net", "safersignup.de", "safetymail.info", "shortmail.net",
  "sofort-mail.de", "spambob.com", "spambox.us", "spamgourmet.com", "spamhole.com",
  "spaminator.de", "spamfree24.org", "spamthis.co.uk", "superrito.com", "suremail.info",
  "tafmail.com", "tempemail.co", "tempemail.net", "tempmail.hu", "temp-mail.mobi",
  "temporaryemail.net", "temporaryinbox.com", "throwawayemailaddress.com", "tilemail.com",
  "trashmail.at", "trashmail.de", "trashmail.io", "trashmail.org", "trashmailer.com",
  "trbvm.com", "tv221.com", "uggsrock.com", "vmani.com", "webmail66.com",
  "whyspam.me", "willhackforfood.biz", "xagloo.com", "xmail.net", "yopmail.fr",
  "yopmail.net", "zippymail.info", "tempmail.org", "guerrillamailblock.com", "my24hours.net",
  "inbox.si", "temp-mail.net", "temp-mail.com.es", "guerrillamail.org.uk", "0815.ru",
  "10minutemail.com", "10minutemail.net", "10minmail.de", "20minmail.it", "get airmail.com"
]);

const DISPOSABLE_KEYWORDS = [
  "tempmail", "temp-mail", "disposable", "throwaway", "10min", "trashmail",
  "mailinator", "guerrillamail", "fakeinbox", "yopmail", "getnada", "dispostable",
  "sharklasers", "fakemail", "generator", "anonymbox", "spamgourmet", "mailnesia",
  "tmpmail", "dropmail", "burnermail", "maildrop", "mohmal", "emailondeck",
  "fake-mail", "temp-email", "spam4"
];

const KNOWN_LEGITIMATE_DOMAINS = new Set([
  "gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com",
  "proton.me", "protonmail.com", "aol.com", "zoho.com", "mail.com",
  "live.com", "gmx.com", "yandex.com", "me.com", "msn.com", "comcast.net",
  "sbcglobal.net", "verizon.net", "att.net", "mac.com"
]);

export interface EmailValidationResult {
  valid: boolean;
  isDisposable?: boolean;
  error?: string;
}

/**
 * Basic format validation for an email string.
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  
  // RFC 5322 compliant simple email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return false;

  // Prevent double dots or starting/ending dots in local part or domain
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;

  return true;
}

/**
 * Checks if the given domain or email is a disposable/temporary email provider.
 */
export function isDisposableEmail(emailOrDomain: string): boolean {
  if (!emailOrDomain) return false;
  const domain = emailOrDomain.includes("@")
    ? emailOrDomain.split("@")[1].toLowerCase().trim()
    : emailOrDomain.toLowerCase().trim();

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return true;
  }

  for (const keyword of DISPOSABLE_KEYWORDS) {
    if (domain.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Synchronous client-side check for email format and disposable detection.
 */
export function validateEmailClient(email: string): EmailValidationResult {
  if (!isValidEmailFormat(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address.",
    };
  }

  if (isDisposableEmail(email)) {
    return {
      valid: false,
      isDisposable: true,
      error: "Temporary or disposable email addresses are not allowed.",
    };
  }

  return { valid: true };
}

/**
 * Check if the domain is a known legitimate email provider.
 */
export function isKnownLegitimateDomain(domain: string): boolean {
  return KNOWN_LEGITIMATE_DOMAINS.has(domain.toLowerCase().trim());
}
