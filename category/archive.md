---
title: "Archive"
---

{% for collection in site.collections %}
  <h2>Items from {{ collection.label }}</h2>
  <ul>
    {% for item in site[collection.label] %}
      <li><a href="{{ item.url }}">{{ item.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}

{% assign all_items = "" %}

{% for collection in site.collections %}
  {% assign items = site[collection.label] | sort: "date" %}
  {% if items.size > 0 %}
    {% assign all_items = all_items | concat: items %}
  {% endif %}
{% endfor %}

{% assign sorted_items = all_items | sort: "date" | reverse %}

<h2>All Items</h2>
<ul>
  {% for item in sorted_items %}
    <li><a href="{{ item.url }}">{{ item.title }}</a> - {{ item.date | date: "%Y-%m-%d" }}</li>
  {% endfor %}
</ul>
