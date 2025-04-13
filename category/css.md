---
layout: codecraft
title: "CSS"
---

{% assign grouped_items = site.css | group_by: "date" %}
{% for year_group in grouped_items %}
<h3>{{ year_group.name | date: "%Y" }}</h3>
{% for item in year_group.items %}
<p>Folder value: {{ folder }}</p>
<p>Folder value: {{ meta.author }}</p>

<p><a href="{{ folder }}{{ item.url }}">{{ item.date | date: "%m-%d" }} - {{ item.title }}</a></p>
{% endfor %}
{% endfor %}
