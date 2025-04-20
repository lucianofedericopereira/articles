---
title: "Archive"
---

<div class="entries-by-year">
  {% assign all_docs = "" %}
  {% for collection in site.collections %}
    {% for doc in collection.docs %}
      {% if all_docs == "" %}
        {% assign all_docs = doc %}
      {% else %}
        {% assign all_docs = all_docs | append: "," | append: doc %}
      {% endif %}
    {% endfor %}
  {% endfor %}
</div>
