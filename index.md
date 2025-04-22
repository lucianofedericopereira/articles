---
title: Home
mermaid: true
comments: false
---

{% assign all_items = "" | split: "," %}
{% for collection in site.collections %}
    {% assign items = site[collection.label] | sort: "date" | reverse %}
    {% if items.size > 0 %}
        {% for item in items %}
            {% if item.title and item.date %}
                {% assign all_items = all_items | push: item %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}
{% assign sorted_items = all_items | sort: "date" | reverse %}
{% assign latest_items = sorted_items | slice: 0, 10 %}

<div class="latest-items">
{% for item in latest_items %}
<div class="entry" onclick="window.location.href = this.querySelector('a').href;">
<p class="title">
  <a href="{{ item.url }}">
    <b>{{ item.title }}</b>
  </a>
  <br>
  <i class="date-tag">{{ item.date | date: "%b %d, %Y"}}</i>
</p>
{% assign words = item.content | strip_html | split: " " %}
{% assign excerpt = "" %}
{% for word in words %}
    {% assign excerpt = excerpt | append: word | append: " " %}
    {% if word contains "." and forloop.index >= 50 %}
        {% break %}
    {% endif %}
{% endfor %}
<p>{{ excerpt }}<a href="#"><span class="collection-tag">{{ item.collection }}</span></a></p>
</div>
{% endfor %}
</div>

This is a *bare-minimum* template to create a Jekyll site that uses the [Just the Docs] theme. You can easily set the created site to be published on [GitHub Pages] – the [README] file explains how to do that, along with other details.

<div class="language-mermaid">
graph TD;
    A[<div style="text-align:center;">HELLO</div>] --> B[<div style="text-align:center;">WORLD</div>]
</div>


If [Jekyll] is installed on your computer, you can also build and preview the created site *locally*. This lets you test changes before committing them, and avoids waiting for GitHub Pages. And you will be able to deploy your local build to a different platform than GitHub Pages.

More specifically, the created site:

- uses a gem-based approach, i.e. uses a `Gemfile` and loads the `just-the-docs` gem
- uses the [GitHub Pages / Actions workflow] to build and publish the site on GitHub Pages

Other than that, you're free to customize sites that you create with this template, however you like. You can easily change the versions of `just-the-docs` and Jekyll it uses, as well as adding further plugins.

[Browse our documentation][Just the Docs] to learn more about how to use this theme.

To get started with creating a site, simply:

1. click "[use this template]" to create a GitHub repository
2. go to Settings > Pages > Build and deployment > Source, and select GitHub Actions

If you want to maintain your docs in the `docs` directory of an existing project repo, see [Hosting your docs from an existing project repo](https://github.com/just-the-docs/just-the-docs-template/blob/main/README.md#hosting-your-docs-from-an-existing-project-repo) in the template README.

[Just the Docs]: https://just-the-docs.github.io/just-the-docs/
[GitHub Pages]: https://docs.github.com/en/pages
[README]: https://github.com/just-the-docs/just-the-docs-template/blob/main/README.md
[Jekyll]: https://jekyllrb.com
[GitHub Pages / Actions workflow]: https://github.blog/changelog/2022-07-27-github-pages-custom-github-actions-workflows-beta/
[use this template]: https://github.com/just-the-docs/just-the-docs-template/generate
