---
layout: test
title: "CSS"
---

<h1>{{ page.title }}</h1>
<ul>
{% for item in site.css %}
    <li><a href="{{ item.url }}">{{ item.title }}</a></li>
{% endfor %}
</ul>
