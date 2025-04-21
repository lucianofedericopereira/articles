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

{% assign current_year = "" %}
{% for item in sorted_items %}
  {% assign year = item.date | date: "%Y" %}
  
{% if year != current_year %}
<h3>{{ year }}</h3>
{% assign current_year = year %}
{% endif %}
  {% assign collection_name = item.url | split: "/" | slice: 1, 1 %}
  <p class="list {{ collection_name }}">
    <a href="{{ item.url }}"><span>{{ item.date | date: "%b %d" }}</span> {{ item.title }}</a>
  </p>
{% endfor %}





{% comment %}







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
{% assign grouped_by_year = sorted_items | group_by: "date" %}


{% for year_group in grouped_by_year %}
   <h3>{{ year_group.name | date: "%Y" }}</h3>
   {% for item in year_group.items %}
  {% assign collection_name = item.url | split: "/" %}
  {% assign collection_name = collection_name[1] %}
  <p class="list {{ collection_name }}">
    <a href="{{ folder }}{{ item.url }}"><span>{{ item.date | date: "%b %d" }}</span>{{ item.title }}</a>
  </p>
{% endfor %}{% endfor %}





<ul>
  {% for item in sorted_items %}
  {% assign collection_name = item.url | split: "/" %}
  {% assign collection_name = collection_name[1] %}
  <li><a href="{{ item.url }}">{{ item.title }}</a> {{ collection_name }} - {{ item.date | date: "%Y-%m-%d" }}</li>
  {% endfor %}
</ul>
{% endcomment %}