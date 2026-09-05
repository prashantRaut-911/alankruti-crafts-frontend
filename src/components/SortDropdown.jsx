const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="sort-control">

      <label htmlFor="product-sort">
        Sort by
      </label>

      <select
        id="product-sort"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="newest">
          Newest
        </option>

        <option value="price-low">
          Price: Low to High
        </option>

        <option value="price-high">
          Price: High to Low
        </option>

        <option value="name-az">
          Name: A–Z
        </option>

        <option value="name-za">
          Name: Z–A
        </option>
      </select>
    </div>
  );
};

export default SortDropdown;