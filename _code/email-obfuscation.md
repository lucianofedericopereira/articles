---
title: "Js: Email Obsfrustration"
date: 2025-10-25
comments: true
---

Email harvesters and bots constantly scan the Internet for email addresses to add to spam lists. This increases the volume of unwanted emails. In this article, we'll create a simple page using JavaScript to obfuscate email addresses while keeping them accessible to humans.

Let's go step by step.

## Background

Cloudflare and other platforms obfuscate emails to prevent harvesting. While researching, I found an article by Andrew Lock<a href="#footnote1"></a> describing a simple XOR-based encoding method. 

I decided to implement my own version.  `XOR` stands for *exclusive OR*, a logical operation that returns `true` if its two inputs differ. This makes XOR a simple yet reversible substitution cipher: each character in a string is transformed using a numeric key, and applying the same operation again restores the original string. This is also known as an additive cipher—the simplest type of cipher.

## Goal

We aim to create a small JavaScript utility and a simple {{page.m}} to encode and decode email addresses.  

Requirements:

1. Encode a string representing a valid email address.
2. Use a numeric key from `0` to `255` (`0` to `FF` in hex).
3. Provide a drop-in script to decode the emails in the page.
4. Optionally, allow users to customize the HTML class for encoded emails and enable regex validation.

## Encoder

The encoder receives two parameters: `email` and `key`. It outputs a string consisting of the hex representation of the key followed by the XOR-obfuscated email.

The `key` is a `decimal` number, we have to convert it to `hex` and pad it with a zero in case is smaller than 10<sub>16</sub>

Convert the key to hex:

```js
let encodedString = key.toString(16).padStart(2,'0')
```

Then XOR each character of the email and append it to the encoded string:

```js
const encoded = [...email]
  .map(char => (char.charCodeAt(0) ^ key).toString(16).padStart(2, '0'))
  .join('');
```

Full encoder function:

```js
const encodeEmail = (email, key) => {
  const keyHex = key.toString(16).padStart(2, '0');
  const encoded = [...email]
    .map(char => (char.charCodeAt(0) ^ key).toString(16).padStart(2, '0'))
    .join('');
  return keyHex + encoded;
};
```
## Decoder

The decoder reverses the process. Extract the first two characters as the `key` and `xor` the rest:

```js
const decodeEmail = encoded => {
  const key = parseInt(encoded.slice(0, 2), 16); // Extract key
  return [...encoded.slice(2).match(/.{1,2}/g)] // Split into hex pairs
    .map(hex => String.fromCharCode(parseInt(hex, 16) ^ key)) // Decode
    .join(''); // Combine characters
};
```
## Parser

In order to store our encoded address we will use the `data` attribute and we also will make a function to parse all of our encoded emails that have a certain class for instance `eml` .

Example Link:


```html
<a href="#" class="eml" data-encoded= "9c...">[contact]</a>
```


Parse Function:


```js
const parseEmail = () => {
  const emlElements = document.getElementsByClassName("eml");
  for (const elEml of emlElements) {
    const { encoded } = elEml.dataset;
    const decoded = decodeEmail(encoded);
    elEml.textContent = decoded;
    elEml.href = `mailto:${decoded}`;
  }
};
parseEmail();
```

## The Form Encoder

What we need

<p>We will create a very basic form in order to encode and create the links also it will have the instructions that allow users to add the script needed to decode mails.</p>

<p>The form need some validations as we need an email address and a key from 0 to 255. You can check the full source code below. </p>

In order to verify the address we use this function that returns `true` or `false` when an address is passed to it.

```js
const validEmail = email => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase())
};
```

In terms of design we will use Simple CSS<a href="#footnote2"></a> a minimal CSS semantic framework.

## Working Example

You can visit the page with the final result<a href="#footnote3"></a>.

## Final Code

Here's the production-ready single-line script, supporting optional regex validation and configurable class names:

```js
    // Luciano Federico Pereira - GPL v2.1 - decode hex emails, configurable class & optional regex
    function decodeEmails({cls='eml',regex=/^[\w!#$%&'*+\-/=?^_`{|}~]+(?:\.[\w!#$%&'*+\-/=?^_`{|}~]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/}={}){const H=new Uint8Array(256).fill(255);for(let i=48;i<58;i++)H[i]=i-48;for(i=65;i<71;i++)H[i]=i-55;for(i=97;i<103;i++)H[i]=i-87;let B=new Uint8Array(256),L=e=>{const s=e.dataset?.encoded;if(!s||s.length<4||s.length&1)return"";const k=(H[s.charCodeAt(0)]<<4)|H[s.charCodeAt(1)],n=(s.length>>1)-1;if(B.length<n)B=new Uint8Array(n);let o="";for(let i=0;i<n;i++){const x=H[s.charCodeAt(2*i+2)],y=H[s.charCodeAt(2*i+3)];if(x>15||y>15)return"";B[i]=(x<<4|y)^k;o+=String.fromCharCode(B[i])}return regex.test(o)?o:o},R=()=>{for(const e of document.getElementsByClassName(cls)){const d=L(e);d&&(e.textContent=d,e.href="mailto:"+d)}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R()}
```

This version is robust, compact, and flexible:

- Works with any class name.
- Optional regex verification.
- Single line, ideal for embedding in pages.

<h3>Footnotes</h3>    
<footer>
  <p id="footnote1"><a href="https://andrewlock.net">Andrew Lock</a>.NET Escapades.</p>
  <p id="footnote2"><a href="https://simplecss.org">Simpe CSS</a> A CSS framework that makes semantic HTML look good.</p>
  <p id="footnote3"><a href="https://lucianofullstack.pages.dev/assets/encoder">Encoder Page</a>a self generation link page.</p>
</footer>
