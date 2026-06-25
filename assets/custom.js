jQuery_T4NT(document).ready(function ($) {

  /**
  *  Variant selection changed
  *  data-variant-toggle="{{ variant.id }}"
  */
  $(document).on("variant:changed", function (evt) {
    // console.log( evt.currentVariant );
    // $('[data-variant-toggle]').hide(0);
    // $('[data-variant-toggle="'+evt.currentVariant.id+'"]').show(0);
  });
});
document.addEventListener('DOMContentLoaded', function () {

  function toArticleCase(str) {

    const smallWords = [
      'and',
      'with',
      'or',
      'of',
      'in',
      'on',
      'at',
      'by',
      'for',
      'to',
      'a',
      'an',
      'the'
    ];

    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {

        // Keep connector words lowercase except first word
        if (index !== 0 && smallWords.includes(word)) {
          return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1);

      })
      .join(' ');
  }

  function applyArticleCase(selector, datasetKey) {

    document.querySelectorAll(selector).forEach(function (el) {

      if (el.dataset[datasetKey] === 'true') return;

      el.childNodes.forEach(function (node) {

        // Text nodes
        if (node.nodeType === Node.TEXT_NODE) {

          const cleaned = node.textContent.trim();

          if (cleaned.length > 0) {
            node.textContent = toArticleCase(cleaned);
          }

        }

        // Element nodes (links/spans/etc)
        if (node.nodeType === Node.ELEMENT_NODE) {

          const cleaned = node.textContent.trim();

          if (cleaned.length > 0) {
            node.textContent = toArticleCase(cleaned);
          }

        }

      });

      el.dataset[datasetKey] = 'true';

    });

  }

  function updateTextCases() {

    // Product card titles
    applyArticleCase('.t4s-product-title', 'titleized');

    // PDP product title
    applyArticleCase('.t4s-product__title', 'producttitleized');

    // Breadcrumbs
    applyArticleCase('.t4s-pr-breadcrumb', 'breadcrumbized');

    // Sticky Add To Cart title
    applyArticleCase('.t4s-sticky-atc__title', 'stickytitleized');

  }

  // Initial page load
  updateTextCases();

  // Shopify dynamic sections / AJAX content
  const observer = new MutationObserver(function () {
    updateTextCases();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

});

document.addEventListener('DOMContentLoaded', function () {
  function updateVisibility(el) {
    const count = el.textContent.trim();
    if (count === '0') {
      el.classList.remove('test');    // fade out
    } else {
      el.classList.add('test'); // fade in
    }
  }

  document.querySelectorAll('[data-count-wishlist], [data-cart-count]').forEach(function (el) {
    updateVisibility(el);

    const observer = new MutationObserver(function () {
      updateVisibility(el);
    });

    observer.observe(el, { childList: true, subtree: true, characterData: true });
  });
});