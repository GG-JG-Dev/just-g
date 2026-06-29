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

//Badges handling: Restoking Soon, Coming Soon, Sold Out
(() => {
  // ✅ IIFE prevents debounceTimer redeclaration across multiple renders

  function updateProductBadges() {
    const cards = document.querySelectorAll('.t4s-product__price-review[data-tags], .t4s-product-wrapper[data-tags]');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    cards.forEach((card) => {
      const productTags = card.dataset.tags.split('|');
      const comingSoonDate = card.dataset.comingSoon;
      const badge = card.querySelector('.t4s-badge-soldout');

      if (!badge) return;

      let newText = '';
      let newClass = '';

      // 1. Coming Soon
      if (comingSoonDate && comingSoonDate.trim() !== '') {
        const releaseDate = new Date(comingSoonDate);
        releaseDate.setHours(0, 0, 0, 0);

        if (releaseDate > today) {
          newText = 'Coming Soon';
          newClass = 't4s-badge-coming-soon';
        }
      }

      // 2. Sold Out
      if (!newText && productTags.includes('Sold Out')) {
        newText = 'Sold Out';
        newClass = 't4s-badge-so-forever';
      }

      // 3. Default fallback
      if (!newText) {
        newText = 'Restocking Soon';
      }

      // ✅ Only update DOM if text actually changed — prevents infinite observer loop
      if (badge.textContent !== newText) {
        badge.textContent = newText;
        if (newClass) badge.classList.add(newClass);
      }

      badge.style.visibility = 'visible';
      badge.style.opacity = '1';
    });
  }

  updateProductBadges();

  let debounceTimer; // ✅ Safe inside IIFE — won't conflict across renders

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateProductBadges, 100);
  });

  const target = document.querySelector('.t4s-product-wrapper') || document.body;
  observer.observe(target, { childList: true, subtree: true });
})();