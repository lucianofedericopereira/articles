---
layout: test
title: "JavaScript"
---

<h1>{{ page.title }}</h1>
<ul>
{% for item in site.js %}
    <li><a href="articles/{{ item.url }}">{{ item.title }}</a></li>
{% endfor %}
</ul>
