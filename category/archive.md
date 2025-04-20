---
title: "Archive"
---

<div class="entries-by-year">
  {% assign all_docs = "" %}
  {% for collection in site.collections %}
    {% assign all_docs = all_docs | append: collection.docs %}
  {% endfor %}
  {% assign sorted_docs = all_docs | sort: "date" | reverse %}
  {% assign grouped_docs = sorted_docs | group_by_exp: "doc", "doc.date | date: '%Y'" %}

  {% for group in grouped_docs %}
    <h2>{{ group.name }}</h2>
    <ul>
      {% for doc in group.items %}
        <li>
          <a href="{{ doc.url }}">{{ doc.title }}</a>
          - {{ doc.date | date: "%Y-%m-%d" }}
          (Collection: {{ doc.collection.label }})
        </li>
      {% endfor %}
    </ul>
  {% endfor %}
</div>