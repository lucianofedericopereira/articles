---
title: "CSS"
---


{% assign collection_items = site[page.collection] %}{%- include components/category.html -%}

{% assign grouped_items = site.css | group_by: "date" %}
{% for year_group in grouped_items %}
<h3>{{ year_group.name | date: "%Y" }}</h3>
{% for item in year_group.items %}
<p><a href="{{ folder }}{{ item.url }}">{{ item.date | date: "%m-%d" }} - {{ item.title }}</a></p>
{% endfor %}
{% endfor %}

