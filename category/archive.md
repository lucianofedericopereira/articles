---
title: "Archive"
---

{% assign all_items = "" | split: "," %}{% for collection in site.collections %}{% assign items = site[collection.label] | sort: "date" %}{% if items.size > 0 %}{% for item in items %}{% if item.title and item.date %}{% assign all_items = all_items | push: item %}{% endif %}{% endfor %}{% endif %}{% endfor %}{% assign sorted_items = all_items | sort: "date" | reverse %}
<div class="items">
<div class="controllers">
  <label>All<input id="all" type="radio" name="filter" checked="checked"></label>
  <label>Design<input id="design" type="radio" name="filter"></label>
  <label>Code<input id="code" type="radio" name="filter"></label>
  <label>Projects<input id="projects" type="radio" name="filter"></label>
</div>
{% assign current_year = "" %}{% for item in sorted_items %}{% assign year = item.date | date: "%Y" %}{% if year != current_year %}<h3>{{ year }}</h3>{% assign current_year = year %}{% endif %}
{% assign collection_name = item.url | split: "/" | slice: 1, 1 %}<p class="list {{ collection_name }}">
<a href="{{ item.url }}"><span>{{ item.date | date: "%b %d" }}</span> {{ item.title }}</a></p>{% endfor %}
</div>
