---
title: "Archive"
---

{% assign collections = site.collections | where_exp: "collection", collection.label != 'posts' %}
{% assign all_entries = collections | map: "docs" | flatten | sort: "date" | reverse %}

{% assign grouped_entries = all_entries | group_by_exp: "entry", "entry.date | date: '%Y'" %}

<div class="entries-by-year">
  {% for group in grouped_entries %}
    <h2>{{ group.name }}</h2>
    <ul>
      {% for entry in group.items %}
        <li>
          <a href="{{ entry.url }}">{{ entry.title }}</a>
          - {{ entry.date | date: "%Y-%m-%d" }}
          (Collection: {{ entry.collection.label }})
        </li>
      {% endfor %}
    </ul>
  {% endfor %}
</div>
