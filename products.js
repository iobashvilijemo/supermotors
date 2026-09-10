const WORKBOOK_URL = "mnt/ნაწილების მარაგი.xlsx";
const PAGE_SIZE = 24;
const EXPECTED_HEADERS = [
  "საქონლის კოდი",
  "დასახელება",
  "საქონლის არტიკული",
  "ბრენდი",
  "ფასი"
];

const productSearch = document.querySelector("#product-search");
const brandFilter = document.querySelector("#brand-filter");
const clearFiltersButton = document.querySelector("#clear-filters");
const catalogStatus = document.querySelector("#catalog-status");
const catalogPageStatus = document.querySelector("#catalog-page-status");
const catalogError = document.querySelector("#catalog-error");
const productsGrid = document.querySelector("#products-grid");
const catalogEmpty = document.querySelector("#catalog-empty");
const previousPageButton = document.querySelector("#previous-page");
const nextPageButton = document.querySelector("#next-page");
const pageNumbers = document.querySelector("#page-numbers");

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

function cleanValue(value) {
  return String(value ?? "").replace(/^\uFEFF/, "").trim();
}

function normalizeSearchValue(value) {
  return cleanValue(value).toLocaleLowerCase("ka-GE").replace(/\s+/g, " ");
}

function removeSearchSpacing(value) {
  return value.replace(/\s+/g, "");
}

function validateHeaders(rows) {
  const headers = (rows[0] || []).map(cleanValue);
  const hasExpectedHeaders = EXPECTED_HEADERS.every(
    (header, index) => headers[index] === header
  );

  if (!hasExpectedHeaders) {
    throw new Error("Workbook headers do not match the expected inventory format");
  }
}

function mapProducts(rows) {
  return rows
    .slice(1)
    .map((columns, index) => {
      const product = {
        id: index + 1,
        barcode: cleanValue(columns[0]),
        name: cleanValue(columns[1]),
        partNumber: cleanValue(columns[2]),
        brand: cleanValue(columns[3]),
        price: cleanValue(columns[4])
      };

      product.searchText = normalizeSearchValue(
        `${product.name} ${product.partNumber} ${product.barcode} ${product.brand}`
      );
      product.compactSearchText = removeSearchSpacing(product.searchText);
      return product;
    })
    .filter((product) => product.name || product.partNumber || product.barcode || product.brand);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ka-GE").format(value);
}

function formatPrice(value) {
  const numericValue = Number(value.replace(/\s/g, "").replace(",", "."));

  if (!Number.isFinite(numericValue)) {
    return value || "ფასი მოთხოვნით";
  }

  return `${new Intl.NumberFormat("ka-GE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue)} ₾`;
}

function createDetail(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value || "—";
  wrapper.append(term, description);
  return wrapper;
}

function createProductCard(product) {
  const card = document.createElement("article");
  const cardTop = document.createElement("div");
  const brand = document.createElement("span");
  const itemNumber = document.createElement("span");
  const name = document.createElement("h2");
  const details = document.createElement("dl");
  const cardBottom = document.createElement("div");
  const priceLabel = document.createElement("span");
  const price = document.createElement("strong");

  card.className = "product-card";
  cardTop.className = "product-card-top";
  brand.className = "product-brand";
  itemNumber.className = "product-item-number";
  name.className = "product-name";
  details.className = "product-details";
  cardBottom.className = "product-card-bottom";
  priceLabel.className = "product-price-label";
  price.className = "product-price";

  brand.textContent = product.brand || "ბრენდი მითითებული არ არის";
  itemNumber.textContent = `#${product.id}`;
  name.textContent = product.name || "უსახელო პროდუქტი";

  details.append(
    createDetail("ნაწილის კოდი", product.partNumber),
    createDetail("შტრიხკოდი", product.barcode)
  );

  priceLabel.textContent = "ფასი";
  price.textContent = formatPrice(product.price);
  cardTop.append(brand, itemNumber);
  cardBottom.append(priceLabel, price);
  card.append(cardTop, name, details, cardBottom);
  return card;
}

function getVisiblePageNumbers(totalPages) {
  const pageSet = new Set([1, totalPages]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 0 && page <= totalPages) {
      pageSet.add(page);
    }
  }

  return Array.from(pageSet).sort((first, second) => first - second);
}

function renderPagination(totalPages) {
  pageNumbers.replaceChildren();
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;

  if (totalPages <= 1) {
    return;
  }

  const visiblePages = getVisiblePageNumbers(totalPages);

  visiblePages.forEach((page, index) => {
    if (index > 0 && page - visiblePages[index - 1] > 1) {
      const separator = document.createElement("span");
      separator.className = "page-separator";
      separator.textContent = "…";
      pageNumbers.append(separator);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(page);
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `გვერდი ${page}`);

    if (page === currentPage) {
      button.classList.add("is-current");
      button.setAttribute("aria-current", "page");
    }

    pageNumbers.append(button);
  });
}

function renderProducts() {
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  const fragment = document.createDocumentFragment();

  visibleProducts.forEach((product) => fragment.append(createProductCard(product)));
  productsGrid.replaceChildren(fragment);
  productsGrid.setAttribute("aria-busy", "false");

  catalogEmpty.hidden = filteredProducts.length > 0;
  productsGrid.hidden = filteredProducts.length === 0;
  catalogStatus.textContent = `${formatNumber(filteredProducts.length)} პროდუქტი`;
  catalogPageStatus.textContent = filteredProducts.length
    ? `გვერდი ${formatNumber(currentPage)} / ${formatNumber(totalPages)}`
    : "";

  renderPagination(totalPages);
}

function applyFilters() {
  const query = normalizeSearchValue(productSearch.value);
  const compactQuery = removeSearchSpacing(query);
  const selectedBrand = brandFilter.value;

  filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      !query ||
      product.searchText.includes(query) ||
      product.compactSearchText.includes(compactQuery);
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  currentPage = 1;
  clearFiltersButton.disabled = !query && !selectedBrand;
  renderProducts();
}

function populateBrands() {
  const brands = Array.from(
    new Set(allProducts.map((product) => product.brand).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second, "ka-GE", { sensitivity: "base" }));

  const fragment = document.createDocumentFragment();
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    fragment.append(option);
  });
  brandFilter.append(fragment);
}

function showLoadingCards() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 9; index += 1) {
    const skeleton = document.createElement("div");
    skeleton.className = "product-card product-card-skeleton";
    skeleton.setAttribute("aria-hidden", "true");
    fragment.append(skeleton);
  }

  productsGrid.replaceChildren(fragment);
}

async function loadProducts() {
  showLoadingCards();

  try {
    if (!window.XLSX) {
      throw new Error("XLSX reader is unavailable");
    }

    const response = await fetch(WORKBOOK_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Workbook request failed with status ${response.status}`);
    }

    const workbookData = await response.arrayBuffer();
    const workbook = window.XLSX.read(workbookData, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("Workbook contains no worksheets");
    }

    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
      header: 1,
      defval: "",
      raw: true
    });

    validateHeaders(rows);
    allProducts = mapProducts(rows);

    if (!allProducts.length) {
      throw new Error("Workbook contains no product rows");
    }

    filteredProducts = allProducts;
    populateBrands();

    productSearch.disabled = false;
    brandFilter.disabled = false;
    clearFiltersButton.disabled = true;
    renderProducts();
  } catch (error) {
    productsGrid.replaceChildren();
    productsGrid.setAttribute("aria-busy", "false");
    catalogStatus.textContent = "კატალოგი ვერ ჩაიტვირთა";
    catalogError.hidden = false;
    catalogError.textContent =
      "Excel ფაილის ჩატვირთვა ვერ მოხერხდა. გადაამოწმეთ, რომ ფაილი არსებობს მისამართზე mnt/ნაწილების მარაგი.xlsx და გვერდი გახსნილია ლოკალური სერვერიდან.";
  }
}

productSearch.addEventListener("input", applyFilters);
brandFilter.addEventListener("change", applyFilters);

clearFiltersButton.addEventListener("click", () => {
  productSearch.value = "";
  brandFilter.value = "";
  applyFilters();
  productSearch.focus();
});

previousPageButton.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }

  currentPage -= 1;
  renderProducts();
  document.querySelector(".catalog-section").scrollIntoView({ behavior: "smooth" });
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  if (currentPage >= totalPages) {
    return;
  }

  currentPage += 1;
  renderProducts();
  document.querySelector(".catalog-section").scrollIntoView({ behavior: "smooth" });
});

pageNumbers.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button) {
    return;
  }

  currentPage = Number(button.dataset.page);
  renderProducts();
  document.querySelector(".catalog-section").scrollIntoView({ behavior: "smooth" });
});

loadProducts();
