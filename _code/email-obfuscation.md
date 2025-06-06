---
title: "Js: Email Obsfrustration"
date: 2023-04-15
comments: true
---

Email harvesters and other bots roam the Internet looking for email addresses to add to lists that target recipients for spam. This trend results in an increasing amount of unwanted email. Learn how to create a simple page using JavaScript. 

Check this step-by-step guide.

Let´s Start.

## Background

I like how Cloudflare obfuscate mails, googling around I found an Andrew Lock<a href="#footnote1"></a> article explaining how to use a simple bitwise XOR using a key, and as I knew the technique, I decided to adapt it and do my own implementation. 

`XOR` stands for *exclusive OR*. It is a logical operation that returns a positive or true result when either but not both of its two inputs are true. In other words, the output is true if the inputs are not alike otherwise the output is false.

The `XOR` algorithm is basically a simple substitution cipher. In other words, it just replaces each alphanumeric in a string that is fed into it with another number. Crucially, the algorithm is reversible. So if you feed the output string back into the same algorithm, you end up with the original string with the cipher removed. This kind of cipher is also called an additive cipher, and is the simplest kind of cipher there is.

## Goal

Create a simple {{page.m}} using just JavaScript for encoding and decoding our address. In order to encode we will need a string representing a valid email address and a numerical key from `0` to `255` (`0` to `FF` in `hex`). Also we have to create a drop-in script that decode our emails, and a form to create the ciphered ones.

## Encoder

The function will receive two parameters `email` and `key` and returns a `string` containing the concatenation of the `key` in `hex` and  the result of applying `XOR` to every character of the mail address.

First, as `key` is a `decimal` number we have to convert it to `hex` and pad it with a zero in case is smaller than 10<sub>16</sub>

```js
let encodedString = key.toString(16).padStart(2,'0')
```

Then we iterate trough the whole mail address doing a `xor`, padding and concatenating to `encodedString`


```js
const encoded = [...email]
  .map(char => (char.charCodeAt(0) ^ key).toString(16).padStart(2, '0'))
  .join('');
```

The whole encoder code so far


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

As we can realize the new length will be `originalLenght*2+2` as every char and the key will be represented by their `hex value`, so we have to pick the first two characters of the encoded string and covert it to decimal. Then we will repeat the operation using that value as `key` and doing `xor` and concatenating the rest. 


```js
const decodeEmail = encoded => {
  const key = parseInt(encoded.slice(0, 2), 16); // Extract and decode the key
  return [...encoded.slice(2).match(/.{1,2}/g)] // Split remaining string into pairs of hex characters
    .map(hex => String.fromCharCode(parseInt(hex, 16) ^ key)) // Decode each character
    .join(''); // Combine characters into the decoded email
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

## Final Code

You can visit the page with the final result<a href="#footnote3"></a>.

<h3>Footnotes</h3>    
<footer>
  <p id="footnote1"><a href="https://andrewlock.net">Andrew Lock</a>.NET Escapades.</p>
  <p id="footnote2"><a href="https://simplecss.org">Simpe CSS</a> A CSS framework that makes semantic HTML look good.</p>
  <p id="footnote3"><a href="https://lucianofullstack.pages.dev/assets/encoder">Encoder Page</a>a self generation link page.</p>
</footer>
