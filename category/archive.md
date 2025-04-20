---
title: "Archive"
---

<div class="entries-by-year">
{% assign all_docs = "" %}
{% for collection in site.collections %}
  {% for doc in collection.docs %}
    {% if doc.date %}
      {% assign all_docs = all_docs | append: doc %}
    {% endif %}
  {% endfor %}
{% endfor %}
{% assign sorted_docs = all_docs | sort: "date" | reverse %}

{% assign grouped_docs = sorted_docs | group_by_exp: "doc", "doc.date | date: '%Y'" %}

{% for collection in site.collections %}
  {% for doc in collection.docs %}
    <p>{{ doc.title }} - {{ doc.date }}</p>
  {% endfor %}
{% endfor %}
