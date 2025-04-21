---
title: "Archive"
---

{% assign all_items = "" | split: "," %}
{% for collection in site.collections %}
  {% assign items = site[collection.label] | sort: "date" %}
  {% if items.size > 0 %}
    {% for item in items %}
      {% if item.title and item.date %}
        {% assign all_items = all_items | push: item %}
      {% endif %}
    {% endfor %}
  {% endif %}
{% endfor %}
{% assign sorted_items = all_items | sort: "date" | reverse %}

<ul>
  {% for item in sorted_items %}
  {% assign collection_name = item.url | split: "/" %}
  {% assign collection_name = collection_name[1] %}
  <li><a href="{{ item.url }}">{{ item.title }}</a> {{ collection_name }} - {{ item.date | date: "%Y-%m-%d" }}</li>
  {% endfor %}
</ul>
