---
layout: test
title: "JavaScript Articles"
---

<h1>{{ page.title }}</h1>
<ul>
{% for item in site.js %}
    <li><a href="{{ item.url }}">{{ item.title }}</a></li>
{% endfor %}
</ul>
