---
title: "Archive"
---



{% assign all_items = "" | split: "," %}

{% for collection in site.collections %}
  {% assign items = site[collection.label] | sort: "date" %}
  {% if items.size > 0 %}
    {% for item in items %}
      {% if item.title and item.date %}
        {% assign collection_name = item.url | split: "/" | slice: 3 %}
        {% assign all_items = all_items | push: item %}
        {% assign all_items = all_items | push: collection_name %}
      {% endif %}
    {% endfor %}
  {% endif %}
{% endfor %}

{% assign sorted_items = all_items | sort: "date" | reverse %}

<h2>All Items</h2>
<ul>
  {% for item in sorted_items %}
    {% assign collection_name = item.url | split: "/" | slice: 3 %}
    <li>
      <a href="{{ item.url }}">{{ item.title }}</a> - {{ item.date | date: "%Y-%m-%d" }}
      <span>(Collection: {{ collection_name }})</span>
    </li>
  {% endfor %}
</ul>






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
    <li><a href="{{ item.url }}">{{ item.title }}</a> - {{ item.date | date: "%Y-%m-%d" }}</li>
  {% endfor %}
</ul>
